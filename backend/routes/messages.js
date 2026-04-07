const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// GET /api/messages - Récupérer les messages de l'utilisateur
router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/messages/conversations - Récupérer la liste des conversations
router.get("/conversations", async (req, res, next) => {
  try {
    const { userId } = req.user;

    // Récupérer tous les messages de l'utilisateur
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Grouper par conversation
    const conversationsMap = new Map();

    messages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const otherUser = message.senderId === userId ? message.receiver : message.sender;

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0,
          messages: []
        });
      }

      const conversation = conversationsMap.get(otherUserId);
      conversation.messages.push(message);

      // Compter les messages non lus reçus
      if (message.receiverId === userId && !message.isRead) {
        conversation.unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/messages/conversation/:userId - Récupérer une conversation avec un utilisateur
router.get("/conversation/:otherUserId", async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { otherUserId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    // Marquer les messages reçus comme lus
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/messages - Envoyer un message
router.post(
  "/",
  [
    body("receiverId").isUUID().withMessage("ID du destinataire invalide"),
    body("content").trim().isLength({ min: 1, max: 2000 }).withMessage("Le message doit contenir entre 1 et 2000 caractères")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Données invalides",
          details: errors.array()
        });
      }

      const { userId } = req.user;
      const { receiverId, content } = req.body;

      // Vérifier que le destinataire existe
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId }
      });

      if (!receiver) {
        return res.status(404).json({
          success: false,
          error: "Destinataire non trouvé"
        });
      }

      // Créer le message
      const message = await prisma.message.create({
        data: {
          senderId: userId,
          receiverId,
          content
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: message,
        message: "Message envoyé avec succès"
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/messages/:id/read - Marquer un message comme lu
router.put("/:id/read", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Vérifier que le message existe et appartient à l'utilisateur
    const message = await prisma.message.findUnique({
      where: { id }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message non trouvé"
      });
    }

    if (message.receiverId !== userId) {
      return res.status(403).json({
        success: false,
        error: "Vous ne pouvez marquer comme lu que vos propres messages"
      });
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { isRead: true }
    });

    res.json({
      success: true,
      data: updatedMessage
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/messages/:id - Supprimer un message
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Vérifier que le message existe et appartient à l'utilisateur
    const message = await prisma.message.findUnique({
      where: { id }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message non trouvé"
      });
    }

    if (message.senderId !== userId) {
      return res.status(403).json({
        success: false,
        error: "Vous ne pouvez supprimer que vos propres messages"
      });
    }

    await prisma.message.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: "Message supprimé avec succès"
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/messages/unread/count - Compter les messages non lus
router.get("/unread/count", async (req, res, next) => {
  try {
    const { userId } = req.user;

    const count = await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false
      }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

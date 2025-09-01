const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Rate limiting pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: {
    success: false,
    error: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
];

const registerValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .custom(async (email) => {
      if (!email.endsWith("@2ie-edu.org")) {
        throw new Error("Utilisez votre adresse email institutionnelle 2iE");
      }
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("Cet email est déjà utilisé");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  body("name")
    .isLength({ min: 2 })
    .withMessage("Le nom doit contenir au moins 2 caractères"),
  body("role")
    .isIn(["STUDENT", "LED_TEAM", "SUPERVISOR"])
    .withMessage("Rôle invalide"),
];

// Route de connexion
router.post("/login", authLimiter, loginValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Données invalides",
        details: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: "Email ou mot de passe incorrect",
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Retourner les données utilisateur (sans le mot de passe)
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
      message: "Connexion réussie",
    });
  } catch (error) {
    next(error);
  }
});

// Route d'inscription
router.post("/register", registerValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Données invalides",
        details: errors.array(),
      });
    }

    const { email, password, name, role } = req.body;

    // Extraire filière et niveau depuis l'email pour les étudiants
    let filiere = null;
    let niveau = null;

    if (role === "STUDENT") {
      const emailParts = email.split("@")[0].split(".");
      if (emailParts.length >= 3) {
        niveau = emailParts[emailParts.length - 1];
        filiere = emailParts[emailParts.length - 2];
      }
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        filiere,
        niveau,
      },
    });

    // Générer le token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Retourner les données utilisateur (sans le mot de passe)
    const { password: _, ...userResponse } = user;

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
      message: "Compte créé avec succès",
    });
  } catch (error) {
    next(error);
  }
});

// Route pour obtenir l'utilisateur actuel
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        filiere: true,
        niveau: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Route de déconnexion (optionnelle, principalement côté client)
router.post("/logout", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "Déconnexion réussie",
  });
});

// Route de vérification du token
router.get("/verify", authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      valid: true,
      user: req.user,
    },
  });
});

module.exports = router;

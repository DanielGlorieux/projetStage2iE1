/*const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Token d'authentification requis",
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        filiere: true,
        niveau: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Token invalide",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expiré",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Erreur de serveur",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentification requise",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Accès non autorisé pour votre rôle",
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };*/

const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt_très_sécurisé";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Token d'authentification manquant",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token manquant",
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Vérifier que l'utilisateur existe toujours
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        filiere: true,
        niveau: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    // Ajouter les informations de l'utilisateur à la requête
    req.user = {
      id: user.id,
      userId: user.id, // Garder pour rétrocompatibilité
      email: user.email,
      role: user.role.toLowerCase(), // Normaliser en minuscules
      name: user.name,
      filiere: user.filiere,
      niveau: user.niveau,
    };

    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Token invalide",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expiré",
      });
    }

    res.status(500).json({
      success: false,
      error: "Erreur lors de la vérification du token",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Non authentifié",
      });
    }

    // Normaliser les rôles en minuscules pour la comparaison
    const normalizedRoles = roles.map((role) => role.toLowerCase());
    const userRole = req.user.role.toLowerCase();

    // Gérer les super admins - ils ont accès à tout ce qu'un admin normal peut faire
    // Plus un accès spécifique à leur domaine de spécialisation
    const isSuperAdmin = userRole.startsWith('super_admin_');

    // Si l'utilisateur est un super admin, vérifier s'il a les droits requis
    if (isSuperAdmin) {
      // Les super admins ont les mêmes droits que led_team
      if (normalizedRoles.includes('led_team') || normalizedRoles.includes('supervisor')) {
        return next();
      }
    }

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: "Accès refusé",
        message: `Rôle requis: ${roles.join(" ou ")}`,
      });
    }

    next();
  };
};

// Middleware spécifique pour vérifier les droits de super admin sur un type d'activité
const authorizeSuperAdminForType = (activityType) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Non authentifié",
      });
    }

    const userRole = req.user.role.toLowerCase();

    // LED team a tous les droits
    if (userRole === 'led_team') {
      return next();
    }

    // Vérifier si c'est un super admin avec la bonne spécialisation
    const expectedRole = `super_admin_${activityType.toLowerCase()}`;
    if (userRole === expectedRole) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: "Accès refusé",
      message: `Super admin ${activityType} requis pour cette action`,
    });
  };
};

module.exports = {
  authenticate,
  authorize,
  authorizeSuperAdminForType,
};

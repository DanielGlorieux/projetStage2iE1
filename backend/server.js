const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activities");
const userRoutes = require("./routes/users");
const searchRoutes = require("./routes/search");
const messagesRoutes = require("./routes/messages");
const supervisorActivitiesRoutes = require("./routes/supervisor-activities");
const { authenticate } = require("./middleware/auth");

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));

// Configuration CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests par window
});
app.use(limiter);

// Middleware de parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Servir les fichiers statiques uploadés (avec authentification pour la sécurité)
app.use("/uploads", authenticate, express.static(path.join(__dirname, "uploads")));

// Routes API
app.use("/api/auth", authRoutes);

// Routes protégées
app.use("/api/activities", authenticate, activityRoutes);
app.use("/api/users", authenticate, userRoutes);
app.use("/api/search", authenticate, searchRoutes);
app.use("/api/messages", authenticate, messagesRoutes);
app.use("/api/supervisor-activities", authenticate, supervisorActivitiesRoutes);

// Route de health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Route par défaut
app.get("/", (req, res) => {
  res.json({
    message: "API Plateforme LED 2iE",
    version: "1.0.0",
    documentation: "/api/docs",
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error("Erreur:", err);

  // Erreur de validation Prisma
  if (err.code === "P2002") {
    return res.status(400).json({
      success: false,
      error: "Données dupliquées",
      message: "Cette donnée existe déjà",
    });
  }

  // Erreur de validation express-validator
  if (err.type === "validation") {
    return res.status(400).json({
      success: false,
      error: "Données invalides",
      details: err.errors,
    });
  }

  // Erreur JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Token invalide",
    });
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Erreur serveur interne",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Gestion des routes non trouvées
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route non trouvée",
    message: `La route ${req.method} ${req.originalUrl} n'existe pas`,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});

// Gestion propre de l'arrêt
process.on("SIGTERM", () => {
  console.log("👋 Arrêt du serveur...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("👋 Arrêt du serveur...");
  process.exit(0);
});

module.exports = app;

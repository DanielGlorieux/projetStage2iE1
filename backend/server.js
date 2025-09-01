const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

// Import des routes
const authRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activities");
const searchRoutes = require("./routes/search");
const userRoutes = require("./routes/users");

// Import des middlewares
const { errorHandler } = require("./middleware/errorHandler");
const { authenticate } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de sécurité
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite par IP
  message: "Trop de requêtes, réessayez plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Middleware de base
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Servir les fichiers statiques (uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/activities", authenticate, activityRoutes);
app.use("/api/search", authenticate, searchRoutes);
app.use("/api/users", authenticate, userRoutes);

// Route par défaut
app.get("/api", (req, res) => {
  res.json({
    message: "API Plateforme LED 2iE",
    version: "1.0.0",
    documentation: "/api/docs",
  });
});

// Gestion des erreurs 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route non trouvée",
    path: req.originalUrl,
  });
});

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur LED Platform démarré sur le port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(
    `💾 Base de données: ${process.env.DATABASE_URL || "SQLite local"}`
  );
});

module.exports = app;

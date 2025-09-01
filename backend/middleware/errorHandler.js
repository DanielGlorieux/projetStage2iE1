const errorHandler = (err, req, res, next) => {
  console.error("Erreur serveur:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    user: req.user?.id || "Non authentifié",
  });

  // Erreurs Prisma
  if (err.code === "P2002") {
    return res.status(400).json({
      success: false,
      error: "Cette ressource existe déjà",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      error: "Ressource non trouvée",
    });
  }

  // Erreurs de validation
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Données invalides",
      details: err.details,
    });
  }

  // Erreurs Multer (upload)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      error: "Fichier trop volumineux",
    });
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      success: false,
      error: "Trop de fichiers",
    });
  }

  // Erreur par défaut
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Erreur interne du serveur"
      : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { errorHandler };

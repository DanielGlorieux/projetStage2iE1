const fs = require('fs').promises;
const path = require('path');
const { ALLOWED_FILE_TYPES, MIME_TYPES } = require('./fileConstants');

/**
 * S'assurer que le répertoire d'upload existe
 */
const ensureUploadDir = async () => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
        await fs.access(uploadDir);
    } catch (error) {
        await fs.mkdir(uploadDir, { recursive: true });
    }
    return uploadDir;
};

/**
 * Générer un nom de fichier sécurisé
 */
const generateSecureFileName = (originalName, fileExtension) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 50);
    return `${timestamp}_${random}_${cleanName}.${fileExtension}`;
};

/**
 * Valider le type de fichier
 */
const validateFileType = (mimetype) => {
    return ALLOWED_FILE_TYPES[mimetype] || null;
};

/**
 * Obtenir le type MIME pour le téléchargement
 */
const getMimeTypeForDownload = (fileExtension) => {
    return MIME_TYPES[fileExtension] || 'application/octet-stream';
};

/**
 * Nettoyer un fichier temporaire
 */
const cleanupTempFile = async (tempFilePath) => {
    if (tempFilePath) {
        try {
            await fs.unlink(tempFilePath);
        } catch (error) {
            console.warn('Erreur nettoyage fichier temporaire:', error.message);
        }
    }
};

/**
 * Vérifier l'existence d'un fichier
 */
const fileExists = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Supprimer un fichier de façon sécurisée
 */
const safeDeleteFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
        return true;
    } catch (error) {
        console.warn('Fichier déjà supprimé ou non trouvé:', error.message);
        return false;
    }
};

module.exports = {
    ensureUploadDir,
    generateSecureFileName,
    validateFileType,
    getMimeTypeForDownload,
    cleanupTempFile,
    fileExists,
    safeDeleteFile
};
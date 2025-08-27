const path = require('path');

// Types de fichiers autorisés avec leurs extensions
const ALLOWED_FILE_TYPES = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/plain': 'txt',
    'application/zip': 'zip'
};

// Taille maximale des fichiers (10MB par défaut)
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;

// Types MIME autorisés pour les headers de téléchargement
const MIME_TYPES = {
    'csv': 'text/csv',
    'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'json': 'application/json',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'txt': 'text/plain',
    'zip': 'application/zip'
};

// Types de documents disponibles
const DOCUMENT_TYPES = [
    'transcript', 
    'certificate', 
    'report', 
    'project', 
    'cv', 
    'photo', 
    'other'
];

module.exports = {
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
    MIME_TYPES,
    DOCUMENT_TYPES
};
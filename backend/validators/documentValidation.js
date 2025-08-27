const { body, query } = require('express-validator');
const { DOCUMENT_TYPES } = require('../utils/fileConstants');

const uploadDocumentValidation = [
    body('scholar_id').isUUID().withMessage('ID boursier invalide'),
    body('activity_id').optional().isUUID().withMessage('ID activité invalide'),
    body('document_type').isIn(DOCUMENT_TYPES).withMessage('Type de document invalide'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description trop longue')
];

const updateDocumentValidation = [
    body('document_type').optional().isIn(DOCUMENT_TYPES),
    body('description').optional().isLength({ max: 500 })
];

const getDocumentsValidation = [
    query('scholar_id').optional().isUUID(),
    query('activity_id').optional().isUUID(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('document_type').optional().isIn(DOCUMENT_TYPES),
    query('verified_only').optional().isBoolean()
];

module.exports = {
    uploadDocumentValidation,
    updateDocumentValidation,
    getDocumentsValidation
};
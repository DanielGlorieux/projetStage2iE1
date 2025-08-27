const database = require('../config/database');

/**
 * Construire les conditions WHERE pour les filtres de documents
 */
const buildDocumentWhereClause = (userRole, userId, filters) => {
    let whereConditions = ['1 = 1'];
    let queryParams = [];

    // Filtrage par rôle utilisateur
    if (userRole === 'student') {
        whereConditions.push('s.user_id = ?');
        queryParams.push(userId);
    } else if (userRole === 'supervisor') {
        whereConditions.push('s.academic_advisor_id = ?');
        queryParams.push(userId);
    }

    // Filtres spécifiques
    if (filters.scholar_id) {
        whereConditions.push('d.scholar_id = ?');
        queryParams.push(filters.scholar_id);
    }

    if (filters.activity_id) {
        whereConditions.push('d.activity_id = ?');
        queryParams.push(filters.activity_id);
    }

    if (filters.document_type) {
        whereConditions.push('d.document_type = ?');
        queryParams.push(filters.document_type);
    }

    if (filters.verified_only === 'true') {
        whereConditions.push('d.is_verified = TRUE');
    }

    return {
        whereClause: whereConditions.join(' AND '),
        queryParams
    };
};

/**
 * Récupérer les documents avec pagination et filtres
 */
const getDocumentsWithFilters = async (userRole, userId, filters, pagination) => {
    const { whereClause, queryParams } = buildDocumentWhereClause(userRole, userId, filters);
    const { limit, offset } = pagination;

    const query = `
        SELECT 
            d.*,
            CONCAT(s_user.first_name, ' ', s_user.last_name) as scholar_name,
            s_user.email as scholar_email,
            s.student_number,
            CONCAT(uploader.first_name, ' ', uploader.last_name) as uploader_name,
            CONCAT(verifier.first_name, ' ', verifier.last_name) as verifier_name,
            sa.title as activity_title
        FROM documents d
        JOIN scholars s ON d.scholar_id = s.id
        JOIN users s_user ON s.user_id = s_user.id
        JOIN users uploader ON d.uploader_id = uploader.id
        LEFT JOIN users verifier ON d.verified_by = verifier.id
        LEFT JOIN scholar_activities sa ON d.activity_id = sa.id
        WHERE ${whereClause}
        ORDER BY d.upload_date DESC
        LIMIT ? OFFSET ?
    `;

    const documents = await database.query(query, [...queryParams, limit, offset]);

    // Compter le total
    const countQuery = `
        SELECT COUNT(DISTINCT d.id) as total
        FROM documents d
        JOIN scholars s ON d.scholar_id = s.id
        WHERE ${whereClause}
    `;

    const [{ total }] = await database.query(countQuery, queryParams);

    return { documents, total };
};

/**
 * Récupérer un document avec permissions
 */
const getDocumentWithPermissions = async (documentId) => {
    const query = `
        SELECT 
            d.*,
            s.id as scholar_id,
            CONCAT(s_user.first_name, ' ', s_user.last_name) as scholar_name,
            s_user.email as scholar_email,
            s.student_number,
            s.academic_advisor_id,
            CONCAT(uploader.first_name, ' ', uploader.last_name) as uploader_name,
            uploader.email as uploader_email,
            CONCAT(verifier.first_name, ' ', verifier.last_name) as verifier_name,
            sa.title as activity_title
        FROM documents d
        JOIN scholars s ON d.scholar_id = s.id
        JOIN users s_user ON s.user_id = s_user.id
        JOIN users uploader ON d.uploader_id = uploader.id
        LEFT JOIN users verifier ON d.verified_by = verifier.id
        LEFT JOIN scholar_activities sa ON d.activity_id = sa.id
        WHERE d.id = ?
    `;

    const documents = await database.query(query, [documentId]);
    return documents.length > 0 ? documents[0] : null;
};

/**
 * Vérifier les permissions sur un boursier
 */
const checkScholarPermissions = async (scholarId) => {
    const query = `
        SELECT s.*, u.first_name, u.last_name 
        FROM scholars s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.id = ?
    `;

    const scholars = await database.query(query, [scholarId]);
    return scholars.length > 0 ? scholars[0] : null;
};

/**
 * Vérifier qu'une activité appartient au boursier
 */
const validateActivityBelongsToScholar = async (activityId, scholarId) => {
    const query = `
        SELECT id FROM scholar_activities 
        WHERE id = ? AND scholar_id = ?
    `;

    const activities = await database.query(query, [activityId, scholarId]);
    return activities.length > 0;
};

/**
 * Créer un nouveau document en base
 */
const createDocument = async (documentData) => {
    const query = `
        INSERT INTO documents (
            id, scholar_id, activity_id, uploader_id, file_name, file_path,
            file_size, file_type, document_type, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await database.query(query, [
        documentData.id,
        documentData.scholar_id,
        documentData.activity_id || null,
        documentData.uploader_id,
        documentData.file_name,
        documentData.file_path,
        documentData.file_size,
        documentData.file_type,
        documentData.document_type,
        documentData.description || null
    ]);
};

/**
 * Mettre à jour un document
 */
const updateDocumentData = async (documentId, updateFields, updateValues) => {
    const updateQuery = `UPDATE documents SET ${updateFields.join(', ')} WHERE id = ?`;
    await database.query(updateQuery, [...updateValues, documentId]);
};

/**
 * Marquer un document comme vérifié
 */
const verifyDocument = async (documentId, verifierId) => {
    await database.query(
        'UPDATE documents SET is_verified = TRUE, verified_by = ?, verification_date = NOW() WHERE id = ?',
        [verifierId, documentId]
    );
};

/**
 * Récupérer l'équipe LED pour les notifications
 */
const getLEDTeamUsers = async () => {
    return await database.query('SELECT id FROM users WHERE role = "led_team" AND is_active = TRUE');
};

module.exports = {
    getDocumentsWithFilters,
    getDocumentWithPermissions,
    checkScholarPermissions,
    validateActivityBelongsToScholar,
    createDocument,
    updateDocumentData,
    verifyDocument,
    getLEDTeamUsers
};
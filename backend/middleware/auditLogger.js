const database = require('../config/database');

/**
 * Middleware d'audit des actions utilisateur
 * Enregistre les actions importantes dans la table audit_logs
 */
const auditLogger = (req, res, next) => {
    // Intercepter la méthode res.json pour capturer les réponses
    const originalJson = res.json;
    
    res.json = function(data) {
        // Enregistrer l'audit après une réponse réussie
        if (res.statusCode < 400 && req.user) {
            setImmediate(() => {
                logAction(req, res, data);
            });
        }
        
        return originalJson.call(this, data);
    };

    next();
};

/**
 * Enregistre une action dans les logs d'audit
 */
const logAction = async (req, res, responseData) => {
    try {
        // Déterminer le type d'entité et l'action
        const action = getActionFromRequest(req);
        const entityInfo = getEntityInfoFromRequest(req);
        
        // Ne pas logger certaines actions (comme les GET sur les listes)
        if (shouldSkipLogging(req, action)) {
            return;
        }

        // Préparer les données à enregistrer
        const logData = {
            user_id: req.user.id,
            action: action,
            entity_type: entityInfo.type,
            entity_id: entityInfo.id,
            old_values: req.method === 'PUT' ? req.body.old_values : null,
            new_values: getNewValuesFromRequest(req, responseData),
            ip_address: getClientIP(req),
            user_agent: req.get('User-Agent')
        };

        // Insérer dans la base de données
        await database.query(
            `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                logData.user_id,
                logData.action,
                logData.entity_type,
                logData.entity_id,
                logData.old_values ? JSON.stringify(logData.old_values) : null,
                logData.new_values ? JSON.stringify(logData.new_values) : null,
                logData.ip_address,
                logData.user_agent
            ]
        );

    } catch (error) {
        console.error('Erreur lors de l\'audit:', error);
        // Ne pas faire échouer la requête si l'audit échoue
    }
};

/**
 * Détermine l'action à partir de la requête HTTP
 */
const getActionFromRequest = (req) => {
    const method = req.method;
    const path = req.route.path;

    switch (method) {
        case 'POST':
            return 'CREATE';
        case 'PUT':
        case 'PATCH':
            return 'UPDATE';
        case 'DELETE':
            return 'DELETE';
        case 'GET':
            if (path.includes(':id')) {
                return 'VIEW';
            }
            return 'LIST';
        default:
            return method;
    }
};

/**
 * Extrait les informations d'entité à partir de la requête
 */
const getEntityInfoFromRequest = (req) => {
    const path = req.route.path;
    
    // Déterminer le type d'entité à partir du chemin
    let entityType = 'unknown';
    if (path.includes('/scholars')) {
        entityType = 'scholar';
    } else if (path.includes('/activities')) {
        entityType = 'activity';
    } else if (path.includes('/evaluations')) {
        entityType = 'evaluation';
    } else if (path.includes('/documents')) {
        entityType = 'document';
    } else if (path.includes('/reports')) {
        entityType = 'report';
    } else if (path.includes('/users')) {
        entityType = 'user';
    } else if (path.includes('/notifications')) {
        entityType = 'notification';
    }

    // Extraire l'ID de l'entité
    const entityId = req.params.id || req.params.scholarId || req.params.userId || null;

    return {
        type: entityType,
        id: entityId
    };
};

/**
 * Extrait les nouvelles valeurs à partir de la requête et de la réponse
 */
const getNewValuesFromRequest = (req, responseData) => {
    if (req.method === 'POST' && responseData) {
        // Pour les créations, enregistrer les données créées
        return responseData.data || responseData;
    } else if (req.method === 'PUT' || req.method === 'PATCH') {
        // Pour les mises à jour, enregistrer les nouvelles données
        return req.body;
    } else if (req.method === 'DELETE') {
        // Pour les suppressions, enregistrer l'ID supprimé
        return { deleted_id: req.params.id };
    }
    
    return null;
};

/**
 * Détermine si l'action doit être ignorée dans les logs
 */
const shouldSkipLogging = (req, action) => {
    // Ne pas logger les consultations de listes (trop verbeux)
    if (action === 'LIST') {
        return true;
    }
    
    // Ne pas logger les consultations individuelles pour les étudiants de leurs propres données
    if (action === 'VIEW' && req.user.role === 'student') {
        return true;
    }
    
    // Ne pas logger les requêtes de santé, auth, etc.
    const skipPaths = ['/health', '/auth/refresh'];
    if (skipPaths.some(path => req.originalUrl.includes(path))) {
        return true;
    }
    
    return false;
};

/**
 * Extrait l'adresse IP réelle du client
 */
const getClientIP = (req) => {
    return req.headers['x-forwarded-for'] ||
           req.headers['x-real-ip'] ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           req.ip;
};

/**
 * Fonction utilitaire pour créer des logs d'audit manuels
 */
const createAuditLog = async (userId, action, entityType, entityId, oldValues, newValues, ipAddress, userAgent) => {
    try {
        await database.query(
            `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                action,
                entityType,
                entityId,
                oldValues ? JSON.stringify(oldValues) : null,
                newValues ? JSON.stringify(newValues) : null,
                ipAddress,
                userAgent
            ]
        );
    } catch (error) {
        console.error('Erreur création log audit:', error);
    }
};

module.exports = {
    auditLogger,
    createAuditLog
};
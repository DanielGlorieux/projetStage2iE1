const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');
const { requireRoles } = require('../middleware/auth');

const router = express.Router();

// ================================
// VALIDATION SCHEMAS
// ================================

const createNotificationValidation = [
    body('recipient_id').isUUID().withMessage('ID destinataire invalide'),
    body('title').trim().isLength({ min: 3, max: 255 }).withMessage('Titre requis'),
    body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message requis'),
    body('notification_type').isIn(['deadline', 'evaluation', 'document', 'system', 'announcement']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    body('related_entity_type').optional().isLength({ max: 50 }),
    body('related_entity_id').optional().isUUID()
];

const updatePreferencesValidation = [
    body('email_notifications').optional().isBoolean(),
    body('push_notifications').optional().isBoolean(),
    body('sms_notifications').optional().isBoolean(),
    body('deadline_alerts').optional().isBoolean(),
    body('evaluation_reminders').optional().isBoolean(),
    body('system_announcements').optional().isBoolean(),
    body('frequency').optional().isIn(['immediate', 'daily', 'weekly'])
];

// ================================
// UTILITAIRES NOTIFICATIONS
// ================================

const broadcastNotification = (notification, wsClients) => {
    const message = JSON.stringify({
        type: 'notification',
        data: notification
    });

    if (wsClients && wsClients.has(notification.recipient_id)) {
        const client = wsClients.get(notification.recipient_id);
        if (client.readyState === 1) { // WebSocket.OPEN
            client.send(message);
        }
    }
};

const createSystemNotification = async (recipientId, title, message, type = 'system', priority = 'medium', relatedEntityType = null, relatedEntityId = null) => {
    const notificationId = uuidv4();
    
    await database.query(`
        INSERT INTO notifications (id, recipient_id, title, message, notification_type, priority, related_entity_type, related_entity_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [notificationId, recipientId, title, message, type, priority, relatedEntityType, relatedEntityId]);

    return notificationId;
};

// ================================
// ROUTES NOTIFICATIONS
// ================================

/**
 * @route GET /api/notifications
 * @desc Récupérer les notifications de l'utilisateur
 * @access Private
 */
router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('unread_only').optional().isBoolean(),
    query('type').optional().isIn(['deadline', 'evaluation', 'document', 'system', 'announcement'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Paramètres invalides',
                details: errors.array()
            });
        }

        const {
            page = 1,
            limit = 20,
            unread_only,
            type
        } = req.query;

        const offset = (page - 1) * limit;

        let whereConditions = ['n.recipient_id = ?'];
        let queryParams = [req.user.id];

        if (unread_only === 'true') {
            whereConditions.push('n.is_read = FALSE');
        }

        if (type) {
            whereConditions.push('n.notification_type = ?');
            queryParams.push(type);
        }

        const whereClause = whereConditions.join(' AND ');

        const notifications = await database.query(`
            SELECT 
                n.*,
                CONCAT(sender.first_name, ' ', sender.last_name) as sender_name,
                sender.email as sender_email
            FROM notifications n
            LEFT JOIN users sender ON n.sender_id = sender.id
            WHERE ${whereClause}
            ORDER BY n.created_at DESC
            LIMIT ? OFFSET ?
        `, [...queryParams, parseInt(limit), offset]);

        // Compter le total
        const [{ total }] = await database.query(`
            SELECT COUNT(*) as total
            FROM notifications n
            WHERE ${whereClause}
        `, queryParams);

        // Compter les non lues
        const [{ unread_count }] = await database.query(`
            SELECT COUNT(*) as unread_count
            FROM notifications
            WHERE recipient_id = ? AND is_read = FALSE
        `, [req.user.id]);

        res.json({
            data: notifications,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(total),
                pages: Math.ceil(total / limit)
            },
            unread_count: parseInt(unread_count)
        });

    } catch (error) {
        console.error('Erreur récupération notifications:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route POST /api/notifications
 * @desc Créer une nouvelle notification
 * @access Private (LED team and supervisors)
 */
router.post('/', requireRoles(['supervisor', 'led_team', 'admin']), createNotificationValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array()
            });
        }

        const notificationId = uuidv4();
        const notificationData = {
            id: notificationId,
            sender_id: req.user.id,
            ...req.body
        };

        // Vérifier que le destinataire existe
        const recipientCheck = await database.query(
            'SELECT id, first_name, last_name FROM users WHERE id = ? AND is_active = TRUE',
            [notificationData.recipient_id]
        );

        if (recipientCheck.length === 0) {
            return res.status(404).json({
                error: 'Destinataire non trouvé'
            });
        }

        // Vérifier les permissions pour les superviseurs
        if (req.user.role === 'supervisor') {
            const supervisorCheck = await database.query(
                'SELECT id FROM scholars WHERE user_id = ? AND academic_advisor_id = ?',
                [notificationData.recipient_id, req.user.id]
            );

            if (supervisorCheck.length === 0) {
                return res.status(403).json({
                    error: 'Vous pouvez seulement envoyer des notifications à vos étudiants supervisés'
                });
            }
        }

        await database.query(`
            INSERT INTO notifications (id, recipient_id, sender_id, title, message, notification_type, priority, related_entity_type, related_entity_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            notificationId,
            notificationData.recipient_id,
            notificationData.sender_id,
            notificationData.title,
            notificationData.message,
            notificationData.notification_type,
            notificationData.priority || 'medium',
            notificationData.related_entity_type || null,
            notificationData.related_entity_id || null
        ]);

        // Récupérer la notification créée
        const createdNotification = await database.query(`
            SELECT 
                n.*,
                CONCAT(sender.first_name, ' ', sender.last_name) as sender_name,
                CONCAT(recipient.first_name, ' ', recipient.last_name) as recipient_name
            FROM notifications n
            JOIN users sender ON n.sender_id = sender.id
            JOIN users recipient ON n.recipient_id = recipient.id
            WHERE n.id = ?
        `, [notificationId]);

        const notification = createdNotification[0];

        // Diffuser en temps réel via WebSocket (sera implémenté dans le serveur principal)
        if (req.app.wsClients) {
            broadcastNotification(notification, req.app.wsClients);
        }

        res.status(201).json({
            message: 'Notification créée avec succès',
            data: notification
        });

    } catch (error) {
        console.error('Erreur création notification:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route PUT /api/notifications/:id/read
 * @desc Marquer une notification comme lue
 * @access Private
 */
router.put('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier que la notification appartient à l'utilisateur
        const notificationCheck = await database.query(
            'SELECT id FROM notifications WHERE id = ? AND recipient_id = ?',
            [id, req.user.id]
        );

        if (notificationCheck.length === 0) {
            return res.status(404).json({
                error: 'Notification non trouvée'
            });
        }

        await database.query(
            'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = ?',
            [id]
        );

        res.json({
            message: 'Notification marquée comme lue'
        });

    } catch (error) {
        console.error('Erreur marquage notification:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route PUT /api/notifications/read-all
 * @desc Marquer toutes les notifications comme lues
 * @access Private
 */
router.put('/read-all', async (req, res) => {
    try {
        const result = await database.query(
            'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE recipient_id = ? AND is_read = FALSE',
            [req.user.id]
        );

        res.json({
            message: 'Toutes les notifications marquées comme lues',
            updated_count: result.affectedRows
        });

    } catch (error) {
        console.error('Erreur marquage toutes notifications:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route DELETE /api/notifications/:id
 * @desc Supprimer une notification
 * @access Private
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier que la notification appartient à l'utilisateur
        const notificationCheck = await database.query(
            'SELECT id FROM notifications WHERE id = ? AND recipient_id = ?',
            [id, req.user.id]
        );

        if (notificationCheck.length === 0) {
            return res.status(404).json({
                error: 'Notification non trouvée'
            });
        }

        await database.query('DELETE FROM notifications WHERE id = ?', [id]);

        res.json({
            message: 'Notification supprimée avec succès'
        });

    } catch (error) {
        console.error('Erreur suppression notification:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/notifications/preferences
 * @desc Récupérer les préférences de notification de l'utilisateur
 * @access Private
 */
router.get('/preferences', async (req, res) => {
    try {
        const preferences = await database.query(
            'SELECT * FROM notification_preferences WHERE user_id = ?',
            [req.user.id]
        );

        if (preferences.length === 0) {
            // Créer des préférences par défaut
            await database.query(
                'INSERT INTO notification_preferences (user_id) VALUES (?)',
                [req.user.id]
            );

            const defaultPreferences = await database.query(
                'SELECT * FROM notification_preferences WHERE user_id = ?',
                [req.user.id]
            );

            return res.json({
                data: defaultPreferences[0]
            });
        }

        res.json({
            data: preferences[0]
        });

    } catch (error) {
        console.error('Erreur récupération préférences:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route PUT /api/notifications/preferences
 * @desc Mettre à jour les préférences de notification
 * @access Private
 */
router.put('/preferences', updatePreferencesValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array()
            });
        }

        const updateData = req.body;

        // Construire la requête de mise à jour
        const updateFields = [];
        const updateValues = [];

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                updateFields.push(`${key} = ?`);
                updateValues.push(updateData[key]);
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                error: 'Aucune modification détectée'
            });
        }

        updateFields.push('updated_at = NOW()');
        updateValues.push(req.user.id);

        const updateQuery = `UPDATE notification_preferences SET ${updateFields.join(', ')} WHERE user_id = ?`;
        await database.query(updateQuery, updateValues);

        // Récupérer les préférences mises à jour
        const updatedPreferences = await database.query(
            'SELECT * FROM notification_preferences WHERE user_id = ?',
            [req.user.id]
        );

        res.json({
            message: 'Préférences mises à jour avec succès',
            data: updatedPreferences[0]
        });

    } catch (error) {
        console.error('Erreur mise à jour préférences:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route POST /api/notifications/broadcast
 * @desc Diffuser une notification à plusieurs utilisateurs
 * @access Private (LED team only)
 */
router.post('/broadcast', requireRoles(['led_team', 'admin']), [
    body('recipient_ids').isArray({ min: 1 }).withMessage('Liste de destinataires requise'),
    body('recipient_ids.*').isUUID(),
    body('title').trim().isLength({ min: 3, max: 255 }),
    body('message').trim().isLength({ min: 10, max: 2000 }),
    body('notification_type').isIn(['deadline', 'evaluation', 'document', 'system', 'announcement']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array()
            });
        }

        const {
            recipient_ids,
            title,
            message,
            notification_type,
            priority = 'medium',
            related_entity_type,
            related_entity_id
        } = req.body;

        // Vérifier que tous les destinataires existent
        const validRecipients = await database.query(
            `SELECT id FROM users WHERE id IN (${recipient_ids.map(() => '?').join(',')}) AND is_active = TRUE`,
            recipient_ids
        );

        if (validRecipients.length !== recipient_ids.length) {
            return res.status(400).json({
                error: 'Certains destinataires sont invalides'
            });
        }

        const notificationIds = [];

        // Créer une notification pour chaque destinataire
        for (const recipientId of recipient_ids) {
            const notificationId = uuidv4();
            notificationIds.push(notificationId);

            await database.query(`
                INSERT INTO notifications (id, recipient_id, sender_id, title, message, notification_type, priority, related_entity_type, related_entity_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                notificationId,
                recipientId,
                req.user.id,
                title,
                message,
                notification_type,
                priority,
                related_entity_type || null,
                related_entity_id || null
            ]);

            // Diffuser en temps réel
            if (req.app.wsClients) {
                const notification = {
                    id: notificationId,
                    recipient_id: recipientId,
                    sender_id: req.user.id,
                    title,
                    message,
                    notification_type,
                    priority,
                    created_at: new Date().toISOString()
                };
                broadcastNotification(notification, req.app.wsClients);
            }
        }

        res.status(201).json({
            message: 'Notifications diffusées avec succès',
            data: {
                notification_ids: notificationIds,
                recipient_count: recipient_ids.length
            }
        });

    } catch (error) {
        console.error('Erreur diffusion notifications:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/notifications/stats
 * @desc Récupérer les statistiques de notifications
 * @access Private
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = await database.query(`
            SELECT 
                COUNT(*) as total_notifications,
                COUNT(CASE WHEN is_read = FALSE THEN 1 END) as unread_count,
                COUNT(CASE WHEN notification_type = 'deadline' THEN 1 END) as deadline_count,
                COUNT(CASE WHEN notification_type = 'evaluation' THEN 1 END) as evaluation_count,
                COUNT(CASE WHEN notification_type = 'system' THEN 1 END) as system_count,
                COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_count,
                COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as last_24h_count
            FROM notifications
            WHERE recipient_id = ?
        `, [req.user.id]);

        res.json({
            data: stats[0]
        });

    } catch (error) {
        console.error('Erreur statistiques notifications:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

// Fonction utilitaire exportée pour créer des notifications système
router.createSystemNotification = createSystemNotification;
router.broadcastNotification = broadcastNotification;

module.exports = router;
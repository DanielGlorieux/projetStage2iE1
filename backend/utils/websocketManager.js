const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const database = require('../config/database');

class WebSocketManager {
    constructor() {
        this.clients = new Map();
        this.wss = null;
    }

    /**
     * Initialiser le serveur WebSocket
     */
    initialize(server) {
        this.wss = new WebSocket.Server({
            server,
            path: '/ws',
            verifyClient: async (info) => {
                try {
                    // Vérifier le token JWT dans les headers ou query params
                    const token = info.req.url.split('token=')[1] || 
                                 info.req.headers.authorization?.replace('Bearer ', '');
                    
                    if (!token) return false;

                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    info.req.user = decoded;
                    return true;

                } catch (error) {
                    console.error('Erreur vérification WebSocket:', error);
                    return false;
                }
            }
        });

        this.wss.on('connection', (ws, req) => {
            const userId = req.user.id;
            
            // Stocker la connexion
            this.clients.set(userId, ws);
            
            console.log(`WebSocket connecté: ${userId}`);

            // Gérer la déconnexion
            ws.on('close', () => {
                this.clients.delete(userId);
                console.log(`WebSocket déconnecté: ${userId}`);
            });

            // Gérer les messages entrants
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleMessage(userId, data);
                } catch (error) {
                    console.error('Erreur message WebSocket:', error);
                }
            });

            // Ping pour maintenir la connexion
            const ping = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.ping();
                } else {
                    clearInterval(ping);
                }
            }, 30000);

            // Envoyer les notifications non lues au client
            this.sendUnreadNotifications(userId);
        });

        console.log('✅ Serveur WebSocket initialisé');
    }

    /**
     * Gérer les messages reçus
     */
    async handleMessage(userId, data) {
        switch (data.type) {
            case 'mark_read':
                if (data.notificationId) {
                    await this.markNotificationAsRead(userId, data.notificationId);
                }
                break;
            case 'ping':
                this.sendToUser(userId, { type: 'pong' });
                break;
            default:
                console.warn('Type de message WebSocket non reconnu:', data.type);
        }
    }

    /**
     * Envoyer un message à un utilisateur spécifique
     */
    sendToUser(userId, message) {
        const client = this.clients.get(userId);
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
            return true;
        }
        return false;
    }

    /**
     * Diffuser une notification
     */
    broadcastNotification(notification) {
        const message = {
            type: 'notification',
            data: notification
        };

        return this.sendToUser(notification.recipient_id, message);
    }

    /**
     * Diffuser à plusieurs utilisateurs
     */
    broadcastToUsers(userIds, message) {
        const results = userIds.map(userId => 
            this.sendToUser(userId, message)
        );

        return {
            sent: results.filter(r => r).length,
            total: userIds.length
        };
    }

    /**
     * Envoyer les notifications non lues
     */
    async sendUnreadNotifications(userId) {
        try {
            const unreadNotifications = await database.query(`
                SELECT 
                    n.*,
                    CONCAT(sender.first_name, ' ', sender.last_name) as sender_name
                FROM notifications n
                LEFT JOIN users sender ON n.sender_id = sender.id
                WHERE n.recipient_id = ? AND n.is_read = FALSE
                ORDER BY n.created_at DESC
                LIMIT 10
            `, [userId]);

            if (unreadNotifications.length > 0) {
                this.sendToUser(userId, {
                    type: 'unread_notifications',
                    data: unreadNotifications,
                    count: unreadNotifications.length
                });
            }

        } catch (error) {
            console.error('Erreur envoi notifications non lues:', error);
        }
    }

    /**
     * Marquer une notification comme lue
     */
    async markNotificationAsRead(userId, notificationId) {
        try {
            await database.query(
                'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = ? AND recipient_id = ?',
                [notificationId, userId]
            );

            // Confirmer au client
            this.sendToUser(userId, {
                type: 'notification_read',
                notificationId
            });

        } catch (error) {
            console.error('Erreur marquage notification:', error);
        }
    }

    /**
     * Obtenir le nombre de clients connectés
     */
    getConnectedCount() {
        return this.clients.size;
    }

    /**
     * Obtenir les utilisateurs connectés
     */
    getConnectedUsers() {
        return Array.from(this.clients.keys());
    }

    /**
     * Fermer toutes les connexions
     */
    closeAll() {
        this.clients.forEach((client, userId) => {
            if (client.readyState === WebSocket.OPEN) {
                client.close();
            }
        });
        this.clients.clear();
        
        if (this.wss) {
            this.wss.close();
        }
    }
}

// Instance singleton
const wsManager = new WebSocketManager();

module.exports = wsManager;
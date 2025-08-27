const jwt = require('jsonwebtoken');
const database = require('../config/database');

/**
 * Middleware d'authentification JWT
 * Vérifie le token d'accès et charge les données utilisateur
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Récupérer le token depuis l'en-tête Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Token d\'authentification requis'
            });
        }

        const token = authHeader.substring(7); // Enlever "Bearer "

        // Vérifier le token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                error: 'Token invalide'
            });
        }

        // Récupérer l'utilisateur depuis la base de données
        const users = await database.query(
            'SELECT * FROM users WHERE id = ? AND is_active = TRUE',
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).json({
                error: 'Utilisateur non trouvé'
            });
        }

        const user = users[0];

        // Vérifier si l'email est vérifié pour certaines actions
        if (!user.email_verified && req.method !== 'GET') {
            return res.status(403).json({
                error: 'Email non vérifié. Veuillez vérifier votre email avant de continuer.'
            });
        }

        // Ajouter l'utilisateur à la requête
        req.user = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            email_verified: user.email_verified,
            is_active: user.is_active
        };

        // Définir l'utilisateur actuel pour l'audit (variable de session MySQL)
        await database.query('SET @current_user_id = ?', [user.id]);

        next();

    } catch (error) {
        console.error('Erreur middleware auth:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
};

/**
 * Middleware de vérification des rôles
 * @param {string[]} roles - Rôles autorisés
 */
const requireRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentification requise'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Permissions insuffisantes'
            });
        }

        next();
    };
};

/**
 * Middleware de vérification de propriété des ressources
 * Permet à un utilisateur d'accéder seulement à ses propres données
 * @param {string} userIdField - Nom du champ contenant l'ID utilisateur
 */
const requireOwnership = (userIdField = 'user_id') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentification requise'
            });
        }

        // Les admins et équipe LED peuvent accéder à toutes les ressources
        if (['admin', 'led_team'].includes(req.user.role)) {
            return next();
        }

        // Pour les autres utilisateurs, vérifier la propriété
        const resourceUserId = req.params[userIdField] || req.body[userIdField];
        
        if (resourceUserId && resourceUserId !== req.user.id) {
            return res.status(403).json({
                error: 'Accès non autorisé à cette ressource'
            });
        }

        next();
    };
};

/**
 * Middleware de vérification des permissions pour les boursiers
 * Permet aux étudiants d'accéder seulement à leurs propres données
 * Permet aux superviseurs d'accéder aux données de leurs étudiants
 */
const requireScholarAccess = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentification requise'
            });
        }

        // Les admins et équipe LED ont accès à tout
        if (['admin', 'led_team'].includes(req.user.role)) {
            return next();
        }

        const scholarId = req.params.id || req.params.scholarId;
        
        if (!scholarId) {
            return next(); // Si pas d'ID spécifique, laisser passer pour les listes filtrées
        }

        if (req.user.role === 'student') {
            // Vérifier que l'étudiant accède à ses propres données
            const scholars = await database.query(
                'SELECT id FROM scholars WHERE id = ? AND user_id = ?',
                [scholarId, req.user.id]
            );

            if (scholars.length === 0) {
                return res.status(403).json({
                    error: 'Accès non autorisé à ce boursier'
                });
            }
        } else if (req.user.role === 'supervisor') {
            // Vérifier que le superviseur a accès à cet étudiant
            const scholars = await database.query(
                'SELECT id FROM scholars WHERE id = ? AND academic_advisor_id = ?',
                [scholarId, req.user.id]
            );

            if (scholars.length === 0) {
                return res.status(403).json({
                    error: 'Accès non autorisé à ce boursier'
                });
            }
        }

        next();

    } catch (error) {
        console.error('Erreur vérification accès boursier:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
};

module.exports = {
    authMiddleware,
    requireRoles,
    requireOwnership,
    requireScholarAccess
};
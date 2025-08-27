const express = require('express');
const { body, query, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const database = require('../config/database');
const { requireRoles } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/users/profile
 * @desc Récupérer le profil de l'utilisateur connecté
 * @access Private
 */
router.get('/profile', async (req, res) => {
    try {
        const user = await database.query(
            'SELECT id, email, first_name, last_name, role, phone_number, profile_picture_url, is_active, email_verified, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        res.json({ data: user[0] });

    } catch (error) {
        console.error('Erreur récupération profil:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route PUT /api/users/profile
 * @desc Mettre à jour le profil utilisateur
 * @access Private
 */
router.put('/profile', [
    body('first_name').optional().trim().isLength({ min: 2, max: 100 }),
    body('last_name').optional().trim().isLength({ min: 2, max: 100 }),
    body('phone_number').optional().isMobilePhone()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array()
            });
        }

        const updateFields = [];
        const updateValues = [];
        const allowedFields = ['first_name', 'last_name', 'phone_number'];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateFields.push(`${field} = ?`);
                updateValues.push(req.body[field]);
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                error: 'Aucune modification détectée'
            });
        }

        updateFields.push('updated_at = NOW()');
        updateValues.push(req.user.id);

        await database.query(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        const updatedUser = await database.query(
            'SELECT id, email, first_name, last_name, role, phone_number, profile_picture_url FROM users WHERE id = ?',
            [req.user.id]
        );

        res.json({
            message: 'Profil mis à jour avec succès',
            data: updatedUser[0]
        });

    } catch (error) {
        console.error('Erreur mise à jour profil:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/users
 * @desc Récupérer la liste des utilisateurs (LED team only)
 * @access Private (LED team and admin)
 */
router.get('/', requireRoles(['led_team', 'admin']), [
    query('role').optional().isIn(['student', 'led_team', 'supervisor', 'admin']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
    try {
        const { role, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE 1 = 1';
        const queryParams = [];

        if (role) {
            whereClause += ' AND role = ?';
            queryParams.push(role);
        }

        const users = await database.query(`
            SELECT 
                u.id, u.email, u.first_name, u.last_name, u.role, 
                u.is_active, u.email_verified, u.created_at,
                COUNT(s.id) as scholar_count
            FROM users u
            LEFT JOIN scholars s ON u.id = s.user_id
            ${whereClause}
            GROUP BY u.id
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?
        `, [...queryParams, parseInt(limit), offset]);

        const [{ total }] = await database.query(`
            SELECT COUNT(*) as total FROM users ${whereClause}
        `, queryParams);

        res.json({
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(total),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Erreur récupération utilisateurs:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

module.exports = router;
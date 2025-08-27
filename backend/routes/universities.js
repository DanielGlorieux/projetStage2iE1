const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');
const { requireRoles } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/universities
 * @desc Récupérer la liste des universités
 * @access Private
 */
router.get('/', async (req, res) => {
    try {
        const universities = await database.query(`
            SELECT 
                u.*,
                COUNT(s.id) as scholar_count
            FROM universities u
            LEFT JOIN scholars s ON u.id = s.university_id
            GROUP BY u.id
            ORDER BY u.name
        `);

        res.json({ data: universities });

    } catch (error) {
        console.error('Erreur récupération universités:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/universities/:id/programs
 * @desc Récupérer les programmes d'une université
 * @access Private
 */
router.get('/:id/programs', async (req, res) => {
    try {
        const { id } = req.params;

        const programs = await database.query(`
            SELECT 
                p.*,
                COUNT(s.id) as scholar_count
            FROM programs p
            LEFT JOIN scholars s ON p.id = s.program_id
            WHERE p.university_id = ?
            GROUP BY p.id
            ORDER BY p.name
        `, [id]);

        res.json({ data: programs });

    } catch (error) {
        console.error('Erreur récupération programmes:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route POST /api/universities
 * @desc Créer une nouvelle université
 * @access Private (LED team only)
 */
router.post('/', requireRoles(['led_team', 'admin']), [
    body('name').trim().isLength({ min: 3, max: 255 }).withMessage('Nom requis'),
    body('code').trim().isLength({ min: 2, max: 10 }).withMessage('Code requis'),
    body('city').optional().isLength({ max: 100 }),
    body('country').optional().isLength({ max: 100 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array()
            });
        }

        const universityId = uuidv4();
        const { name, code, city, country, address, website_url, contact_email } = req.body;

        await database.query(`
            INSERT INTO universities (id, name, code, city, country, address, website_url, contact_email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [universityId, name, code, city || null, country || 'France', address || null, website_url || null, contact_email || null]);

        const createdUniversity = await database.query(
            'SELECT * FROM universities WHERE id = ?',
            [universityId]
        );

        res.status(201).json({
            message: 'Université créée avec succès',
            data: createdUniversity[0]
        });

    } catch (error) {
        console.error('Erreur création université:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({
                error: 'Une université avec ce code existe déjà'
            });
        } else {
            res.status(500).json({
                error: 'Erreur interne du serveur'
            });
        }
    }
});

module.exports = router;
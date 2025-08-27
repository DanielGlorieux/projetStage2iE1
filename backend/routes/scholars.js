const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');
const { requireRoles, requireScholarAccess } = require('../middleware/auth');

const router = express.Router();

// ================================
// VALIDATION SCHEMAS
// ================================

const createScholarValidation = [
    body('user_id').isUUID().withMessage('ID utilisateur invalide'),
    body('university_id').optional().isUUID().withMessage('ID université invalide'),
    body('program_id').optional().isUUID().withMessage('ID programme invalide'),
    body('student_number').optional().isLength({ max: 50 }),
    body('admission_year').optional().isInt({ min: 1900, max: 2100 }),
    body('current_year').optional().isInt({ min: 1, max: 10 }),
    body('expected_graduation_year').optional().isInt({ min: 1900, max: 2100 }),
    body('scholarship_start_date').optional().isISO8601(),
    body('scholarship_end_date').optional().isISO8601(),
    body('scholarship_type').optional().isLength({ max: 100 }),
    body('financial_aid_amount').optional().isDecimal(),
    body('academic_advisor_id').optional().isUUID()
];

const updateScholarValidation = [
    body('university_id').optional().isUUID(),
    body('program_id').optional().isUUID(),
    body('student_number').optional().isLength({ max: 50 }),
    body('admission_year').optional().isInt({ min: 1900, max: 2100 }),
    body('current_year').optional().isInt({ min: 1, max: 10 }),
    body('expected_graduation_year').optional().isInt({ min: 1900, max: 2100 }),
    body('scholarship_start_date').optional().isISO8601(),
    body('scholarship_end_date').optional().isISO8601(),
    body('scholarship_type').optional().isLength({ max: 100 }),
    body('financial_aid_amount').optional().isDecimal(),
    body('academic_advisor_id').optional().isUUID(),
    body('status').optional().isIn(['active', 'pending', 'graduated', 'suspended', 'withdrawn'])
];

// ================================
// ROUTES CRUD BOURSIERS
// ================================

/**
 * @route GET /api/scholars
 * @desc Récupérer la liste des boursiers avec filtres
 * @access Private (LED team, supervisors, students own data)
 */
router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isLength({ max: 255 }),
    query('status').optional().isIn(['active', 'pending', 'graduated', 'suspended', 'withdrawn']),
    query('university_id').optional().isUUID(),
    query('program_id').optional().isUUID(),
    query('year').optional().isInt({ min: 1, max: 10 })
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
            search,
            status,
            university_id,
            program_id,
            year
        } = req.query;

        const offset = (page - 1) * limit;

        // Construction de la requête avec filtres
        let whereConditions = ['1 = 1'];
        let queryParams = [];

        // Filtrage par rôle utilisateur
        if (req.user.role === 'student') {
            whereConditions.push('s.user_id = ?');
            queryParams.push(req.user.id);
        } else if (req.user.role === 'supervisor') {
            whereConditions.push('s.academic_advisor_id = ?');
            queryParams.push(req.user.id);
        }

        // Filtres de recherche
        if (search) {
            whereConditions.push('(CONCAT(u.first_name, " ", u.last_name) LIKE ? OR u.email LIKE ? OR un.name LIKE ? OR p.name LIKE ?)');
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (status) {
            whereConditions.push('s.status = ?');
            queryParams.push(status);
        }

        if (university_id) {
            whereConditions.push('s.university_id = ?');
            queryParams.push(university_id);
        }

        if (program_id) {
            whereConditions.push('s.program_id = ?');
            queryParams.push(program_id);
        }

        if (year) {
            whereConditions.push('s.current_year = ?');
            queryParams.push(year);
        }

        const whereClause = whereConditions.join(' AND ');

        // Requête principale avec pagination
        const query = `
            SELECT 
                s.*,
                CONCAT(u.first_name, ' ', u.last_name) as full_name,
                u.first_name,
                u.last_name,
                u.email,
                un.name as university_name,
                p.name as program_name,
                p.degree_level,
                CONCAT(advisor.first_name, ' ', advisor.last_name) as advisor_name,
                COUNT(sa.id) as total_activities,
                COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) as completed_activities,
                COUNT(CASE WHEN sa.status = 'in_progress' THEN 1 END) as in_progress_activities
            FROM scholars s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN universities un ON s.university_id = un.id
            LEFT JOIN programs p ON s.program_id = p.id
            LEFT JOIN users advisor ON s.academic_advisor_id = advisor.id
            LEFT JOIN scholar_activities sa ON s.id = sa.scholar_id
            WHERE ${whereClause}
            GROUP BY s.id, u.first_name, u.last_name, u.email, un.name, p.name, 
                     p.degree_level, advisor.first_name, advisor.last_name
            ORDER BY s.created_at DESC
            LIMIT ? OFFSET ?
        `;

        queryParams.push(parseInt(limit), offset);

        const scholars = await database.query(query, queryParams);

        // Compter le total pour la pagination
        const countQuery = `
            SELECT COUNT(DISTINCT s.id) as total
            FROM scholars s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN universities un ON s.university_id = un.id
            LEFT JOIN programs p ON s.program_id = p.id
            WHERE ${whereClause}
        `;

        const countParams = queryParams.slice(0, -2); // Enlever limit et offset
        const [{ total }] = await database.query(countQuery, countParams);

        res.json({
            data: scholars,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(total),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Erreur récupération boursiers:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/scholars/:id
 * @desc Récupérer un boursier spécifique
 * @access Private (with ownership check)
 */
router.get('/:id', requireScholarAccess, async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                s.*,
                CONCAT(u.first_name, ' ', u.last_name) as full_name,
                u.first_name,
                u.last_name,
                u.email,
                u.phone_number,
                un.name as university_name,
                un.city as university_city,
                p.name as program_name,
                p.degree_level,
                p.duration_years,
                CONCAT(advisor.first_name, ' ', advisor.last_name) as advisor_name,
                advisor.email as advisor_email
            FROM scholars s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN universities un ON s.university_id = un.id
            LEFT JOIN programs p ON s.program_id = p.id
            LEFT JOIN users advisor ON s.academic_advisor_id = advisor.id
            WHERE s.id = ?
        `;

        const scholars = await database.query(query, [id]);

        if (scholars.length === 0) {
            return res.status(404).json({
                error: 'Boursier non trouvé'
            });
        }

        const scholar = scholars[0];

        // Récupérer les statistiques d'activités
        const activityStats = await database.query(`
            SELECT 
                at.category,
                COUNT(sa.id) as total,
                COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) as completed,
                AVG(CASE WHEN sa.status = 'completed' AND sa.score_achieved IS NOT NULL THEN sa.score_achieved END) as avg_score
            FROM activity_types at
            LEFT JOIN scholar_activities sa ON at.id = sa.activity_type_id AND sa.scholar_id = ?
            GROUP BY at.category
        `, [id]);

        // Récupérer l'historique des scores
        const scoreHistory = await database.query(`
            SELECT score_date, academic_score, extracurricular_score, professional_score, overall_score
            FROM score_history 
            WHERE scholar_id = ? 
            ORDER BY score_date DESC 
            LIMIT 12
        `, [id]);

        res.json({
            data: {
                ...scholar,
                activity_stats: activityStats,
                score_history: scoreHistory
            }
        });

    } catch (error) {
        console.error('Erreur récupération boursier:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route POST /api/scholars
 * @desc Créer un nouveau boursier
 * @access Private (LED team only)
 */
router.post('/', requireRoles(['led_team', 'admin']), createScholarValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array()
            });
        }

        const scholarId = uuidv4();
        const scholarData = {
            id: scholarId,
            ...req.body
        };

        // Vérifier que l'utilisateur existe et n'est pas déjà un boursier
        const existingUser = await database.query(
            'SELECT id FROM users WHERE id = ?',
            [scholarData.user_id]
        );

        if (existingUser.length === 0) {
            return res.status(400).json({
                error: 'Utilisateur non trouvé'
            });
        }

        const existingScholar = await database.query(
            'SELECT id FROM scholars WHERE user_id = ?',
            [scholarData.user_id]
        );

        if (existingScholar.length > 0) {
            return res.status(409).json({
                error: 'Cet utilisateur est déjà un boursier'
            });
        }

        // Insérer le nouveau boursier
        const insertQuery = `
            INSERT INTO scholars (
                id, user_id, university_id, program_id, student_number,
                admission_year, current_year, expected_graduation_year,
                scholarship_start_date, scholarship_end_date, scholarship_type,
                financial_aid_amount, academic_advisor_id, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await database.query(insertQuery, [
            scholarData.id,
            scholarData.user_id,
            scholarData.university_id || null,
            scholarData.program_id || null,
            scholarData.student_number || null,
            scholarData.admission_year || null,
            scholarData.current_year || 1,
            scholarData.expected_graduation_year || null,
            scholarData.scholarship_start_date || null,
            scholarData.scholarship_end_date || null,
            scholarData.scholarship_type || null,
            scholarData.financial_aid_amount || null,
            scholarData.academic_advisor_id || null,
            scholarData.status || 'active'
        ]);

        // Récupérer le boursier créé avec les données complètes
        const createdScholar = await database.query(`
            SELECT 
                s.*,
                CONCAT(u.first_name, ' ', u.last_name) as full_name,
                u.email,
                un.name as university_name,
                p.name as program_name
            FROM scholars s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN universities un ON s.university_id = un.id
            LEFT JOIN programs p ON s.program_id = p.id
            WHERE s.id = ?
        `, [scholarId]);

        res.status(201).json({
            message: 'Boursier créé avec succès',
            data: createdScholar[0]
        });

    } catch (error) {
        console.error('Erreur création boursier:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route PUT /api/scholars/:id
 * @desc Mettre à jour un boursier
 * @access Private (LED team, supervisors for their students)
 */
router.put('/:id', requireScholarAccess, updateScholarValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array()
            });
        }

        const { id } = req.params;
        const updateData = req.body;

        // Vérifier que le boursier existe et récupérer les anciennes valeurs
        const existingScholar = await database.query(
            'SELECT * FROM scholars WHERE id = ?',
            [id]
        );

        if (existingScholar.length === 0) {
            return res.status(404).json({
                error: 'Boursier non trouvé'
            });
        }

        const oldData = existingScholar[0];

        // Construire la requête de mise à jour dynamiquement
        const updateFields = [];
        const updateValues = [];

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && updateData[key] !== oldData[key]) {
                updateFields.push(`${key} = ?`);
                updateValues.push(updateData[key]);
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                error: 'Aucune modification détectée'
            });
        }

        // Ajouter updated_at
        updateFields.push('updated_at = NOW()');
        updateValues.push(id);

        const updateQuery = `UPDATE scholars SET ${updateFields.join(', ')} WHERE id = ?`;
        
        await database.query(updateQuery, updateValues);

        // Si le score global a été modifié, l'enregistrer dans l'historique
        if (updateData.overall_score && updateData.overall_score !== oldData.overall_score) {
            await database.query(`
                INSERT INTO score_history (scholar_id, score_date, overall_score)
                VALUES (?, CURDATE(), ?)
                ON DUPLICATE KEY UPDATE overall_score = VALUES(overall_score)
            `, [id, updateData.overall_score]);
        }

        // Récupérer le boursier mis à jour
        const updatedScholar = await database.query(`
            SELECT 
                s.*,
                CONCAT(u.first_name, ' ', u.last_name) as full_name,
                u.email,
                un.name as university_name,
                p.name as program_name
            FROM scholars s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN universities un ON s.university_id = un.id
            LEFT JOIN programs p ON s.program_id = p.id
            WHERE s.id = ?
        `, [id]);

        res.json({
            message: 'Boursier mis à jour avec succès',
            data: updatedScholar[0]
        });

    } catch (error) {
        console.error('Erreur mise à jour boursier:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route DELETE /api/scholars/:id
 * @desc Supprimer un boursier (soft delete)
 * @access Private (LED team only)
 */
router.delete('/:id', requireRoles(['led_team', 'admin']), async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier que le boursier existe
        const existingScholar = await database.query(
            'SELECT * FROM scholars WHERE id = ?',
            [id]
        );

        if (existingScholar.length === 0) {
            return res.status(404).json({
                error: 'Boursier non trouvé'
            });
        }

        // Soft delete - marquer comme retiré au lieu de supprimer
        await database.query(
            'UPDATE scholars SET status = ?, updated_at = NOW() WHERE id = ?',
            ['withdrawn', id]
        );

        res.json({
            message: 'Boursier supprimé avec succès'
        });

    } catch (error) {
        console.error('Erreur suppression boursier:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/scholars/:id/statistics
 * @desc Récupérer les statistiques détaillées d'un boursier
 * @access Private (with ownership check)
 */
router.get('/:id/statistics', requireScholarAccess, async (req, res) => {
    try {
        const { id } = req.params;

        // Statistiques générales
        const generalStats = await database.query(`
            SELECT 
                COUNT(sa.id) as total_activities,
                COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) as completed_activities,
                COUNT(CASE WHEN sa.status = 'in_progress' THEN 1 END) as in_progress_activities,
                COUNT(CASE WHEN sa.status = 'planned' THEN 1 END) as planned_activities,
                AVG(CASE WHEN sa.status = 'completed' AND sa.score_achieved IS NOT NULL THEN sa.score_achieved END) as avg_score,
                MAX(sa.score_achieved) as best_score,
                COUNT(d.id) as total_documents
            FROM scholars s
            LEFT JOIN scholar_activities sa ON s.id = sa.scholar_id
            LEFT JOIN documents d ON s.id = d.scholar_id
            WHERE s.id = ?
            GROUP BY s.id
        `, [id]);

        // Statistiques par catégorie d'activité
        const categoryStats = await database.query(`
            SELECT 
                at.category,
                at.name as activity_type,
                COUNT(sa.id) as count,
                AVG(CASE WHEN sa.status = 'completed' THEN sa.score_achieved END) as avg_score
            FROM activity_types at
            LEFT JOIN scholar_activities sa ON at.id = sa.activity_type_id AND sa.scholar_id = ?
            GROUP BY at.category, at.name
            ORDER BY at.category, count DESC
        `, [id]);

        // Évolution mensuelle des scores
        const monthlyProgress = await database.query(`
            SELECT 
                DATE_FORMAT(score_date, '%Y-%m') as month,
                AVG(overall_score) as avg_score,
                AVG(academic_score) as avg_academic,
                AVG(extracurricular_score) as avg_extracurricular,
                AVG(professional_score) as avg_professional
            FROM score_history
            WHERE scholar_id = ?
            GROUP BY DATE_FORMAT(score_date, '%Y-%m')
            ORDER BY month DESC
            LIMIT 12
        `, [id]);

        // Dernières évaluations
        const recentEvaluations = await database.query(`
            SELECT 
                e.*,
                CONCAT(u.first_name, ' ', u.last_name) as evaluator_name
            FROM evaluations e
            JOIN users u ON e.evaluator_id = u.id
            WHERE e.scholar_id = ?
            ORDER BY e.created_at DESC
            LIMIT 5
        `, [id]);

        res.json({
            data: {
                general: generalStats[0] || {},
                by_category: categoryStats,
                monthly_progress: monthlyProgress,
                recent_evaluations: recentEvaluations
            }
        });

    } catch (error) {
        console.error('Erreur statistiques boursier:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

module.exports = router;
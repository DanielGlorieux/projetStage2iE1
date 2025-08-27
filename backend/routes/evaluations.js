const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');
const { requireRoles, requireScholarAccess } = require('../middleware/auth');

const router = express.Router();

// ================================
// VALIDATION SCHEMAS
// ================================

const createEvaluationValidation = [
    body('scholar_id').isUUID().withMessage('ID boursier invalide'),
    body('evaluation_period').isIn(['monthly', 'quarterly', 'semester', 'annual']).withMessage('Période d\'évaluation invalide'),
    body('period_start').isISO8601().withMessage('Date de début invalide'),
    body('period_end').isISO8601().withMessage('Date de fin invalide'),
    body('academic_score').optional().isDecimal({ min: 0, max: 100 }),
    body('extracurricular_score').optional().isDecimal({ min: 0, max: 100 }),
    body('professional_score').optional().isDecimal({ min: 0, max: 100 }),
    body('overall_score').optional().isDecimal({ min: 0, max: 100 }),
    body('strengths').optional().isLength({ max: 2000 }),
    body('areas_for_improvement').optional().isLength({ max: 2000 }),
    body('recommendations').optional().isLength({ max: 2000 }),
    body('next_objectives').optional().isLength({ max: 2000 })
];

const updateEvaluationValidation = [
    body('academic_score').optional().isDecimal({ min: 0, max: 100 }),
    body('extracurricular_score').optional().isDecimal({ min: 0, max: 100 }),
    body('professional_score').optional().isDecimal({ min: 0, max: 100 }),
    body('overall_score').optional().isDecimal({ min: 0, max: 100 }),
    body('strengths').optional().isLength({ max: 2000 }),
    body('areas_for_improvement').optional().isLength({ max: 2000 }),
    body('recommendations').optional().isLength({ max: 2000 }),
    body('next_objectives').optional().isLength({ max: 2000 }),
    body('status').optional().isIn(['draft', 'submitted', 'reviewed', 'approved'])
];

// ================================
// ROUTES CRUD ÉVALUATIONS
// ================================

/**
 * @route GET /api/evaluations
 * @desc Récupérer la liste des évaluations avec filtres
 * @access Private
 */
router.get('/', [
    query('scholar_id').optional().isUUID(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('period').optional().isIn(['monthly', 'quarterly', 'semester', 'annual']),
    query('status').optional().isIn(['draft', 'submitted', 'reviewed', 'approved']),
    query('evaluator_id').optional().isUUID()
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
            scholar_id,
            page = 1,
            limit = 20,
            period,
            status,
            evaluator_id
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
            whereConditions.push('(s.academic_advisor_id = ? OR e.evaluator_id = ?)');
            queryParams.push(req.user.id, req.user.id);
        }

        // Filtres spécifiques
        if (scholar_id) {
            whereConditions.push('e.scholar_id = ?');
            queryParams.push(scholar_id);
        }

        if (period) {
            whereConditions.push('e.evaluation_period = ?');
            queryParams.push(period);
        }

        if (status) {
            whereConditions.push('e.status = ?');
            queryParams.push(status);
        }

        if (evaluator_id) {
            whereConditions.push('e.evaluator_id = ?');
            queryParams.push(evaluator_id);
        }

        const whereClause = whereConditions.join(' AND ');

        // Requête principale
        const query = `
            SELECT 
                e.*,
                CONCAT(s_user.first_name, ' ', s_user.last_name) as scholar_name,
                s_user.email as scholar_email,
                s.student_number,
                un.name as university_name,
                p.name as program_name,
                CONCAT(eval_user.first_name, ' ', eval_user.last_name) as evaluator_name,
                eval_user.email as evaluator_email
            FROM evaluations e
            JOIN scholars s ON e.scholar_id = s.id
            JOIN users s_user ON s.user_id = s_user.id
            JOIN users eval_user ON e.evaluator_id = eval_user.id
            LEFT JOIN universities un ON s.university_id = un.id
            LEFT JOIN programs p ON s.program_id = p.id
            WHERE ${whereClause}
            ORDER BY e.created_at DESC
            LIMIT ? OFFSET ?
        `;

        queryParams.push(parseInt(limit), offset);
        const evaluations = await database.query(query, queryParams);

        // Compter le total
        const countQuery = `
            SELECT COUNT(DISTINCT e.id) as total
            FROM evaluations e
            JOIN scholars s ON e.scholar_id = s.id
            JOIN users eval_user ON e.evaluator_id = eval_user.id
            WHERE ${whereClause}
        `;

        const countParams = queryParams.slice(0, -2);
        const [{ total }] = await database.query(countQuery, countParams);

        res.json({
            data: evaluations,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(total),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Erreur récupération évaluations:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/evaluations/:id
 * @desc Récupérer une évaluation spécifique
 * @access Private
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                e.*,
                s.id as scholar_id,
                CONCAT(s_user.first_name, ' ', s_user.last_name) as scholar_name,
                s_user.email as scholar_email,
                s.student_number,
                s.current_year,
                un.name as university_name,
                p.name as program_name,
                p.degree_level,
                CONCAT(eval_user.first_name, ' ', eval_user.last_name) as evaluator_name,
                eval_user.email as evaluator_email,
                eval_user.role as evaluator_role
            FROM evaluations e
            JOIN scholars s ON e.scholar_id = s.id
            JOIN users s_user ON s.user_id = s_user.id
            JOIN users eval_user ON e.evaluator_id = eval_user.id
            LEFT JOIN universities un ON s.university_id = un.id
            LEFT JOIN programs p ON s.program_id = p.id
            WHERE e.id = ?
        `;

        const evaluations = await database.query(query, [id]);

        if (evaluations.length === 0) {
            return res.status(404).json({
                error: 'Évaluation non trouvée'
            });
        }

        const evaluation = evaluations[0];

        // Vérifier les permissions
        if (req.user.role === 'student') {
            const scholarCheck = await database.query(
                'SELECT id FROM scholars WHERE id = ? AND user_id = ?',
                [evaluation.scholar_id, req.user.id]
            );
            if (scholarCheck.length === 0) {
                return res.status(403).json({
                    error: 'Accès non autorisé à cette évaluation'
                });
            }
        } else if (req.user.role === 'supervisor') {
            const supervisorCheck = await database.query(
                'SELECT id FROM scholars WHERE id = ? AND academic_advisor_id = ?',
                [evaluation.scholar_id, req.user.id]
            );
            if (supervisorCheck.length === 0 && evaluation.evaluator_id !== req.user.id) {
                return res.status(403).json({
                    error: 'Accès non autorisé à cette évaluation'
                });
            }
        }

        // Récupérer les activités de la période d'évaluation
        const activitiesInPeriod = await database.query(`
            SELECT 
                sa.id,
                sa.title,
                sa.status,
                sa.score_achieved,
                sa.completion_percentage,
                at.name as activity_type,
                at.category,
                at.max_score
            FROM scholar_activities sa
            JOIN activity_types at ON sa.activity_type_id = at.id
            WHERE sa.scholar_id = ?
            AND (
                (sa.start_date BETWEEN ? AND ?) OR
                (sa.end_date BETWEEN ? AND ?) OR
                (sa.start_date <= ? AND sa.end_date >= ?)
            )
            ORDER BY at.category, sa.start_date
        `, [
            evaluation.scholar_id,
            evaluation.period_start, evaluation.period_end,
            evaluation.period_start, evaluation.period_end,
            evaluation.period_start, evaluation.period_end
        ]);

        // Grouper les activités par catégorie
        const activitiesByCategory = activitiesInPeriod.reduce((acc, activity) => {
            if (!acc[activity.category]) {
                acc[activity.category] = [];
            }
            acc[activity.category].push(activity);
            return acc;
        }, {});

        res.json({
            data: {
                ...evaluation,
                activities_in_period: activitiesByCategory
            }
        });

    } catch (error) {
        console.error('Erreur récupération évaluation:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route POST /api/evaluations
 * @desc Créer une nouvelle évaluation
 * @access Private (supervisors and LED team only)
 */
router.post('/', requireRoles(['supervisor', 'led_team', 'admin']), createEvaluationValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array()
            });
        }

        const evaluationId = uuidv4();
        const evaluationData = {
            id: evaluationId,
            evaluator_id: req.user.id,
            ...req.body
        };

        // Vérifier les permissions sur le boursier
        const scholarCheck = await database.query(
            'SELECT s.*, u.first_name, u.last_name FROM scholars s JOIN users u ON s.user_id = u.id WHERE s.id = ?',
            [evaluationData.scholar_id]
        );

        if (scholarCheck.length === 0) {
            return res.status(404).json({
                error: 'Boursier non trouvé'
            });
        }

        const scholar = scholarCheck[0];

        // Vérifier les permissions pour les superviseurs
        if (req.user.role === 'supervisor' && scholar.academic_advisor_id !== req.user.id) {
            return res.status(403).json({
                error: 'Vous ne pouvez créer d\'évaluations que pour vos étudiants supervisés'
            });
        }

        // Vérifier qu'il n'y a pas déjà une évaluation pour cette période
        const existingEvaluation = await database.query(`
            SELECT id FROM evaluations 
            WHERE scholar_id = ? AND evaluation_period = ? 
            AND period_start = ? AND period_end = ?
        `, [
            evaluationData.scholar_id,
            evaluationData.evaluation_period,
            evaluationData.period_start,
            evaluationData.period_end
        ]);

        if (existingEvaluation.length > 0) {
            return res.status(409).json({
                error: 'Une évaluation existe déjà pour cette période'
            });
        }

        // Calculer automatiquement les scores si non fournis
        if (!evaluationData.academic_score || !evaluationData.extracurricular_score || !evaluationData.professional_score) {
            const scoresQuery = await database.query(`
                SELECT 
                    at.category,
                    AVG(CASE WHEN sa.status = 'completed' AND sa.score_achieved IS NOT NULL THEN sa.score_achieved END) as avg_score,
                    COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) as completed_count
                FROM scholar_activities sa
                JOIN activity_types at ON sa.activity_type_id = at.id
                WHERE sa.scholar_id = ?
                AND (
                    (sa.start_date BETWEEN ? AND ?) OR
                    (sa.end_date BETWEEN ? AND ?) OR
                    (sa.start_date <= ? AND sa.end_date >= ?)
                )
                GROUP BY at.category
            `, [
                evaluationData.scholar_id,
                evaluationData.period_start, evaluationData.period_end,
                evaluationData.period_start, evaluationData.period_end,
                evaluationData.period_start, evaluationData.period_end
            ]);

            scoresQuery.forEach(score => {
                const avgScore = score.avg_score || 0;
                switch (score.category) {
                    case 'academic':
                        if (!evaluationData.academic_score) evaluationData.academic_score = avgScore;
                        break;
                    case 'extracurricular':
                        if (!evaluationData.extracurricular_score) evaluationData.extracurricular_score = avgScore;
                        break;
                    case 'professional':
                        if (!evaluationData.professional_score) evaluationData.professional_score = avgScore;
                        break;
                }
            });
        }

        // Calculer le score global
        if (!evaluationData.overall_score) {
            const scores = [
                evaluationData.academic_score || 0,
                evaluationData.extracurricular_score || 0,
                evaluationData.professional_score || 0
            ].filter(score => score > 0);

            evaluationData.overall_score = scores.length > 0 
                ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
                : 0;
        }

        // Insérer la nouvelle évaluation
        const insertQuery = `
            INSERT INTO evaluations (
                id, scholar_id, evaluator_id, evaluation_period, period_start, period_end,
                academic_score, extracurricular_score, professional_score, overall_score,
                strengths, areas_for_improvement, recommendations, next_objectives, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await database.query(insertQuery, [
            evaluationData.id,
            evaluationData.scholar_id,
            evaluationData.evaluator_id,
            evaluationData.evaluation_period,
            evaluationData.period_start,
            evaluationData.period_end,
            evaluationData.academic_score || null,
            evaluationData.extracurricular_score || null,
            evaluationData.professional_score || null,
            evaluationData.overall_score || null,
            evaluationData.strengths || null,
            evaluationData.areas_for_improvement || null,
            evaluationData.recommendations || null,
            evaluationData.next_objectives || null,
            evaluationData.status || 'draft'
        ]);

        // Ajouter à l'historique des scores
        if (evaluationData.overall_score) {
            await database.query(`
                INSERT INTO score_history (scholar_id, evaluation_id, score_date, academic_score, extracurricular_score, professional_score, overall_score)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                evaluationData.scholar_id,
                evaluationId,
                evaluationData.period_end,
                evaluationData.academic_score,
                evaluationData.extracurricular_score,
                evaluationData.professional_score,
                evaluationData.overall_score
            ]);

            // Mettre à jour le score global du boursier
            await database.query(
                'UPDATE scholars SET overall_score = ?, last_evaluation_date = ? WHERE id = ?',
                [evaluationData.overall_score, evaluationData.period_end, evaluationData.scholar_id]
            );
        }

        // Créer une notification pour l'étudiant
        await database.query(`
            INSERT INTO notifications (recipient_id, sender_id, title, message, notification_type, related_entity_type, related_entity_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            scholar.user_id,
            req.user.id,
            'Nouvelle évaluation',
            `Une nouvelle évaluation ${evaluationData.evaluation_period} a été créée pour la période du ${evaluationData.period_start} au ${evaluationData.period_end}.`,
            'evaluation',
            'evaluation',
            evaluationId
        ]);

        // Récupérer l'évaluation créée avec les données complètes
        const createdEvaluation = await database.query(`
            SELECT 
                e.*,
                CONCAT(s_user.first_name, ' ', s_user.last_name) as scholar_name,
                CONCAT(eval_user.first_name, ' ', eval_user.last_name) as evaluator_name
            FROM evaluations e
            JOIN scholars s ON e.scholar_id = s.id
            JOIN users s_user ON s.user_id = s_user.id
            JOIN users eval_user ON e.evaluator_id = eval_user.id
            WHERE e.id = ?
        `, [evaluationId]);

        res.status(201).json({
            message: 'Évaluation créée avec succès',
            data: createdEvaluation[0]
        });

    } catch (error) {
        console.error('Erreur création évaluation:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route PUT /api/evaluations/:id
 * @desc Mettre à jour une évaluation
 * @access Private (evaluator only)
 */
router.put('/:id', updateEvaluationValidation, async (req, res) => {
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

        // Récupérer l'évaluation existante
        const existingEvaluation = await database.query(`
            SELECT e.*, s.user_id as scholar_user_id, s.academic_advisor_id
            FROM evaluations e
            JOIN scholars s ON e.scholar_id = s.id
            WHERE e.id = ?
        `, [id]);

        if (existingEvaluation.length === 0) {
            return res.status(404).json({
                error: 'Évaluation non trouvée'
            });
        }

        const evaluation = existingEvaluation[0];

        // Vérifier les permissions
        if (req.user.role === 'supervisor' && evaluation.academic_advisor_id !== req.user.id && evaluation.evaluator_id !== req.user.id) {
            return res.status(403).json({
                error: 'Vous ne pouvez modifier que vos propres évaluations'
            });
        } else if (!['led_team', 'admin'].includes(req.user.role) && evaluation.evaluator_id !== req.user.id) {
            return res.status(403).json({
                error: 'Vous ne pouvez modifier que vos propres évaluations'
            });
        }

        // Construire la requête de mise à jour
        const updateFields = [];
        const updateValues = [];

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && updateData[key] !== evaluation[key]) {
                updateFields.push(`${key} = ?`);
                updateValues.push(updateData[key]);
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                error: 'Aucune modification détectée'
            });
        }

        // Recalculer le score global si nécessaire
        if (updateData.academic_score || updateData.extracurricular_score || updateData.professional_score) {
            const academicScore = updateData.academic_score !== undefined ? updateData.academic_score : evaluation.academic_score;
            const extracurricularScore = updateData.extracurricular_score !== undefined ? updateData.extracurricular_score : evaluation.extracurricular_score;
            const professionalScore = updateData.professional_score !== undefined ? updateData.professional_score : evaluation.professional_score;

            const scores = [academicScore, extracurricularScore, professionalScore].filter(score => score && score > 0);
            const overallScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;

            if (!updateData.overall_score) {
                updateFields.push('overall_score = ?');
                updateValues.push(overallScore);
            }
        }

        updateFields.push('updated_at = NOW()');
        updateValues.push(id);

        const updateQuery = `UPDATE evaluations SET ${updateFields.join(', ')} WHERE id = ?`;
        await database.query(updateQuery, updateValues);

        // Mettre à jour l'historique des scores si le score global a changé
        const finalOverallScore = updateData.overall_score || evaluation.overall_score;
        if (finalOverallScore && finalOverallScore !== evaluation.overall_score) {
            await database.query(`
                INSERT INTO score_history (scholar_id, evaluation_id, score_date, academic_score, extracurricular_score, professional_score, overall_score)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                academic_score = VALUES(academic_score),
                extracurricular_score = VALUES(extracurricular_score),
                professional_score = VALUES(professional_score),
                overall_score = VALUES(overall_score)
            `, [
                evaluation.scholar_id,
                id,
                evaluation.period_end,
                updateData.academic_score || evaluation.academic_score,
                updateData.extracurricular_score || evaluation.extracurricular_score,
                updateData.professional_score || evaluation.professional_score,
                finalOverallScore
            ]);

            // Mettre à jour le score global du boursier
            await database.query(
                'UPDATE scholars SET overall_score = ? WHERE id = ?',
                [finalOverallScore, evaluation.scholar_id]
            );
        }

        // Notifier l'étudiant si l'évaluation est approuvée
        if (updateData.status === 'approved' && evaluation.status !== 'approved') {
            await database.query(`
                INSERT INTO notifications (recipient_id, sender_id, title, message, notification_type, related_entity_type, related_entity_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                evaluation.scholar_user_id,
                req.user.id,
                'Évaluation approuvée',
                `Votre évaluation ${evaluation.evaluation_period} a été approuvée. Score global: ${finalOverallScore}/100`,
                'evaluation',
                'evaluation',
                id
            ]);
        }

        // Récupérer l'évaluation mise à jour
        const updatedEvaluation = await database.query(`
            SELECT 
                e.*,
                CONCAT(s_user.first_name, ' ', s_user.last_name) as scholar_name,
                CONCAT(eval_user.first_name, ' ', eval_user.last_name) as evaluator_name
            FROM evaluations e
            JOIN scholars s ON e.scholar_id = s.id
            JOIN users s_user ON s.user_id = s_user.id  
            JOIN users eval_user ON e.evaluator_id = eval_user.id
            WHERE e.id = ?
        `, [id]);

        res.json({
            message: 'Évaluation mise à jour avec succès',
            data: updatedEvaluation[0]
        });

    } catch (error) {
        console.error('Erreur mise à jour évaluation:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route DELETE /api/evaluations/:id
 * @desc Supprimer une évaluation
 * @access Private (evaluator and LED team only)
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Récupérer l'évaluation
        const evaluationQuery = await database.query(`
            SELECT e.*, s.academic_advisor_id
            FROM evaluations e
            JOIN scholars s ON e.scholar_id = s.id
            WHERE e.id = ?
        `, [id]);

        if (evaluationQuery.length === 0) {
            return res.status(404).json({
                error: 'Évaluation non trouvée'
            });
        }

        const evaluation = evaluationQuery[0];

        // Vérifier les permissions
        if (!['led_team', 'admin'].includes(req.user.role) && 
            evaluation.evaluator_id !== req.user.id && 
            evaluation.academic_advisor_id !== req.user.id) {
            return res.status(403).json({
                error: 'Permissions insuffisantes pour supprimer cette évaluation'
            });
        }

        // Supprimer l'évaluation et l'historique associé
        await database.transaction(async (connection) => {
            // Supprimer de l'historique des scores
            await connection.execute('DELETE FROM score_history WHERE evaluation_id = ?', [id]);
            
            // Supprimer l'évaluation
            await connection.execute('DELETE FROM evaluations WHERE id = ?', [id]);
        });

        // Recalculer le score global du boursier
        await database.query('CALL UpdateScholarScore(?)', [evaluation.scholar_id]);

        res.json({
            message: 'Évaluation supprimée avec succès'
        });

    } catch (error) {
        console.error('Erreur suppression évaluation:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/evaluations/scholar/:scholarId/timeline
 * @desc Récupérer la chronologie des évaluations d'un boursier
 * @access Private
 */
router.get('/scholar/:scholarId/timeline', requireScholarAccess, async (req, res) => {
    try {
        const { scholarId } = req.params;

        const timeline = await database.query(`
            SELECT 
                e.*,
                CONCAT(eval_user.first_name, ' ', eval_user.last_name) as evaluator_name
            FROM evaluations e
            JOIN users eval_user ON e.evaluator_id = eval_user.id
            WHERE e.scholar_id = ?
            ORDER BY e.period_start DESC
        `, [scholarId]);

        // Récupérer aussi l'historique des scores pour le graphique
        const scoreHistory = await database.query(`
            SELECT 
                score_date,
                academic_score,
                extracurricular_score,
                professional_score,
                overall_score
            FROM score_history
            WHERE scholar_id = ?
            ORDER BY score_date ASC
        `, [scholarId]);

        res.json({
            data: {
                evaluations: timeline,
                score_history: scoreHistory
            }
        });

    } catch (error) {
        console.error('Erreur récupération timeline évaluations:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

module.exports = router;
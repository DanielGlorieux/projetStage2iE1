const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const XLSX = require('xlsx');
const database = require('../config/database');
const { requireRoles } = require('../middleware/auth');

const router = express.Router();

// ================================
// UTILITAIRES DE GÉNÉRATION
// ================================

const generateCSV = (data, headers) => {
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
        headers.map(header => {
            const value = row[header] || '';
            // Échapper les guillemets et entourer de guillemets si nécessaire
            return typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value;
        }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
};

const generateExcel = (data, headers, sheetName = 'Rapport') => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
};

const ensureReportsDir = async () => {
    const reportsDir = path.join(__dirname, '../reports');
    try {
        await fs.access(reportsDir);
    } catch (error) {
        await fs.mkdir(reportsDir, { recursive: true });
    }
    return reportsDir;
};

// ================================
// VALIDATION SCHEMAS
// ================================

const generateReportValidation = [
    body('report_type').isIn(['performance', 'activities', 'progress', 'summary', 'financial']).withMessage('Type de rapport invalide'),
    body('period_start').optional().isISO8601(),
    body('period_end').optional().isISO8601(),
    body('scholar_ids').optional().isArray(),
    body('scholar_ids.*').optional().isUUID(),
    body('format').isIn(['pdf', 'csv', 'excel', 'json']).withMessage('Format invalide'),
    body('title').trim().isLength({ min: 3, max: 255 }).withMessage('Titre requis')
];

const createTemplateValidation = [
    body('name').trim().isLength({ min: 3, max: 255 }).withMessage('Nom requis'),
    body('report_type').isIn(['performance', 'activities', 'progress', 'summary', 'financial']),
    body('frequency').isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annual', 'on_demand']),
    body('template_config').isObject(),
    body('description').optional().isLength({ max: 1000 })
];

// ================================
// GÉNÉRATEURS DE RAPPORTS
// ================================

const generatePerformanceReport = async (filters) => {
    const { period_start, period_end, scholar_ids } = filters;
    
    let whereConditions = ['1 = 1'];
    let queryParams = [];

    if (period_start && period_end) {
        whereConditions.push('e.period_start >= ? AND e.period_end <= ?');
        queryParams.push(period_start, period_end);
    }

    if (scholar_ids && scholar_ids.length > 0) {
        whereConditions.push(`s.id IN (${scholar_ids.map(() => '?').join(',')})`);
        queryParams.push(...scholar_ids);
    }

    const whereClause = whereConditions.join(' AND ');

    const data = await database.query(`
        SELECT 
            CONCAT(u.first_name, ' ', u.last_name) as scholar_name,
            u.email,
            s.student_number,
            s.current_year,
            s.status as scholar_status,
            s.overall_score,
            un.name as university_name,
            p.name as program_name,
            p.degree_level,
            COUNT(DISTINCT sa.id) as total_activities,
            COUNT(DISTINCT CASE WHEN sa.status = 'completed' THEN sa.id END) as completed_activities,
            AVG(CASE WHEN sa.status = 'completed' AND sa.score_achieved IS NOT NULL THEN sa.score_achieved END) as avg_activity_score,
            AVG(e.overall_score) as avg_evaluation_score,
            MAX(e.period_end) as last_evaluation_date
        FROM scholars s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN universities un ON s.university_id = un.id
        LEFT JOIN programs p ON s.program_id = p.id
        LEFT JOIN scholar_activities sa ON s.id = sa.scholar_id
        LEFT JOIN evaluations e ON s.id = e.scholar_id
        WHERE ${whereClause}
        GROUP BY s.id, u.first_name, u.last_name, u.email, s.student_number, 
                 s.current_year, s.status, s.overall_score, un.name, p.name, p.degree_level
        ORDER BY s.overall_score DESC
    `, queryParams);

    return {
        data,
        headers: [
            'scholar_name', 'email', 'student_number', 'current_year', 'scholar_status',
            'overall_score', 'university_name', 'program_name', 'degree_level',
            'total_activities', 'completed_activities', 'avg_activity_score',
            'avg_evaluation_score', 'last_evaluation_date'
        ],
        summary: {
            total_scholars: data.length,
            avg_overall_score: data.reduce((sum, row) => sum + (row.overall_score || 0), 0) / data.length,
            active_scholars: data.filter(row => row.scholar_status === 'active').length,
            completed_activities_total: data.reduce((sum, row) => sum + (row.completed_activities || 0), 0)
        }
    };
};

const generateActivitiesReport = async (filters) => {
    const { period_start, period_end, scholar_ids } = filters;
    
    let whereConditions = ['1 = 1'];
    let queryParams = [];

    if (period_start && period_end) {
        whereConditions.push('(sa.start_date >= ? OR sa.end_date <= ?)');
        queryParams.push(period_start, period_end);
    }

    if (scholar_ids && scholar_ids.length > 0) {
        whereConditions.push(`s.id IN (${scholar_ids.map(() => '?').join(',')})`);
        queryParams.push(...scholar_ids);
    }

    const whereClause = whereConditions.join(' AND ');

    const data = await database.query(`
        SELECT 
            CONCAT(u.first_name, ' ', u.last_name) as scholar_name,
            s.student_number,
            sa.title as activity_title,
            at.name as activity_type,
            at.category,
            sa.status as activity_status,
            sa.start_date,
            sa.end_date,
            sa.completion_percentage,
            sa.score_achieved,
            at.max_score,
            CONCAT(eval_user.first_name, ' ', eval_user.last_name) as evaluator_name,
            sa.evaluation_date,
            COUNT(d.id) as document_count
        FROM scholar_activities sa
        JOIN scholars s ON sa.scholar_id = s.id
        JOIN users u ON s.user_id = u.id
        JOIN activity_types at ON sa.activity_type_id = at.id
        LEFT JOIN users eval_user ON sa.evaluator_id = eval_user.id
        LEFT JOIN documents d ON sa.id = d.activity_id
        WHERE ${whereClause}
        GROUP BY sa.id, u.first_name, u.last_name, s.student_number, sa.title,
                 at.name, at.category, at.max_score, eval_user.first_name, eval_user.last_name
        ORDER BY s.student_number, sa.start_date DESC
    `, queryParams);

    return {
        data,
        headers: [
            'scholar_name', 'student_number', 'activity_title', 'activity_type', 'category',
            'activity_status', 'start_date', 'end_date', 'completion_percentage',
            'score_achieved', 'max_score', 'evaluator_name', 'evaluation_date', 'document_count'
        ],
        summary: {
            total_activities: data.length,
            completed_activities: data.filter(row => row.activity_status === 'completed').length,
            avg_score: data.filter(row => row.score_achieved).reduce((sum, row) => sum + row.score_achieved, 0) / data.filter(row => row.score_achieved).length || 0,
            by_category: data.reduce((acc, row) => {
                acc[row.category] = (acc[row.category] || 0) + 1;
                return acc;
            }, {})
        }
    };
};

const generateProgressReport = async (filters) => {
    const { period_start, period_end, scholar_ids } = filters;
    
    let whereConditions = ['1 = 1'];
    let queryParams = [];

    if (period_start && period_end) {
        whereConditions.push('sh.score_date BETWEEN ? AND ?');
        queryParams.push(period_start, period_end);
    }

    if (scholar_ids && scholar_ids.length > 0) {
        whereConditions.push(`s.id IN (${scholar_ids.map(() => '?').join(',')})`);
        queryParams.push(...scholar_ids);
    }

    const whereClause = whereConditions.join(' AND ');

    const data = await database.query(`
        SELECT 
            CONCAT(u.first_name, ' ', u.last_name) as scholar_name,
            s.student_number,
            s.current_year,
            DATE_FORMAT(sh.score_date, '%Y-%m') as period,
            sh.academic_score,
            sh.extracurricular_score,
            sh.professional_score,
            sh.overall_score,
            LAG(sh.overall_score) OVER (PARTITION BY s.id ORDER BY sh.score_date) as previous_score,
            (sh.overall_score - LAG(sh.overall_score) OVER (PARTITION BY s.id ORDER BY sh.score_date)) as score_change
        FROM score_history sh
        JOIN scholars s ON sh.scholar_id = s.id
        JOIN users u ON s.user_id = u.id
        WHERE ${whereClause}
        ORDER BY s.student_number, sh.score_date
    `, queryParams);

    return {
        data,
        headers: [
            'scholar_name', 'student_number', 'current_year', 'period',
            'academic_score', 'extracurricular_score', 'professional_score',
            'overall_score', 'previous_score', 'score_change'
        ],
        summary: {
            total_records: data.length,
            avg_overall_score: data.reduce((sum, row) => sum + (row.overall_score || 0), 0) / data.length,
            improving_scholars: data.filter(row => row.score_change > 0).length,
            declining_scholars: data.filter(row => row.score_change < 0).length
        }
    };
};

// ================================
// ROUTES RAPPORTS
// ================================

/**
 * @route GET /api/reports/templates
 * @desc Récupérer les templates de rapports
 * @access Private (LED team and supervisors)
 */
router.get('/templates', requireRoles(['supervisor', 'led_team', 'admin']), async (req, res) => {
    try {
        const templates = await database.query(`
            SELECT 
                rt.*,
                CONCAT(u.first_name, ' ', u.last_name) as created_by_name
            FROM report_templates rt
            JOIN users u ON rt.created_by = u.id
            WHERE rt.is_active = TRUE
            ORDER BY rt.report_type, rt.name
        `);

        res.json({
            data: templates
        });

    } catch (error) {
        console.error('Erreur récupération templates:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route POST /api/reports/templates
 * @desc Créer un nouveau template de rapport
 * @access Private (LED team only)
 */
router.post('/templates', requireRoles(['led_team', 'admin']), createTemplateValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array()
            });
        }

        const templateId = uuidv4();
        const templateData = {
            id: templateId,
            created_by: req.user.id,
            ...req.body
        };

        await database.query(`
            INSERT INTO report_templates (id, name, description, report_type, template_config, frequency, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            templateId,
            templateData.name,
            templateData.description || null,
            templateData.report_type,
            JSON.stringify(templateData.template_config),
            templateData.frequency,
            templateData.created_by
        ]);

        const createdTemplate = await database.query(`
            SELECT 
                rt.*,
                CONCAT(u.first_name, ' ', u.last_name) as created_by_name
            FROM report_templates rt
            JOIN users u ON rt.created_by = u.id
            WHERE rt.id = ?
        `, [templateId]);

        res.status(201).json({
            message: 'Template créé avec succès',
            data: createdTemplate[0]
        });

    } catch (error) {
        console.error('Erreur création template:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route POST /api/reports/generate
 * @desc Générer un rapport
 * @access Private (LED team and supervisors)
 */
router.post('/generate', requireRoles(['supervisor', 'led_team', 'admin']), generateReportValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array()
            });
        }

        const {
            report_type,
            period_start,
            period_end,
            scholar_ids,
            format,
            title,
            template_id
        } = req.body;

        // Générer les données selon le type de rapport
        let reportData;
        switch (report_type) {
            case 'performance':
                reportData = await generatePerformanceReport({ period_start, period_end, scholar_ids });
                break;
            case 'activities':
                reportData = await generateActivitiesReport({ period_start, period_end, scholar_ids });
                break;
            case 'progress':
                reportData = await generateProgressReport({ period_start, period_end, scholar_ids });
                break;
            default:
                return res.status(400).json({
                    error: 'Type de rapport non supporté'
                });
        }

        const reportId = uuidv4();
        const reportsDir = await ensureReportsDir();
        
        let filePath;
        let fileContent;

        // Générer le fichier selon le format demandé
        switch (format) {
            case 'csv':
                fileContent = generateCSV(reportData.data, reportData.headers);
                filePath = path.join(reportsDir, `${reportId}.csv`);
                await fs.writeFile(filePath, fileContent, 'utf8');
                break;

            case 'excel':
                fileContent = generateExcel(reportData.data, reportData.headers, title);
                filePath = path.join(reportsDir, `${reportId}.xlsx`);
                await fs.writeFile(filePath, fileContent);
                break;

            case 'json':
                fileContent = JSON.stringify({
                    metadata: {
                        title,
                        report_type,
                        generated_at: new Date().toISOString(),
                        generated_by: req.user.email,
                        period: { start: period_start, end: period_end },
                        filters: { scholar_ids }
                    },
                    summary: reportData.summary,
                    data: reportData.data
                }, null, 2);
                filePath = path.join(reportsDir, `${reportId}.json`);
                await fs.writeFile(filePath, fileContent, 'utf8');
                break;

            default:
                return res.status(400).json({
                    error: 'Format non supporté'
                });
        }

        // Enregistrer le rapport généré en base
        await database.query(`
            INSERT INTO generated_reports (id, template_id, generated_by, report_title, period_start, period_end, file_path, file_format, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            reportId,
            template_id || null,
            req.user.id,
            title,
            period_start || null,
            period_end || null,
            path.relative(path.join(__dirname, '..'), filePath),
            format,
            'completed'
        ]);

        res.json({
            message: 'Rapport généré avec succès',
            data: {
                id: reportId,
                title,
                format,
                file_path: `/api/reports/${reportId}/download`,
                summary: reportData.summary,
                record_count: reportData.data.length
            }
        });

    } catch (error) {
        console.error('Erreur génération rapport:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/reports
 * @desc Récupérer l'historique des rapports générés
 * @access Private (LED team and supervisors)
 */
router.get('/', requireRoles(['supervisor', 'led_team', 'admin']), [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20
        } = req.query;

        const offset = (page - 1) * limit;

        let whereConditions = ['1 = 1'];
        let queryParams = [];

        // Filtrer par utilisateur pour les superviseurs
        if (req.user.role === 'supervisor') {
            whereConditions.push('gr.generated_by = ?');
            queryParams.push(req.user.id);
        }

        const whereClause = whereConditions.join(' AND ');

        const reports = await database.query(`
            SELECT 
                gr.*,
                CONCAT(u.first_name, ' ', u.last_name) as generated_by_name,
                rt.name as template_name,
                rt.report_type
            FROM generated_reports gr
            JOIN users u ON gr.generated_by = u.id
            LEFT JOIN report_templates rt ON gr.template_id = rt.id
            WHERE ${whereClause}
            ORDER BY gr.generation_date DESC
            LIMIT ? OFFSET ?
        `, [...queryParams, parseInt(limit), offset]);

        // Compter le total
        const [{ total }] = await database.query(`
            SELECT COUNT(*) as total
            FROM generated_reports gr
            WHERE ${whereClause}
        `, queryParams);

        res.json({
            data: reports,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(total),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Erreur récupération rapports:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/reports/:id/download
 * @desc Télécharger un rapport généré
 * @access Private
 */
router.get('/:id/download', requireRoles(['supervisor', 'led_team', 'admin']), async (req, res) => {
    try {
        const { id } = req.params;

        const reportQuery = await database.query(`
            SELECT * FROM generated_reports WHERE id = ?
        `, [id]);

        if (reportQuery.length === 0) {
            return res.status(404).json({
                error: 'Rapport non trouvé'
            });
        }

        const report = reportQuery[0];

        // Vérifier les permissions
        if (req.user.role === 'supervisor' && report.generated_by !== req.user.id) {
            return res.status(403).json({
                error: 'Accès non autorisé à ce rapport'
            });
        }

        const filePath = path.join(__dirname, '..', report.file_path);

        try {
            await fs.access(filePath);
        } catch (error) {
            return res.status(404).json({
                error: 'Fichier de rapport non trouvé'
            });
        }

        // Définir les headers appropriés selon le format
        const mimeTypes = {
            'csv': 'text/csv',
            'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'json': 'application/json',
            'pdf': 'application/pdf'
        };

        const mimeType = mimeTypes[report.file_format] || 'application/octet-stream';
        const fileName = `${report.report_title.replace(/[^a-zA-Z0-9]/g, '_')}.${report.file_format}`;

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        
        const fileContent = await fs.readFile(filePath);
        res.send(fileContent);

    } catch (error) {
        console.error('Erreur téléchargement rapport:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route DELETE /api/reports/:id
 * @desc Supprimer un rapport généré
 * @access Private (generator or LED team)
 */
router.delete('/:id', requireRoles(['supervisor', 'led_team', 'admin']), async (req, res) => {
    try {
        const { id } = req.params;

        const reportQuery = await database.query(`
            SELECT * FROM generated_reports WHERE id = ?
        `, [id]);

        if (reportQuery.length === 0) {
            return res.status(404).json({
                error: 'Rapport non trouvé'
            });
        }

        const report = reportQuery[0];

        // Vérifier les permissions
        if (!['led_team', 'admin'].includes(req.user.role) && report.generated_by !== req.user.id) {
            return res.status(403).json({
                error: 'Permissions insuffisantes'
            });
        }

        // Supprimer le fichier
        const filePath = path.join(__dirname, '..', report.file_path);
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.warn('Fichier de rapport déjà supprimé:', error.message);
        }

        // Supprimer l'enregistrement
        await database.query('DELETE FROM generated_reports WHERE id = ?', [id]);

        res.json({
            message: 'Rapport supprimé avec succès'
        });

    } catch (error) {
        console.error('Erreur suppression rapport:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/reports/statistics
 * @desc Récupérer les statistiques globales pour les rapports
 * @access Private (LED team only)
 */
router.get('/statistics', requireRoles(['led_team', 'admin']), async (req, res) => {
    try {
        // Statistiques générales
        const generalStats = await database.query(`
            SELECT 
                COUNT(DISTINCT s.id) as total_scholars,
                COUNT(DISTINCT CASE WHEN s.status = 'active' THEN s.id END) as active_scholars,
                AVG(s.overall_score) as avg_overall_score,
                COUNT(DISTINCT sa.id) as total_activities,
                COUNT(DISTINCT CASE WHEN sa.status = 'completed' THEN sa.id END) as completed_activities,
                COUNT(DISTINCT e.id) as total_evaluations
            FROM scholars s
            LEFT JOIN scholar_activities sa ON s.id = sa.scholar_id
            LEFT JOIN evaluations e ON s.id = e.scholar_id
        `);

        // Statistiques par université
        const universityStats = await database.query(`
            SELECT 
                un.name as university_name,
                COUNT(s.id) as scholar_count,
                AVG(s.overall_score) as avg_score
            FROM universities un
            LEFT JOIN scholars s ON un.id = s.university_id
            GROUP BY un.id, un.name
            ORDER BY scholar_count DESC
        `);

        // Statistiques par type d'activité
        const activityStats = await database.query(`
            SELECT 
                at.category,
                at.name as activity_type,
                COUNT(sa.id) as activity_count,
                AVG(CASE WHEN sa.status = 'completed' THEN sa.score_achieved END) as avg_score
            FROM activity_types at
            LEFT JOIN scholar_activities sa ON at.id = sa.activity_type_id
            GROUP BY at.category, at.name
            ORDER BY at.category, activity_count DESC
        `);

        // Évolution mensuelle
        const monthlyEvolution = await database.query(`
            SELECT 
                DATE_FORMAT(sh.score_date, '%Y-%m') as month,
                AVG(sh.overall_score) as avg_score,
                COUNT(DISTINCT sh.scholar_id) as scholar_count
            FROM score_history sh
            WHERE sh.score_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(sh.score_date, '%Y-%m')
            ORDER BY month
        `);

        res.json({
            data: {
                general: generalStats[0],
                by_university: universityStats,
                by_activity_type: activityStats,
                monthly_evolution: monthlyEvolution
            }
        });

    } catch (error) {
        console.error('Erreur statistiques rapports:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

module.exports = router;
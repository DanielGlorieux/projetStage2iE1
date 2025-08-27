const express = require('express');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const database = require('../config/database');
const { requireRoles } = require('../middleware/auth');
const { 
    uploadDocumentValidation, 
    updateDocumentValidation, 
    getDocumentsValidation 
} = require('../validators/documentValidation');
const { 
    MAX_FILE_SIZE, 
    ALLOWED_FILE_TYPES,
    DOCUMENT_TYPES
} = require('../utils/fileConstants');
const {
    ensureUploadDir,
    generateSecureFileName,
    validateFileType,
    getMimeTypeForDownload,
    cleanupTempFile,
    fileExists,
    safeDeleteFile
} = require('../utils/fileHelpers');
const {
    getDocumentsWithFilters,
    getDocumentWithPermissions,
    checkScholarPermissions,
    validateActivityBelongsToScholar,
    createDocument,
    updateDocumentData,
    verifyDocument,
    getLEDTeamUsers
} = require('../utils/documentQueries');

const router = express.Router();

// ================================
// ROUTES CRUD DOCUMENTS
// ================================

/**
 * @route GET /api/documents
 * @desc Récupérer la liste des documents avec filtres
 * @access Private
 */
router.get('/', getDocumentsValidation, async (req, res) => {
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
            activity_id,
            page = 1,
            limit = 20,
            document_type,
            verified_only
        } = req.query;

        const filters = { scholar_id, activity_id, document_type, verified_only };
        const pagination = { 
            limit: parseInt(limit), 
            offset: (page - 1) * limit 
        };

        const { documents, total } = await getDocumentsWithFilters(
            req.user.role, 
            req.user.id, 
            filters, 
            pagination
        );

        res.json({
            data: documents,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(total),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Erreur récupération documents:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/documents/:id
 * @desc Récupérer un document spécifique
 * @access Private
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const document = await getDocumentWithPermissions(id);

        if (!document) {
            return res.status(404).json({
                error: 'Document non trouvé'
            });
        }

        // Vérifier les permissions
        if (req.user.role === 'student') {
            const scholarCheck = await database.query(
                'SELECT id FROM scholars WHERE id = ? AND user_id = ?',
                [document.scholar_id, req.user.id]
            );
            if (scholarCheck.length === 0) {
                return res.status(403).json({
                    error: 'Accès non autorisé à ce document'
                });
            }
        } else if (req.user.role === 'supervisor' && document.academic_advisor_id !== req.user.id) {
            return res.status(403).json({
                error: 'Accès non autorisé à ce document'
            });
        }

        res.json({ data: document });

    } catch (error) {
        console.error('Erreur récupération document:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route POST /api/documents/upload
 * @desc Uploader un nouveau document
 * @access Private
 */
router.post('/upload', uploadDocumentValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array()
            });
        }

        if (!req.files || !req.files.file) {
            return res.status(400).json({
                error: 'Aucun fichier fourni'
            });
        }

        const uploadedFile = req.files.file;
        const { scholar_id, activity_id, document_type, description } = req.body;

        // Validations fichier
        if (uploadedFile.size > MAX_FILE_SIZE) {
            return res.status(400).json({
                error: `Fichier trop volumineux. Taille maximale: ${MAX_FILE_SIZE / 1024 / 1024}MB`
            });
        }

        const fileExtension = validateFileType(uploadedFile.mimetype);
        if (!fileExtension) {
            return res.status(400).json({
                error: 'Type de fichier non autorisé',
                allowed_types: Object.keys(ALLOWED_FILE_TYPES)
            });
        }

        // Vérifier permissions boursier
        const scholar = await checkScholarPermissions(scholar_id);
        if (!scholar) {
            return res.status(404).json({
                error: 'Boursier non trouvé'
            });
        }

        if (req.user.role === 'student' && scholar.user_id !== req.user.id) {
            return res.status(403).json({
                error: 'Vous ne pouvez uploader des documents que pour vous-même'
            });
        } else if (req.user.role === 'supervisor' && scholar.academic_advisor_id !== req.user.id) {
            return res.status(403).json({
                error: 'Vous ne pouvez uploader des documents que pour vos étudiants supervisés'
            });
        }

        // Vérifier activité si spécifiée
        if (activity_id && !(await validateActivityBelongsToScholar(activity_id, scholar_id))) {
            return res.status(400).json({
                error: 'Activité non trouvée pour ce boursier'
            });
        }

        // Upload du fichier
        const uploadDir = await ensureUploadDir();
        const secureFileName = generateSecureFileName(uploadedFile.name, fileExtension);
        const filePath = path.join(uploadDir, secureFileName);

        await uploadedFile.mv(filePath);

        // Enregistrer en base
        const documentId = uuidv4();
        await createDocument({
            id: documentId,
            scholar_id,
            activity_id,
            uploader_id: req.user.id,
            file_name: uploadedFile.name,
            file_path: path.relative(path.join(__dirname, '..'), filePath),
            file_size: uploadedFile.size,
            file_type: uploadedFile.mimetype,
            document_type,
            description
        });

        // Notification équipe LED si upload par étudiant
        if (req.user.role === 'student') {
            const ledTeam = await getLEDTeamUsers();
            if (ledTeam.length > 0) {
                await database.query(`
                    INSERT INTO notifications (recipient_id, sender_id, title, message, notification_type, related_entity_type, related_entity_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                    ledTeam[0].id,
                    req.user.id,
                    'Nouveau document uploadé',
                    `${scholar.first_name} ${scholar.last_name} a uploadé un nouveau document: ${uploadedFile.name}`,
                    'document',
                    'document',
                    documentId
                ]);
            }
        }

        // Récupérer document créé
        const createdDocument = await getDocumentWithPermissions(documentId);
        res.status(201).json({
            message: 'Document uploadé avec succès',
            data: createdDocument
        });

    } catch (error) {
        console.error('Erreur upload document:', error);
        await cleanupTempFile(req.files?.file?.tempFilePath);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/documents/:id/download
 * @desc Télécharger un document
 * @access Private
 */
router.get('/:id/download', async (req, res) => {
    try {
        const { id } = req.params;
        const document = await getDocumentWithPermissions(id);

        if (!document) {
            return res.status(404).json({
                error: 'Document non trouvé'
            });
        }

        // Vérifier permissions
        if (req.user.role === 'student' && document.scholar_user_id !== req.user.id) {
            return res.status(403).json({
                error: 'Accès non autorisé à ce document'
            });
        } else if (req.user.role === 'supervisor' && document.academic_advisor_id !== req.user.id) {
            return res.status(403).json({
                error: 'Accès non autorisé à ce document'
            });
        }

        const filePath = path.join(__dirname, '..', document.file_path);

        if (!(await fileExists(filePath))) {
            return res.status(404).json({
                error: 'Fichier non trouvé sur le serveur'
            });
        }

        // Headers et envoi
        const fileExtension = path.extname(document.file_name).substring(1);
        const mimeType = getMimeTypeForDownload(fileExtension);
        
        res.setHeader('Content-Type', document.file_type);
        res.setHeader('Content-Disposition', `attachment; filename="${document.file_name}"`);
        res.setHeader('Content-Length', document.file_size);

        const fileContent = await fs.readFile(filePath);
        res.send(fileContent);

    } catch (error) {
        console.error('Erreur téléchargement document:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route PUT /api/documents/:id
 * @desc Mettre à jour les métadonnées d'un document
 * @access Private
 */
router.put('/:id', updateDocumentValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array()
            });
        }

        const { id } = req.params;
        const updateFields = [];
        const updateValues = [];

        const document = await getDocumentWithPermissions(id);
        if (!document) {
            return res.status(404).json({
                error: 'Document non trouvé'
            });
        }

        // Vérifier permissions
        if (req.user.role === 'student' && document.scholar_user_id !== req.user.id) {
            return res.status(403).json({
                error: 'Vous ne pouvez modifier que vos propres documents'
            });
        } else if (req.user.role === 'supervisor' && 
                   document.academic_advisor_id !== req.user.id && 
                   document.uploader_id !== req.user.id) {
            return res.status(403).json({
                error: 'Vous ne pouvez modifier que les documents de vos étudiants supervisés'
            });
        }

        // Construire mise à jour
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined && req.body[key] !== document[key]) {
                updateFields.push(`${key} = ?`);
                updateValues.push(req.body[key]);
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                error: 'Aucune modification détectée'
            });
        }

        await updateDocumentData(id, updateFields, updateValues);
        const updatedDocument = await getDocumentWithPermissions(id);

        res.json({
            message: 'Document mis à jour avec succès',
            data: updatedDocument
        });

    } catch (error) {
        console.error('Erreur mise à jour document:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route POST /api/documents/:id/verify
 * @desc Vérifier un document
 * @access Private (LED team and supervisors only)
 */
router.post('/:id/verify', requireRoles(['supervisor', 'led_team', 'admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const document = await getDocumentWithPermissions(id);

        if (!document) {
            return res.status(404).json({
                error: 'Document non trouvé'
            });
        }

        if (req.user.role === 'supervisor' && document.academic_advisor_id !== req.user.id) {
            return res.status(403).json({
                error: 'Vous ne pouvez vérifier que les documents de vos étudiants supervisés'
            });
        }

        await verifyDocument(id, req.user.id);

        // Notification étudiant
        await database.query(`
            INSERT INTO notifications (recipient_id, sender_id, title, message, notification_type, related_entity_type, related_entity_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            document.scholar_user_id,
            req.user.id,
            'Document vérifié',
            `Votre document "${document.file_name}" a été vérifié et approuvé.`,
            'document',
            'document',
            id
        ]);

        res.json({
            message: 'Document vérifié avec succès'
        });

    } catch (error) {
        console.error('Erreur vérification document:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route DELETE /api/documents/:id
 * @desc Supprimer un document
 * @access Private
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const document = await getDocumentWithPermissions(id);

        if (!document) {
            return res.status(404).json({
                error: 'Document non trouvé'
            });
        }

        // Vérifier permissions
        if (req.user.role === 'student' && document.scholar_user_id !== req.user.id) {
            return res.status(403).json({
                error: 'Vous ne pouvez supprimer que vos propres documents'
            });
        } else if (req.user.role === 'supervisor' && 
                   document.academic_advisor_id !== req.user.id && 
                   document.uploader_id !== req.user.id) {
            return res.status(403).json({
                error: 'Permissions insuffisantes'
            });
        }

        // Supprimer fichier et enregistrement
        const filePath = path.join(__dirname, '..', document.file_path);
        await safeDeleteFile(filePath);
        await database.query('DELETE FROM documents WHERE id = ?', [id]);

        res.json({
            message: 'Document supprimé avec succès'
        });

    } catch (error) {
        console.error('Erreur suppression document:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

/**
 * @route GET /api/documents/types
 * @desc Récupérer les types de documents disponibles
 * @access Private
 */
router.get('/types', async (req, res) => {
    try {
        res.json({
            data: DOCUMENT_TYPES.map(type => ({
                value: type,
                label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
            }))
        });
    } catch (error) {
        console.error('Erreur récupération types documents:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
});

module.exports = router;
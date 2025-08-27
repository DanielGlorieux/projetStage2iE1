-- ================================
-- SCHÉMA DE BASE DE DONNÉES LED PLATFORM
-- MySQL 8.0+
-- ================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS led_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE led_platform;

-- ================================
-- TABLE DES UTILISATEURS
-- ================================

-- Table principale des utilisateurs
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('student', 'led_team', 'supervisor', 'admin') NOT NULL,
    phone_number VARCHAR(20),
    profile_picture_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires DATETIME,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- ================================
-- TABLES ACADÉMIQUES
-- ================================

-- Universités et établissements
CREATE TABLE universities (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'France',
    website_url TEXT,
    contact_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_city (city)
);

-- Programmes d'études
CREATE TABLE programs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    university_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL,
    degree_level ENUM('bachelor', 'master', 'phd', 'other') NOT NULL,
    duration_years INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    INDEX idx_university (university_id),
    INDEX idx_degree_level (degree_level)
);

-- ================================
-- TABLE DES BOURSIERS
-- ================================

-- Informations détaillées des boursiers
CREATE TABLE scholars (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    university_id CHAR(36),
    program_id CHAR(36),
    student_number VARCHAR(50),
    admission_year INT,
    current_year INT,
    expected_graduation_year INT,
    scholarship_start_date DATE,
    scholarship_end_date DATE,
    scholarship_type VARCHAR(100),
    financial_aid_amount DECIMAL(10,2),
    academic_advisor_id CHAR(36),
    status ENUM('active', 'pending', 'graduated', 'suspended', 'withdrawn') DEFAULT 'active',
    overall_score DECIMAL(5,2) DEFAULT 0,
    last_evaluation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE SET NULL,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL,
    FOREIGN KEY (academic_advisor_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_university (university_id),
    INDEX idx_program (program_id),
    INDEX idx_advisor (academic_advisor_id)
);

-- ================================
-- SYSTÈME D'ACTIVITÉS
-- ================================

-- Types d'activités
CREATE TABLE activity_types (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    category ENUM('academic', 'extracurricular', 'professional') NOT NULL,
    description TEXT,
    scoring_criteria JSON,
    max_score INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_active (is_active)
);

-- Activités des boursiers
CREATE TABLE scholar_activities (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    scholar_id CHAR(36) NOT NULL,
    activity_type_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('planned', 'in_progress', 'completed', 'cancelled', 'on_hold') DEFAULT 'planned',
    completion_percentage INT DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    score_achieved DECIMAL(5,2) DEFAULT 0,
    evaluator_id CHAR(36),
    evaluation_date DATE,
    evaluation_comments TEXT,
    supporting_documents JSON, -- URLs et métadonnées des documents
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (scholar_id) REFERENCES scholars(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_type_id) REFERENCES activity_types(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_scholar (scholar_id),
    INDEX idx_activity_type (activity_type_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_evaluator (evaluator_id)
);

-- ================================
-- ÉVALUATIONS ET SCORES
-- ================================

-- Évaluations périodiques
CREATE TABLE evaluations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    scholar_id CHAR(36) NOT NULL,
    evaluator_id CHAR(36) NOT NULL,
    evaluation_period ENUM('monthly', 'quarterly', 'semester', 'annual') NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    academic_score DECIMAL(5,2),
    extracurricular_score DECIMAL(5,2),
    professional_score DECIMAL(5,2),
    overall_score DECIMAL(5,2),
    strengths TEXT,
    areas_for_improvement TEXT,
    recommendations TEXT,
    next_objectives TEXT,
    status ENUM('draft', 'submitted', 'reviewed', 'approved') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (scholar_id) REFERENCES scholars(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_scholar (scholar_id),
    INDEX idx_evaluator (evaluator_id),
    INDEX idx_period (period_start, period_end),
    INDEX idx_status (status)
);

-- Historique des scores
CREATE TABLE score_history (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    scholar_id CHAR(36) NOT NULL,
    evaluation_id CHAR(36),
    score_date DATE NOT NULL,
    academic_score DECIMAL(5,2),
    extracurricular_score DECIMAL(5,2),
    professional_score DECIMAL(5,2),
    overall_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (scholar_id) REFERENCES scholars(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE SET NULL,
    
    INDEX idx_scholar (scholar_id),
    INDEX idx_date (score_date),
    INDEX idx_evaluation (evaluation_id)
);

-- ================================
-- DOCUMENTS ET FICHIERS
-- ================================

-- Documents uploadés
CREATE TABLE documents (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    scholar_id CHAR(36) NOT NULL,
    activity_id CHAR(36),
    uploader_id CHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    document_type ENUM('transcript', 'certificate', 'report', 'project', 'cv', 'photo', 'other') NOT NULL,
    description TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by CHAR(36),
    verification_date TIMESTAMP,
    
    FOREIGN KEY (scholar_id) REFERENCES scholars(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES scholar_activities(id) ON DELETE SET NULL,
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_scholar (scholar_id),
    INDEX idx_activity (activity_id),
    INDEX idx_uploader (uploader_id),
    INDEX idx_type (document_type),
    INDEX idx_verified (is_verified)
);

-- ================================
-- SYSTÈME DE RAPPORTS
-- ================================

-- Templates de rapports
CREATE TABLE report_templates (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type ENUM('performance', 'activities', 'progress', 'summary', 'financial') NOT NULL,
    template_config JSON, -- Configuration du template
    frequency ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'on_demand') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_type (report_type),
    INDEX idx_frequency (frequency),
    INDEX idx_active (is_active),
    INDEX idx_creator (created_by)
);

-- Rapports générés
CREATE TABLE generated_reports (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    template_id CHAR(36),
    generated_by CHAR(36) NOT NULL,
    report_title VARCHAR(255) NOT NULL,
    period_start DATE,
    period_end DATE,
    file_path TEXT,
    file_format ENUM('pdf', 'csv', 'excel', 'json') NOT NULL,
    recipients JSON, -- Liste des destinataires
    generation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('generating', 'completed', 'failed', 'sent') DEFAULT 'generating',
    
    FOREIGN KEY (template_id) REFERENCES report_templates(id) ON DELETE SET NULL,
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_template (template_id),
    INDEX idx_generator (generated_by),
    INDEX idx_status (status),
    INDEX idx_generation_date (generation_date)
);

-- ================================
-- NOTIFICATIONS ET COMMUNICATIONS
-- ================================

-- Notifications système
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    recipient_id CHAR(36) NOT NULL,
    sender_id CHAR(36),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('deadline', 'evaluation', 'document', 'system', 'announcement') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    related_entity_type VARCHAR(50), -- 'scholar', 'activity', 'evaluation', etc.
    related_entity_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_recipient (recipient_id),
    INDEX idx_sender (sender_id),
    INDEX idx_type (notification_type),
    INDEX idx_read (is_read),
    INDEX idx_priority (priority),
    INDEX idx_created (created_at)
);

-- Paramètres de notification utilisateur
CREATE TABLE notification_preferences (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    deadline_alerts BOOLEAN DEFAULT TRUE,
    evaluation_reminders BOOLEAN DEFAULT TRUE,
    system_announcements BOOLEAN DEFAULT TRUE,
    frequency ENUM('immediate', 'daily', 'weekly') DEFAULT 'immediate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_preferences (user_id)
);

-- ================================
-- LOGS ET AUDIT
-- ================================

-- Journal d'audit
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id CHAR(36),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_timestamp (timestamp)
);

-- ================================
-- SESSIONS UTILISATEUR
-- ================================

-- Sessions pour l'authentification JWT
CREATE TABLE user_sessions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    refresh_token VARCHAR(255) UNIQUE NOT NULL,
    access_token_hash VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user (user_id),
    INDEX idx_refresh_token (refresh_token),
    INDEX idx_expires (expires_at),
    INDEX idx_active (is_active)
);

-- ================================
-- VUES UTILES
-- ================================

-- Vue complète des boursiers avec informations détaillées
CREATE VIEW scholars_detailed AS
SELECT 
    s.id,
    CONCAT(u.first_name, ' ', u.last_name) as full_name,
    u.first_name,
    u.last_name,
    u.email,
    u.role,
    un.name as university_name,
    p.name as program_name,
    p.degree_level,
    s.current_year,
    s.status,
    s.overall_score,
    s.scholarship_start_date,
    s.scholarship_end_date,
    s.last_evaluation_date,
    COUNT(sa.id) as total_activities,
    COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) as completed_activities,
    COUNT(CASE WHEN sa.status = 'in_progress' THEN 1 END) as in_progress_activities,
    s.created_at,
    s.updated_at
FROM scholars s
JOIN users u ON s.user_id = u.id
LEFT JOIN universities un ON s.university_id = un.id
LEFT JOIN programs p ON s.program_id = p.id
LEFT JOIN scholar_activities sa ON s.id = sa.scholar_id
GROUP BY s.id, u.first_name, u.last_name, u.email, u.role, un.name, p.name, 
         p.degree_level, s.current_year, s.status, s.overall_score, 
         s.scholarship_start_date, s.scholarship_end_date, s.last_evaluation_date,
         s.created_at, s.updated_at;

-- Vue des statistiques par activité
CREATE VIEW activity_statistics AS
SELECT 
    at.name as activity_type,
    at.category,
    COUNT(sa.id) as total_activities,
    COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) as completed_count,
    ROUND(AVG(CASE WHEN sa.status = 'completed' AND sa.score_achieved IS NOT NULL THEN sa.score_achieved END), 2) as average_score,
    MIN(sa.start_date) as earliest_start,
    MAX(sa.end_date) as latest_end
FROM activity_types at
LEFT JOIN scholar_activities sa ON at.id = sa.activity_type_id
GROUP BY at.id, at.name, at.category;

-- ================================
-- PROCÉDURES STOCKÉES
-- ================================

DELIMITER //

-- Procédure pour mettre à jour le score global d'un boursier
CREATE PROCEDURE UpdateScholarScore(IN scholar_uuid CHAR(36))
BEGIN
    DECLARE score_avg DECIMAL(5,2) DEFAULT 0;
    
    SELECT COALESCE(AVG(score_achieved), 0) INTO score_avg
    FROM scholar_activities 
    WHERE scholar_id = scholar_uuid 
    AND status = 'completed'
    AND score_achieved IS NOT NULL;
    
    UPDATE scholars 
    SET overall_score = score_avg,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = scholar_uuid;
END //

-- Procédure pour nettoyer les sessions expirées
CREATE PROCEDURE CleanExpiredSessions()
BEGIN
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() OR is_active = FALSE;
END //

-- Procédure pour générer des statistiques de performance
CREATE PROCEDURE GetPerformanceStats(
    IN start_date DATE,
    IN end_date DATE,
    IN scholar_id_param CHAR(36)
)
BEGIN
    SELECT 
        DATE_FORMAT(sh.score_date, '%Y-%m') as period,
        AVG(sh.overall_score) as avg_score,
        MAX(sh.overall_score) as max_score,
        MIN(sh.overall_score) as min_score,
        COUNT(*) as records_count
    FROM score_history sh
    WHERE sh.score_date BETWEEN start_date AND end_date
    AND (scholar_id_param IS NULL OR sh.scholar_id = scholar_id_param)
    GROUP BY DATE_FORMAT(sh.score_date, '%Y-%m')
    ORDER BY period;
END //

DELIMITER ;

-- ================================
-- TRIGGERS
-- ================================

DELIMITER //

-- Trigger pour mettre à jour le score global quand une activité est modifiée
CREATE TRIGGER update_scholar_score_after_activity
AFTER UPDATE ON scholar_activities
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND (OLD.status != 'completed' OR OLD.score_achieved != NEW.score_achieved) THEN
        CALL UpdateScholarScore(NEW.scholar_id);
    END IF;
END //

-- Trigger pour l'audit des modifications sur les boursiers
CREATE TRIGGER audit_scholars_update
AFTER UPDATE ON scholars
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, timestamp)
    VALUES (
        @current_user_id,
        'UPDATE',
        'scholar',
        NEW.id,
        JSON_OBJECT(
            'status', OLD.status,
            'overall_score', OLD.overall_score,
            'current_year', OLD.current_year
        ),
        JSON_OBJECT(
            'status', NEW.status,
            'overall_score', NEW.overall_score,
            'current_year', NEW.current_year
        ),
        NOW()
    );
END //

DELIMITER ;

-- ================================
-- ÉVÉNEMENTS PLANIFIÉS
-- ================================

-- Événement pour nettoyer les sessions expirées (toutes les heures)
CREATE EVENT IF NOT EXISTS clean_expired_sessions
ON SCHEDULE EVERY 1 HOUR
DO
  CALL CleanExpiredSessions();

-- ================================
-- DONNÉES D'EXEMPLE
-- ================================

-- Insertion d'universités de base
INSERT INTO universities (name, code, city, country) VALUES
('Université Paris-Sorbonne', 'UPS', 'Paris', 'France'),
('École Polytechnique', 'EP', 'Palaiseau', 'France'),
('Sciences Po Paris', 'SPP', 'Paris', 'France'),
('Université Lyon 1', 'UL1', 'Lyon', 'France'),
('INSA Lyon', 'INSA', 'Lyon', 'France'),
('Université Bordeaux', 'UB', 'Bordeaux', 'France');

-- Types d'activités de base
INSERT INTO activity_types (name, category, description, max_score) VALUES
('Projet de fin d\'études', 'academic', 'Projet de recherche ou développement en fin de cursus', 100),
('Stage professionnel', 'professional', 'Expérience professionnelle en entreprise', 100),
('Participation associative', 'extracurricular', 'Engagement dans une association étudiante', 50),
('Compétition académique', 'academic', 'Participation à des concours ou compétitions', 75),
('Projet entrepreneurial', 'professional', 'Création ou participation à un projet d\'entreprise', 100),
('Bénévolat', 'extracurricular', 'Activités de bénévolat et service communautaire', 50),
('Publication scientifique', 'academic', 'Publication d\'articles ou communications scientifiques', 100),
('Formation complémentaire', 'professional', 'Formations et certifications professionnelles', 75);

-- Utilisateur administrateur par défaut
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, email_verified) VALUES
('admin@led.org', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'LED', 'admin', TRUE, TRUE);

-- Templates de rapports par défaut
INSERT INTO report_templates (name, description, report_type, frequency, created_by) VALUES
('Rapport mensuel de performance', 'Performance globale de tous les boursiers sur le mois', 'performance', 'monthly', (SELECT id FROM users WHERE email = 'admin@led.org')),
('Suivi hebdomadaire des activités', 'État d\'avancement des activités en cours', 'activities', 'weekly', (SELECT id FROM users WHERE email = 'admin@led.org')),
('Bilan trimestriel', 'Analyse complète des progrès sur 3 mois', 'summary', 'quarterly', (SELECT id FROM users WHERE email = 'admin@led.org'));
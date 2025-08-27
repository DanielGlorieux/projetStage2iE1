const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true pour 465, false pour autres ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Envoyer un email
 * @param {Object} options - Options de l'email
 * @param {string} options.to - Destinataire
 * @param {string} options.subject - Sujet
 * @param {string} options.text - Texte brut (optionnel)
 * @param {string} options.html - Contenu HTML
 * @param {string} options.from - Expéditeur (optionnel)
 */
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: options.from || process.env.EMAIL_FROM || 'noreply@led.org',
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé:', info.messageId);
        return info;

    } catch (error) {
        console.error('Erreur envoi email:', error);
        throw error;
    }
};

/**
 * Vérifier la configuration email
 */
const verifyEmailConfig = async () => {
    try {
        await transporter.verify();
        console.log('✅ Configuration email valide');
        return true;
    } catch (error) {
        console.error('❌ Configuration email invalide:', error.message);
        return false;
    }
};

module.exports = sendEmail;
module.exports.verifyEmailConfig = verifyEmailConfig;
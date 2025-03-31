import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Read email templates
const readTemplate = (templateName) => {
    const templatePath = path.join(__dirname, '../templates/emails', templateName);
    return fs.readFileSync(templatePath, 'utf-8');
};

// Compile template with handlebars
const compileTemplate = (templateName, data) => {
    const template = readTemplate(templateName);
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(data);
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        const html = compileTemplate('passwordReset.html', {
            resetUrl,
            email
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

export const testEmailConfig = async () => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Email Configuration Test',
            text: 'This is a test email to verify your email configuration is working correctly.'
        };

        await transporter.sendMail(mailOptions);
        console.log('Test email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending test email:', error);
        return false;
    }
}; 
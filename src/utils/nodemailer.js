import nodemailer from 'nodemailer';
import config from '../config/config.js';

async function sendPasswordResetEmail(email, resetToken) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port:587,
        auth: {
            user: 'matoleto2@gmail.com',
            pass: config.gmailPassword
        }
    });

    // URL para restablecer la contraseña (cambia 'tudominio.com' según corresponda)
    const resetUrl = `http://localhost:8080/users/reset-password/${resetToken}`;

    const mailOptions = {
        from: 'Productos locos de Maxi',
        to: email,
        subject: 'Recuperación de Contraseña',
        html: `
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
            <p>Si no solicitaste esto, puedes ignorar este correo electrónico.</p>
            <p>Si deseas restablecer tu contraseña, haz clic en el siguiente enlace:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>Este enlace expirará en 30 minutos.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico de recuperación de contraseña enviado correctamente.');
    } catch (error) {
        console.error('Error al enviar el correo electrónico de recuperación de contraseña:', error);
    }
}

export default sendPasswordResetEmail;
const nodemailer = require('nodemailer');

// Create reusable transporter
async function createTransporter() {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    // Create a transporter using the test account
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
}

let transporter = null;

async function sendMail(options) {
    try {
        if (!transporter) {
            transporter = await createTransporter();
        }

        const info = await transporter.sendMail({
            from: '"Your Shop" <shop@example.com>',
            to: options.to,
            subject: options.subject,
            html: options.html
        });

        // Log test email URL (Ethereal only)
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
        console.error('Error sending mail:', error);
        throw error;
    }
}

module.exports = sendMail;

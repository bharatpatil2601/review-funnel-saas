// ============================================
// Review Funnel SaaS — Email Service
// ============================================

const nodemailer = require('nodemailer');
const config = require('../config');

/**
 * Initialize Transporter
 */
const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

/**
 * Send Feedback Email
 * @param {Object} feedback 
 */
async function sendFeedbackEmail(feedback) {
  try {
    // If SMTP user/pass missing, log and return (don't crash)
    if (!config.smtp.user || !config.smtp.pass) {
      console.warn('[EMAIL] Skipping email send: SMTP_USER or SMTP_PASS not configured.');
      return;
    }

    const info = await transporter.sendMail({
      from: `"Review Funnel" <${config.smtp.user}>`,
      to: config.smtp.receiver,
      subject: `New Low Rating Feedback (${feedback.rating} Stars)`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #d32f2f;">New Negative Feedback Received</h2>
          <p><strong>Business:</strong> Skin & Scalps Clinic</p>
          <hr>
          <p><strong>Customer Name:</strong> ${feedback.name}</p>
          <p><strong>Phone:</strong> ${feedback.phone}</p>
          <p><strong>Rating:</strong> ${feedback.rating} / 5 Stars</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; font-style: italic;">
            "${feedback.message}"
          </div>
          <p style="font-size: 0.8rem; color: #666; margin-top: 20px;">
            This feedback was automatically captured by your Review Funnel system.
          </p>
        </div>
      `,
    });

    console.log(`[EMAIL] Message sent: ${info.messageId}`);
  } catch (err) {
    console.error('[EMAIL] Failed to send email:', err);
  }
}

module.exports = { sendFeedbackEmail };

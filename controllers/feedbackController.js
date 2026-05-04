// ============================================
// Review Funnel SaaS — Feedback Controller
// ============================================

const { v4: uuidv4 } = require('uuid');
const { getClient } = require('../services/clientService');
const { sendFeedbackEmail } = require('../services/emailService');
const store = require('../store');

/**
 * POST /api/feedback
 * Body: { name: string, phone: string, message: string, clientId: string, rating?: number }
 */
function handleFeedback(req, res) {
  try {
    const { name, phone, message, clientId, rating } = req.body;

    // ---- Validation ----
    if (!clientId || !name || !phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: clientId, name, phone, message',
      });
    }

    const client = getClient(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        error: `Client "${clientId}" not found`,
      });
    }

    // ---- Store feedback ----
    const entry = {
      id: uuidv4(),
      clientId,
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
      rating: rating ? Number(rating) : null,
      createdAt: new Date().toISOString(),
    };
    store.addFeedback(entry);
    store.incrementFeedbacks(clientId);

    console.log(`[FEEDBACK] Stored | client=${clientId} name="${entry.name}" phone=${entry.phone}`);

    // ---- Send email for low ratings (<= 3) ----
    if (entry.rating !== null && entry.rating <= 3) {
      sendFeedbackEmail(entry); // Async call in background
    }

    return res.status(201).json({
      success: true,
      data: { id: entry.id, message: 'Feedback received. Thank you!' },
    });
  } catch (err) {
    console.error('[FEEDBACK] Unhandled error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

module.exports = { handleFeedback };

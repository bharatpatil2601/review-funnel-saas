// ============================================
// Review Funnel SaaS — Feedback Routes
// ============================================

const { Router } = require('express');
const { handleFeedback } = require('../controllers/feedbackController');

const router = Router();

router.post('/feedback', handleFeedback);

module.exports = router;

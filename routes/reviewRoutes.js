// ============================================
// Review Funnel SaaS — Review Routes
// ============================================

const { Router } = require('express');
const { handleGenerateReview } = require('../controllers/reviewController');

const router = Router();

router.post('/generate-review', handleGenerateReview);

module.exports = router;

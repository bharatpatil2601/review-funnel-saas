// ============================================
// Review Funnel SaaS — Tracking Routes
// ============================================

const { Router } = require('express');
const { handleTrackScan } = require('../controllers/trackingController');

const router = Router();

router.post('/track-scan', handleTrackScan);

module.exports = router;

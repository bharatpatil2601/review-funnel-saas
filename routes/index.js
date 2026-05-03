// ============================================
// Review Funnel SaaS — Route Index
// ============================================

const { Router } = require('express');
const reviewRoutes = require('./reviewRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const trackingRoutes = require('./trackingRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = Router();

router.use(reviewRoutes);
router.use(feedbackRoutes);
router.use(trackingRoutes);
router.use(dashboardRoutes);

module.exports = router;

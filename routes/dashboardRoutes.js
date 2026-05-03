// ============================================
// Review Funnel SaaS — Dashboard Routes
// ============================================

const { Router } = require('express');
const { handleDashboard } = require('../controllers/dashboardController');

const router = Router();

router.get('/dashboard/:clientId', handleDashboard);

module.exports = router;

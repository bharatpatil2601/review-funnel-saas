// ============================================
// Review Funnel SaaS — Dashboard Controller
// ============================================

const { getClient } = require('../services/clientService');
const store = require('../store');

/**
 * GET /api/dashboard/:clientId
 * Returns analytics + recent activity for a client.
 */
function handleDashboard(req, res) {
  try {
    const { clientId } = req.params;

    const client = getClient(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        error: `Client "${clientId}" not found`,
      });
    }

    const analytics = store.getAnalytics(clientId);
    const recentFeedback = store.getFeedbackByClient(clientId).slice(-20);
    const recentReviews = store.getReviewsByClient(clientId).slice(-20);

    return res.status(200).json({
      success: true,
      data: {
        client: {
          id: client.id,
          businessName: client.businessName,
          googleReviewLink: client.googleReviewLink,
        },
        analytics: {
          totalScans: analytics.scans,
          totalReviews: analytics.reviews,
          totalFeedbacks: analytics.feedbacks,
        },
        recentFeedback,
        recentReviews,
      },
    });
  } catch (err) {
    console.error('[DASHBOARD] Unhandled error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

module.exports = { handleDashboard };

// ============================================
// Review Funnel SaaS — Tracking Controller
// ============================================

const { getClient } = require('../services/clientService');
const store = require('../store');

/**
 * POST /api/track-scan
 * Body: { clientId: string }
 */
function handleTrackScan(req, res) {
  try {
    const { clientId } = req.body;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: clientId',
      });
    }

    const client = getClient(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        error: `Client "${clientId}" not found`,
      });
    }

    const analytics = store.incrementScans(clientId);

    return res.status(200).json({
      success: true,
      data: { clientId, scans: analytics.scans },
    });
  } catch (err) {
    console.error('[TRACK] Unhandled error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

module.exports = { handleTrackScan };

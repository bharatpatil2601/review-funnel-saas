// ============================================
// Review Funnel SaaS — Review Controller
// ============================================

const { v4: uuidv4 } = require('uuid');
const { getClient } = require('../services/clientService');
const { generateReview } = require('../services/geminiService');
const store = require('../store');

/**
 * POST /api/generate-review
 * Body: { rating: number, name: string, clientId: string }
 */
async function handleGenerateReview(req, res) {
  try {
    const { rating, name, clientId } = req.body;

    // ---- Validation ----
    if (!clientId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: clientId, rating',
      });
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        error: 'rating must be an integer between 1 and 5',
      });
    }

    const client = getClient(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        error: `Client "${clientId}" not found`,
      });
    }

    // ---- Only generate for 4–5 star ratings ----
    if (ratingNum < 4) {
      return res.status(400).json({
        success: false,
        error: 'Reviews are only generated for ratings of 4 or 5. Use /api/feedback for lower ratings.',
      });
    }

    // ---- Generate review via Gemini ----
    const reviewText = await generateReview({
      rating: ratingNum,
      businessName: client.businessName,
      keywords: client.keywords,
    });

    // ---- Log & track ----
    const entry = {
      id: uuidv4(),
      clientId,
      name: name || 'Anonymous',
      rating: ratingNum,
      review: reviewText,
      createdAt: new Date().toISOString(),
    };
    store.addReviewLog(entry);
    store.incrementReviews(clientId);

    console.log(`[REVIEW] Generated for client=${clientId} name="${entry.name}"`);

    return res.status(200).json({
      success: true,
      data: {
        review: reviewText,
        googleReviewLink: client.googleReviewLink,
      },
    });
  } catch (err) {
    console.error('[REVIEW] Unhandled error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

module.exports = { handleGenerateReview };

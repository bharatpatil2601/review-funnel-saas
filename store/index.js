// ============================================
// Review Funnel SaaS — In-Memory Data Store
// ============================================

/**
 * Structured in-memory store.
 *
 * To migrate to MongoDB:
 *   1. Create Mongoose schemas matching these shapes
 *   2. Replace push/increment helpers with Model.create() / Model.updateOne()
 *   3. Replace getters with Model.find() / Model.aggregate()
 */

// ---- Analytics (per-client counters) ----

const analytics = new Map(); // clientId → { scans, reviews, feedbacks }

function ensureAnalytics(clientId) {
  if (!analytics.has(clientId)) {
    analytics.set(clientId, { scans: 0, reviews: 0, feedbacks: 0 });
  }
  return analytics.get(clientId);
}

function incrementScans(clientId) {
  const a = ensureAnalytics(clientId);
  a.scans += 1;
  console.log(`[TRACK] scan  | client=${clientId} | total=${a.scans}`);
  return a;
}

function incrementReviews(clientId) {
  const a = ensureAnalytics(clientId);
  a.reviews += 1;
  console.log(`[TRACK] review | client=${clientId} | total=${a.reviews}`);
  return a;
}

function incrementFeedbacks(clientId) {
  const a = ensureAnalytics(clientId);
  a.feedbacks += 1;
  console.log(`[TRACK] feedback | client=${clientId} | total=${a.feedbacks}`);
  return a;
}

function getAnalytics(clientId) {
  return ensureAnalytics(clientId);
}

// ---- Feedback entries ----

const feedbackEntries = []; // { id, clientId, name, phone, message, rating, createdAt }

function addFeedback(entry) {
  feedbackEntries.push(entry);
  return entry;
}

function getFeedbackByClient(clientId) {
  return feedbackEntries.filter((f) => f.clientId === clientId);
}

// ---- Generated reviews log ----

const reviewLog = []; // { id, clientId, rating, review, createdAt }

function addReviewLog(entry) {
  reviewLog.push(entry);
  return entry;
}

function getReviewsByClient(clientId) {
  return reviewLog.filter((r) => r.clientId === clientId);
}

module.exports = {
  incrementScans,
  incrementReviews,
  incrementFeedbacks,
  getAnalytics,
  addFeedback,
  getFeedbackByClient,
  addReviewLog,
  getReviewsByClient,
};

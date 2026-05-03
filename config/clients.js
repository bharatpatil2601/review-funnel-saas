// ============================================
// Review Funnel SaaS — Seed Client Data
// ============================================

/**
 * In-memory client store.
 * Structure mirrors a future MongoDB document so migration is trivial:
 *   - swap this file for a Mongoose model
 *   - replace Map lookups with Model.findOne()
 */

const clients = new Map();

// ---------- seed data ----------

clients.set('clinic1', {
  id: 'clinic1',
  businessName: 'Dr. Glow Skin & Hair Clinic',
  keywords: ['skin specialist in Wakad', 'best dermatologist Pune', 'acne treatment Wakad'],
  googleReviewLink: 'https://g.page/r/your-clinic1-review-link/review',
});

clients.set('clinic2', {
  id: 'clinic2',
  businessName: 'SmileCare Dental Studio',
  keywords: ['dentist in Baner', 'teeth whitening Pune', 'best dental clinic Baner'],
  googleReviewLink: 'https://g.page/r/your-clinic2-review-link/review',
});

clients.set('salon1', {
  id: 'salon1',
  businessName: 'Luxe Hair & Beauty Lounge',
  keywords: ['hair salon Hinjewadi', 'keratin treatment Pune', 'bridal makeup Hinjewadi'],
  googleReviewLink: 'https://g.page/r/your-salon1-review-link/review',
});

module.exports = clients;

// ============================================
// Review Funnel SaaS — Gemini AI Service
// ============================================

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

// ---------- Tone / style randomisers ----------

const TONES = [
  'friendly and warm',
  'enthusiastic and excited',
  'calm and professional',
  'casual and conversational',
  'grateful and heartfelt',
  'cheerful and upbeat',
  'sincere and honest',
  'relaxed and natural',
];

const STRUCTURES = [
  'Start with a personal experience, then praise the service.',
  'Begin with a recommendation, then describe your visit.',
  'Open with how you found them, then share the outcome.',
  'Lead with the result you got, then thank the team.',
  'Start with a question you had before visiting, then explain how they helped.',
  'Mention what made you choose them, then describe the experience.',
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------- Fallback reviews ----------

const FALLBACK_REVIEWS = [
  (biz) => `Had an amazing experience at ${biz}. The team was incredibly professional and caring. Highly recommend to everyone!`,
  (biz) => `Visited ${biz} recently and was thoroughly impressed. Great service, friendly staff, and excellent results. Will definitely be back!`,
  (biz) => `${biz} exceeded all my expectations. From the moment I walked in, I felt welcomed. Outstanding quality and attention to detail!`,
  (biz) => `Absolutely loved my experience at ${biz}! The staff went above and beyond to make sure I was satisfied. Five stars all the way!`,
  (biz) => `If you're looking for top-notch service, ${biz} is the place to go. Professional, reliable, and truly the best in town.`,
];

function getFallbackReview(businessName) {
  return pickRandom(FALLBACK_REVIEWS)(businessName);
}

// ---------- Core generation ----------

/**
 * Generate a unique, human-like Google review using Gemini.
 *
 * @param {Object} params
 * @param {number} params.rating      – star rating (4 or 5)
 * @param {string} params.businessName
 * @param {string[]} params.keywords
 * @returns {Promise<string>} generated review text
 */
async function generateReview({ rating, businessName, keywords }) {
  const tone = pickRandom(TONES);
  const structure = pickRandom(STRUCTURES);
  const keywordStr = keywords.join(', ');

  const prompt = `You are a real customer writing a Google review.

Business: ${businessName}
Rating: ${rating} out of 5 stars
Relevant keywords to naturally weave in: ${keywordStr}

Tone: ${tone}
Structure guideline: ${structure}

Rules:
- Write ONLY the review text (no greeting, no sign-off, no star mention).
- 2–3 lines maximum.
- Sound like a genuine human, not an AI.
- Use natural, varied sentence lengths.
- Do NOT use hashtags, emojis, or bullet points.
- Every generated review must be unique in wording.`;

  try {
    const model = genAI.getGenerativeModel({
      model: config.gemini.model,
      generationConfig: {
        maxOutputTokens: config.gemini.maxTokens,
        temperature: 1.2 + Math.random() * 0.6, // 1.2 – 1.8 range for high variance
        topP: 0.9,
        topK: 40,
      },
    });

    console.log(`[GEMINI] Generating review | biz="${businessName}" rating=${rating} tone="${tone}"`);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();

    if (!text || text.length < 10) {
      console.warn('[GEMINI] Response too short, using fallback');
      return getFallbackReview(businessName);
    }

    console.log(`[GEMINI] Success | length=${text.length} chars`);
    return text;
  } catch (err) {
    console.error('[GEMINI] Generation failed:', err.message);
    return getFallbackReview(businessName);
  }
}

module.exports = { generateReview };

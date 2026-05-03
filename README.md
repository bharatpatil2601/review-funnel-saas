# Review Funnel SaaS — Backend

Production-ready backend for a Review Funnel SaaS with Google Gemini AI integration.

## Project Structure

```
├── server.js                  # Express entry point
├── config/
│   ├── index.js               # Centralized configuration (.env reader)
│   └── clients.js             # Seed client data (in-memory)
├── controllers/
│   ├── reviewController.js    # POST /api/generate-review
│   ├── feedbackController.js  # POST /api/feedback
│   ├── trackingController.js  # POST /api/track-scan
│   └── dashboardController.js # GET  /api/dashboard/:clientId
├── routes/
│   ├── index.js               # Route aggregator
│   ├── reviewRoutes.js
│   ├── feedbackRoutes.js
│   ├── trackingRoutes.js
│   └── dashboardRoutes.js
├── services/
│   ├── geminiService.js       # Gemini AI review generation
│   └── clientService.js       # Client lookup abstraction
├── store/
│   └── index.js               # In-memory data store (analytics, feedback, reviews)
├── .env                       # Secrets (not committed)
├── .env.example               # Template for .env
└── .gitignore
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your Gemini API key
#    Edit .env and replace "your_gemini_api_key_here" with your actual key.
#    Get one at: https://aistudio.google.com/app/apikey

# 3. Start the server
npm run dev

# Server runs at http://localhost:3000
```

## API Endpoints

### `POST /api/generate-review`
Generate an AI review for 4–5 star ratings.

```json
// Request
{ "rating": 5, "name": "Rahul", "clientId": "clinic1" }

// Response
{
  "success": true,
  "data": {
    "review": "Visited Dr. Glow Skin & Hair Clinic for...",
    "googleReviewLink": "https://g.page/r/..."
  }
}
```

### `POST /api/feedback`
Store feedback for 1–3 star ratings.

```json
// Request
{ "name": "Priya", "phone": "9876543210", "message": "Long wait time", "clientId": "clinic1" }

// Response
{ "success": true, "data": { "id": "...", "message": "Feedback received. Thank you!" } }
```

### `POST /api/track-scan`
Track a QR code scan.

```json
// Request
{ "clientId": "clinic1" }

// Response
{ "success": true, "data": { "clientId": "clinic1", "scans": 1 } }
```

### `GET /api/dashboard/:clientId`
Get analytics and recent activity.

```json
// Response
{
  "success": true,
  "data": {
    "client": { "id": "clinic1", "businessName": "..." },
    "analytics": { "totalScans": 12, "totalReviews": 8, "totalFeedbacks": 4 },
    "recentFeedback": [...],
    "recentReviews": [...]
  }
}
```

### `GET /health`
Health check endpoint.

## Seed Clients

| ID        | Business Name                | Keywords                                              |
|-----------|------------------------------|-------------------------------------------------------|
| `clinic1` | Dr. Glow Skin & Hair Clinic  | skin specialist in Wakad, best dermatologist Pune      |
| `clinic2` | SmileCare Dental Studio      | dentist in Baner, teeth whitening Pune                 |
| `salon1`  | Luxe Hair & Beauty Lounge    | hair salon Hinjewadi, keratin treatment Pune           |

## Deployment

Ready for **Render** or **Vercel** (serverless):

- Set `GEMINI_API_KEY` in environment variables
- Set `NODE_ENV=production`
- Set `CORS_ORIGINS` to your frontend domain
- Entry point: `server.js`

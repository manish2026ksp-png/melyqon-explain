# Melyqon Explain

A lightweight explainer-writing workspace. The public website is static; optional AI generation runs through a small Cloudflare Worker so the Gemini API key is never placed in browser code.

## Features
- Topic-specific scripts for shorts, carousels and mini-lessons.
- Audience-aware plain-language writing, narration beats and visual directions.
- Editable output, copy and Markdown export.
- Optional source references. The app does not fetch or verify those links.

## Deploy the AI endpoint (free-tier friendly)

1. Create a Cloudflare Worker in the Cloudflare dashboard.
2. Paste the code from `worker/index.js` into the Worker editor.
3. In Worker Settings → Variables and Secrets, add a secret named `GEMINI_API_KEY` containing your Google AI Studio API key.
4. Deploy the Worker and copy its URL.
5. Open the public Melyqon Explain site, expand **AI connection**, paste the Worker URL ending in `/generate`, and generate.

The Gemini key remains server-side as a Worker secret. Do not paste the key into this public GitHub repository or into the website. Cloudflare and Google may change free-tier limits; check their current quotas before production use.

## Local use
Open `index.html` in a modern browser. Without a Worker URL, the app displays a clearly labelled sample scaffold. With a Worker URL, it requests AI generation.

## Important limitations
- The AI can make mistakes. Review all claims before publishing.
- Supplied source URLs are passed as references in the prompt; the Worker does not browse, fetch, or verify them.
- The Worker has basic input validation and CORS support. For a public production launch, add rate limiting and abuse protection.
- No user account or database is required; generated drafts stay in the browser unless the user copies or exports them.

## Hosting
GitHub Actions publishes the static app to GitHub Pages on pushes to `main`.

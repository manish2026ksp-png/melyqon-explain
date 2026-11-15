# Melyqon Explain

A lightweight, source-first explainer planning workspace for educators and technical creators.

## What it does

Enter a topic, choose an audience and output format, and create an editable explainer blueprint with:
- A scene-by-scene structure for a 60-second short, a 6-slide carousel, or a 3-minute mini lesson.
- Visual direction prompts for each scene.
- A publishing caption draft.
- A checklist for checking claims against sources.
- Copy and Markdown export.

## Important limitations

This is a client-side drafting scaffold. It does **not** use an AI model, fetch or verify source URLs, or generate/render video. Add and check trusted sources yourself before publishing.

## Run locally

Open `index.html` in a modern browser. No build step, server, API key, database, or account is required.

## Deploy

This repository includes a GitHub Actions workflow that publishes the static site to GitHub Pages when changes are pushed to `main`.

After the first workflow run, enable GitHub Pages in repository Settings → Pages → Build and deployment → Source: GitHub Actions if GitHub has not enabled it automatically.

## Privacy

The app does not send entered topics or source links to a backend. Content remains in the current browser page; it is not saved persistently.

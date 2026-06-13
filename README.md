# Uni Prompt

Public repository for [uni-prompt.com](https://uni-prompt.com/) — a bilingual prompt library for practical AI workflows.

Uni Prompt is a lightweight web app for publishing, browsing, searching, and copying structured prompts across business, content, sales, creativity, career, and personal productivity use cases.

## What This Site Does

- Publishes a curated prompt library in English and Russian
- Groups prompts by practical categories
- Supports keyword search and category filtering
- Opens prompt details in a focused modal view
- Lets users copy prompt text quickly
- Runs as a simple static frontend without a backend dependency

## Why It Exists

Most people do not need another abstract AI tool. They need ready-to-use prompts that help them get work done: write content, structure offers, prepare sales materials, think through business ideas, and automate repetitive thinking tasks.

This repository is the source for that public prompt collection.

## Project Structure

- `index.html` — main page
- `app.js` — prompt loading, search, filtering, and UI behavior
- `prompts.json` — prompt database
- `icons/` — interface and platform icons
- `LICENSE` — MIT license

## Adding Prompts

Prompts are stored in `prompts.json`. Each entry follows this structure:

```json
{
  "category": {
    "en": "Business",
    "ru": "Бизнес"
  },
  "name": {
    "en": "Prompt name",
    "ru": "Название промпта"
  },
  "description": {
    "en": "Short description",
    "ru": "Краткое описание"
  },
  "text": {
    "en": "Full prompt text",
    "ru": "Полный текст промпта"
  },
  "dateAdded": "YYYY-MM-DDT00:00:00Z"
}
```

## Live Site

[https://uni-prompt.com/](https://uni-prompt.com/)

## License

MIT License.
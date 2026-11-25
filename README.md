# Business Marketing & Growth Academy

An interactive, self-paced learning website covering the complete business growth system—from market understanding and customer research to positioning, offers, sales, SEO, paid acquisition, CRO, measurement, unit economics, retention, experimentation and expert operating practice.

## Run locally

Requires Python 3 (or any static web server).

```bash
python3 -m http.server 8000
```

Open http://localhost:8000.

## Publish with GitHub Pages

This repository includes a GitHub Actions workflow at `.github/workflows/pages.yml`. It publishes the website root whenever changes are pushed to `main`.

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. The workflow will deploy the site after the workflow file is committed. Check the **Actions** tab for deployment status.
4. Once the Pages deployment succeeds, visit https://nova-2010.github.io/business-marketing-growth-academy/.

## Learning features

- 18 progressive modules across foundation, intermediate, advanced and expert practice.
- Search across lesson titles and learning content.
- Responsive navigation and mobile-friendly layout.
- Lesson completion tracker stored in this browser's local storage.
- Light/dark theme preference.
- Practical examples, common mistakes, project outputs and knowledge checks in each module.

Progress is stored in the current browser on the current device; it is not synced across devices. This is a static website and does not require a backend, API key or package installation.

## Project structure

- `index.html` — app shell and navigation
- `styles.css` — responsive design
- `content.js` — curriculum and lesson content
- `app.js` — navigation, search, progress and theme behavior
- `.github/workflows/pages.yml` — GitHub Pages deployment

## Content note

The curriculum is an original educational synthesis. Business examples and numerical scenarios are illustrative unless explicitly identified otherwise. Advertising outcomes such as ROAS are not guaranteed; acquisition decisions should use validated unit economics, data quality and business capacity.

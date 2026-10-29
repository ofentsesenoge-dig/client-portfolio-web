# Bongani Tshabalala | Portfolio

Personal portfolio for **Bongani Tshabalala**, a full stack developer and software development intern based in Pretoria, South Africa.

**Live site:** _add your GitHub Pages URL here after deploying_

## What's on the site

- Hero with current role and core stack
- Experience (FOCI Group, Software Development Intern)
- Featured projects: Cattle Manager, Global Logistics Management System, Secure User Portal, Cybersecurity Awareness Chatbot
- Skills grouped by area: languages, frameworks, databases, testing, workflow
- Education, athletics and leadership
- Contact links

## Tech

Plain **HTML, CSS and JavaScript**, with no build step and no dependencies (the only external request is the Google Fonts stylesheet).

- Responsive layout (CSS grid, tested down to 375px)
- Dark and light themes, switched from the nav and remembered in `localStorage` (colours are CSS variables)
- Sticky navigation with active-section highlighting, a scroll progress bar and a mobile menu
- Hero effects: cursor-following glow, 3D tilt on the photo and code card, line-by-line headline reveal
- Count-up stats, staggered scroll-reveal, and a cursor spotlight on project cards
- All motion respects `prefers-reduced-motion`; a print stylesheet gives a clean white page when saved as a PDF
- Accessible: skip link, visible focus states, semantic landmarks, alt text
- SEO basics: meta description, Open Graph tags and `Person` structured data
- Typography: Geist and Geist Mono, loaded from Google Fonts

## Run locally

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly in a browser also works.

## Project structure

```
index.html      Page content and structured data
styles.css      Design tokens (dark + light themes), layout, effects, responsive and print rules
script.js       Theme toggle, navigation, scroll progress, reveals, count-up and hero interactions
assets/         Optimised profile images (WebP with JPEG fallback)
```

## Deploy on GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
4. Save. The site will be live at `https://<username>.github.io/<repo-name>/` within a minute or two.
5. Paste that URL into the repository's **About → Website** field and into the "Live site" line above.

## Contact

- Email: tshabalalabongani315@gmail.com
- LinkedIn: [bongani-tshabalala](https://www.linkedin.com/in/bongani-tshabalala-0873b039a)
- GitHub 1: [tshabalalabongani315-afk](https://github.com/tshabalalabongani315-afk)
- GitHub 2: [st10446555](https://github.com/st10446555)

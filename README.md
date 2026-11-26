# Youssef Samir Refky — Portfolio

Personal portfolio built with **React 18, Vite, Tailwind CSS, Framer Motion and Lenis**.

**Live:** https://youssefsamir6.github.io/Portfolio/

## Run locally

```bash
npm install
npm run dev        # http://localhost:5000
npm run build      # production build in dist/
npm run preview    # serve the production build
```

## Deploy (GitHub Pages)

```bash
npm run deploy     # builds, then publishes dist/ to the gh-pages branch
```

The site is served from `/Portfolio/`, which is the `base` in `vite.config.js`. If you rename the repo, change it there
and update the URLs in `index.html` (canonical, `og:url`, `og:image`) and in `public/404.html` / `public/offline.html`.

## Editing content

Almost everything you will ever change lives in **`src/data/portfolio.js`**:

| What | Where |
| --- | --- |
| Name, bio, contact details, CV path | `personalInfo` |
| Projects (`github` / `live` links show up as buttons automatically) | `projects` |
| Skills (80+ shows as "Core", the rest as "Also use") | `skills` |
| Education, certificates | `education`, `certificates` |
| Hero numbers (projects / technologies / certifications) | derived automatically, nothing to edit |

Static files (CV, certificate PDFs and images, favicon, social preview image) go in `public/`.
Use `asset('file.ext')` in the data file so paths keep working under the `/Portfolio/` base.

## Project structure

```
src/
  App.jsx             layout, smooth scrolling, reduced-motion handling
  components/         Navbar, Footer
  sections/           Hero, About, Projects, Skills, Education, Contact
  data/portfolio.js   all site content
  lib/scroll.js       one scrolling helper shared by Lenis and the nav buttons
public/
  sw.js               offline fallback service worker
  404.html, offline.html, favicon.svg, og-image.png, certs/
```

## Notes

- Respects `prefers-reduced-motion` (no smooth-scroll hijack, particles, typewriter or entrance animations).
- Social preview image: `public/og-image.png` (1200×630). Re-generate it if you change your title or tagline.

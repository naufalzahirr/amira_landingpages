# AMIRA Official Website

The English-language product landing page for **amiraedu.com**, built with Astro 7, CSS, and TypeScript.

AMIRA — Artificial Mentor for Intelligent Reasoning and Assistance — is an AI learning companion guided by educators. Teachers shape the instructions and learning context; students work through questions, hints, and reflection.

![AMIRA landing page](docs/preview/desktop.png)

## Requirements and local development

- Node.js **22.12.0 or newer**
- npm

```sh
npm ci
npm run dev
```

Astro prints the local development URL, usually `http://127.0.0.1:4321`.

```sh
npm run build
npm run preview
```

## Hosting

This project produces a **static website**. Build it with `npm run build`, then publish the **contents of `dist/`** to the document root configured for `amiraedu.com`. On cPanel this may be `public_html/` or a separate directory assigned to the domain. Preserve the generated folder structure.

For a host that builds from Git:

| Setting | Value |
| --- | --- |
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` |
| Node version | 22.12.0 or newer |

Node is used to build the files. The generated site can be served directly over HTTPS by a static web server. See the [official Astro deployment guide](https://docs.astro.build/en/guides/deploy/).

Domain and production deployment configuration are separate from this source repository. The future AMIRA application is reserved for `app.amiraedu.com`.

### Rumahweb with Git

GitHub Actions builds each update to `main` and publishes the generated files under `dist/` on the separate **`hosting` branch**. Clone `hosting` on the hosting account and point the domain to that checkout's `dist/` directory. Follow the [Rumahweb installation and update instructions](docs/HOSTING-BRANCH.md).

This avoids running the Astro compiler on shared hosting. On the developer's Unlimited M account, npm installation succeeded, but the Rust compiler could not create a worker thread (`Resource temporarily unavailable`, OS error 11), including a retry with reduced Tokio, Rayon, and libuv workers. The exact server quota requires hosting resource diagnostics; the prebuilt branch removes that build step from the account.

The workflow commits only the generated website and hosting instructions. It uses ordinary pushes, requires no hosting credentials, and does not deploy to Rumahweb or change DNS. Original PDFs are excluded from the published build. `node scripts/publish-hosting.mjs` verifies the generated files without publishing; `--push` publishes them to `hosting`.

## Scope and product status

- Responsive landing page, educator/student explanation, classroom history, source-linked recognition, FAQ, and contact.
- Interactive mentor examples with three learning contexts and three guidance approaches, keyboard-accessible tabs, and prepared step-by-step conversations.
- Approved AMIRA A logo, mascot, learning illustration, self-hosted fonts, SEO metadata, and social preview card.
- Contact: **admin@amiraedu.com**.

AMIRA's earlier classroom app was used in 2025 and is now being rebuilt. This repository contains the landing page. Interactive examples are prepared illustrations; separate mentor profiles and class access remain product direction. There is no live AI API, authentication, dashboard, or database in this project.

Innovation sharing began in 2025. Official reporting documents the developer's national teaching recognition in 2025 and a later school-innovation presentation in 2026. The award is attributed to the educator.

Original reference PDFs are retained locally and excluded from this repository and its current build. Optional document links are rendered only when the files are available in `public/references/` at build time. Numerical learning-impact claims are omitted while discrepancies in the original materials remain unresolved.

## Documentation and assets

- [Design decisions](DESIGN.md)
- [Public-source research and claim boundaries](RESEARCH.md)
- [Asset provenance](ASSETS.md)
- [Logo usage and ImageGen prompts](docs/BRAND.md)
- [Validation record](VALIDATION.md)
- [Mobile preview](docs/preview/mobile.png)

`node_modules/`, `dist/`, local environment files, and `output/` archives/QA artifacts are excluded from Git. Full historical previews remain local; the screenshots above show the selected visual direction.

The optional `scripts/generate-social-card.cjs` generator uses `sharp`, `playwright-core`, and an installed Google Chrome. The ready-to-use `public/og.png` is committed, so normal builds do not require the generator.

To regenerate the card locally:

```sh
npm install --no-save --package-lock=false playwright-core
node scripts/generate-social-card.cjs
```

Set `AMIRA_CHROME_PATH` only if Chrome is installed at a custom location. The generator renders embedded local fonts and images without accessing external websites.

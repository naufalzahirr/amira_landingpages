# Verification

Verified on 12 October 2026 against the final static build, served locally with Chrome in a fresh headless browser context.

- `npm run build`: passed, static output in `dist/`.
- Latest dependency installation: zero reported npm audit vulnerabilities (Astro 7.3.8).
- Viewport widths: 320, 390, 640, 768, 1024, and 1440 px. No horizontal overflow or failed images.
- Runtime: no JavaScript page errors or failed requests during browser checks.
- Links: all 20 links checked for valid internal targets, accessible local files, or the explicit email destination.
- Interactions: all three configuration contexts, resource tab updates, keyboard tab switching, all conversation scenarios, conversation continuation/reset, mobile menu dismissal by link and Escape, and the development disclosure deep link passed.
- Education revision: all nine combinations of subject and teaching approach passed. Instruction changes update the illustrative AI response and student action; selected subjects update the conversation scenario. The refined two-room showcase preserves these controls and displays instructions as readable prose.
- Axe checks with WCAG 2 A/AA and 2.1 A/AA tags: no violations in the default view, open documentation/resource view, approach view, and mobile approach view. Automated checks do not constitute a full accessibility certification.
- Build artifact references: all local references exist. No duplicate HTML IDs.
- Visual inspection: revised desktop/mobile hero, generated teacher/SMK learning illustration, two-room instruction/response showcase, conversation stage indicator, classroom narrative, and contact section inspected. Important mobile text is enlarged. The generated scene is clearly labeled as an illustration and exported as optimized responsive WebP assets. Hero, contact, and avatar mascot images are optimized as well.

Screenshots and the machine-readable final report are in `output/preview/`. No production deployment or DNS changes have been performed. Local QA servers are stopped after verification; use `npm run dev` to start an interactive preview.

## Approved logo integration — 13 October 2026

- `npm run build`: passed with the new shared logo component and 14 optimized image outputs. Responsive logo WebP variants are approximately 10–20 kB.
- Header and footer use the approved A logo. Hero, mentor showcase, and conversation use its optimized symbol; obsolete crescent CSS pseudo-elements were removed.
- Checked widths: 320, 390, 640, 768, 1024, and 1440 px. All logo images loaded, no horizontal overflow, and no JavaScript errors or failed requests.
- Favicon PNGs (32/64 px), apple-touch icon, optimized symbol, and the 1200 × 630 social card returned HTTP 200. Build copies match their source assets.
- Mobile navigation opening and dismissal with Escape passed.
- Axe checks with WCAG 2 A/AA and 2.1 A/AA tags found no violations in desktop and mobile default views.
- Desktop/mobile hero and footer screenshots were visually inspected for logo sizing, spacing, and preserved aspect ratio. Screenshots and measurements are in `output/preview/` and `output/preview/brand-report.json`. Earlier screenshots are archived in `output/archive/brand-integration/preview/`.

## International English edition — 13 October 2026

- `npm run build`: passed after translation and the final mobile typography adjustment.
- Page language, structured data, and social metadata use English. All visible page, component, interaction, accessibility, and social-card text was reviewed for English consistency; original school names, award names, and source documents retain their original identity.
- Widths 320, 390, 640, 768, 1024, and 1440 px passed layout checks with no horizontal overflow, broken images, runtime errors, or failed requests.
- English configuration previews, subject-linked conversations, resource/approach tabs, keyboard tab switching, replay/continue controls, mobile navigation, and the renamed product-status disclosure link passed.
- All 22 links checked for valid internal targets, accessible local files, or the explicit contact destination. The two external report URLs were opened and reviewed during source research.
- No duplicate HTML IDs. Axe checks using WCAG 2 A/AA and 2.1 A/AA tags found no violations in desktop/default, resources, approach, and mobile approach views.
- Final focused checks at 320, 390, 640, and 1440 px confirmed a two-line hero headline and the updated rebuild disclosure. Other breakpoint styling did not change after the broader checks.
- Desktop/mobile hero, mentor showcase, contact, journey, and recognition block were visually inspected. The award is attributed to the developer and the 2026 milestone to the school's AMIRA presentation.
- The developer's clarification that the earlier app worked and is now being rebuilt is reflected in the product status and FAQ.

English screenshots and reports: `output/preview/english/`. Source research: `RESEARCH.md`. No production deployment or DNS changes were performed.

## Ink & Marigold palette — 13 October 2026

- `npm run build`: passed after the palette update and final selected-indicator adjustment.
- Six viewport widths (320, 390, 640, 768, 1024, 1440 px): no overflow, broken images, JavaScript errors, or failed requests.
- Existing configuration, conversation, tab-keyboard, disclosure, and mobile-navigation checks passed; all 22 page links retained valid destinations.
- Axe checks with WCAG 2 A/AA and 2.1 A/AA tags found no violations in the default, resources, approach, and mobile approach views.
- Final computed-style check confirmed dark-ink selected tab and conversation-stage indicators on light surfaces. Focus rings use ink on light surfaces and gold on the charcoal section.
- Desktop/mobile hero, mentor panel, learning section, contact, and journey were visually inspected. The approved logo and generated illustrations retain their original artwork; page and social-card colors use the new palette.
- Three palette directions were rendered and compared in `output/exploration/palettes.png`. The selected Ink & Marigold direction has ink/paper contrast 13.83:1, olive/paper 5.93:1, and ink/gold 8.76:1; yellow is used as fill and decorative emphasis.

Latest screenshots and reports are in `output/preview/palette/`. The social card is 1200 × 630 px, generated with local embedded assets and inspected for clipped text. No production deployment or DNS changes were made.

## Contact update — 13 October 2026

The displayed contact address and contact-button mailto destination now use `admin@amiraedu.com`, supplied by the developer. Build passed; the generated HTML contains the new address and retains the English collaboration subject. Earlier screenshots and source documents may show the historical Gmail address.

## Journey correction — 13 October 2026

Build passed after clarifying that innovation sharing began in 2025. The generated timeline contains “Since 2025” and describes the official 2026 forum as a later activity; its source link is labeled “Read the 2026 coverage.” Earlier screenshots retain the preceding date label.

## Source repository preparation — 13 October 2026

Build passed with Node requirements recorded in package metadata and the README. Dependency, build, environment, and local archive folders are ignored. Original PDFs are preserved locally outside `public/` and excluded from the commit and generated build; optional document links are omitted when those files are unavailable. The current build has 20 links with valid internal targets or file destinations. Asset/brand documentation and selected previews are included in portable repository paths.

## Single-A logo correction — 13 October 2026

- The primary logo was edited with built-in ImageGen so the stylized A followed by mira reads Amira once. Original PNG: 2172 × 724 px with transparent alpha; website derivative: 1700 × 468 px.
- The shared header/footer logo, social card, current brand proof, palette comparison, repository screenshots, and hosting package use the corrected wordmark. The standalone A symbol and favicons remain suitable.
- `npm run build` passed. Six viewport widths (320, 390, 640, 768, 1024, 1440 px) showed no overflow, broken logo images, runtime errors, or failed requests.
- Mobile navigation checks passed. Axe default-view checks with WCAG 2 A/AA and 2.1 A/AA tags found no violations on desktop or mobile.
- Logo typography was visually checked at 148/180 px. Header, footer, and social-card spacing were inspected. Latest measurements and screenshots are in `output/preview/single-a/`; provenance and the full edit prompt are in `docs/BRAND.md`.

## Prebuilt Git hosting workflow — 13 October 2026

- Local `npm run build` passed; the publisher verified 35 static files and their HTML/CSS resource destinations.
- An isolated local bare Git repository exercised first publication, an unchanged build, and an updated build. The update preserved the earlier hosting commit as its parent; the unchanged build created no commit.
- Verified that the hosting branch contains only `README.md` and `dist/`, records the source commit, excludes original PDFs and Finder metadata, and leaves the source branch and temporary worktree registry clean. An unexpected PDF was rejected before publication.
- Workflow YAML parsed successfully. Official checkout/setup-node actions are pinned to verified commit hashes. Main-branch triggers and the manual-run guard restrict source builds to `main`; publication is serialized and uses ordinary pushes.
- These checks verify packaging and repository publication behavior. The hosting account's process/thread quota was not directly inspected. No production hosting or DNS changes were performed.

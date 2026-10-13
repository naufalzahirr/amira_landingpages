const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const sharp = require('sharp');

// Prefer a project-local Playwright installation; the existing QA environment is
// also supported without installing another package or starting a preview server.
function loadPlaywright() {
  try {
    return require('playwright-core');
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    if (process.env.AMIRA_PLAYWRIGHT_MODULE) return require(process.env.AMIRA_PLAYWRIGHT_MODULE);
    throw new Error('Optional social-card generator requires playwright-core. Install it locally with npm install --no-save --package-lock=false playwright-core.');
  }
}

const { chromium } = loadPlaywright();
const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(projectRoot, 'public/og.png');
const archivePath = path.join(projectRoot, 'output/archive/single-a-logo/public/og.png');
const logoPath = path.join(projectRoot, 'public/assets/brand/amira-logo-primary-v3.png');
const mascotPath = path.join(projectRoot, 'public/assets/amira-mascot.png');
const fontPath = path.join(projectRoot, 'public/assets/nunito-latin.woff2');

(async () => {
  // Resize the original transparent logo only in memory. Its source is unchanged.
  const logo = await sharp(logoPath).trim({ threshold: 1 }).resize({ width: 700, withoutEnlargement: true }).png().toBuffer();
  const logoData = `data:image/png;base64,${logo.toString('base64')}`;
  const mascotData = `data:image/png;base64,${fs.readFileSync(mascotPath).toString('base64')}`;
  const fontData = `data:font/woff2;base64,${fs.readFileSync(fontPath).toString('base64')}`;
  let browser;
  try {
    browser = await chromium.launch({
      ...(process.env.AMIRA_CHROME_PATH ? { executablePath: process.env.AMIRA_CHROME_PATH } : { channel: 'chrome' }),
      headless: true,
    });
    const context = await browser.newContext({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1,
      colorScheme: 'light',
    });
    await context.route(/^https?:\/\//, route => route.abort());
    const page = await context.newPage();
    await page.setContent(`<!doctype html><html lang="en"><head><meta charset="UTF-8"><style>
      @font-face{font-family:Nunito;src:url('${fontData}') format('woff2');font-weight:400 900;font-display:block}
      *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#F8F6EF;color:#242824;font-family:Nunito,sans-serif;overflow:hidden}
      .brand{position:absolute;left:65px;top:39px;width:250px;height:61px;object-fit:contain;object-position:left center}
      h1{position:absolute;left:65px;top:171px;margin:0;font-size:68px;line-height:1.14;letter-spacing:-2px;font-weight:900;z-index:3}
      h1 span{color:#242824;background:linear-gradient(transparent 76%,#F4BE43 76%,#F4BE43 95%,transparent 95%)}
      p{position:absolute;left:68px;top:382px;font-size:25px;color:#62665D;line-height:1.5;margin:0;z-index:3}
      .domain{position:absolute;left:68px;bottom:38px;font-size:19px;font-weight:800;color:#536445}
      .blob{position:absolute;right:36px;top:116px;width:415px;height:425px;background:#F8E6B3;border-radius:45% 55% 40% 60%;transform:rotate(7deg)}
      .mascot{position:absolute;right:10px;bottom:0;width:450px;height:470px;object-fit:contain}
      .hello{position:absolute;right:66px;top:49px;background:#F8F6EF;border:2px solid #DBDED3;border-radius:20px 20px 20px 3px;padding:12px 23px;font-size:25px;font-weight:850;transform:rotate(4deg)}
      .star{position:absolute;right:38px;top:275px;font-size:65px;color:#536445}.spark{position:absolute;right:414px;top:94px;font-size:65px;color:#536445}
    </style></head><body>
      <img class="brand" src="${logoData}" alt="AMIRA logo with an A monogram" width="250" height="61">
      <h1>More curiosity.<br><span>More understanding.</span></h1>
      <p>An AI learning companion,<br>guided by educators.</p>
      <div class="domain">amiraedu.com</div><div class="blob" aria-hidden="true"></div>
      <img class="mascot" src="${mascotData}" alt="The AMIRA mascot welcomes learners" width="450" height="470">
      <div class="hello">Hi, I’m AMIRA!</div><span class="star" aria-hidden="true">✦</span><span class="spark" aria-hidden="true">✳</span>
    </body></html>`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
    const layout = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      fontLoaded: document.fonts.check('900 68px Nunito'),
      clippedText: [...document.querySelectorAll('h1,p,.domain,.hello')].filter(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.left < 0 || bounds.top < 0 || bounds.right > 1200 || bounds.bottom > 630;
      }).map(element => element.textContent),
    }));
    assert.equal(layout.width, 1200);
    assert.equal(layout.height, 630);
    assert(layout.fontLoaded, 'Nunito must load before the screenshot');
    assert.equal(layout.clippedText.length, 0, 'Text must fit within the social card');

    const screenshot = await page.screenshot({ type: 'png' });
    const optimized = await sharp(screenshot).png({ compressionLevel: 9 }).toBuffer();
    const metadata = await sharp(optimized).metadata();
    assert.equal(metadata.width, 1200);
    assert.equal(metadata.height, 630);
    fs.mkdirSync(path.dirname(archivePath), { recursive: true });
    if (fs.existsSync(outputPath) && !fs.existsSync(archivePath)) fs.copyFileSync(outputPath, archivePath);
    fs.writeFileSync(outputPath, optimized);
    console.log(JSON.stringify({ output: outputPath, archivedOriginal: archivePath, width: metadata.width, height: metadata.height, bytes: optimized.length, previewServer: false }, null, 2));
  } finally {
    if (browser) await browser.close();
  }
})().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});

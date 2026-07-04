const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const OUTPUT_DIR = path.resolve(__dirname, '../assets/out');
const SITE_ORIGIN = 'http://127.0.0.1:1313';

function ensureDirectory(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function discoverPages() {
  const pages = [{ urlPath: '/', outputPath: path.join(OUTPUT_DIR, 'resume.pdf') }];
  const postsDir = path.join(PUBLIC_DIR, 'posts');

  if (!fs.existsSync(postsDir)) {
    return pages;
  }

  for (const entry of fs.readdirSync(postsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const pagePath = path.join(postsDir, entry.name, 'index.html');
    if (!fs.existsSync(pagePath)) {
      continue;
    }

    pages.push({
      urlPath: `/posts/${entry.name}/`,
      outputPath: path.join(OUTPUT_DIR, `${entry.name}.pdf`),
    });
  }

  return pages;
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: WIDTH,
      height: 2000,
      deviceScaleFactor: 1,
    });

    for (const { urlPath, outputPath } of discoverPages()) {
      await page.goto(`${SITE_ORIGIN}${urlPath}`, {
        waitUntil: 'networkidle0',
      });

      await page.evaluateHandle('document.fonts.ready');

      const height = await page.evaluate(() => {
        return Math.ceil(document.body.scrollHeight + 1);
      });

      ensureDirectory(outputPath);

      await page.pdf({
        path: outputPath,
        printBackground: true,
        preferCSSPageSize: false,
        width: `${WIDTH}px`,
        height: `${height}px`,
        margin: {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      });
    }
  } finally {
    await browser.close();
  }
}

main();

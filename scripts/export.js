const puppeteer = require('puppeteer');

const WIDTH = 1200;

async function main() {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: WIDTH,
      height: 2000,
      deviceScaleFactor: 1,
    });

    await page.goto('http://localhost:1313/', {
      waitUntil: 'networkidle0',
    });

    await page.evaluateHandle('document.fonts.ready');

    const height = await page.evaluate(() => {
      return Math.ceil(document.body.scrollHeight + 1);
    });

    await page.pdf({
      path: './assets/out/resume.pdf',
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
  } finally {
    await browser.close();
  }
}

main();

import { mkConfig, generateCsv, asString } from "export-to-csv";
import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";

// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
import { chromium } from "playwright";

const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: 'top_10_y_articles' });


async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");
  await page.waitForSelector('#hnmain');

  const articleElements = (await page.locator('.titleline > a').all()).slice(0, 10);
  const articles = [];
  let order = 0;
  for (const item of articleElements) {
    const article = { 
      'order': order, 
      'title': await item.innerText(),
      'link': await item.getAttribute('href') 
    };
    order++;
    articles.push(article);
  }

  const csv = generateCsv(csvConfig)(articles);
  const filename = `${csvConfig.filename}.csv`;
  const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

  // Write the csv file to disk
  writeFile(filename, csvBuffer, (err) => {
    if (err) throw err;
    console.log("file saved: ", filename);
  });

  // Close the browser
  await page.close();
  await context.close();
  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();

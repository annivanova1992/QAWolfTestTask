import { mkConfig, generateCsv, asString } from "export-to-csv";
import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";

// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
import { chromium } from "playwright";
const csvConfig = mkConfig({ useKeysAsHeaders: true });


async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  await page.waitForSelector('#hnmain');

  // link = page.locator('.item-info-container ').get_by_role('link').get_attribute('href')
  const articleElements = await page.locator('.titleline > a').all();
  const articles = []; 
  for (const article of articleElements) {
    articles.push(await article.getAttribute('href'));
  }

  let exportArticles = articles.map((a, index) => { return { 'order': index, 'title': a, 'link': a } });

  console.log(exportArticles);

  const csv = generateCsv(csvConfig)(exportArticles);
  const filename = `${csvConfig.filename}.csv`;
  const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

  // Write the csv file to disk
  writeFile(filename, csvBuffer, (err) => {
    if (err) throw err;
    console.log("file saved: ", filename);
  })

  // const articles = await page.$$eval('.storylink', (links) => {
  //   return links.slice(0, 10).map((link) => ({
  //     title: link.innerText,
  //     url: link.href
  //   }));
  // });

  // articles.forEach((article, index) => {
  //   console.log(`Article ${index + 1}: ${article.title} - ${article.url}`);
  // });

  // Close the browser
  await page.close();
  await context.close();
  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();

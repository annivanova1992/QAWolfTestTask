import { mkConfig, generateCsv, asString } from "export-to-csv";
import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";

// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
import { chromium } from "playwright";

const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: 'top_10_y_articles' });


async function saveHackerNewsArticles() {
  const articlesCount = 10;
  const articles = await getArticles(articlesCount);
  exportToCSV(articles);
}

(async () => {
  await saveHackerNewsArticles();
})();

function exportToCSV(data) {
  const csv = generateCsv(csvConfig)(data);
  const filename = `${csvConfig.filename}.csv`;
  const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

  writeFile(filename, csvBuffer, (err) => {
    if (err) throw err;
    console.log("file saved: ", filename);
  });
}

async function getArticles(count) {
  let browser;
  let context;
  let page;
  try {
    browser = await launchBrowser();
    context = await createContext(browser);
    page = await openNewPage(context);
    await goToURL(page, 'https://news.ycombinator.com');

    const articleElements = (await page.locator('.titleline > a').all()).slice(0, count);
    const articles = [];
    let order = 1;
    for (const item of articleElements) {
      const article = { 
        'order': order, 
        'title': await item.innerText(),
        'link': await item.getAttribute('href') 
      };
      order++;
      articles.push(article);
    }

    return articles;
  } catch (e) {
    console.log('failure: ' + e);
  } finally {
    await dispose(browser, context, page);
  }
}

async function launchBrowser() {
  return await chromium.launch({ headless: false });
}

async function createContext(browser) {
  return await browser.newContext();
}
  
async function openNewPage(context) {
  return await context.newPage();
}

async function goToURL(page, url) {
  await page.goto(url);
  await page.waitForSelector('#hnmain');
}

async function dispose(browser, context, page) {
  await page.close();
  await context.close();
  await browser.close();
}
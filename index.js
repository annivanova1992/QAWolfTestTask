// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  await page.waitForSelector('#hnmain');

  // link = page.locator('.item-info-container ').get_by_role('link').get_attribute('href')
  const articles = await page.locator('.titleline > a').all();
  for (const article of articles) {
    console.log(await article.getAttribute('href'));
  }

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

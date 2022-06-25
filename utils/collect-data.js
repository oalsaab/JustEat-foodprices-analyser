const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function launchBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
  });

  return browser;
}

async function launchJustEat(browser) {
  console.log("Launching browser...");
  const page = await browser.newPage();
  await page.goto("https://www.just-eat.co.uk/", { waitUntil: "networkidle0" });

  return page;
}

async function acceptCookies(page) {
  console.log("Accepting cookies...");
  const accept = await page.waitForSelector(
    '[data-test-id="accept-necessary-cookies-button"]'
  );
  await accept.click({ delay: 1000 });
}

async function enterPostcode(page, postcode) {
  console.log(`Entering postcode: ${postcode}`);
  await page.type('input[name="postcode"]', postcode);
  await Promise.all([
    page.keyboard.press("Enter"),
    page.keyboard.press("Enter"),
    page.waitForNavigation(),
  ]);
}

async function scrollToBottom(page) {
  let lastHeight = await page.evaluate("document.body.scrollHeight");

  while (true) {
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await page.waitForTimeout(500);

    let newHeight = await page.evaluate("document.body.scrollHeight");
    if (newHeight === lastHeight) {
      break;
    }

    lastHeight = newHeight;
  }

  await page.waitForTimeout(2000);
}

async function collectRestaurants(page) {
  const openRestaurantsUrls = await page.$$eval(
    '[data-test-id="restaurant"]',
    (restaurantsNode) => {
      let restaurantsObj = {};
      restaurantsNode.forEach((restaurant) => {
        const url = restaurant.href;
        const name = restaurant.querySelector(
          '[data-test-id="restaurant_name"]'
        ).innerText;
        restaurantsObj[name] = url;
      });
      return restaurantsObj;
    }
  );

  return openRestaurantsUrls;
}

async function collectRestaurantData(browser, url, foods) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  let foodData = {};
  for (let food of foods) {
    foodData[food] = await collectPageData(page, food);
  }

  await page.waitForTimeout(500);
  await page.close();

  return foodData;
}

async function collectPageData(page, food) {
  const foodPrices = await page.evaluate((food) => {
    const items = document.querySelectorAll(".c-menuItems-content");
    let prices = [];
    items.forEach((item) => {
      const itemData = item.querySelector('[data-test-id="menu-item-name"]');
      if (itemData.innerText.includes(food)) {
        const itemPrice = item.querySelector(
          '[data-js-test="menu-item-price"]'
        );
        const itemPence = itemPrice.innerText
          .split(/[£.]/)
          .join("")
          .replace("from", "")
          .trim();
        prices.push(Number(itemPence));
      }
    });
    return prices;
  }, food);

  return foodPrices;
}

async function buildData(browser, urls, foods) {
  let aggregatePrices = {};
  const total = Object.keys(urls).length;
  console.log(`Collecting data from ${total} restaurants...\n`);
  let count = 1;

  let restaurantUrls = Object.values(urls);
  let restaurantNames = Object.keys(urls);

  for (let i = 0; i < total; i += 5) {
    let namesArr = restaurantNames.slice(i, i + 5);
    let urlsArr = restaurantUrls
      .slice(i, i + 5)
      .map((url) => collectRestaurantData(browser, url, foods));
    
    let results = await Promise.all(urlsArr);

    for (let j = 0; j < namesArr.length; j++) {
      aggregatePrices[namesArr[j]] = results[j];
      console.log(
        `[${count} / ${total}] Collecting data from: ${[namesArr[j]]}`
      );
      count += 1;
    }
  }

  return aggregatePrices;
}

async function collectData(foods, postcode) {
  let browser = await launchBrowser();
  let page = await launchJustEat(browser);
  await acceptCookies(page);
  await enterPostcode(page, postcode);
  await scrollToBottom(page);
  let urls = await collectRestaurants(page);
  let data = await buildData(browser, urls, foods);
  await browser.close();
  return data;
}

module.exports = {
  collectData,
};

const method = require('./methods');

function mergeData(foods, data) {
  let concatenatedData = {};
  let matchedRestaurants = new Set();

  for (let food of foods) {
    concatenatedData[food] = [];
  }

  for (let [key, value] of Object.entries(data)) {
    for (let [food, price] of Object.entries(value)) {
      if (price.length) {
        matchedRestaurants.add(key);
        cleanedPrices = price.filter(Number);
        concatenatedData[food] = concatenatedData[food].concat(cleanedPrices);
      }
    }
  }

  console.log(
    `\nNumber of restaurants that matched search criteria: ${matchedRestaurants.size}`
  );

  return concatenatedData;
}

function createTable(concatenatedData) {
  let result = {};

  for (let [food, prices] of Object.entries(concatenatedData)) {
    console.log(`Total number of items found with ${food}: ${prices.length}`);

    const median = method.medianCalc(prices);
    const mean = method.meanCalc(prices);
    const mode = method.modeCalc(prices);
    const range = method.rangeCalc(prices);
    const IQR = method.interquartileRangeCalc(prices);
    const standardDev = method.standardDeviationCalc(prices, mean);
    const skew = method.pearsonModeSkewness(mean, mode, standardDev);

    result[food] = {
      median: median,
      mean: mean,
      mode: mode,
      range: range,
      IQR: IQR,
      SD: standardDev,
      skew: skew,
    };
  }

  Object.keys(result).forEach(function (foods) {
    let food = result[foods];
    Object.keys(food).forEach(function (price) {
      food[price] = toPound(food[price]);
    });
  });

  return result;
}

function toPound(value) {
  if (Array.isArray(value)) {
    return value.map((el) => toPound(el));
  }

  if (value < 1) {
    return Math.round(value * 1000) / 1000;
  }

  return Math.round((value / 100) * 100) / 100;
}

module.exports = {
  mergeData,
  createTable,
};

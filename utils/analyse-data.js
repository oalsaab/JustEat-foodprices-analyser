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
    result[food] = {
      median: median(prices) / 100,
      mean: mean(prices) / 100,
      mode: mode(prices) / 100,
      range: range(prices).map((el) => el / 100),
    };
  }

  return result;
}

function median(arr) {
  let sorted = arr.sort((a, b) => a - b);
  let half = Math.floor(sorted.length / 2);

  if (sorted.length % 2 == 0) {
    return (sorted[half - 1] + sorted[half]) / 2;
  }

  return sorted[half];
}

function mean(arr) {
  return Math.round(arr.reduce((sum, value) => sum + value, 0) / arr.length);
}

function range(arr) {
  let sorted = arr.sort((a, b) => a - b);
  return [sorted[0], sorted[sorted.length - 1]];
}

function mode(arr) {
  let frequency = {};
  let max = 0;
  let mode = null;

  for (let price of arr) {
    frequency[price] = (frequency[price] || 0) + 1;
  }

  for (let [num, freq] of Object.entries(frequency)) {
    if (freq > max) {
      max = freq;
      mode = num;
    }
  }

  return Number(mode);
}

module.exports = {
  mergeData,
  createTable,
};

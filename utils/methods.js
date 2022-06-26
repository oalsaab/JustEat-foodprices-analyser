function medianCalc(arr) {
  let sorted = arr.sort((a, b) => a - b);
  let half = Math.floor(sorted.length / 2);

  if (sorted.length % 2 == 0) {
    return (sorted[half - 1] + sorted[half]) / 2;
  }

  return sorted[half];
}

function meanCalc(arr) {
  return arr.reduce((sum, value) => sum + value, 0) / arr.length;
}

function modeCalc(arr) {
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

function rangeCalc(arr) {
  let sorted = arr.sort((a, b) => a - b);
  return [sorted[0], sorted[sorted.length - 1]];
}

function interquartileRangeCalc(arr) {
  let sorted = arr.sort((a, b) => a - b);
  let half = Math.floor(sorted.length / 2);

  if (sorted.length % 2 == 0) {
    let firstQuarter = sorted.slice(0, half);
    let thirdQuarter = sorted.slice(half, sorted.length);
    return medianCalc(thirdQuarter) - medianCalc(firstQuarter);
  }

  let firstQuarter = sorted.slice(0, half);
  let thirdQuarter = sorted.slice(half + 1, sorted.length);
  return medianCalc(thirdQuarter) - medianCalc(firstQuarter);
}

function standardDeviationCalc(arr, mean) {
  let variance =
    arr.reduce((sum, value) => sum + (value - mean) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function pearsonModeSkewness(mean, mode, standardDev) {
  return (mean - mode) / standardDev;
}

module.exports = {
    medianCalc,
    meanCalc,
    modeCalc,
    rangeCalc,
    interquartileRangeCalc,
    standardDeviationCalc,
    pearsonModeSkewness,
}
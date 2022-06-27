# JustEat Food Prices Analyser

This app will run a headless version of Chromium and navigate to the online food delivery service JustEat to collect food price data for a given array of foods and for a given postcode. After the collection of data some simple analysis will be performed on the data, which include determining the averages and spread. 

The results should only serve as a guidance so that your business may get a general sense of the prices of your competitors. 

Please note that the app will not account for differences in portion size of the food, the data is collected indiscriminately. 

**Be aware**: installing the package will download a recent version of Chromium to your device (~300mb). If you do not wish to download a new browser and wish to connect to a existing Chrome/Chromium browser then use puppeteer-core instead of puppeteer.

## Usage

Edit the provided input.js file in the root directory and provide your postcode and the food(s) you wish to search for.
It is recommended that you use the singular noun of the food, e.g. "Burger" instead of "Burgers".

Example:

```
module.exports = userInput = {
    POSTCODE: "WC2N 5DN",
    FOODS: ['Burger', 'Pizza', 'Kebab']
};
```

## Output example

![output-example](https://user-images.githubusercontent.com/94754943/175838551-a50f7c82-37d9-4ffb-b8f2-2b24c2ebf4b2.png)

## Installation

Clone the repository: `git clone https://github.com/oalsaab/JustEat-foodprices-analyser`

In root directory run: `npm run start`

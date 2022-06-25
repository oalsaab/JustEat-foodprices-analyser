const input = require("./inputs");
const collect = require("./utils/collect-data");
const analyse = require("./utils/analyse-data");

async function main() {
  if (!input["FOODS"].length || !input["POSTCODE"]) {
    throw new Error("Array of foods or postcode can not be empty");
  }

  let foods = input["FOODS"].map(
    (el) => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase()
  );
  let postcode = input["POSTCODE"];

  let data = await collect.collectData(foods, postcode);
  let dataMerged = analyse.mergeData(foods, data);
  let result = analyse.createTable(dataMerged);
  console.table(result);
}

main();

import fs from "fs";

let [directions, map] = fs.readFileSync("./input.txt", "utf8").split("\n\n");

let mapDirections = {};

for (let row of map.split("\n")) {
  const key = row.slice(0, 3);
  const L = row.slice(7, 10);
  const R = row.slice(12, 15);
  mapDirections[key] = { L, R };
}

let mapPointer = 'AAA';
let idx = 0;

while (mapPointer != "ZZZ") {
  mapPointer = mapDirections[mapPointer][directions[idx % directions.length]];
  idx++;
  console.log(idx, mapPointer);
}

console.log(idx);

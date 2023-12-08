import fs from "fs";

let [directions, map] = fs.readFileSync("./input.txt", "utf8").split("\n\n");

let mapDirections = {};

let starts = [];

for (let row of map.split("\n")) {
  const key = row.slice(0, 3);
  const L = row.slice(7, 10);
  const R = row.slice(12, 15);
  if (key[2] === "A") {
    starts.push(key);
  }
  mapDirections[key] = { L, R };
}

function traverse(start) {
  let mapPointer = start;
  let idx = 0;

  while (mapPointer[2] != "Z") {
    mapPointer = mapDirections[mapPointer][directions[idx % directions.length]];
    idx++;
    console.log(idx, mapPointer);
  }

  return idx;
}

const all = starts.map(traverse);

// this will eventually find it lol
console.log(starts, all);

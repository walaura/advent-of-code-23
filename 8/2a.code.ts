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
  }

  return idx;
}

const multiples = starts.map(traverse);

function getPrimeFactors(num) {
    let factors = [];
    let divisor = 2;
  
    while (num >= 2) {
      if (num % divisor == 0) {
        factors.push(divisor);
        num = num / divisor;
      } else {
        divisor++;
      }
    }
    return factors;
  }
  
//added em up manually
const factors = multiples.map(getPrimeFactors);
console.log(factors);

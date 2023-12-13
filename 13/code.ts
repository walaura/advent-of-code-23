import fs from "fs";

type Lake = string[];

const lakes: Lake[] = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n\n")
  .map((row) => row.split("\n"));

const flip = (lake: Lake) => {
  let flippedLake = [];
  for (let index = 0; index < lake[0].length ; index++) {
    if (!flippedLake[index]) {
      flippedLake[index] = "";
    }
    for (let row of lake) {
      flippedLake[index] += row[index];
    }
  }
  return flippedLake;
};

const findReflection = (lake: Lake) => {
  let candidates: number[] = [];
  for (let row = 0; row < lake.length - 1; row++) {
    if (lake[row] === lake[row + 1]) {
      candidates.push(row);
    }
  }
  for (let candidate of candidates) {
    let index = 1;
    let isDone = false;
    while (!isDone) {
      if (
        !lake[candidate - index] ||
        !lake[candidate + 1 + index] 
      ) {
        return candidate + 1;
      }
      if (lake[candidate - index] !== lake[candidate + 1 + index]) {
        isDone = true;
      }
      index++;
    }
  }
};

let horizontals = [];
let verticals = [];

lakes.forEach((lake) => {
  const hz = findReflection(lake);
  if (hz) {
    horizontals.push(hz);
    return;
  }
  const vert = findReflection(flip(lake));
  if (vert) {
    verticals.push(vert);
    return;
  }
  console.error(flip(lake).join("\n"));
});
console.log({horizontals, verticals})

let sum = 0;
for (let hz of horizontals) {
  sum += hz * 100;
}
for (let vert of verticals) {
  sum += vert;
}

console.log(sum);

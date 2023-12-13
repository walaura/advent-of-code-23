import fs from "fs";

type Lake = string[];

const lakes: Lake[] = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n\n")
  .map((row) => row.split("\n"));

const flip = (lake: Lake) => {
  let flippedLake = [];
  for (let index = 0; index < lake[0].length; index++) {
    if (!flippedLake[index]) {
      flippedLake[index] = "";
    }
    for (let row of lake) {
      flippedLake[index] += row[index];
    }
  }
  return flippedLake;
};

const isSameish = (strA: string, strB: string) => {
  let diff = 0;
  if(!strB || !strA) {
    return false;
  }
  for (let char in strA) {
    if (strA[char] !== strB[char]) {
      diff++;
    }
    if (diff > 1) {
      return false;
    }
  }
  return true;
};

const findReflection = (lake: Lake) => {
  for (let candidate = 0; candidate < lake.length - 1; candidate++) {
    let isSame = lake[candidate] === lake[candidate + 1];
    let hasReplacement = false;
    if (!isSame) {
      isSame = isSameish(lake[candidate], lake[candidate + 1]);
      if (isSame) {
        hasReplacement = true;
      }
    }
    if (isSame) {
      let index = 1;
      let isDone = false;

      while (!isDone) {
        if (!lake[candidate - index] || !lake[candidate + 1 + index]) {
          if (hasReplacement) {
            return candidate + 1;
          }
        }
        let isSame = lake[candidate - index] === lake[candidate + 1 + index];
        if (!hasReplacement && !isSame) {
          isSame = isSameish(
            lake[candidate - index],
            lake[candidate + 1 + index]
          );
          if (isSame) {
            hasReplacement = true;
          }
        }
        if (!isSame) {
          isDone = true;
        }
        index++;
      }
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
console.log({ horizontals, verticals });

let sum = 0;
for (let hz of horizontals) {
  sum += hz * 100;
}
for (let vert of verticals) {
  sum += vert;
}

console.log(sum);

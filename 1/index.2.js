import fs from "fs";
import { exit } from "process";

const file = fs.readFileSync("./input.txt", "utf8");

const rows = file.split("\n");

let sum = 0;

const PLAIN_DIGITS = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
};

const DIGITS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const BACKWARDS_DIGITS = Object.fromEntries(
  Object.entries(DIGITS).map(([key, value]) => [
    key.split("").reverse().join(""),
    value,
  ])
);

for (let row of rows) {
  const backwardsRow = row.split("").reverse().join("");

  let end = { digit: null, at: Infinity };
  let start = { digit: null, at: Infinity };

  for (let [key, value] of Object.entries({ ...PLAIN_DIGITS, ...DIGITS })) {
    const index = row.indexOf(key);
    if (index >= 0 && index < start.at) {
      start = { digit: value, at: index };
    }
  }
  for (let [key, value] of Object.entries({ ...PLAIN_DIGITS, ...BACKWARDS_DIGITS })) {
    const index = backwardsRow.indexOf(key);
    if (index >= 0 && index < end.at) {
      end = { digit: value, at: index };
    }
  }

  if(start.at === Infinity || end.at === Infinity) {
    console.log(row, start, end);
    exit(1);
  }
  sum += Number(`${start.digit}${end.digit}`);
}

console.log(sum);

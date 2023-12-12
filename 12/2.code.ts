import fs from "fs";
import process from "process";

const logMem = (...etc) => {
  const mu = process.memoryUsage();
  // # bytes / KB / MB / GB
  const gbNow = mu["heapTotal"] / 1024 / 1024 / 1024;
  const gbRounded = Math.round(gbNow * 100) / 100;

  console.log(...etc, `Heap allocated ${gbRounded} GB`);
};

let rows: Row[] = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n")
  .map((row) => row.split(" "))
  .map(([mask, input]) => [mask, input?.split(",").map(Number)]);

const inflate = (r) =>
  r.map(([mask, input]) => [
    Array(5).fill(mask).join("?"),
    Array(5).fill(input).flat(),
  ]);
//rows = inflate(rows);

type Row = [string, number[]];
type ValveArrangement = string;

enum Characters {
  Empty = ".",
  Spring = "#",
  Unknown = "?",
}


const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);
const sumGaps = (arr) => sumArray(arr) + 1 * (arr.length - 1) + 1;

const getValveArrangements = (
  mask: string,
  start: number,
  end: number,
  size: number
): ValveArrangement[] => {
  let possibles = [];
  top: for (let i = 0; i <= end - size; i++) {
    // where the next empty is
    const offset = size + i + 1;

    if (mask[start + i - 1] === Characters.Spring) {
      continue;
    }
    if (mask[start + offset - 1] === Characters.Spring) {
      continue;
    }
    for (let char = 0; char < size; char++) {
      if (
        mask[start + i + char] !== Characters.Unknown &&
        mask[start + i + char] === Characters.Empty
      ) {
        continue top;
      }
    }

    possibles.push(
      [
        ...Array(i).fill(Characters.Empty),
        ...Array(size).fill(Characters.Spring),
        Characters.Empty,
      ].join("")
    );
  }
  return possibles;
};

const fitsInMask = (
  start: number,
  mask: string,
  valve: string,
  isLast: boolean
) => {
  const submask = mask.substring(start, start + valve.length);

  // check if we are covering all # in this region
  for (let char = 0; char < submask.length; char++) {
    if (submask[char] === "#" && valve[char] !== Characters.Spring) {
      return;
    }
  }

  // check if theres any unused # that we need
  if (isLast) {
    const remainder = mask.substring(start + valve.length);
    if (remainder && remainder.includes(Characters.Spring)) {
      return;
    }
  }

  return true;
};

const solveLine = (mask: string, row: number[]): number => {
  const lineSize = mask.length;
  let nextPossibleStarts = new Map();
  let currentPossibleStarts = new Map([[0, 1]]);

  for (let valveIndex = 0; valveIndex < row.length; valveIndex++) {
    nextPossibleStarts = new Map();

    for (let startAt of currentPossibleStarts.keys()) {
      const basis = currentPossibleStarts.get(startAt);

      getValveArrangements(
        mask,
        startAt,
        lineSize - sumGaps(row.slice(valveIndex + 1)) - startAt,
        row[valveIndex]
      ).forEach((valve) => {
        if (
          !fitsInMask(
            startAt,
            mask,
            valve,
            valveIndex === row.length - 1
          )
        ) {
          return;
        }

        const val = nextPossibleStarts.get(startAt + valve.length);
        nextPossibleStarts.set(startAt + valve.length, (val ?? 0) + basis);
      });
    }

    currentPossibleStarts = nextPossibleStarts;
  }

  return [...nextPossibleStarts.values()].reduce((a, b) => a + b, 0);
};

let tot = 0;
rows.map(([mask, input]) => {
  logMem("before");
  const lines = solveLine(mask, input);
  logMem("after");
  console.log(tot);
  tot += lines;
});

console.log(tot);

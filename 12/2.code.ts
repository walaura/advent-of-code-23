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
rows = inflate(rows);

type Row = [string, number[]];

enum Characters {
  Empty = ".",
  Spring = "#",
  Unknown = "?",
}

type ValvePosition = string;

type Line = ValvePosition[];

const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);
const sumGaps = (arr) => sumArray(arr) + 1 * (arr.length - 1) + 1;

const solveValvePosition = (
  mask: string,
  start: number,
  end: number,
  size: number
): Line => {
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

const solveLine = (mask: string, row: number[]): number => {
  const lineSize = mask.length;
  let nextPossiblesCount = new Map();
  let currentPossiblesCount = new Map([[0, 1]]);

  for (let curValveIndex = 0; curValveIndex < row.length; curValveIndex++) {
    nextPossiblesCount = new Map();

    for (let valvesBefore of currentPossiblesCount.keys()) {
      const basis = currentPossiblesCount.get(valvesBefore);

      solveValvePosition(
        mask,
        valvesBefore,
        lineSize - sumGaps(row.slice(curValveIndex + 1)) - valvesBefore,
        row[curValveIndex]
      ).forEach((valve) => {
        const submask = mask.substring(
          valvesBefore,
          valvesBefore + valve.length
        );

        for (let char = 0; char < submask.length; char++) {
          if (submask[char] === "#" && valve[char] !== "#") {
            return;
          }
        }

        if (curValveIndex === row.length - 1) {
          const remainder = mask.substring(valvesBefore + valve.length);
          if (remainder && remainder.includes("#")) {
            return;
          }
        }
        const val = nextPossiblesCount.get(valvesBefore + valve.length);
        if (!val) {
          nextPossiblesCount.set(valvesBefore + valve.length, 0);
        }
        nextPossiblesCount.set(valvesBefore + valve.length, (val ?? 0) + basis);
      });
    }

    currentPossiblesCount = nextPossiblesCount;
  }

  return [...nextPossiblesCount.values()].reduce((a, b) => a + b, 0);
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

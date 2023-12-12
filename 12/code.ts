import fs from "fs";

const rows: Row[] = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n")
  .map((row) => row.split(" "))
  .map(([mask, input]) => [mask, input?.split(",").map(Number)]);

type Row = [string, number[]];

enum Characters {
  Empty = ".",
  Spring = "#",
  Unknown = "?",
}

type LineWithMeta = { size: number; line: Line };

type ValvePosition = {
  size: number;
  position: number;
  offset: number;
};

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
  top: for (let i = start; i <= end - size; i++) {
    // where the next empty is
    const offset = size + i + 1;

    if (mask[i - 1] === Characters.Spring) {
      continue;
    }
    if (mask[offset - 1] === Characters.Spring) {
      continue;
    }
    for (let char = 0; char < size; char++) {
      if (
        mask[i + char] !== Characters.Unknown &&
        mask[i + char] === Characters.Empty
      ) {
        continue top;
      }
    }

    possibles.push({
      size,
      position: i,
      offset, // precalc this one
    });
  }
  return possibles;
};

const solveLine = (mask: string, _row: number[]): LineWithMeta[] => {
  const lineSize = mask.length;
  const row = [..._row];
  const first = row.shift();
  const end = lineSize - sumGaps(row);
  const valves = mask
    .split("")
    .map((v, i) => {
      if (v === Characters.Spring) {
        return i + 1;
      }
    })
    .filter(Boolean)
    .map((v) => v - 1);

  let possibles: Line[][] = [
    solveValvePosition(mask, 0, end, first).map((r) => [r]),
  ];
  for (let curValveIndex = 0; curValveIndex < row.length; curValveIndex++) {
    possibles[curValveIndex + 1] = [];
    while (possibles[curValveIndex].length) {
      const valvesBefore = possibles[curValveIndex].pop();
      const valveBefore = valvesBefore[curValveIndex];

      solveValvePosition(
        mask,
        valveBefore.offset,
        lineSize - sumGaps(row.slice(curValveIndex + 1)),
        row[curValveIndex]
      ).forEach((valve) => {
        possibles[curValveIndex + 1].push([...valvesBefore, valve]);
      });
    }
  }

  let final = possibles.pop();
  possibles = null;
  // this sux but lets filter so all the # are assigned
  final = final.filter((line) => {
    for (let valveIndex of valves) {
      if (
        !line.find(
          ({ position, size, offset }) =>
            position <= valveIndex && size + position >= valveIndex
        )
      ) {
        return false;
      }
    }
    return true;
  });

  return final.map((line) => ({ size: lineSize, line }));
};

const PREVIEW_CHARS = {
  // no: '💢',
  // yes: '🔩'
  no: ".",
  yes: "#",
};

const preview = (line: LineWithMeta) => {
  let returnable = Array.from({ length: line.size }, () => PREVIEW_CHARS.no);
  for (let { size, position } of line.line) {
    returnable[position] = PREVIEW_CHARS.yes;
    for (let i = 0; i < size; i++) {
      returnable[position + i] = PREVIEW_CHARS.yes;
    }
  }
  console.log(returnable.join(""));
};

let tot = 0;
rows.map(([mask, input]) => {
  const lines = solveLine(mask, input);
  //lines.map(preview);
  tot += lines.length;
});

console.log(tot);

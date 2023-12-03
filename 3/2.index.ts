import fs from "fs";

type Token = {
  start: number;
  line: number;
};

type PartNumber = Token & {
  value: number;
  end: number;
};

function findTokens<TToken>(
  rows: string[],
  regex: RegExp,
  onFind: (exec: RegExpExecArray, line: number) => TToken
): TToken[] {
  let tokens: TToken[] = [];

  rows.map((row, line) => {
    let exec: RegExpExecArray | null | undefined;
    while (exec !== null) {
      exec = regex.exec(row);
      if (exec) {
        tokens.push(onFind(exec, line));
      }
    }
  });

  return tokens;
}

function findPartsNextToGear(
  partNumbers: PartNumber[],
  gear: Gear
): PartNumber[] {
  function findPartsNextToGearAtLine(line: number) {
    return partNumbers.filter((partNumber) => {
      if (partNumber.line !== line) {
        return false;
      }
      if (Math.abs(partNumber.end - gear.start) <= 1) {
        return true;
      }
      if (Math.abs(partNumber.start - gear.start) <= 1) {
        return true;
      }
      if (gear.start > partNumber.start && gear.start < partNumber.end) {
        return true;
      }
    });
  }

  const over = findPartsNextToGearAtLine(gear.line - 1);
  const around = findPartsNextToGearAtLine(gear.line);
  const under = findPartsNextToGearAtLine(gear.line + 1);

  return [...over, ...around, ...under];
}

function filterPartsnextTogear(partNumbers: PartNumber[]): PartNumber[] {
  if (partNumbers.length === 2) {
    return partNumbers;
  }
  return [];
}

type Gear = Token & {};

const file = fs.readFileSync("./input.txt", "utf8");

const ROWS = file.split("\n");

const partNumbers: PartNumber[] = findTokens(
  ROWS,
  /([0-9])+/g,
  (exec, line) => ({
    value: Number(exec[0]),
    line,
    start: exec.index,
    end: exec.index + exec[0].length - 1,
  })
);

const gears: Gear[] = findTokens(ROWS, /([*])+/g, (exec, line) => ({
  line,
  start: exec.index,
}));

const partsToMultiply = gears.map((gear) =>
  filterPartsnextTogear(findPartsNextToGear(partNumbers, gear))
);

const multipliedValues = partsToMultiply
  .map((setOfParts) =>
    setOfParts[1] ? setOfParts[0].value * setOfParts[1].value : 0
  )
  .reduce((acc, cur) => acc + cur, 0);

console.log(multipliedValues);
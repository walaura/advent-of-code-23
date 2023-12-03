import fs from "fs";

type PartNumber = {
  value: number;
  start: number;
  length: number;
  line: number;
};

const file = fs.readFileSync("./input.txt", "utf8");

const rows = file.split("\n");
const numbers = /([0-9])+/g;

let partNumbers: PartNumber[] = [];

rows.map((row, line) => {
  let exec: RegExpExecArray | null | undefined;
  while (exec !== null) {
    exec = numbers.exec(row);
    if (exec) {
      partNumbers.push({
        value: Number(exec[0]),
        line,
        start: exec.index,
        length: exec[0].length,
      });
    }
  }
});

let validPartNumbers: PartNumber[] = [];

for (let partNumber of partNumbers) {
  const endPos = partNumber.start + partNumber.length;

  const above = (rows[partNumber.line - 1] ?? "").substring(
    partNumber.start - 1,
    endPos + 1
  );
  const under = (rows[partNumber.line + 1] ?? "").substring(
    partNumber.start - 1,
    endPos + 1
  );
  const before = rows[partNumber.line].substring(
    partNumber.start - 1,
    partNumber.start
  );
  const after = rows[partNumber.line].substring(endPos, endPos + 1);

  const allAround = [above, before, after, under]
    .join("")
    .replace(/[0-9.]/g, "");

  if (allAround.length !== 0) {
    validPartNumbers.push(partNumber);
  }
}

const allParts = validPartNumbers.reduce((acc, cur) => cur.value + acc, 0);
console.log(allParts);

import fs from "fs";

const file = fs.readFileSync("./input.txt", "utf8");

const rows = file.split("\n");

let sum = 0;

for (let row of rows) {
  let components = row.split("");
  const start = components.find((c) => !Number.isNaN(Number(c)));
  const end = components.findLast((c) => !Number.isNaN(Number(c)));

  sum += Number(`${start}${end}`);
}

console.log(sum);

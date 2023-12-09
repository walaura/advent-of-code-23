import fs from "fs";

let sequences = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n")
  .map((line) => line.split(" ").reverse().map(Number));

const getDiff = (sequence: number[], offset: number = 0) => {
  return sequence[offset] - sequence[1 + offset];
};

const walk = (path: number[][]) => {
  let level = path.length - 1;
  let final = path[level];

  const stableLength = path.length;
  for (let i = 0; i < stableLength; i++) {
    if (!path[i + 1]) {
      path[i + 1] = [];
    }
    const index = path[i + 1];
    path[i + 1] = [
      ...index,
      getDiff(path[i], index.length ?? 0),
      getDiff(path[i], (index.length ?? 0) + 1),
    ];
  }
  if (final[0] === 0) {
    return path;
  }
  return walk(path);
};

const calc = (path: number[][]) => {
  let acc = 0;
  for (let seq of path.reverse()) {
    acc += seq[0];
  }
  return acc;
};

let acc = 0;
for (let seq of sequences) {
  let path = [seq];
  path = walk(path);
  acc += calc(path);
}
console.log(acc);

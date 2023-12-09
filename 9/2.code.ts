import fs from "fs";

let sequences = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n")
  .map((line) => line.split(" ").map(Number));

const getDiff = (sequence: number[], offset: number = 0) => {
  return (sequence[offset+1] - sequence[offset]);
};

const walk = (path: number[][]) => {
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
    ].filter(n => !Number.isNaN(n));
  }
  let final = path[path.length-1];
  if(final.length === 0 ){
    path.pop();
    return path;
  }
  return walk(path);
};

const calc = (path: number[][]) => {
  let acc = 0;
  for (let seq of path.reverse()) {
    acc = seq[0] - acc;
  }
  return acc;
};

let acc = 0;
for (let seq of sequences) {
  let path = [seq];
  path = walk(path);
  const calcd = calc(path);
  acc += calcd;
}

console.log(acc);

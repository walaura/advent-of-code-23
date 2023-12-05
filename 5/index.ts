import fs from "fs";

const file = fs.readFileSync("./input.txt", "utf8");

type AlmanacMap = {
  from: string;
  to: string;
  ranges: [destinationStart: number, sourceStart: number, length: number][];
};

const toNumberParts = (string: string | undefined) =>
  string
    ?.replace(/[^0-9 ]/gim, "")
    .trim()
    .split(" ")
    .map((s) => Number(s));

const getMapFromString = (string: string): AlmanacMap => {
  const parts = string.split("\n");
  // @ts-ignore
  const [from, to] = parts.shift()?.split(" ").shift()?.split("-to-");

  return {
    from,
    to,
    // @ts-ignore
    ranges: parts.map((part) => toNumberParts(part)),
  };
};

const applyMap = (value, map: AlmanacMap) => {
  for (let range of map.ranges) {
    if (value >= range[1] && value <= range[1] + range[2]) {
      const diff = value - range[1];
      const position = range[0] + diff;
      return position;
    }
  }
  return value;
};

const parts = file.split("\n\n");
const seeds = toNumberParts(parts.shift()) ?? [];

const maps = parts.map((part) => getMapFromString(part));

let values: number[] = [];
for (let seed of seeds) {
  let value = seed;
  for (let map of maps) {
    value = applyMap(value, map);
  }
  values.push(value);
}

console.log(values.sort((a, b) => a - b));

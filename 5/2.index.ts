import fs from "fs";

const file = fs.readFileSync("./input.txt", "utf8");

type RawRange = [destinationStart: number, sourceStart: number, length: number];
type AlmanacMap = {
  from: string;
  to: string;
  rangeKeys: number[];
  rangeValues: number[];
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
  // @ts-ignore
  const ranges: RawRange[] = parts.map((part) => toNumberParts(part));

  const sorted = ranges.sort(
    ([_, sourceStart], [__, sourceStartB]) => sourceStart - sourceStartB
  );

  let rangeAccess = { 0: 0 };
  for (let [destinationStart, sourceStart, length] of sorted) {
    const diff = destinationStart - sourceStart;
    rangeAccess[sourceStart] = diff;
    rangeAccess[sourceStart + length] = 0;
  }

  const entries = Object.entries(rangeAccess);
  const rangeKeys = entries.map(([k]) => Number(k));
  const rangeValues = entries.map(([_, v]) => v);
  return {
    from,
    to,
    rangeKeys,
    rangeValues,
  };
};

const applyMap = (value, map: AlmanacMap) => {
  let closest = map.rangeKeys.findIndex((idx) => idx > value) - 1;
  if (closest === -2) {
    closest = map.rangeKeys.length - 1;
  }
  if (closest === -1) {
    closest = 0;
  }
  return value + map.rangeValues[closest];
};

const parts = file.split("\n\n");
const seeds = toNumberParts(parts.shift()) ?? [];
const maps = parts.map((part) => getMapFromString(part));

let smaller = Infinity;
for (let seedIndex = 0; seedIndex + 1 < seeds.length; seedIndex += 2) {
  const [seed, range] = [seeds[seedIndex], seeds[seedIndex + 1]];
  console.log(`seed: ${seed}-${seed + range}`);
  console.log(`${seedIndex / 2 + 1}/${seeds.length / 2}`);
  for (let rangeIndex = 0; rangeIndex < range; rangeIndex++) {
    let value = seed + rangeIndex;
    for (let map of maps) {
      value = applyMap(value, map);
    }

    if (value < smaller) {
      console.log(`new smaller value! ${value}`);
      smaller = value;
    }
  }
}
console.log(smaller);

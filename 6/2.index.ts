import fs from "fs";

function find<T>(
  process: (half: number) => T,
  isValidValue: (T) => boolean,
  start: number,
  end: number
) {
  const half = Math.round((end - start) / 2 + start);
  const value = process(half);
  if (isValidValue(value)) {
    return value;
  }
  if (end - half < 1) {
    return null;
  }
  return (
    find(process, isValidValue, start, half) ??
    find(process, isValidValue, half, end)
  );
}

const data = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n")
  .map((f) => f.replace(/ /g, "").replace(/[^0-9]/g, ""));

let races: Race[] = [
  {
    time: Number(data[0]),
    distance: Number(data[1]),
  },
];

races = [
  races.reduce((acc, race) => ({
    time: Number(`${acc?.time ?? ""}${race.time}`),
    distance: Number(`${acc?.distance ?? ""}${race.distance}`),
  })),
];

console.log(races);

type Race = { time: number; distance: number };

function getSpeeds({ time, distance }: Race) {
  function testRange(test) {
    return test * (time - test) > distance;
  }

  const winInTheMiddleToKickThingsOff = find((n) => n, testRange, 0, distance);
  const winFrom = find(
    (n) => n,
    (n) => testRange(n) && !testRange(n - 1),
    0,
    winInTheMiddleToKickThingsOff
  );
  const winUpTo = find(
    (n) => n,
    (n) => testRange(n) && !testRange(n + 1),
    winInTheMiddleToKickThingsOff,
    distance
  );
  console.log({ winInTheMiddleToKickThingsOff, winFrom, winUpTo });

  return winUpTo - winFrom + 1;
}

let wins = 1;
for (let race of races) {
  wins *= getSpeeds(race);
}

console.log(wins);

import fs from "fs";

const data = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n")
  .map((f) =>
    f
      .split(" ")
      .map((n) => Number(n))
      .filter(Boolean)
  );

let races: Race[] = [];
for (let i = 0; i < data[0].length; i++) {
  races.push({
    time: data[0][i],
    distance: data[1][i],
  });
}

races = [
  races.reduce((acc, race) => ({
    time: Number(`${acc?.time ?? ""}${race.time}`),
    distance: Number(`${acc?.distance ?? ""}${race.distance}`),
  })),
];

type Race = { time: number; distance: number };

function getSpeeds({ time, distance }: Race) {
  let winFrom, winUpTo;
  for (let i = 1; i < time; i++) {
    if (i * (time - i) > distance) {
      winFrom = i;
      break;
    }
  }
  for (let i = distance; i > 0; i--) {
    if (i * (time - i) > distance) {
      winUpTo = i;
      break;
    }
  }

  console.log({ time, winUpTo, winFrom });

  return winUpTo - winFrom + 1;
}

let wins = 1;
for (let race of races) {
  wins *= getSpeeds(race);
}

console.log(wins);

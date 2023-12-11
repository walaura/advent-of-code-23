import fs from "fs";

const universe = fs.readFileSync("./input.txt", "utf8").split("\n");

type Universe = string[];
type Coords = [y: number, x: number];
type Star = { coords: Coords; id: number };
type StarMap = Star[];
type Expansions = { rowsAt: number[]; colsAt: number[] };

const getDimensions = (board: Universe): Coords => [
  board.length,
  board[0].length,
];
const getVertical = (board: Universe, index: number) => {
  let vert = "";
  for (let row of board) {
    vert += row[index];
  }
  return vert;
};

const preExpand = (board: Universe): Expansions => {
  let [height, width] = getDimensions(board);

  let rowsAt = [];
  let colsAt = [];
  for (let i = 0; i < height; i++) {
    if (!board[i].includes("#")) {
      rowsAt.push(i);
    }
  }
  for (let i = 0; i < width; i++) {
    if (!getVertical(board, i).includes("#")) {
      colsAt.push(i);
    }
  }
  return { rowsAt, colsAt };
};

const multi = (1_000_000)-1;

const findStars = (
  board: Universe,
  { rowsAt, colsAt }: Expansions
): StarMap => {
  const [height, width] = getDimensions(board);
  let starMap = [];
  let index = 0;
  for (let col = 0; col < height; col++) {
    for (let row = 0; row < width; row++) {
      if (board[row][col] === "#") {
        index++;
        const addCols = colsAt.filter((at) => at < col).length;
        const addRows = rowsAt.filter((at) => at < row).length;
        starMap.push({
          id: starMap.length,
          coords: [col + (addCols*multi), row + (addRows*multi)],
        });
      }
    }
  }
  return starMap;
};

const getPathLength = (from: Star, to: Star) => {
  const distance = [
    to.coords[0] - from.coords[0],
    to.coords[1] - from.coords[1],
  ];

  return Math.abs(distance[0]) + Math.abs(distance[1]);
};

const getRoutes = (count: number): [number, number][] => {
  let routes = [];
  for (let start = 0; start <= count; start++) {
    for (let end = start + 1; end <= count; end++) {
      routes.push([start, end]);
    }
  }
  return routes;
};

const expansions = preExpand(universe);
const starMap = findStars(universe, expansions);
console.log(expansions, starMap);
const routes = getRoutes(starMap.length - 1);

let tot = 0;
for (let [start, end] of routes) {
  const path = getPathLength(starMap[start], starMap[end]);
  tot += path;
}

console.log(tot);

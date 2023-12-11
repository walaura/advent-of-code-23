import fs from "fs";

const oldUniverse = fs.readFileSync("./input.txt", "utf8").split("\n");

type Universe = string[];
type Coords = [y: number, x: number];
type Star = { coords: Coords; id: number };
type StarMap = Star[];

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
const expand = (board: Universe): Universe => {
  let mutaBoard = [...board];
  let [height, width] = getDimensions(board);

  let addRows = [];
  let addCols = [];
  for (let i = 0; i < height; i++) {
    if (!board[i].includes("#")) {
      addRows.push(i);
    }
  }
  for (let i = 0; i < width; i++) {
    if (!getVertical(board, i).includes("#")) {
      addCols.push(i);
    }
  }

  let counter = 0;
  for (let row of addRows) {
    mutaBoard.splice(row + counter, 0, mutaBoard[row + counter]);
    counter++;
  }
  mutaBoard = mutaBoard.map((row) => {
    counter = 0;
    for (let col of addCols) {
      row = row.slice(0, col + counter) + "." + row.slice(col + counter);
      counter++;
    }
    return row;
  });

  return mutaBoard;
};


const preview = (path: Coords[]) => {
  for (let star of starMap) {
    universe[star.coords[0]] =
      universe[star.coords[0]].slice(0, star.coords[1]) +
      star.id +
      universe[star.coords[0]].slice(star.coords[1] + 1);
  }
  for (let route of pathLol) {
    universe[route[0]] =
      universe[route[0]].slice(0, route[1]) +
      "#" +
      universe[route[0]].slice(route[1] + 1);
  }
  console.log(universe.join("\n"));
};

const findStars = (board: Universe): StarMap => {
  const [height, width] = getDimensions(board);
  let starMap = [];
  let index = 0;
  for (let col = 0; col < height; col++) {
    for (let row = 0; row < width; row++) {
      if (board[col][row] === "#") {
        index++;
        starMap.push({ id: starMap.length, coords: [col, row] });
      }
    }
  }
  return starMap;
};

const getClosestDirection = (from: Coords, to: Coords): Coords => {
  const distance = [to[0] - from[0], to[1] - from[1]];
  const distanceAbs = distance.map(Math.abs);
  const transform =
    distanceAbs[0] > distanceAbs[1]
      ? [distance[0] > 0 ? 1 : -1, 0]
      : [0, distance[1] > 0 ? 1 : -1];

  return [from[0] + transform[0], from[1] + transform[1]];
};

const isSameCoordinates = (from: Coords, to: Coords) => {
  return from[0] === to[0] && from[1] === to[1];
};

const getPath = (from: Star, to: Star) => {
  let path = [from.coords];
  while (
    !isSameCoordinates(path[path.length - 1], to.coords)
  ) {
    path.push(getClosestDirection(path[path.length - 1], to.coords));
  }
  return path;
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

let universe = expand(oldUniverse);
const starMap = findStars(universe);

const routes = getRoutes(starMap.length - 1);

let tot = 0;
for (let [start, end] of routes) {
  const path = getPath(starMap[start], starMap[end]).length - 1;
  //console.log(start+1, end+1, path)
  tot += path;
}

console.log(starMap);
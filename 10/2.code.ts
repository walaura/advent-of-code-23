import fs from "fs";

enum Direction {
  Left = 0,
  Right = 1,
  Up = 2,
  Down = 3,
}

const DIRECTIONS = [
  Direction.Left,
  Direction.Right,
  Direction.Up,
  Direction.Down,
];

enum Position {
  Start = "S",
  Vertical = "|",
  Horizontal = "-",
  BottomRight = "L",
  BottomLeft = "J",
  TopRight = "F",
  TopLeft = "7",
  Ground = ".",
}

const VALID_POSITIONS_FOR_DIRECTION = {
  [Direction.Up]: [
    Position.Start,
    Position.Vertical,
    Position.TopLeft,
    Position.TopRight,
  ],
  [Direction.Down]: [
    Position.Start,
    Position.Vertical,
    Position.BottomLeft,
    Position.BottomRight,
  ],
  [Direction.Left]: [
    Position.Start,
    Position.Horizontal,
    Position.TopRight,
    Position.BottomRight,
  ],
  [Direction.Right]: [
    Position.Start,
    Position.Horizontal,
    Position.TopLeft,
    Position.BottomLeft,
  ],
};

const VALID_DIRECTIONS_FOR_POSITION = {
  [Position.Start]: [
    Direction.Up,
    Direction.Down,
    Direction.Left,
    Direction.Right,
  ],
  [Position.TopRight]: [Direction.Down, Direction.Right],
  [Position.TopLeft]: [Direction.Down, Direction.Left],
  [Position.BottomRight]: [Direction.Up, Direction.Right],
  [Position.BottomLeft]: [Direction.Up, Direction.Left],
  [Position.Vertical]: [Direction.Up, Direction.Down],
  [Position.Horizontal]: [Direction.Left, Direction.Right],
};

const PATHS_FOR_DIRECTION_PAIR = {
  [Direction.Left]: {
    [Direction.Left]: [
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ],
    [Direction.Right]: [
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ],
    [Direction.Up]: [
      [false, true, false],
      [false, true, true],
      [false, false, false],
    ],
    [Direction.Down]: [
      [false, false, false],
      [false, true, true],
      [false, true, false],
    ],
  },
  [Direction.Right]: {
    [Direction.Left]: [
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ],
    [Direction.Right]: [
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ],
    [Direction.Up]: [
      [false, true, false],
      [true, true, false],
      [false, false, false],
    ],
    [Direction.Down]: [
      [false, false, false],
      [true, true, false],
      [false, true, false],
    ],
  },
  [Direction.Up]: {
    [Direction.Left]: [
      [false, false, false],
      [true, true, false],
      [false, true, false],
    ],
    [Direction.Right]: [
      [false, false, false],
      [false, true, true],
      [false, true, false],
    ],
    [Direction.Up]: [
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ],
    [Direction.Down]: [
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ],
  },
  [Direction.Down]: {
    [Direction.Left]: [
      [false, true, false],
      [true, true, false],
      [false, false, false],
    ],
    [Direction.Right]: [
      [false, true, false],
      [false, true, true],
      [false, false, false],
    ],
    [Direction.Up]: [
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ],
    [Direction.Down]: [
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ],
  },
};

/*
i have done this better in the past but dammit i want it to be readable
*/
const isValidMove = (
  from: Position | string,
  to: Position | string,
  direction: Direction
) => {
  if (!VALID_DIRECTIONS_FOR_POSITION[from].includes(direction)) {
    return false;
  }
  return VALID_POSITIONS_FOR_DIRECTION[direction].includes(to);
};

const transformCoordinates = (
  y: number,
  x: number,
  to: Direction
): [y: number, x: number] => {
  switch (to) {
    case Direction.Up: {
      return [y - 1, x];
    }
    case Direction.Down: {
      return [y + 1, x];
    }
    case Direction.Left: {
      return [y, x - 1];
    }
    case Direction.Right: {
      return [y, x + 1];
    }
  }
};

const boardRaw = fs.readFileSync("./input.txt", "utf8");
const board = boardRaw.split("\n");

const startRow = board.findIndex((f) => f.includes(Position.Start));
const startCol = board[startRow].indexOf(Position.Start);

let walked = [
  ...board.map((s) => Array.from({ length: s.length }, () => false)),
];
let floodMap = [
  ...board.flatMap((s) =>
    Array.from({ length: 3 }, () =>
      Array.from({ length: s.length * 3 }, () => false)
    )
  ),
];
let floodFill = [
  ...board.flatMap((s) =>
    Array.from({ length: 3 }, () =>
      Array.from({ length: s.length * 3 }, () => undefined)
    )
  ),
];

type FloodPathRow = [boolean, boolean, boolean];
type FloodPath = [FloodPathRow, FloodPathRow, FloodPathRow];
function getFloodPathForDirection(from: Direction, to: Direction): FloodPath {
  const ZERO: FloodPath = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ];
  const path = PATHS_FOR_DIRECTION_PAIR[from];
  if (!path) {
    return ZERO;
  }
  return path[to] ?? ZERO;
}

type Path = { coords: [number, number]; direction: number };

function walk(y, x) {
  let currentTile = null;
  let history: Path[] = [];
  let currentCoords: [number, number] = [y, x];
  let count = 0;
  walked[y][x] = true;

  while (currentTile !== Position.Start) {
    currentTile = board[currentCoords[0]][currentCoords[1]];
    for (let direction of DIRECTIONS) {
      const newCoords = transformCoordinates(...currentCoords, direction);
      const newCol = board[newCoords[0]];
      if (!newCol) {
        continue;
      }
      const newTile = newCol[newCoords[1]];
      if (walked[newCoords[0]][newCoords[1]] === true) {
        if (count > 1 && newTile === Position.Start) {
        } else {
          continue;
        }
      }
      if (!newTile) {
        continue;
      }
      if (isValidMove(currentTile, newTile, direction)) {
        walked[newCoords[0]][newCoords[1]] = true;
        history.push({ coords: currentCoords, direction });
        currentTile = newTile;
        currentCoords = newCoords;
        count++;
        continue;
      }
    }
  }

  history.forEach((item, index) => {
    const prev = history[index - 1] ?? history[history.length-1];
    const floodTile = getFloodPathForDirection(
      prev.direction,
      item.direction
    );
    floodTile.forEach((row, colIndex) => {
      row.forEach((value, rowIndex) => {
        floodMap[item.coords[0] * 3 + colIndex][item.coords[1] * 3 + rowIndex] =
          value;
      });
    });
  });

  return count;
}

const _ = walk(startRow, startCol);

const map = (
  floodMap
    .map((r) =>
      r.map((v) => (v === undefined ? "⬜️" : v ? "🟦" : "🛑")).join("")
    )
    .join("\n")
);

fs.writeFileSync('./map.txt', map);


let fillables: [number, number][] = [[0,0]];
const fill = (y, x) => {
  const COORDS = [
    [x + 1, y + 1],
    [x - 1, y - 1],
    [x + 1, y - 1],
    [x - 1, y + 1],
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ];
  for (let coordinates of COORDS) {
    const [nX, nY] = coordinates;
    const newCol = floodMap[nY];
    if (!newCol) {
      continue;
    }
    const newTile = newCol[nX];
    if (floodFill[nY][nX] !== undefined) {
      continue;
    }
    if (newTile === null || newTile === undefined) {
      continue;
    }
    floodFill[nY][nX] = false;
    if (newTile === false) {
      floodFill[nY][nX] = true;
      fillables.push([nY, nX]);
      continue;
    }
  }
};

while(fillables.length) {
  fill(...fillables.pop());
}


let minimap = floodFill
  .filter((_, index) => (index - 1) % 3 === 0)
  .map((row) => row.filter((_, index) => (index - 1) % 3 === 0));

/*
this looks super cool with a smaller input
*/
console.log(
  floodFill
    .map((r) =>
      r.map((v) => (v === undefined ? "⬜️" : v ? "🟦" : "🛑")).join("")
    )
    .join("\n")
);

console.log(minimap.flat().filter((i) => i === undefined).length);

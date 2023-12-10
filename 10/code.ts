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

function walk(y, x) {
  let currentTile = null;
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
        console.log(count, currentTile, newTile, Direction[direction]);
        walked[newCoords[0]][newCoords[1]] = true;
        currentTile = newTile;
        currentCoords = newCoords;
        count++;
        continue;
      }
    }
  }

  return count ;
}

const total = walk(startRow, startCol);
console.log(
  walked.map((r) => r.map((v) => (v ? "🟩" : "🛑")).join("")).join("\n")
);

console.log(total);

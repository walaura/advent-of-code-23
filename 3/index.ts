import fs from "fs";

type Number = {
  start: number;
  length: number;
  line: number;
};

const file = fs.readFileSync("./input.txt", "utf8");

const rows = file.split("\n");

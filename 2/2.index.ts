import fs from "fs";

const file = fs.readFileSync("./input.txt", "utf8");

const rows = file.split("\n");

function prepare() {
  let games = [];

  for (let row of rows) {
    let game = {};

    const parts = row.split(":");
    game.id = Number(parts[0].split(" ").pop());

    const plays = parts[1].split(";");
    for (let play of plays) {
      const colors = play.split(",");
      for (let color of colors) {
        const colorPart = color.trim().split(" ");
        if (!game[colorPart[1]]) {
          game[colorPart[1]] = Number(colorPart[0]);
        } else if (Number(colorPart[0]) > game[colorPart[1]]) {
          game[colorPart[1]] = Number(colorPart[0]);
        }
      }
    }
    games.push(game);

    // let normalized = row.replace(/[^0-9a-z ]/g, "");
    // let parts = normalized.split(" ");
    // for (let i = 0; i < parts.length; i += 2) {
    //   if (i === 0) {
    //     game.id = Number(parts[1]);
    //   } else {
    //     if (!game[parts[i + 1]]) {
    //       game[parts[i + 1]] = 0;
    //     }
    //     game[parts[i + 1]] = game[parts[i + 1]] + Number(parts[i]);
    //   }
    // }
    // games.push(game);
  }
  return games;
}

function checkMax(games, maximums) {
  let validGames = [];
  for (let game of games) {
    let isValid = true;
    for (let key of Object.keys(maximums)) {
      if (game[key] > maximums[key]) {
        isValid = false;
        break;
      }
    }
    if (isValid) {
      validGames.push(game);
    }
  }
  return validGames;
}

const pow = (games) =>
  games.map((game) => ({
    ...game,
    pow: Object.keys(game).reduce(
      (prev, key) => (key !== "id" ? prev * game[key] : prev),
      1
    ),
  }));

const addUpPow = (games) => games.reduce((prev, game) => prev + game.pow, 0);

const games = prepare();

console.log(addUpPow(pow(games)));

import fs from "fs";

const file = fs.readFileSync("./input.txt", "utf8");

const rows = file.split("\n");
const getNumbers = (s) => s.split(' ').map(l => l.replace(/[^0-9]/g, '')).filter(Boolean);
const cards = rows.map(row => row.split(':').pop().split('|').map(getNumbers));

const getCardScore = (winningNumbers, candidates) => {
    let score = 0;
    for (let candidate of candidates) {
        if (winningNumbers.includes(candidate)) {
            if (score === 0) {
                score = 1;
            } else {
                score = score * 2;
            }
        }
    }
    return score;
}

const cardScores = cards.map(([winningNumbers, candidates]) => getCardScore(winningNumbers, candidates));
const sum = arr => arr.reduce((acc, val) => acc + val, 0);

console.log( cards, cardScores, sum(cardScores));
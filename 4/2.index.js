import fs from "fs";

const file = fs.readFileSync("./input.txt", "utf8");

const rows = file.split("\n");
const getNumbers = (s) => s.split(" ")
    .map((l) => l.replace(/[^0-9]/g, ""))
    .filter(Boolean);
    
const cards = rows.map((row, index) => [
    ...row.split(":").pop().split("|").map(getNumbers),
    index,
]);

const getCardMatches = (winningNumbers, candidates, index) => {
    let matches = 0;
    for (let candidate of candidates) {
        if (winningNumbers.includes(candidate)) {
            matches++;
        }
    }
    return matches;
};

const cardScores = cards.map(([winningNumbers, candidates, index]) => [
    getCardMatches(winningNumbers, candidates),
    index,
]);

const sum = arr => arr.reduce((acc, val) => acc + val, 0);

let cardCounts = cards.map(_ => 1);

cardScores.forEach(([score, index]) => {
    console.log(index, score, cardCounts[index]);
    for (let i = 1; i < score + 1; i++) {
        cardCounts[index + i] += cardCounts[index];
    }
});

console.log(sum(cardCounts));

/*
for (let i = 0; i < pool.length; i++) {
    const [matches, index] = pool[i];
    if (i % 1000 === 0) {
        console.log(index, pool.length);
    }
    pool = [...pool, ...cardScores.slice(index + 1, index + 1 + matches)];
}
*/

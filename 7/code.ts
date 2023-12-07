import fs from "fs";

type Hand = {
  cards: string;
  stake: number;
};

const data: Hand[] = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n")
  .map((f) => {
    const hand = f.split(" ");
    return { cards: hand[0], stake: Number(hand[1]) };
  });

const SCORES = Object.fromEntries(
  "AKQJT98765432".split("").map((s, k) => [s, k + 1])
);
const TYPES = {
  five: 1,
  four: 2,
  "full-house": 3,
  three: 4,
  "two-pair": 5,
  "one-pair": 6,
  "high-card": 7,
};

const sortScore = (a, b) => {
  if (SCORES[a] === SCORES[b]) {
    return undefined;
  }
  return SCORES[a] - SCORES[b];
};

const calculateType = (hand: Hand) => {
  let samesies = {};
  for (let i = 0; i < hand.cards.length; i++) {
    if (!samesies[hand.cards[i]]) {
      samesies[hand.cards[i]] = 0;
    }
    samesies[hand.cards[i]]++;
  }

  const keys = Object.keys(samesies);
  const values = Object.values<number>(samesies);

  //ABCDE
  if (keys.length === 5) {
    return "high-card";
  }
  //AABCD
  if (keys.length === 4) {
    return "one-pair";
  }
  //AABBC - AAABC
  if (keys.length === 3) {
    if (Math.max(...values) === 3) {
      return "three";
    }
    return "two-pair";
  }
  //AAABB - AAAAB
  if (keys.length === 2) {
    if (Math.max(...values) === 4) {
      return "four";
    }
    return "full-house";
  }
  //AAAAA
  if (keys.length === 1) {
    return "five";
  }
};

let byType: Hand[][] = [];

data.forEach((dt) => {
  const type = calculateType(dt);
  if (!byType[TYPES[type]]) {
    byType[TYPES[type]] = [];
  }
  byType[TYPES[type]].push(dt);
});

const results = byType
  .map((hands) =>
    hands.sort((a, b) => {
      let index = 0;
      let returnable;
      while (
        (returnable = sortScore(a.cards[index], b.cards[index])) == undefined
      ) {
        index++;
      }
      return returnable;
    })
  )
  .filter(Boolean)
  .flat()
  .reverse();

const scores = results.map((r, index) => r.stake*(index+1));

console.log(scores.reduce((a,b)=>a+b,0));

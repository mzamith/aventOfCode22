import { parseFile } from "../util";

type OpponentAnswer = "A" | "B" | "C";
type Answer = "X" | "Y" | "Z";
type Outcome = Answer;

const answerScore = new Map<Answer | OpponentAnswer, number>([
  ["X", 1], // rock
  ["Y", 2], // paper
  ["Z", 3], // scissors
  ["A", 1], // rock
  ["B", 2], // paper
  ["C", 3], // scissors
]);

// Part 1 - XYZ is the proposed answer and means rock, paper os scissors
const answerToOpponentAnswer = new Map<Answer, OpponentAnswer>([
  ["X", "A"], // rock
  ["Y", "B"], // paper
  ["Z", "C"], // scissors
]);

const outcomeScore = new Map<Outcome, number>([
  ["X", 0],
  ["Y", 3],
  ["Z", 6],
]);

function calcWinScore(answer: Answer, opponentAnswer: OpponentAnswer) {
  const converted = answerToOpponentAnswer.get(answer);
  if (opponentAnswer === converted) {
    return 3;
  }

  if (opponentAnswer === "A") {
    return converted === "B" ? 6 : 0;
  }

  if (opponentAnswer === "B") {
    return converted === "C" ? 6 : 0;
  }

  if (opponentAnswer === "C") {
    return converted === "A" ? 6 : 0;
  }
}

function calcAnswerFromOutcome(
  opponentAnswer: OpponentAnswer,
  outcome: Outcome
): OpponentAnswer {
  if (outcome === "Y") {
    return opponentAnswer;
  }

  if (outcome === "X") {
    return opponentAnswer === "A" ? "C" : opponentAnswer === "B" ? "A" : "B";
  }

  if (outcome === "Z") {
    return opponentAnswer === "A" ? "B" : opponentAnswer === "B" ? "C" : "A";
  }
}

function roundScoreOutcomes(opponentAnswer: OpponentAnswer, outcome: Outcome) {
  const neededAnswer = calcAnswerFromOutcome(opponentAnswer, outcome);
  return answerScore.get(neededAnswer) + outcomeScore.get(outcome);
}

function roundScore(opponentAnswer: OpponentAnswer, answer: Answer) {
  return calcWinScore(answer, opponentAnswer) + answerScore.get(answer);
}

function parse() {
  return parseFile().map((eachElf) => eachElf.split(" "));
}

const guide = parse() as [OpponentAnswer, Answer][];
const score = guide.reduce(
  (prev, round) => prev + roundScore(round[0], round[1]),
  0
);

const score2 = guide.reduce(
  (prev, round) => prev + roundScoreOutcomes(round[0], round[1]),
  0
);

console.log(`Part 1: ${score}`);
console.log(`Part 2: ${score2}`);

import { last } from "lodash";
import { parseFile } from "../util";

interface Position {
  x: number;
  y: number;
}

let headPosition = { x: 0, y: 0 };
let tailPosition = { x: 0, y: 0 };
let ropePositions: { x: 0; y: 0 }[];
let tailPositions: Set<string>;

function init(numberOfTails = 9) {
  headPosition = { x: 0, y: 0 };
  tailPosition = { x: 0, y: 0 };
  ropePositions = [];
  for (let i = 0; i < numberOfTails; i++) {
    ropePositions.push({ x: 0, y: 0 });
  }
  tailPositions = new Set<string>();
}

function parse() {
  const lines = parseFile();
  const positions = lines.map((line) => {
    const [direction, numberOfPositions] = line.split(" ");
    return [direction, parseInt(numberOfPositions, 10)] as [
      "U" | "D" | "L" | "R",
      number
    ];
  });
  return positions;
}

const commands = parse();

function addPosition(position: Position) {
  tailPositions.add(`${position.x}:${position.y}`);
}

function isAdjacent(firstPosition: Position, nextPosition: Position) {
  return (
    Math.abs(firstPosition.x - nextPosition.x) <= 1 &&
    Math.abs(firstPosition.y - nextPosition.y) <= 1
  );
}

function moveTail(firstPosition: Position, nextPosition: Position) {
  // head is up -> move up
  if (firstPosition.y < nextPosition.y) {
    nextPosition.y--;
  }

  if (firstPosition.y > nextPosition.y) {
    // head is down -> move down
    nextPosition.y++;
  }
  // head is left -> move left
  if (firstPosition.x < nextPosition.x) {
    nextPosition.x--;
  }

  if (firstPosition.x > nextPosition.x) {
    // head is right -> move right
    nextPosition.x++;
  }
}

function moveHead(command: "U" | "D" | "L" | "R") {
  if (command === "U") {
    headPosition.y--;
  }

  if (command[0] === "D") {
    headPosition.y++;
  }

  if (command[0] === "L") {
    headPosition.x--;
  }

  if (command[0] === "R") {
    headPosition.x++;
  }
}

function moveSimpleRope(command: ["U" | "D" | "L" | "R", number]) {
  const shifts = command[1];

  for (let i = 0; i < shifts; i++) {
    moveHead(command[0]);
    if (!isAdjacent(headPosition, tailPosition)) {
      moveTail(headPosition, tailPosition);
      addPosition(tailPosition);
    }
  }
}

function moveLongRope(command: ["U" | "D" | "L" | "R", number]) {
  const shifts = command[1];

  for (let i = 0; i < shifts; i++) {
    moveHead(command[0]);

    let lead = headPosition;

    for (const tail of ropePositions) {
      if (!isAdjacent(lead, tail)) {
        moveTail(lead, tail);
        if (tail === last(ropePositions)) {
          addPosition(tail);
        }
      }
      lead = tail;
    }
  }
}

init();
addPosition({ x: 0, y: 0 });
commands.forEach((command) => moveSimpleRope(command));
console.log(`Part 1: ${tailPositions.size}`);
init();
addPosition({ x: 0, y: 0 });
commands.forEach((command) => moveLongRope(command));
console.log(`Part 2: ${tailPositions.size}`);

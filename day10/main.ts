import { parseFile } from "../util";

type Command = ["noop" | "addx", number?];
const WIDTH = 40;

function parseCommands(lines: string[]) {
  return lines.map((command) => {
    const instruction = command.split(" ");
    if (instruction.length === 2) {
      return [instruction[0], parseInt(instruction[1])];
    }
    return instruction;
  }) as Command[];
}

function processCycles(commands: Command[], cycles: number[]) {
  let finalStrength = 0;
  let cycle = 1;
  let xValue = 1;

  for (const [command, arg] of commands) {
    if (cycles.includes(cycle)) {
      finalStrength += cycle * xValue;
    }

    if (command === "addx") {
      cycle++;
      if (cycles.includes(cycle)) {
        finalStrength += cycle * xValue;
      }
      xValue += arg;
    }
    cycle++;
  }

  return finalStrength;
}

function performDrawing(commands: Command[]) {
  let currentCycle = 0;
  let spritePosition = 1;
  const finalDrawing: string[] = [];

  for (const [command, arg] of commands) {
    draw(currentCycle, spritePosition, finalDrawing);

    if (command === "addx") {
      currentCycle++;
      draw(currentCycle, spritePosition, finalDrawing);
      spritePosition += arg;
    }
    currentCycle++;
  }

  return finalDrawing;
}

function draw(
  currentCycle: number,
  spritePosition: number,
  finalDrawing: string[]
) {
  const horizontalPosition = currentCycle % WIDTH;
  const verticalPosition = Math.floor(currentCycle / WIDTH);
  let currentLine = finalDrawing[verticalPosition];

  if (!currentLine) finalDrawing.push("");

  if (
    horizontalPosition >= spritePosition - 1 &&
    horizontalPosition <= spritePosition + 1
  ) {
    finalDrawing[verticalPosition] += "#";
  } else {
    finalDrawing[verticalPosition] += ".";
  }
}

const lines = parseFile();
const commands = parseCommands(lines);
const cycles = [20, 60, 100, 140, 180, 220];
const totalPart1 = processCycles(commands, cycles);
console.log(`Part 1: ${totalPart1}`);
const totalPart2 = performDrawing(commands);
console.log("Part 2: ");
console.log(totalPart2);

import { last } from 'lodash';
import fs from 'fs';

export type Move = [number, number, number];

function fillPositionGrid(diagram: string[], indexArray: string) {
  const positions = new Map<number, string[]>();
  for (const grid of diagram) {
    for (let i = 1; i < grid.length - 1; i += 4) {
      const crate = grid[i];
      if (crate.trim().length > 0) {
        const stack = parseInt(indexArray[i], 10);
        if (positions.has(stack)) {
          positions.get(stack).unshift(crate);
        } else {
          positions.set(stack, [crate]);
        }
      }
    }
  }
  return positions;
}

function parseMoves(moves: string[]) {
  return moves.map((move) => move.match(/\d+/g).map((result) => parseInt(result, 10))) as Move[];
}

export function parseFile(): [Map<number, string[]>, Move[]] {
  const [positionsDiagram, movesText] = fs.readFileSync('./input.txt', 'utf-8').split('\n\n');

  const positionsDiagramFull = positionsDiagram.split('\n');
  const indexLists = positionsDiagramFull.pop();
  const movesList = movesText.split('\n');

  const positions = fillPositionGrid(positionsDiagramFull, indexLists);
  const moves = parseMoves(movesList);
  return [positions, moves];
}

const [positionGrid, moves] = parseFile();

for (const move of moves) {
  const [quantity, from, to] = move;

  for (let i = 0; i < quantity; i++) {
    const origin = positionGrid.get(from);
    const destination = positionGrid.get(to);
    const crate = origin.pop();
    destination.push(crate);
  }
}

const finalPart1 = [...positionGrid.keys()].sort().reduce((prev, key) => prev + last(positionGrid.get(key)), '');

console.log(`Part 1: ${finalPart1}`);

const [positionGrid2, moves2] = parseFile();

for (const move of moves2) {
  const [quantity, from, to] = move;
  const origin = positionGrid2.get(from);
  const destination = positionGrid2.get(to);
  const crate = origin.splice(origin.length - quantity, quantity);
  destination.push(...crate);
}

const finalPart2 = [...positionGrid2.keys()].sort().reduce((prev, key) => prev + last(positionGrid2.get(key)), '');

console.log(`Part 2: ${finalPart2}`);

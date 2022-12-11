import { first } from "lodash";
import { parseFile } from "../util";

function parse() {
  return parseFile().map((line) =>
    line.split("").map((str) => parseInt(str, 10))
  );
}

const grid = parse();

function getNeighbors(cordY: number, cordX: number) {
  const horizontalNeighborhood = grid[cordY];
  const verticalNeighborhood = grid.map((lines) => lines[cordX]);

  const left = horizontalNeighborhood.slice(0, cordX).reverse();
  const right = horizontalNeighborhood.slice(cordX + 1);
  const up = verticalNeighborhood.slice(0, cordY).reverse();
  const down = verticalNeighborhood.slice(cordY + 1);
  return { left, right, up, down };
}

function isVisible(cordX: number, cordY: number) {
  const lenY = grid.length;
  const lenX = first(grid).length;
  const currentTree = grid[cordY][cordX];

  if (cordX === 0 || cordY === 0 || cordX === lenX - 1 || cordY === lenY - 1) {
    // borders
    return true;
  }

  const visibleDirection = (direction: number[]) =>
    direction.every((tree) => tree < currentTree);

  const { left, right, up, down } = getNeighbors(cordY, cordX);

  return (
    visibleDirection(left) ||
    visibleDirection(right) ||
    visibleDirection(up) ||
    visibleDirection(down)
  );
}

function scenicScore(cordX: number, cordY: number) {
  const lenY = grid.length;
  const lenX = first(grid).length;
  const currentTree = grid[cordY][cordX];

  if (cordX === 0 || cordY === 0 || cordX === lenX - 1 || cordY === lenY - 1) {
    // borders
    return 0;
  }

  const findDirectionScore = (neighbors: number[]) => {
    const index = neighbors.findIndex((tree) => tree >= currentTree);

    return index >= 0 ? index + 1 : neighbors.length;
  };

  const { left, right, up, down } = getNeighbors(cordY, cordX);

  return (
    findDirectionScore(left) *
    findDirectionScore(right) *
    findDirectionScore(up) *
    findDirectionScore(down)
  );
}

let totalPart1 = 0;
let totalPart2 = 0;
for (let j = 0; j < grid.length; j++) {
  for (let i = 0; i < grid[j].length; i++) {
    if (isVisible(i, j)) {
      totalPart1++;
    }
    const sScore = scenicScore(i, j);
    if (sScore > totalPart2) {
      totalPart2 = sScore;
    }
  }
}

console.log(`Part 1: ${totalPart1}`);
console.log(`Part 2: ${totalPart2}`);

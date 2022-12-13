import { min, minBy } from "lodash";
import { parseFile } from "../util";

const START = "S";
const END = "E";
const LOWEST = "a";
const HIGHEST = "z";

interface Vertex {
  distance: number;
  previousVertex?: Vertex;
  id: string;
  value: string;
  x: number;
  y: number;
}

interface Result {
  visitedVertexes: string[];
  lastVertex?: Vertex;
}

/**
 * Adaptation of the Dijkstra algo to the specific problem
 */
class Grid {
  unvisitedCells = new Map<string, Vertex>();

  constructor(grid: string[], startCoordinates?: { x: number; y: number }) {
    const height = grid.length;
    const length = grid[0].length;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < length; x++) {
        const value = grid[y][x];
        const id = this.id(x, y);
        if (
          (!startCoordinates && value === START) ||
          (startCoordinates?.x === x && startCoordinates?.y === y)
        ) {
          this.unvisitedCells.set(id, { distance: 0, id, value, x, y });
        } else {
          this.unvisitedCells.set(id, {
            distance: Number.POSITIVE_INFINITY,
            id,
            value,
            x,
            y,
          });
        }
      }
    }
  }

  id(x: number, y: number) {
    return `${x}:${y}`;
  }

  minimumDistanceVertex() {
    return minBy([...this.unvisitedCells.values()], (cell) => cell.distance);
  }

  getCell(x: number, y: number) {
    return this.unvisitedCells.get(this.id(x, y));
  }

  isNeighbor(currentValue: string, nextValue: string) {
    const value =
      currentValue === START
        ? LOWEST
        : currentValue === END
        ? HIGHEST
        : currentValue;
    const followingValue =
      nextValue === START ? LOWEST : nextValue === END ? HIGHEST : nextValue;
    return value.charCodeAt(0) + 1 >= followingValue.charCodeAt(0);
  }

  getNeighbors(vertex: Vertex) {
    const { x, y, value } = vertex;
    const neighbors: Vertex[] = [];
    const candidates = [
      this.getCell(x, y - 1),
      this.getCell(x, y + 1),
      this.getCell(x - 1, y),
      this.getCell(x + 1, y),
    ];

    candidates.forEach((candidate) => {
      if (
        this.unvisitedCells.has(candidate?.id) &&
        this.isNeighbor(value, candidate.value)
      ) {
        neighbors.push(candidate);
      }
    });

    return neighbors.sort((a, b) => a.distance - b.distance);
  }

  findShortestPath(): Result {
    const visitedVertexes = [];
    while (this.unvisitedCells.size !== 0) {
      const currentVertex = this.minimumDistanceVertex();
      visitedVertexes.push(currentVertex.id);

      if (currentVertex.distance === Number.POSITIVE_INFINITY) {
        return { visitedVertexes };
      }

      this.unvisitedCells.delete(currentVertex.id);
      const neighbors = this.getNeighbors(currentVertex);

      for (const neighbor of neighbors) {
        const distance = currentVertex.distance + 1;
        if (distance < neighbor.distance) {
          neighbor.distance = distance;
          neighbor.previousVertex = currentVertex;
          if (neighbor.value === END) {
            return { lastVertex: neighbor, visitedVertexes };
          }
        }
      }
    }
  }
}

const grid = parseFile();
const dijkstra = new Grid(grid);
const shortestPath = dijkstra.findShortestPath();
console.log(`Part 1: ${shortestPath.lastVertex.distance}`);

const startingIndexes = new Set<string>();
const shortestPaths: number[] = [];

grid.forEach((line, index) =>
  line.split("").forEach((char, indexX) => {
    if (char === LOWEST) startingIndexes.add(`${indexX}:${index}`);
  })
);

// Try to optimize a little bit as to not repeat straight paths
while (startingIndexes.size !== 0) {
  const [index] = startingIndexes;
  const coords = index.split(":").map((i) => parseInt(i, 10));
  const result = new Grid(grid, {
    x: coords[0],
    y: coords[1],
  }).findShortestPath();

  if (result.lastVertex) {
    let vertex = result.lastVertex;
    let finalDistance = result.lastVertex.distance;
    while (vertex) {
      if (vertex.value === LOWEST) {
        startingIndexes.delete(vertex.id);
        shortestPaths.push(finalDistance - vertex.distance);
      }
      vertex = vertex.previousVertex;
    }
  } else {
    for (const visitedVertex of result.visitedVertexes) {
      if (startingIndexes.has(visitedVertex)) {
        startingIndexes.delete(visitedVertex);
      }
    }
  }
}

console.log(`Part 1: ${min(shortestPaths)}`);

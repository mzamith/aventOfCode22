import fs from 'fs';
import { max, maxBy, min, minBy } from 'lodash';

const SAND_START_X = 500;

function parse() {
  const input = fs
    .readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map((line) =>
      line.split(' -> ').map((coord) => {
        const xy = coord.split(',');
        return [parseInt(xy[0], 10), parseInt(xy[1], 10)] as [number, number];
      })
    );
  return input;
}

interface Object {
  x: number;
  y: number;
  id: string;
  type: 'sand' | 'rock';
}

class Cave {
  occupiedPositions = new Map<string, Object>();
  topPosition: Object = this.makeRock(SAND_START_X, Number.POSITIVE_INFINITY);
  topPositions = new Map<number, Object>();
  floorY: number;

  constructor(positions: [number, number][][]) {
    for (const rockLine of positions) {
      for (let i = 1; i < rockLine.length; i++) {
        this.drawRocks(rockLine, i);
      }
    }
  }

  setRockFloor(distance: number) {
    this.floorY = maxBy([...this.occupiedPositions.values()], (obj) => obj.y).y + distance;
  }

  private makeRock(x: number, y: number): Object {
    return { x, y, id: `${x}:${y}`, type: 'rock' };
  }

  private makeSand(x: number, y: number): Object {
    return { x, y, id: `${x}:${y}`, type: 'sand' };
  }

  calcSands() {
    return [...this.occupiedPositions.values()].filter((obj) => obj.type === 'sand').length;
  }

  private getFallPositionInColumn(x: number, y: number) {
    const lowestObject = minBy(
      [...this.occupiedPositions.values()].filter((obj) => obj.x === x && obj.y > y),
      (obj) => obj.y
    );

    return lowestObject ?? this.makeRock(x, this.floorY ?? Number.POSITIVE_INFINITY);
  }

  draw() {
    const maxX = maxBy([...this.occupiedPositions.values()], (obj) => obj.x).x;
    const maxY = maxBy([...this.occupiedPositions.values()], (obj) => obj.y).y;
    const minX = minBy([...this.occupiedPositions.values()], (obj) => obj.x).x;
    const minY = minBy([...this.occupiedPositions.values()], (obj) => obj.y).y;

    for (let i = minY; i <= maxY; i++) {
      let arr = '';
      for (let j = minX; j <= maxX; j++) {
        const id = `${j}:${i}`;
        const obj = this.occupiedPositions.get(id);
        arr += obj ? (obj.type === 'rock' ? '#' : 'O') : '.';
      }
      console.log(arr);
    }
  }

  drawRocks(rockLine: [number, number][], i: number) {
    const originX = rockLine[i - 1][0];
    const originY = rockLine[i - 1][1];
    const destinationX = rockLine[i][0];
    const destinationY = rockLine[i][1];

    const isVertical = originX === destinationX;
    const origin = isVertical ? originY : originX;
    const destination = isVertical ? destinationY : destinationX;
    const inf = min([origin, destination]);
    const sup = max([origin, destination]);

    for (let c = inf; c <= sup; c++) {
      const x = isVertical ? originX : c;
      const y = isVertical ? c : originY;
      const rock = this.makeRock(x, y);
      this.occupiedPositions.set(rock.id, rock);
      if (x === SAND_START_X && y < this.topPosition.y) {
        this.topPosition = rock;
      }
    }
  }

  private dropGrainOfSand(fallX: number, fallY: number) {
    const sand = this.makeSand(fallX, fallY);
    this.occupiedPositions.set(sand.id, sand);
    if (sand.x === SAND_START_X && sand.y < this.topPosition.y) {
      this.topPosition = sand;
    }
  }

  dropSandUntilAbyss(exitCriteria?: (x: number, y: number) => boolean) {
    let hitAbyss = false;
    let exited = false;
    while (!hitAbyss && !exited) {
      let fallY = this.topPosition.y - 1;
      let fallX = this.topPosition.x;
      let sandSettled = false;

      while (!sandSettled) {
        let next: Object;
        let dropped = false;
        const candidates = [fallX - 1, fallX + 1];

        for (const candidate of candidates) {
          next = this.getFallPositionInColumn(candidate, fallY);
          if (isFinite(next.y)) {
            if (next.y > fallY + 1) {
              fallY = next.y - 1;
              fallX = next.x;
              dropped = true;
              break;
            }
          } else {
            hitAbyss = true;
            sandSettled = true;
          }
        }

        if (!dropped && !hitAbyss) {
          this.dropGrainOfSand(fallX, fallY);
          sandSettled = true;

          exited = exitCriteria && exitCriteria(fallX, fallY);
        }
      }
    }
  }
}

const input = parse();
const grid = new Cave(input);
grid.dropSandUntilAbyss();
// grid.draw();
console.log(`Part 1: ${grid.calcSands()}`);
grid.setRockFloor(2);
grid.dropSandUntilAbyss((x, y) => x === 500 && y === 0);
// grid.draw();
console.log(`Part 2: ${grid.calcSands()}`);

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
        this.drawOccupiedPositions(rockLine, i);
      }
    }
    this.floorY = maxBy([...this.occupiedPositions.values()], (obj) => obj.y).y + 2;
    console.log(this.topPosition);
  }

  makeRock(x: number, y: number): Object {
    return { x, y, id: `${x}:${y}`, type: 'rock' };
  }

  makeSand(x: number, y: number): Object {
    return { x, y, id: `${x}:${y}`, type: 'sand' };
  }

  getFallPositionInColumn(x: number, y: number) {
    return minBy(
      [...this.occupiedPositions.values()].filter((obj) => obj.x === x && obj.y > y),
      (obj) => obj.y
    );
  }

  getFallPositionInColumnWithFloor(x: number, y: number) {
    const floor = this.getFallPositionInColumn(x, y);
    if (floor === undefined) {
      return this.makeRock(x, this.floorY);
    }
    return floor;
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

  drawOccupiedPositions(rockLine: [number, number][], i: number) {
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

  dropSand(iterations = Number.POSITIVE_INFINITY) {
    console.log(this.occupiedPositions);
    let hitAbyss = false;
    let isBlocked = false;
    let index = 0;
    let sands = 0;
    while (!hitAbyss && sands <= iterations) {
      let fallY = this.topPosition.y - 1;
      let fallX = this.topPosition.x;
      let wtv = false;

      console.log('');
      console.log('Dropping Sand on');
      console.log(fallX, fallY);

      while (!wtv) {
        const nextLeft = this.getFallPositionInColumn(fallX - 1, fallY);

        console.log('Next left is ', nextLeft);

        if (nextLeft === undefined) {
          hitAbyss = true;
          console.log(sands);
          wtv = true;
        } else if (nextLeft.y > fallY + 1) {
          fallY = nextLeft.y - 1;
          fallX = nextLeft.x;
        } else {
          const nextRight = this.getFallPositionInColumn(fallX + 1, fallY);
          console.log('Next right is ', nextRight);

          if (nextRight === undefined) {
            hitAbyss = true;
            console.log(sands);
            wtv = true;
          } else if (nextRight.y > fallY + 1) {
            fallY = nextRight.y - 1;
            fallX = nextRight.x;
          } else if (nextRight.y === fallY + 1) {
            wtv = true;
            const sand = this.makeSand(fallX, fallY);
            console.log('Adding Position', sand.x, sand.y);
            sands++;
            this.occupiedPositions.set(sand.id, sand);
            if (sand.x === SAND_START_X && sand.y < this.topPosition.y) {
              this.topPosition = sand;
            }
          }
        }

        if (fallX === 500 && fallY === 0) {
          isBlocked = true;
        }
        // console.log('Position for Sand is: ', fallX, fallY);
        // console.log('');

        // hitAbyss = true;
        // wtv = true;
      }
      index++;
    }
  }

  dropSand2(iterations = Number.POSITIVE_INFINITY) {
    // console.log(this.occupiedPositions);
    let hitAbyss = false;
    let isBlocked = false;
    let index = 0;
    let sands = 0;
    while (sands <= iterations && !isBlocked) {
      let fallY = this.topPosition.y - 1;
      let fallX = this.topPosition.x;
      let wtv = false;

      //console.log('');
      // console.log('Dropping Sand on');
      // console.log(fallX, fallY);

      while (!wtv) {
        const nextLeft = this.getFallPositionInColumnWithFloor(fallX - 1, fallY);

        // console.log('Next left is ', nextLeft);

        if (nextLeft === undefined) {
          hitAbyss = true;
          console.log(sands);
          wtv = true;
        } else if (nextLeft.y > fallY + 1) {
          fallY = nextLeft.y - 1;
          fallX = nextLeft.x;
        } else {
          const nextRight = this.getFallPositionInColumnWithFloor(fallX + 1, fallY);
          // console.log('Next right is ', nextRight);

          if (nextRight === undefined) {
            hitAbyss = true;
            console.log(sands);
            wtv = true;
          } else if (nextRight.y > fallY + 1) {
            fallY = nextRight.y - 1;
            fallX = nextRight.x;
          } else if (nextRight.y === fallY + 1) {
            wtv = true;
            const sand = this.makeSand(fallX, fallY);
            // console.log('Adding Position', sand.x, sand.y);
            sands++;
            this.occupiedPositions.set(sand.id, sand);
            if (sand.x === SAND_START_X && sand.y < this.topPosition.y) {
              this.topPosition = sand;
              console.log("Top Position changed to ", sand.y)
            }
            if (sands % 1000 === 0) {
                // this.draw()
            }
    
            if (fallX === 500 && fallY === 0) {
              console.log("Hey")
              console.log(sands);
              isBlocked = true;
            }
          }
        }


        // console.log('Position for Sand is: ', fallX, fallY);
        // console.log('');

        // hitAbyss = true;
        // wtv = true;
      }
      index++;
    }
  }
}

// Algo
// Sand Falls
// check Top
// while caput
// check available position -> check right, check left (....)

const input = parse();
const grid = new Cave(input);
grid.draw()
grid.dropSand2();
// grid.draw();

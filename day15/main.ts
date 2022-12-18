import fs from 'fs';


interface Coord {
  x: number;
  y: number;
}

function parse() {
  const reg = new RegExp(/\=((\d|-)*?)(\,|:|$)/g);
  const input = fs.readFileSync('./input.txt', 'utf8').split('\n');
  return input.map((line) => [...line.matchAll(reg)].map((res) => parseInt(res[1], 10)));
}

class SensorGrid {
  sensorBeacon = new Map<Coord, Coord>();
  beacons = new Set<string>();

  constructor(coordsArr: number[][]) {
    coordsArr.forEach((coord) => {
      const beacon = { x: coord[2], y: coord[3] };
      const sensor = { x: coord[0], y: coord[1] };
      this.beacons.add(JSON.stringify(beacon));
      this.sensorBeacon.set(sensor, beacon);
    });
  }

  manhattan(coordA: Coord, coordB: Coord) {
    return Math.abs(coordA.x - coordB.x) + Math.abs(coordA.y - coordB.y);
  }

  minimumX() {
    return [...this.sensorBeacon.entries()].reduce((prev, sensor) => {
      const mnh = this.manhattan(sensor[0], sensor[1]);
      return prev < sensor[0].x - mnh ? prev : sensor[0].x - mnh;
    }, Number.POSITIVE_INFINITY);
  }

  maximumX() {
    return [...this.sensorBeacon.entries()].reduce((prev, sensor) => {
      const mnh = this.manhattan(sensor[0], sensor[1]);
      return prev > sensor[0].x + mnh ? prev : sensor[0].x + mnh;
    }, Number.NEGATIVE_INFINITY);
  }

  cantHaveBeacon(x: number, y: number) {
    return [...this.sensorBeacon.entries()].some((sensorB) => {
      const shortestMnh = this.manhattan(sensorB[0], sensorB[1]);
      return shortestMnh >= this.manhattan(sensorB[0], { x, y });
    });
  }

  hasBeacon(x: number, y: number) {
    return this.beacons.has(JSON.stringify({ x, y }));
  }

  getPlacesWithoutBeacon(y: number) {
    const [minX, maxX] = [this.minimumX(), this.maximumX()];
    let count = 0;
    for (let i = minX; i < maxX; i++) {
      if (this.cantHaveBeacon(i, y) && !this.hasBeacon(i, y)) {
        count++;
      }
    }
    return count;
  }

  checkSensorCircumference(sensor: Coord, beacon: Coord, infLimit: number, supLimit: number) {
    const distance = this.manhattan(sensor, beacon) + 1;

    for (let i = distance; i >= 0; i--) {
      // find points outside diamond in four quadrants
      const q1 = { x: sensor.x + i, y: sensor.y + distance - i };
      const q2 = { x: sensor.x + i, y: sensor.y - distance + i };
      const q3 = { x: sensor.x - i, y: sensor.y - distance + i };
      const q4 = { x: sensor.x - i, y: sensor.y + distance - i };

      const candidate = [q1, q2, q3, q4].find((q) => {
        const inRange = q.x >= infLimit && q.y >= infLimit && q.x <= supLimit && q.y <= supLimit;

        if (inRange) {
          return !this.cantHaveBeacon(q.x, q.y);
        }
        return false;
      });

      if (candidate) {
        return candidate;
      }
    }
  }

  findHiddenBeacon(infLimit: number, supLimit: number) {
    for (const entry of [...this.sensorBeacon.entries()]) {
      const couldItBe = this.checkSensorCircumference(entry[0], entry[1], infLimit, supLimit);
      if (couldItBe) {
        return couldItBe;
      }
    }
  }
}

const input = parse();
const grid = new SensorGrid(input);
console.log(`Part 1: ${grid.getPlacesWithoutBeacon(2000000)}`);
const answer2 = grid.findHiddenBeacon(0, 4000000);
console.log(`Part 2: ${answer2.x * 4000000 + answer2.y}`);

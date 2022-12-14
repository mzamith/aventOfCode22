import { parseFile } from '../util';

type Ranges = [
  number, // lower limit first range
  number, // higher limit first range
  number, // lower limit second range
  number // higher limit second range
];

function parseInput() {
  return parseFile().map((stringPair) => stringPair.split(/[-,]+/).map((str) => parseInt(str, 10))) as Ranges[]; // split by , or - to get all ranges
}

function contains(pair: Ranges) {
  const firstRangeContains = pair[0] <= pair[2] && pair[1] >= pair[3];
  const secondRangeContains = pair[2] <= pair[0] && pair[3] >= pair[1];

  return firstRangeContains || secondRangeContains;
}

function overlaps(pair: Ranges) {
  return !(pair[1] < pair[2] || pair[0] > pair[3]);
}

const ranges = parseInput();
const totalPart1 = ranges.filter((range) => contains(range)).length;
const totalPart2 = ranges.filter((range) => overlaps(range)).length;

console.log(`Part 1: ${totalPart1}`);
console.log(`Part 2: ${totalPart2}`);

import fs from 'fs';
import { first, sum } from 'lodash';

function parseFile() {
  const input = fs.readFileSync('./input.txt', 'utf-8');
  return input.split('\n\n').map((eachElf) => sum(eachElf.split('\n').map((calories) => parseInt(calories, 10))));
}

const calArray = parseFile();
const sorted = calArray.sort((a, b) => b - a);

const answerPart1 = first(sorted);
const answerPart2 = sum(sorted.slice(0, 3));

console.log(`Part 1: ${answerPart1}`);
console.log(`Part 2: ${answerPart2}`);

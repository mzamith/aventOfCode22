import { first } from 'lodash';
import { parseFile } from '../util';

function groupRucksacks(input: string[], num: number): string[][] {
  return input.reduce(function (result, value, index, array) {
    if (index % num === 0) {
      result.push(array.slice(index, index + num));
    }
    return result;
  }, []);
}

function letterScore(letter: string) {
  const lowercase = letter.toLowerCase();
  const isUppercase = lowercase !== letter;
  const lowercaseScore = lowercase.charCodeAt(0) - 96;
  const score = isUppercase ? lowercaseScore + 26 : lowercaseScore;
  return score;
}

function findCommonLetter(...sections: string[]) {
  for (const letter of first(sections)) {
    if (sections.every((section) => section.includes(letter))) {
      return letter;
    }
  }
}

function getRucksackScore(rucksack: string) {
  const totalItems = rucksack.length;
  const itemsEach = Math.round(rucksack.length / 2);
  const [sectionOne, sectionTwo] = [rucksack.slice(0, itemsEach), rucksack.slice(itemsEach, totalItems)];

  const commonLetter = findCommonLetter(sectionOne, sectionTwo);
  return letterScore(commonLetter);
}

function getMultipleRucksackScore(...rucksacks: string[]) {
  const commonLetter = findCommonLetter(...rucksacks);
  return letterScore(commonLetter);
}

const input = parseFile();
const totalPart1 = input.reduce((prev, rucksack) => prev + getRucksackScore(rucksack), 0);

const grouped = groupRucksacks(input, 3);

const totalPart2 = grouped.reduce((prev, rucksack) => prev + getMultipleRucksackScore(...rucksack), 0);

console.log(`Part 1: ${totalPart1}`);
console.log(`Part 2: ${totalPart2}`);

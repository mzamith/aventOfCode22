import fs from "fs";
import { flatMap, isArray, zip } from "lodash";

function parse() {
  const input = fs
    .readFileSync("./input.txt", "utf-8")
    .split("\n\n")
    .map((pair) => pair.split("\n").map((packet) => JSON.parse(packet)));
  return input as [any[], any[]][];
}

function comparePackets(packets: [any[], any[]]): 1 | -1 | 0 {
  for (const [firstValue, secondValue] of zip(packets[0], packets[1])) {
    if (firstValue === undefined && secondValue !== undefined) return 1;
    if (secondValue === undefined && firstValue !== undefined) return -1;

    if (firstValue !== secondValue) {
      if (
        !isArray(firstValue) &&
        !isArray(secondValue) &&
        firstValue !== secondValue
      ) {
        return firstValue < secondValue ? 1 : -1;
      } else {
        const newFirst = isArray(firstValue) ? firstValue : [firstValue];
        const newSecond = isArray(secondValue) ? secondValue : [secondValue];
        const comparison = comparePackets([newFirst, newSecond]);
        if (comparison !== 0) {
          return comparison;
        }
      }
    }
  }
  return 0;
}

const packets = parse();
const answer1 = packets.reduce((prev, packet, index) => {
  const comparison = comparePackets(packet);
  if (comparison > 0) {
    return prev + index + 1;
  }
  return prev;
}, 0);

const specialPackets = [[[2]], [[6]]] as any[];
const allPackets = [...flatMap(packets), ...specialPackets];
const sorted = allPackets
  .sort((a, b) => comparePackets([b, a]))
  .map((pck) => JSON.stringify(pck));
const answer2 = specialPackets.reduce(
  (prev, packet) => prev * (sorted.indexOf(JSON.stringify(packet)) + 1),
  1
);

console.log(`Part1: ${answer1}`);
console.log(`Part2: ${answer2}`);

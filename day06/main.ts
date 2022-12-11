import fs from "fs";

const packet = fs.readFileSync("./input.txt", "utf-8");

function findDifferentPackets(windowSize: number) {
  for (let i = 0; i < packet.length - windowSize + 1; i++) {
    const window = packet.substring(i, i + windowSize);
    const isDifferent =
      new Set<string>(window.split("")).size === window.length;

    if (isDifferent) {
      return i + windowSize;
    }
  }
}

console.log(`Part 1: ${findDifferentPackets(4)}`);
console.log(`Part 2: ${findDifferentPackets(14)}`);

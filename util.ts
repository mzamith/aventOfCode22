import fs from "fs";

export function parseFile(path: string = "./input.txt") {
  const input = fs.readFileSync(path, "utf-8").split("\n");
  return input;
}


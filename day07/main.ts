import { first, last, sum } from "lodash";
import { parseFile } from "../util";

export interface Node {
  type: "dir" | "file";
  name: string;
}

export class FileNode implements Node {
  type: "file";

  constructor(public name: string, public size: number) {
    this.type = "file";
  }
}

export class DirNode implements Node {
  type: "dir";
  children: Node[];

  constructor(public name: string) {
    this.children = [];
    this.type = "dir";
  }
}

export function parseTree() {
  const inputs = parseFile();
  const inputCommandRegExp = new RegExp(/^\$ ([a-z]{2})\s?(.*)$/);
  const nodeNamesRegExp = new RegExp(/(\d+) (.+)/);
  let directoryStack: DirNode[] = [];

  for (const terminalLine of inputs) {
    const currentParentDirectory = last(directoryStack);
    const [, command, arg] = inputCommandRegExp.exec(terminalLine) ?? [];

    if (command === "cd") {
      if (arg === "..") {
        directoryStack.pop();
      } else {
        const newDirNode = new DirNode(arg);
        directoryStack.push(newDirNode);

        if (currentParentDirectory) {
          currentParentDirectory.children.push(newDirNode);
        }
      }
    } else {
      const [, size, filename] = nodeNamesRegExp.exec(terminalLine) ?? [];

      if (size && filename && currentParentDirectory) {
        const newFileNode = new FileNode(filename, parseInt(size, 10));
        currentParentDirectory.children.push(newFileNode);
      }
    }
  }

  return first(directoryStack);
}

function sizes(root: Node) {
  const sizes: number[] = []; // an array of directory sizes. doesn't matter which dir has which size
  const findSize = (node: Node) => {
    if (node.type === "dir") {
      const dirNode = node as DirNode;
      const dirSize = dirNode.children.reduce(
        (prev, child) => prev + findSize(child),
        0
      );

      sizes.push(dirSize);
      return dirSize;
    }
    return (node as FileNode).size;
  };

  findSize(root);
  return sizes;
}

const tree = parseTree();
const sizesArr = sizes(tree);

const smallSizes = sum(sizesArr.filter((size) => size < 100000)); // Question 1
const sortedSizes = sizesArr.sort((a, b) => b - a);
const outermostDir = sortedSizes.find(
  (size) => size > 30000000 - (70000000 - last(sortedSizes))
); // question 2

console.log(`Part 1: ${smallSizes}`);
console.log(`Part 2: ${outermostDir}`);

import fs from 'fs';
import { last } from 'lodash';

export interface Monkey {
  number: number;
  items: number[];
  operation: {
    operator: '*' | '+' | '-' | '/';
    value: number | 'old';
  };
  test: {
    divisibleBy: number;
    ifTrue: number;
    ifFalse: number;
  };
  inspections: number;
}

export function parseMonkeys() {
  const monkeys: Monkey[] = [];

  const digitRegexp = new RegExp(/(\d+)/g);
  const operatorRegexp = new RegExp(/(\+|\-|\/|\*)/g);
  const monkeyLines = fs.readFileSync('./input.txt', 'utf-8').split('\n\n'); // one line per Monkey

  for (const monkeyLine of monkeyLines) {
    const infos = monkeyLine.split('\n');
    const number = parseInt(infos[0].match(digitRegexp)[0]);
    const items = infos[1].match(digitRegexp).map((item) => parseInt(item, 10));
    const operator = infos[2].match(operatorRegexp)[0] as '*' | '+' | '-' | '/';
    const valueOrOld = last(infos[2].split(' '));
    const value = valueOrOld === 'old' ? valueOrOld : parseInt(valueOrOld, 10);
    const divisibleBy = parseInt(infos[3].match(digitRegexp)[0]);
    const ifTrue = parseInt(infos[4].match(digitRegexp)[0]);
    const ifFalse = parseInt(infos[5].match(digitRegexp)[0]);

    monkeys.push({
      number,
      items,
      operation: { operator, value },
      test: { divisibleBy, ifTrue, ifFalse },
      inspections: 0
    });
  }
  return monkeys;
}

export function calcWorry(monkey: Monkey, item: number) {
  const operationValue = monkey.operation.value === 'old' ? item : monkey.operation.value;
  switch (monkey.operation.operator) {
    case '*':
      return item * operationValue;
    case '+':
      return item + operationValue;
    case '-':
      return item - operationValue;
    case '/':
      return item / operationValue;
  }
}

export function nextMonkey(monkey: Monkey, item: number) {
  return item % monkey.test.divisibleBy === 0 ? monkey.test.ifTrue : monkey.test.ifFalse;
}

function monkeyBusiness(monkey: Monkey, reallyWorried = false) {
  while (monkey.items.length) {
    const item = monkey.items.shift();
    const baseWorry = calcWorry(monkey, item);
    let worryLevel = 0;
    if (!reallyWorried) {
      worryLevel = Math.floor(baseWorry / 3);
    } else {
      worryLevel = baseWorry % superMod;
    }

    const nextMonkeyIndex = nextMonkey(monkey, worryLevel);
    monkeys[nextMonkeyIndex].items.push(worryLevel);
    monkey.inspections++;
  }
}

function traverseRounds(rounds: number, reallyWorried = false) {
  for (let i = 0; i < rounds; i++) {
    for (const monkey of monkeys) {
      monkeyBusiness(monkey, reallyWorried);
    }
  }
  return monkeys.map((monk) => monk.inspections).sort((a, b) => b - a);
}

let monkeys = parseMonkeys();

const totalPart1 = traverseRounds(20);
console.log(`Part 1: ${totalPart1[0] * totalPart1[1]}`);

monkeys = parseMonkeys();
const superMod = monkeys.reduce((prev, monk) => prev * monk.test.divisibleBy, 1);

const totalPart2 = traverseRounds(10000, true);
console.log(`Part 2: ${totalPart2[0] * totalPart2[1]}`);

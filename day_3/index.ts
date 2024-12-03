import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

const testInstruction = "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";
let realData: string = '';
let result = 0;

try {
	realData = readFileSync('./puzzle.txt', 'utf-8');
} catch (err) {
	console.error(err);
	exit(1);
}

// Regex for finding the pattern mul(:bumberBetween1And999:,:bumberBetween1And999:) or do() or don't()
const searchRegex = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g;
const allMatches = realData.match(searchRegex) || [];

const getNumbersFromMul = (value: string): [number, number] => {
	const numberString = value
		.slice(value.indexOf('(') + 1, value.indexOf(')'))
		.split(',')
		.map(Number);

	if (numberString.length !== 2) {
		console.error('Invalid amount of numbers');
		exit(1);
	}

	return [numberString[0], numberString[1]];
};

let shouldAdd = true;
for (const match of allMatches) {
	if (shouldAdd && match.startsWith('mul')) {
		const [num1, num2] = getNumbersFromMul(match);
		result += num1 * num2;

		continue;
	}

	if (match === "don't()") shouldAdd = false;
	if (match === 'do()') shouldAdd = true;
}

console.log(result);

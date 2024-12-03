import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

let realData: string;
try {
	realData = readFileSync('./puzzle.txt', 'utf-8');
} catch (err) {
	console.error(err);
	exit(1);
}

const testInstruction = 'xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))';

// Regex for finding the pattern mul(:bumberBetween1And999:,:bumberBetween1And999:)
const searchRegex = /mul\(\d{1,3},\d{1,3}\)/g;
const allMatches = realData.match(searchRegex) || [];
let result = 0;

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

for (const match of allMatches) {
	const [num1, num2] = getNumbersFromMul(match);
	result += num1 * num2;
}

console.log(result);

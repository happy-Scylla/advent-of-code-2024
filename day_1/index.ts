import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

const leftList: number[] = [];
const rightList: number[] = [];

try {
	const file = readFileSync('./location_ids.txt', 'utf-8');
	const lines = file.split('\n');

	for (const line of lines) {
		const [left, right] = line.split('   ');
		leftList.push(Number.parseInt(left));
		rightList.push(Number.parseInt(right));
	}

	if (leftList.length !== rightList.length) {
		throw new Error('Lists must be the same length');
	}
} catch (err) {
	console.error(err);
	exit(1);
}

const getTotalDistance = (leftList: number[], rightList: number[]): number => {
	leftList.sort((a, b) => a - b);
	rightList.sort((a, b) => a - b);

	let totalDistance = 0;
	for (let i = 0; i < leftList.length; i++) {
		const diff = Math.abs(rightList[i] - leftList[i]);
		totalDistance += Math.abs(diff);
	}

	return totalDistance;
};

const countOfOccurences = (list: number[], numberToCount: number): number => {
	return list.reduce((acc, curr) => (curr === numberToCount ? acc + 1 : acc), 0);
};

const getSimilarityScore = (leftList: number[], rightList: number[]): number => {
	let similarityScore = 0;
	for (const leftNumber of leftList) {
		similarityScore += leftNumber * countOfOccurences(rightList, leftNumber);
	}

	return similarityScore;
};

console.log(`total distance: ${getTotalDistance(leftList, rightList)}`);
console.log(`similarity score: ${getSimilarityScore(leftList, rightList)}`);

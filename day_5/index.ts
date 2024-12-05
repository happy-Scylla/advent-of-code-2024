import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

const readUpdates = (path: string): number[][] => {
	try {
		const lines = readFileSync(path, 'utf-8').split('\n');

		return lines.map((line) => line.split(',').map(Number));
	} catch (err) {
		console.error(`could not read file ${path}`);
		exit(1);
	}
};

type RulesType = Map<number, Set<number>>;

/**
 * creates a map with the following structure:
 * key: a number included in the rules
 * value: a set of numbers that cannot be included after the key number
 */
const readRules = (path: string): RulesType => {
	try {
		const lines = readFileSync(path, 'utf-8').split('\n');
		const lookupMap = new Map<number, Set<number>>();

		for (const line of lines) {
			const [firstValues, secondValue] = line.split('|').map(Number || 0);

			if (lookupMap.has(secondValue)) {
				const setValues = lookupMap.get(secondValue) as Set<number>;
				setValues.add(firstValues);
				lookupMap.set(secondValue, setValues);
			} else {
				lookupMap.set(secondValue, new Set([firstValues]));
			}
		}

		return lookupMap;
	} catch (err) {
		console.error(`could not read file ${path}`);
		exit(1);
	}
};

const checkIfUpdatesIsCorrect = (
	updates: number[][],
	rules: RulesType
): { correctUpdates: number[][]; incorrectUpdates: number[][] } => {
	const correctUpdates: number[][] = [];
	const incorrectUpdates: number[][] = [];

	for (const update of updates) {
		let pushToCorrectUpdates = true;

		for (let i = 0; i < update.length - 1; i++) {
			const isCurrentNumberWrong = update.some((pos, posIndex) => i < posIndex && rules.get(update[i])?.has(pos));

			if (isCurrentNumberWrong) {
				pushToCorrectUpdates = false;
				break;
			}
		}

		pushToCorrectUpdates ? correctUpdates.push(update) : incorrectUpdates.push(update);
	}

	return { correctUpdates, incorrectUpdates };
};

const modifyIncorrectUpdate = (updates: number[][], rules: RulesType): number[][] => {
	for (const update of updates) {
		const checkIfRulesForIndexIncludePos = (index: number, pos: number) => (rules.get(index)?.has(pos) ? 1 : -1);
		update.sort(checkIfRulesForIndexIncludePos);
	}

	return updates;
};

const getMiddlePageSum = (updates: number[][]): number => {
	let sum = 0;
	for (const update of updates) {
		if (update.length % 2 === 0) {
			// console.error(`update <${update}> length is not odd`);
			continue;
		}

		const middleIndx = Math.floor(update.length / 2);
		sum += update[middleIndx] || 0; // return 0 if number is NaN
	}

	return sum;
};

const updates = readUpdates('./real_updates.txt');
const rules = readRules('./real_rules.txt');
const { correctUpdates, incorrectUpdates } = checkIfUpdatesIsCorrect(updates, rules);
const modifiedUpdates = modifyIncorrectUpdate(incorrectUpdates, rules);

console.log(getMiddlePageSum(correctUpdates));
console.log(getMiddlePageSum(modifiedUpdates));

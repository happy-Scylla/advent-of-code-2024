import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

const realData: number[][] = [];
try {
	const file = readFileSync('./all_reports.txt', 'utf-8');
	const lines = file.split('\n');

	for (const line of lines) {
		const report = line.split(' ');
		realData.push(report.map((element) => Number.parseInt(element)));
	}
} catch (err) {
	console.error(err);
	exit(1);
}

const testData: number[][] = [
	[7, 6, 4, 2, 1],
	[1, 2, 7, 8, 9],
	[9, 7, 6, 2, 1],
	[1, 3, 2, 4, 5],
	[8, 6, 4, 4, 1],
	[1, 3, 6, 7, 9],
];

const getTotalSumOfSafeReports = (data: number[][]): [number, number] => {
	let safe = 0;
	let safeAfterSkip = 0;

	for (const row of data) {
		let isGood = false;

		for (let i = 0; i < row.length; i++) {
			// check if row is good if we slice one of the elements, if yes --> break
			const rowButSkippedIndex = [...row.slice(0, i), ...row.slice(i + 1)];

			if (isSafe(rowButSkippedIndex)) {
				isGood = true;
				break;
			}
		}

		if (isSafe(row)) safe++;
		if (isSafe(row) || isGood) safeAfterSkip++;
	}

	return [safe, safeAfterSkip];
};

const isSafe = (report: number[]): boolean => {
	const diff: number[] = [];

	// get diff of index and adjancent
	for (let i = 1; i < report.length; i++) {
		diff.push(report[i] - report[i - 1]);
	}

	const isIncreasing = diff.every((element) => element >= 1 && element <= 3);
	const isDecreasing = diff.every((element) => element <= -1 && element >= -3);

	return isIncreasing || isDecreasing;
};

// old solution, only worked for part one
const getIsSafeReport = (report: number[]): boolean => {
	const firstElement = report.at(0);
	const secondElement = report.at(1);

	if (firstElement == null || firstElement === secondElement) return false;
	if (secondElement == null) return true;

	const shouldBeAscending = secondElement > firstElement;

	let index = 0;
	for (const element of report) {
		if (index === report.length - 1) continue;

		let isInRange = true;
		if (shouldBeAscending) {
			isInRange = report[index + 1] >= element + 1 && report[index + 1] <= element + 3;
		} else {
			isInRange = report[index + 1] <= element - 1 && report[index + 1] >= element - 3;
		}

		if (!isInRange) return false;
		index++;
	}

	return true;
};

const [safe, safeAfterSkip] = getTotalSumOfSafeReports(realData);
console.log(`total safe reports: ${safe}`);
console.log(`total safe reports (with skipping): ${safeAfterSkip}`);

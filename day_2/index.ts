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

const getTotalSumOfSafeReports = (data: number[][]): number => {
	let countOfSafeReports = 0;
	for (const row of data) {
		if (getIsSafeReport(row)) countOfSafeReports++;
	}

	return countOfSafeReports;
};

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

console.log(`total safe reports: ${getTotalSumOfSafeReports(realData)}`);

import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

const searchWord = 'XMAS';
const testRiddle: string =
	'MMMSXXMASM,MSAMXMSMSA,AMXSXMAAMM,MSAMASMSMX,XMASAMXAMM,XXAMMXXAMA,SMSMSASXSS,SAXAMASAAA,MAMMMXMMMM,MXMXAXMASX';

let realData: string;

try {
	realData = readFileSync('./my_riddle.txt', 'utf-8').split('\n').join(',');
} catch (err) {
	console.error(err);
	exit(1);
}

const solveRiddle = (riddle: string): number => {
	const riddle2dArray = riddle.split(',').map((row) => row.split(''));

	let count = 0;
	let indexRow = 0;
	for (const row of riddle2dArray) {
		let indexCell = 0;

		for (const cell of row) {
			if (cell === 'X') {
				count += checkAllDirections(riddle2dArray, indexRow, indexCell);
			}
			indexCell++;
		}
		indexRow++;
	}

	return count;
};

const checkAllDirections = (riddle: string[][], indexRow: number, indexCol: number): number => {
	return (
		checkHorizontal(riddle[indexRow], indexCol) +
		checkVertical(riddle, indexRow, indexCol) +
		checkDiagonal(riddle, indexRow, indexCol)
	);
};

const checkHorizontal = (row: string[], index: number): number => {
	const lenthRow = row.length;
	let subString = '';
	let countOfHits = 0;

	if (index + 3 <= lenthRow) {
		subString = row.slice(index, index + 4).join('');

		if (subString === searchWord) countOfHits++;
	}

	if (index - 3 >= 0) {
		subString = row
			.slice(index - 3, index + 1)
			.reverse()
			.join('');

		if (subString === searchWord) countOfHits++;
	}

	return countOfHits++;
};

const checkVertical = (riddle: string[][], indexRow: number, indexCol: number): number => {
	const numberOfRows = riddle.length;
	let countOfHits = 0;

	if (indexRow + 4 <= numberOfRows) {
		let subString = '';
		for (let i = 0; i < 4; i++) {
			subString += riddle[indexRow + i][indexCol];
		}

		if (subString === searchWord) countOfHits++;
	}

	if (indexRow - 3 >= 0) {
		let subString = '';
		for (let j = 0; j < 4; j++) {
			subString += riddle[indexRow - j][indexCol];
		}

		if (subString === searchWord) countOfHits++;
	}

	return countOfHits;
};

const checkDiagonal = (riddle: string[][], indexRow: number, indexCol: number): number => {
	const numberOfRows = riddle.length;
	let countOfHits = 0;

	if (indexRow + 4 <= numberOfRows) {
		let subString = '';
		for (let i = 0; i < 4; i++) {
			subString += riddle[indexRow + i][indexCol + i];
		}

		if (subString === searchWord) countOfHits++;

		subString = '';
		for (let i = 0; i < 4; i++) {
			subString += riddle[indexRow + i][indexCol - i];
		}

		if (subString === searchWord) countOfHits++;
	}

	if (indexRow - 3 >= 0) {
		let subString = '';
		for (let i = 0; i < 4; i++) {
			subString += riddle[indexRow - i][indexCol + i];
		}

		if (subString === searchWord) countOfHits++;

		subString = '';
		for (let i = 0; i < 4; i++) {
			subString += riddle[indexRow - i][indexCol - i];
		}

		if (subString === searchWord) countOfHits++;
	}

	return countOfHits;
};

console.log(solveRiddle(realData));

import { readFileSync } from 'node:fs';

const readMap = (path: string): number[][] => {
	const lines = readFileSync(path, 'utf-8').split('\n');
	return lines.map((line) => line.split('').map(Number));
};

const map = readMap('./real_map.txt');

type PositionValue = { x: number; y: number; value: number };
const findAllZeroes = (map: number[][]): PositionValue[] => {
	const zeroes: PositionValue[] = [];
	map.forEach((line, y) => {
		line.forEach((value, x) => {
			if (value === 0) {
				zeroes.push({ x, y, value });
			}
		});
	});

	return zeroes;
};

const findNextField = (
	map: number[][],
	currentPos: PositionValue,
	addHit: (currentPos: PositionValue) => void
): void => {
	const { value } = currentPos;
	if (value === 9) {
		addHit(currentPos);
		return;
	}

	for (const nextPos of checkAdjacentFields(currentPos, map)) {
		findNextField(map, nextPos, addHit);
	}
};

const checkIsInBounds = (x: number, y: number, map: number[][]): boolean => {
	return x >= 0 && y >= 0 && y < map.length && x < map[y].length;
};

const checkAdjacentFields = (pos: PositionValue, map: number[][]): PositionValue[] => {
	const possibleNextMoves: PositionValue[] = [];
	const { x, y, value } = pos;

	const allDirections: Array<{ x: number; y: number }> = [
		{ x, y: y - 1 },
		{ x: x + 1, y },
		{ x, y: y + 1 },
		{ x: x - 1, y },
	];
	for (const direction of allDirections) {
		const { x, y } = direction;
		if (checkIsInBounds(x, y, map) && map[y][x] === value + 1) possibleNextMoves.push({ x, y, value: value + 1 });
	}

	return possibleNextMoves;
};

const solvePart1 = (map: number[][]): number => {
	const allZeroes = findAllZeroes(map);
	let count = 0;
	for (const trailhead of allZeroes) {
		let hits = 0;
		const endOfTrails = new Set<string>();
		const addHit = (currentPos: PositionValue) => {
			const posAsString = `${currentPos.x}:${currentPos.y}:${currentPos.value}`;
			if (!endOfTrails.has(posAsString)) {
				endOfTrails.add(posAsString);
				hits++;
				count++;
			}
		};

		findNextField(map, trailhead, addHit);
	}

	return count;
};

const solvePart2 = (map: number[][]): number => {
	const allZeroes = findAllZeroes(map);
	let count = 0;
	for (const trailhead of allZeroes) {
		let hits = 0;
		const addHit = () => {
			hits++;
			count++;
		};

		findNextField(map, trailhead, addHit);
	}

	return count;
};

console.log('part 1: ', solvePart1(map));
console.log('part 2: ', solvePart2(map));

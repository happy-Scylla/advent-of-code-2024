import { readFileSync } from 'node:fs';

const getRealInput = (): string[] => {
	const lines = readFileSync('./real_map.txt', 'utf-8');
	return lines.split('\n');
};

const testInput = [
	'....#.....',
	'.........#',
	'..........',
	'..#.......',
	'.......#..',
	'..........',
	'.#..^.....',
	'........#.',
	'#.........',
	'......#...',
];

type MapPosition = { x: number; y: number };
type WalkingDirection = 'up' | 'right' | 'down' | 'left';

const transformedTestInput = testInput.map((row) => row.split(''));
const transformedRealInput = getRealInput().map((row) => row.split(''));

const init = (input: string[][]): { obstacleMap: Map<number, Set<number>>; initialGuardPos: MapPosition } => {
	const obstacleMap = new Map<number, Set<number>>();
	let initialGuardPos: MapPosition = { x: 0, y: 0 };
	let rowIndex = 0;

	for (const row of input) {
		row.forEach((cell, index) => {
			if (cell === '.') return;

			if (cell === '^') {
				initialGuardPos = { x: index, y: rowIndex };

				return;
			}

			if (!obstacleMap.has(rowIndex)) {
				obstacleMap.set(rowIndex, new Set());
			}
			obstacleMap.get(rowIndex)?.add(index);
		});

		rowIndex++;
	}

	return { obstacleMap, initialGuardPos };
};

const getNextPosition = (currentPos: MapPosition, walkingDirection: WalkingDirection): MapPosition => {
	const { x, y } = currentPos;

	switch (walkingDirection) {
		case 'up':
			return { x, y: y - 1 };
		case 'right':
			return { x: x + 1, y };
		case 'down':
			return { x, y: y + 1 };
		case 'left':
			return { x: x - 1, y };
	}
};

const isNextPosInsideMap = (nextPos: MapPosition, input: string[][]): boolean => {
	const { x, y } = nextPos;

	if (y < 0 || y >= input.length) return false;
	if (x < 0 || x >= input[0].length) return false;

	return true;
};

const setNewWalkingDirection = (currentWalkingDirection: WalkingDirection): WalkingDirection => {
	switch (currentWalkingDirection) {
		case 'up':
			return 'right';
		case 'right':
			return 'down';
		case 'down':
			return 'left';
		case 'left':
			return 'up';
	}
};

const walk = (input: string[][]): number => {
	const { initialGuardPos, obstacleMap } = init(input);
	let currentGuardPos = { ...initialGuardPos };

	const visitedFields = new Set<string>([`${currentGuardPos.x},${currentGuardPos.y}`]);
	let amountOfVisitedFields = 1;
	let isGuardInside = true;
	let walkingDirection: WalkingDirection = 'up';

	while (isGuardInside) {
		const nextPos = getNextPosition(currentGuardPos, walkingDirection);
		if (!isNextPosInsideMap(nextPos, input)) {
			isGuardInside = false;
			break;
		}

		const isObstacle = obstacleMap.get(nextPos.y)?.has(nextPos.x) ?? false;
		if (isObstacle) {
			walkingDirection = setNewWalkingDirection(walkingDirection);
		} else {
			currentGuardPos = nextPos;
			if (!visitedFields.has(`${currentGuardPos.x},${currentGuardPos.y}`)) {
				amountOfVisitedFields++;
				visitedFields.add(`${currentGuardPos.x},${currentGuardPos.y}`);
			}
		}
	}

	return amountOfVisitedFields;
};

console.log('Amount of visited fields: ', walk(transformedRealInput));

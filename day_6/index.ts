import { readFileSync } from 'node:fs';

type MapPosition = { x: number; y: number };
type WalkingDirection = 'up' | 'right' | 'down' | 'left';

const getInput = (path: string): string[][] => {
	const content = readFileSync(path, 'utf-8');
	const lines = content.split('\n');

	return lines.map((line) => line.split(''));
};

const initGuardPos = (input: string[][]): MapPosition => {
	let initialGuardPos: MapPosition = { x: 0, y: 0 };

	input.forEach((row, rowIndex) => {
		row.forEach((cell, cellIndex) => {
			if (cell === '^') {
				initialGuardPos = { x: cellIndex, y: rowIndex };
			}
		});
	});

	return initialGuardPos;
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

const rotateWalkingDirection = (currentWalkingDirection: WalkingDirection): WalkingDirection => {
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

const addObstacle = (input: string[][], position: MapPosition) => {
	const inputClone = input.map((row) => row.slice());
	inputClone[position.y][position.x] = '#';

	return inputClone;
};

const walk = (input: string[][]): { visitedFields: Map<string, WalkingDirection>; isInfiniteLoop: boolean } => {
	let currentGuardPos = initGuardPos(input);

	let walkingDirection: WalkingDirection = 'up';
	const visitedFields = new Map<string, WalkingDirection>().set(
		`${currentGuardPos.x},${currentGuardPos.y}`,
		walkingDirection
	);

	let continueWaling = true;
	let isInfiniteLoop = false;

	while (continueWaling) {
		const nextPos = getNextPosition(currentGuardPos, walkingDirection);
		if (!isNextPosInsideMap(nextPos, input)) {
			continueWaling = false;
			continue;
		}

		const isObstacle = input[nextPos.y][nextPos.x] === '#';
		if (isObstacle) {
			walkingDirection = rotateWalkingDirection(walkingDirection);
			continue;
		}

		if (visitedFields.get(`${nextPos.x},${nextPos.y}`) === walkingDirection) {
			isInfiniteLoop = true;
			continueWaling = false;
			continue;
		}

		currentGuardPos = nextPos;
		if (!visitedFields.has(`${nextPos.x},${nextPos.y}`)) {
			visitedFields.set(`${nextPos.x},${nextPos.y}`, walkingDirection);
		}
	}

	return { visitedFields, isInfiniteLoop };
};

const countLoops = (input: string[][], visitedFields: Map<string, WalkingDirection>): number => {
	let amountOfLoops = 0;

	for (const key of visitedFields.keys()) {
		const [x, y] = key.split(',').map(Number);

		const newInput = addObstacle(input, { x, y });
		if (walk(newInput).isInfiniteLoop) {
			amountOfLoops++;
		}
	}

	return amountOfLoops;
};

const result = walk(getInput('./real_map.txt'));

console.log('Amount of visited fields: ', result.visitedFields.size);
console.log('Amount of infinite loops: ', countLoops(getInput('./real_map.txt'), result.visitedFields));

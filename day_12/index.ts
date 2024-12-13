import { readFileSync } from 'node:fs';

const getMap = (path: string): string[][] => {
	const lines = readFileSync(path, 'utf-8').split('\n');
	return lines.map((line) => line.split(''));
};

type Position = { x: number; y: number };

const getNeighbours = (pos: Position): Position[] => {
	return [
		{ x: pos.x - 1, y: pos.y },
		{ x: pos.x + 1, y: pos.y },
		{ x: pos.x, y: pos.y - 1 },
		{ x: pos.x, y: pos.y + 1 },
	];
};

const isInMap = (pos: Position, map: string[][]): boolean => {
	return pos.x >= 0 && pos.y >= 0 && pos.x < map[0].length && pos.y < map.length;
};

const getPositionFromString = (str: string): Position => {
	const [x, y] = str.split(',').map(Number);
	if (Number.isNaN(x) || Number.isNaN(y)) throw new Error('Invalid position');

	return { x, y };
};

const makeGroup = (pos: Position, map: string[][], fieldSet: Set<string>): { pos: Position; edges: number }[] => {
	if (!fieldSet.delete(`${pos.x},${pos.y}`)) return [];

	let edges = 0;
	const rest: { pos: Position; edges: number }[] = [];
	for (const neighbour of getNeighbours(pos)) {
		if (!isInMap(neighbour, map) || map[neighbour.y][neighbour.x] !== map[pos.y][pos.x]) {
			edges++;
			continue;
		}

		rest.push(...makeGroup(neighbour, map, fieldSet));
	}

	return [{ pos, edges }, ...rest];
};

const solveTaskOne = (path: string): void => {
	const fieldSet = new Set<string>();
	const map = getMap(path);

	map.forEach((row, y) => {
		row.forEach((_, x) => {
			fieldSet.add(`${x},${y}`);
		});
	});

	const allFieldsToVisit = fieldSet.values();
	const groups: { pos: Position; edges: number }[][] = [];

	while (true) {
		const field = allFieldsToVisit.next();
		if (field.done) break;

		const pos = getPositionFromString(field.value);
		groups.push(makeGroup(pos, map, fieldSet));
	}

	const areas = groups.map((group) => group.length);
	const perimeters = groups.map((group) => group.reduce((acc, curr) => acc + curr.edges, 0));
	const totalSum = areas.reduce((acc, curr, idx) => acc + curr * perimeters[idx], 0);

	console.log('Task One: ', totalSum);
};

solveTaskOne('./real_map.txt');

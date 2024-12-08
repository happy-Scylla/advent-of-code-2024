import { readFileSync } from 'node:fs';

const readMap = (path: string): string[][] => {
	const lines = readFileSync(path, 'utf-8').split('\n');
	return lines.map((line) => line.split(''));
};

type Position = { x: number; y: number };

const getAllAntennas = (map: string[][]): Map<string, Position[]> => {
	const antennaMap = new Map<string, Position[]>();
	map.forEach((row, rowIndex) => {
		row.forEach((cell, cellIndex) => {
			if (cell === '.') return;

			if (!antennaMap.has(cell)) {
				antennaMap.set(cell, [{ x: cellIndex, y: rowIndex }]);
				return;
			}

			const positions = antennaMap.get(cell);
			if (positions == null) throw new Error('Array should not be empty');
			positions.push({ x: cellIndex, y: rowIndex });
			antennaMap.set(cell, positions);
		});
	});

	return antennaMap;
};

const isInBounds = (map: string[][], pos: Position): boolean => {
	if (pos.x < 0 || pos.x >= map[0].length) return false;
	if (pos.y < 0 || pos.y >= map.length) return false;

	return true;
};

const getAntinodes = (map: string[][], antenna: Map<string, Position[]>): Set<string> => {
	const antinodes = new Set<string>();
	for (const [_key, value] of antenna) {
		for (let i = 0; i < value.length; i++) {
			const removeCurrentPos = value.filter((_, index) => index !== i);
			antinodes.add(`${value[i].x}:${value[i].y}`);

			for (const antenna of removeCurrentPos) {
				const diff = { x: antenna.x - value[i].x, y: antenna.y - value[i].y };
				let addAnotherAntinode = true;
				let prevPosition = { x: antenna.x, y: antenna.y };

				while (addAnotherAntinode) {
					const antinodePos = { x: prevPosition.x + diff.x, y: prevPosition.y + diff.y };

					if (!isInBounds(map, antinodePos)) {
						addAnotherAntinode = false;
						continue;
					}

					antinodes.add(`${antinodePos.x}:${antinodePos.y}`);
					prevPosition = antinodePos;
				}
			}
		}
	}

	return antinodes;
};

const map = readMap('./real_map.txt');
const antennas = getAllAntennas(map);
const antinodes = getAntinodes(map, antennas);

console.log('antinode: ', antinodes);
console.log('antinode number: ', antinodes.size);

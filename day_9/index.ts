import { readFileSync } from 'node:fs';

const readInput = (path: string): string[] => {
	const line = readFileSync(path, 'utf-8');
	return line.split('');
};

const createSchmea = (input: string[]): string[] => {
	const schema = [];
	let currentId = 0;

	for (let i = 0; i < input.length; i++) {
		const cell = Number(input[i]);
		const isOdd = i % 2 === 0;

		for (let j = 0; j < cell; j++) {
			schema.push(isOdd ? currentId.toString() : '.');
		}

		if (isOdd) currentId++;
	}

	return schema;
};

const moveSingleFile = (schema: string[]): string[] => {
	const lastElement = schema.reduce((largest, current) => (current > largest ? current : largest), schema[0]);
	let indexOfLastNumber = schema.lastIndexOf(lastElement);

	schema.forEach((cell, index) => {
		if (cell !== '.' || index > indexOfLastNumber) return;
		[schema[index], schema[indexOfLastNumber]] = [schema[indexOfLastNumber], schema[index]];

		indexOfLastNumber--;
		while (schema[indexOfLastNumber] === '.') {
			indexOfLastNumber--;
		}
	});

	return schema;
};

// code is relly slow with real data and a bit messy, but I reached my daily timelimit for each riddle

const moveWholeBlock = (schema: string[]): string[] => {
	let lastElement = schema.reduce((largest, current) => {
		if (current === '.') return largest;
		return current > largest ? current : largest;
	}, schema[0]);

	for (let i = 0; i < schema.length; i++) {
		if (Number(lastElement) < 0) {
			i = schema.length; // break did not work somehow
			continue;
		}

		if (i === schema.length - 1) {
			i = 0;
			lastElement = String(Number(lastElement) - 1);
			continue;
		}

		if (schema[i] !== '.') continue;

		const { firstIndexOfGroup, lastIndexOfGroup, lengthGroup } = getIndicesAndLengthOfGroup(schema, lastElement);
		if (i >= firstIndexOfGroup) {
			i = 0;
			lastElement = String(Number(lastElement) - 1);
			console.log('element: ', lastElement);
			continue;
		}

		const sectionToCheckForFit = [...schema.slice(i, i + lengthGroup)];
		if (
			!sectionToCheckForFit.every((value) => value === '.') ||
			sectionToCheckForFit.length < lengthGroup ||
			i > firstIndexOfGroup
		) {
			continue;
		}

		let switchIndex = i;
		for (let j = firstIndexOfGroup; j <= lastIndexOfGroup; j++) {
			[schema[j], schema[switchIndex]] = [schema[switchIndex], schema[j]];
			switchIndex++;
		}

		lastElement = String(Number(lastElement) - 1);
		if (lastElement === '-1') {
			i = schema.length; // break did not work somehow
			continue;
		}

		i = 0; // restart loop with new element
	}

	return schema;
};

const getIndicesAndLengthOfGroup = (schema: string[], element: string) => {
	const lastIndexOfGroup = schema.lastIndexOf(element);
	const firstIndexOfGroup = schema.indexOf(element);
	const lengthGroup = lastIndexOfGroup - firstIndexOfGroup + 1;

	return { lastIndexOfGroup, firstIndexOfGroup, lengthGroup };
};

const getCheckSum = (schema: string[]): number => {
	let checkSum = 0;
	schema.forEach((cell, index) => {
		if (cell === '.') return;
		checkSum += Number(cell) * index;
	});

	return checkSum;
};

const schema = createSchmea(readInput('./real_input.txt'));
const sortedSchema = moveWholeBlock(schema);
console.log('schema: ', sortedSchema.join(''));
console.log(getCheckSum(sortedSchema));

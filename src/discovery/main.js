const getLabel = (x, y) => {
	const X_AXIS_LABEL_PARTS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	const Y_AXIS_LABEL_PARTS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

	return `${X_AXIS_LABEL_PARTS[x]}${Y_AXIS_LABEL_PARTS[y]}`;
};

const SIZE = 8;

const POSSIBLE_KNIGHT_MOVES = [
	{ x: -2, y: -1 },
	{ x: -2, y: 1 },
	{ x: -1, y: -2 },
	{ x: -1, y: 2 },
	{ x: 1, y: -2 },
	{ x: 1, y: 2 },
	{ x: 2, y: -1 },
	{ x: 2, y: 1 },
];

// create a 2D array to represent the chess board
const board = [...Array(SIZE)].map(() => Array(SIZE).fill(null));

console.log(board);

const calculateKnightPath = (startX = 0, startY = 0, board) => {
	// we output the path as an array of {x,y,label} objects
	const path = [];
	// add initial position to path
	// path.push({ x: startX, y: startY, label: getLabel(startX, startY) });
	path.push({ x: startX, y: startY });
	board[startX][startY] = 0; // index of the first move

	let iterationCount = 0;

	// console.log(path);
	// console.log(board);

	// brute force approach
	const isValidMove = (position, board) => {
		// check if the move is out of boundries of the board
		if (position.x < 0 || position.x > board.length || position.y < 0 || position.y > board[0].length) {
			return false;
			// check if this square was already visited
		} else if (board[position.x]?.[position.y] !== null) {
			return false;
		} else {
			return true;
		}
	};

	const calculateNumberOfValidMoves = (position, board) => {
		let count = 0;
		for (let i = 0; i < POSSIBLE_KNIGHT_MOVES.length; i++) {
			const possibleMove = POSSIBLE_KNIGHT_MOVES[i];
			const newX = position.x + possibleMove.x;
			const newY = position.y + possibleMove.y;

			const newPosition = { x: newX, y: newY };

			if (isValidMove(newPosition, board)) {
				count++;
			}
		}
		return count;
	};

	const calculateNextMove = (board, path) => {
		iterationCount++;
		// console.log('new iteration', path, board)
		// if the path array length === number of squares on the board
		if (path.length === board.length * board[0].length) {
			// add labels to the path positions
			path.forEach((position) => (position.label = getLabel(position.x, position.y)));
			console.log('Total iterations:', iterationCount);
			// console.log('solution found!', path);
			// console.log('board', board);
			return { board, path };
		}
		const currentPosition = path[path.length - 1];

		// iterate through each possible move and determine valid moves
		// for (let i = 0; i < POSSIBLE_KNIGHT_MOVES.length; i++) {
		// 	const possibleMove = POSSIBLE_KNIGHT_MOVES[i];
		// 	const newX = currentPosition.x + possibleMove.x;
		// 	const newY = currentPosition.y + possibleMove.y;

		// 	const newPosition = { x: newX, y: newY };

		// 	if (isValidMove(newPosition, board)) {
		// 		board[newPosition.x][newPosition.y] = path.length;
		// 		const result = calculateNextMove(board, [...path, newPosition]);

		// 		if (result) {
		// 			return result;
		// 		} else {
		// 			board[newPosition.x][newPosition.y] = null;
		// 		}
		// 	}
		// }

		// lets try warnsdorf's rule with Squirrel and Cull tie breaking method
		// https://blogs.asarkar.com/assets/docs/algorithms-curated/Warnsdorff-Rule%20Algorithm%20-%20Squirrel+Cull.pdf

		let candidateMoves = [];

		for (let i = 0; i < POSSIBLE_KNIGHT_MOVES.length; i++) {
			const possibleMove = POSSIBLE_KNIGHT_MOVES[i];
			const newX = currentPosition.x + possibleMove.x;
			const newY = currentPosition.y + possibleMove.y;

			const newPosition = { x: newX, y: newY };

			if (isValidMove(newPosition, board)) {
				const countOfValidMovesFromNewPosition = calculateNumberOfValidMoves(newPosition, board);
				candidateMoves.push({ move: newPosition, count: countOfValidMovesFromNewPosition });
			}
		}

		// sort the moves by the number of valid moves
		candidateMoves.sort((a, b) => a.count - b.count);

		for (let i = 0; i < candidateMoves.length; i++) {
			const move = candidateMoves[i].move;

			board[move.x][move.y] = path.length;
			const result = calculateNextMove(board, [...path, move]);

			if (result) {
				return result;
			} else {
				board[move.x][move.y] = null;
			}
		}

		return null;
	};

	let solution = calculateNextMove(board, path);
	if (!solution) {
		console.log('No solution found');
	}
	return solution;
};

console.log(calculateKnightPath(3, 5, board));

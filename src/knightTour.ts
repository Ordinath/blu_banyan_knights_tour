import { Board, Position } from './types';

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

const getLabel = (x: number, y: number, board: Board) => {
    const letter = String.fromCharCode(65 + x);
    const number = board[0].length - y;
    return `${letter}${number}`;
};

export const calculateKnightPath = (startX = 0, startY = 0, width: number, height: number, closedTour: boolean) => {
    console.log('Calculating knight path from:', startX, startY, 'on board:', width, height);
    const board = [...Array(width)].map(() => Array(height).fill(null));
    const path = [];
    // add initial position to path
    // path.push({ x: startX, y: startY, label: getLabel(startX, startY) });
    path.push({ x: startX, y: startY });
    board[startX][startY] = 0; // index of the first move

    let iterationCount = 0;

    // console.log(path);
    // console.log(board);

    // brute force approach
    const isValidMove = (position: Position, board: Board) => {
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

    const calculateNumberOfValidMoves = (position: Position, board: Board) => {
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

    const calculateNextMove = (board: Board, path: Position[]): { board: Board; path: Position[] } | null => {
        iterationCount++;
        // console.log('new iteration', path, board)
        if (iterationCount % 1000000 === 0) {
            console.log('iteration:', iterationCount);
        }
        if (iterationCount > 100000000) {
            return null;
        }
        // if the path array length === number of squares on the board
        if (path.length === board.length * board[0].length) {
            // add labels to the path positions
            path.forEach((position) => (position.label = getLabel(position.x, position.y, board)));
            // console.log('Total iterations:', iterationCount);
            // console.log('solution found!', path);
            // console.log('board', board);
            if (closedTour) {
                // check if the last move can move to the initial position
                const lastPosition = path[path.length - 1];
                const firstPosition = path[0];
                for (let i = 0; i < POSSIBLE_KNIGHT_MOVES.length; i++) {
                    const possibleMove = POSSIBLE_KNIGHT_MOVES[i];
                    const newX = lastPosition.x + possibleMove.x;
                    const newY = lastPosition.y + possibleMove.y;

                    const newPosition = { x: newX, y: newY };

                    if (newPosition.x === firstPosition.x && newPosition.y === firstPosition.y) {
                        path.push(newPosition);
                        return { board, path };
                    }
                }
                return null;
            } else {
                return { board, path };
            }
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

        if (candidateMoves.length !== 0) {
            // sort the moves by the number of valid moves
            candidateMoves.sort((a, b) => a.count - b.count);
            // identify the candidates with the same smallest number of valid moves and shuffle them randomly at the beginning of the array for lulz
            const smallestCount = candidateMoves[0].count;
            let movesWithSmallestCount = candidateMoves.filter((move) => move.count === smallestCount);
            movesWithSmallestCount = movesWithSmallestCount.sort(() => Math.random() - 0.5);
            candidateMoves = movesWithSmallestCount.concat(candidateMoves.filter((move) => move.count !== smallestCount));
        }

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

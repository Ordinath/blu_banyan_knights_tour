import { Algorithm, Chessboard, KnightTourConfig, KnightTourOutput, Move, Position, TieBreakMethod } from './types';

/* 
https://blogs.asarkar.com/assets/docs/algorithms-curated/Warnsdorff-Rule%20Algorithm%20-%20Squirrel+Cull.pdf

squirrel+cull order of moves
+---+---+---+---+---+
|   | 8 |   | 1 |   |
+---+---+---+---+---+
| 7 |   |   |   | 2 |
+---+---+---+---+---+
|   |   | X |   |   |
+---+---+---+---+---+
| 6 |   |   |   | 3 |
+---+---+---+---+---+
|   | 5 |   | 4 |   |
+---+---+---+---+---+

move orderings by squirrel+cull
12345678,
21345678,
31245678,
13245678,
23145678,
32145678,
42135678,
24135678,
14235678,
41235678,
21435678, 
12435678, 
13425678, 
31425678,
41325678, 
14325678, 
34125678, 
43125678, 
43215678

additional interesting reads:
http://dagstuhl.sunsite.rwth-aachen.de/volltexte/2020/12765/pdf/LIPIcs-FUN-2021-4.pdf
https://sites.science.oregonstate.edu/math_reu/proceedings/REU_Proceedings/Proceedings2004/2004Ganzfried.pdf
*/

const POSSIBLE_KNIGHT_MOVES: Move[] = [
    { x: 1, y: -2, order: 1 },
    { x: 2, y: -1, order: 2 },
    { x: 2, y: 1, order: 3 },
    { x: 1, y: 2, order: 4 },
    { x: -1, y: -2, order: 5 },
    { x: -2, y: -1, order: 6 },
    { x: -2, y: 1, order: 7 },
    { x: -1, y: 2, order: 8 },
];

export class KnightTour {
    startX: number;
    startY: number;
    chessboard: Chessboard;
    center: { x: number; y: number };
    algorithm: Algorithm;
    tieBreakMethod: TieBreakMethod;
    iterationLimit: number;
    attemptLimit: number;
    closedTour: boolean;
    moveOrdering: number[];
    iterationCount: number;
    totalIterationCount: number;
    attemptCount: number;
    knightMoves: Move[];
    solution: KnightTourOutput | null;
    error: string;

    constructor(config: KnightTourConfig) {
        this.startX = config.startX;
        this.startY = config.startY;
        this.chessboard = config.chessboard;
        this.center = { x: config.chessboard.width / 2, y: config.chessboard.height / 2 };
        this.iterationLimit = config.iterationLimit;
        this.attemptLimit = config.attemptLimit;
        this.closedTour = config.closedTour;
        this.algorithm = config.algorithm;
        this.tieBreakMethod = config.tieBreakMethod;
        this.moveOrdering = config.moveOrdering.toString().split('').map(Number);
        this.iterationCount = 0;
        this.totalIterationCount = 0;
        this.attemptCount = 0;
        this.knightMoves = POSSIBLE_KNIGHT_MOVES;
        this.solution = null;
        this.error = '';

        // console.log(config);
    }

    private isValidMove(position: Position): boolean {
        // check if the move is out of boundries of the board
        if (position.x < 0 || position.x > this.chessboard.board.length || position.y < 0 || position.y > this.chessboard.board[0].length) {
            return false;
            // check if this square was already visited
        } else if (this.chessboard.board[position.x]?.[position.y] !== null) {
            return false;
        } else {
            return true;
        }
    }

    private calculateDegree = (position: Position) => {
        let count = 0;
        for (let i = 0; i < this.knightMoves.length; i++) {
            const possibleMove = this.knightMoves[i];
            const newX = position.x + possibleMove.x;
            const newY = position.y + possibleMove.y;

            const newPosition = { x: newX, y: newY, move: possibleMove };

            if (this.isValidMove(newPosition)) {
                count++;
            }
        }
        return count;
    };

    private async calculateNextMove(path: Position[]): Promise<Position[] | null> {
        if (this.iterationCount > this.iterationLimit) {
            return null;
        }

        this.iterationCount++;

        // base case - if the path array length === number of squares on the board
        if (path.length === this.chessboard.width * this.chessboard.height) {
            // if closed tour option is selected, check if the last move can move to the initial position
            if (this.closedTour) {
                // check if the last move can move to the initial position
                const lastPosition = path[path.length - 1];
                const firstPosition = path[0];
                for (let i = 0; i < this.knightMoves.length; i++) {
                    const possibleMove = this.knightMoves[i];
                    const newX = lastPosition.x + possibleMove.x;
                    const newY = lastPosition.y + possibleMove.y;

                    const newPosition = { x: newX, y: newY, move: possibleMove };

                    if (newPosition.x === firstPosition.x && newPosition.y === firstPosition.y) {
                        path.push(newPosition);
                        return path;
                    }
                }
                return null;
            } else {
                return path;
            }
        }

        const currentPosition = path[path.length - 1];

        // potential refactor later
        if (this.algorithm === Algorithm.BRUTEFORCE) {
            for (let i = 0; i < this.knightMoves.length; i++) {
                const possibleMove = this.knightMoves[i];
                const newX = currentPosition.x + possibleMove.x;
                const newY = currentPosition.y + possibleMove.y;

                const newPosition = { x: newX, y: newY, move: possibleMove };

                if (this.isValidMove(newPosition)) {
                    this.chessboard.board[newPosition.x][newPosition.y] = path.length;
                    const result = await this.calculateNextMove([...path, newPosition]);

                    if (result) {
                        return result;
                    }

                    this.chessboard.board[newPosition.x][newPosition.y] = null;
                }
            }
            return null;
        }

        if (this.algorithm === Algorithm.MOVE_ORDERING) {
            for (let i = 0; i < this.moveOrdering.length; i++) {
                const currentMoveOrder = this.moveOrdering[i];
                const possibleMove = this.knightMoves.find((move) => move.order === currentMoveOrder);
                if (!possibleMove) {
                    continue;
                }
                const newX = currentPosition.x + possibleMove.x;
                const newY = currentPosition.y + possibleMove.y;

                const newPosition = { x: newX, y: newY, move: possibleMove };

                if (this.isValidMove(newPosition)) {
                    this.chessboard.board[newPosition.x][newPosition.y] = path.length;
                    const result = await this.calculateNextMove([...path, newPosition]);

                    if (result) {
                        return result;
                    }

                    this.chessboard.board[newPosition.x][newPosition.y] = null;
                }
            }

            return null;
        }

        if (this.algorithm === Algorithm.WARNSDORF) {
            // identify candidate moves
            let candidateMoves: { newPosition: Position; degree: number }[] = [];
            // get the number of valid moves for each candidate move per Warnsdorff's Rule
            for (let i = 0; i < this.knightMoves.length; i++) {
                const possibleMove = this.knightMoves[i];
                const newX = currentPosition.x + possibleMove.x;
                const newY = currentPosition.y + possibleMove.y;

                const newPosition = { x: newX, y: newY, move: possibleMove };

                if (this.isValidMove(newPosition)) {
                    const newPositionDegree = this.calculateDegree(newPosition);
                    candidateMoves.push({ newPosition, degree: newPositionDegree });
                }
            }

            if (candidateMoves.length !== 0) {
                // sort the moves by the number of valid moves
                candidateMoves.sort((a, b) => a.degree - b.degree);
                const smallestDegree = candidateMoves[0].degree;
                let movesWithSmallestDegree = candidateMoves.filter((move) => move.degree === smallestDegree);

                // tie breaking methods

                if (this.tieBreakMethod === TieBreakMethod.FIRST || this.tieBreakMethod === TieBreakMethod.MOVE_ORDERING) {
                    // do nothing, tie breaking is done by default ordering 12345678
                    // move ordering tie break

                    if (movesWithSmallestDegree.length > 1) {
                        movesWithSmallestDegree = movesWithSmallestDegree.sort((a, b) => {
                            if (this.tieBreakMethod === TieBreakMethod.MOVE_ORDERING) {
                                let orderA = this.moveOrdering.indexOf(a.newPosition.move!.order);
                                let orderB = this.moveOrdering.indexOf(b.newPosition.move!.order);
                                return orderA - orderB;
                            } else if (this.tieBreakMethod === TieBreakMethod.FIRST) {
                                let orderA = [1, 2, 3, 4, 5, 6, 7, 8].indexOf(a.newPosition.move!.order);
                                let orderB = [1, 2, 3, 4, 5, 6, 7, 8].indexOf(b.newPosition.move!.order);
                                return orderA - orderB;
                            }
                            return 0;
                        });
                        candidateMoves = movesWithSmallestDegree.concat(candidateMoves.filter((move) => move.degree !== smallestDegree));
                    }
                }

                if (this.tieBreakMethod === TieBreakMethod.RANDOM) {
                    // identify the candidates with the same smallest number of valid moves
                    // and shuffle them randomly at the beginning of the array for lulz
                    if (movesWithSmallestDegree.length > 1) {
                        movesWithSmallestDegree = movesWithSmallestDegree.sort(() => Math.random() - 0.5);
                        candidateMoves = movesWithSmallestDegree.concat(candidateMoves.filter((move) => move.degree !== smallestDegree));
                    }
                }

                if (this.tieBreakMethod === TieBreakMethod.POHL) {
                    // Pohl's Tie-Breaking Rule - https://dl.acm.org/doi/pdf/10.1145/363427.363463
                    // we dive one level deeper and calculate the number of valid moves from the next move
                    // for each candidate move with the smallest number of valid moves (degree)
                    if (movesWithSmallestDegree.length > 1) {
                        for (let i = 0; i < movesWithSmallestDegree.length; i++) {
                            // update the board with the new move
                            this.chessboard.board[movesWithSmallestDegree[i].newPosition.x][movesWithSmallestDegree[i].newPosition.y] = path.length + 1;

                            for (let j = 0; j < this.knightMoves.length; j++) {
                                const possibleMove = this.knightMoves[j];
                                const newX = movesWithSmallestDegree[i].newPosition.x + possibleMove.x;
                                const newY = movesWithSmallestDegree[i].newPosition.y + possibleMove.y;

                                const move = { x: newX, y: newY, move: possibleMove };

                                if (this.isValidMove(move)) {
                                    // decrease the degree of the move
                                    movesWithSmallestDegree[i].degree--;
                                }
                            }

                            // remove the move from the board
                            this.chessboard.board[movesWithSmallestDegree[i].newPosition.x][movesWithSmallestDegree[i].newPosition.y] = null;
                        }

                        movesWithSmallestDegree.sort((a, b) => {
                            let result = a.degree - b.degree;
                            // if the number of valid moves is still equal, we randomize
                            if (result === 0) {
                                return Math.random() - 0.5;
                            } else {
                                return result;
                            }
                        });

                        candidateMoves = movesWithSmallestDegree.concat(candidateMoves.filter((move) => move.degree !== smallestDegree));
                    }
                }

                if (this.tieBreakMethod === TieBreakMethod.FURTHEST_FROM_CENTER || this.tieBreakMethod === TieBreakMethod.CLOSEST_TO_CENTER) {
                    // furthest - Roth rule - https://www.wolframcloud.com/objects/nbarch/2018/10/2018-10-10r6l3m/Knight.nb
                    // furthest or closest from the center
                    if (movesWithSmallestDegree.length > 1) {
                        movesWithSmallestDegree = movesWithSmallestDegree.sort((a, b) => {
                            // no need to square root for comparison
                            let distanceA = (a.newPosition.x - this.center.x) ** 2 + (a.newPosition.y - this.center.y) ** 2;
                            let distanceB = (b.newPosition.x - this.center.x) ** 2 + (b.newPosition.y - this.center.y) ** 2;
                            console.log('this.center', this.center);

                            console.log('a.newPosition', a.newPosition);
                            console.log('b.newPosition', b.newPosition);
                            
                            console.log('(a.newPosition.x - this.center.x)', a.newPosition.x - this.center.x);
                            console.log('(a.newPosition.x - this.center.x) ** 2', (b.newPosition.x - this.center.x) ** 2);
                            console.log('(a.newPosition.y - this.center.y)', a.newPosition.y - this.center.y);
                            console.log('(a.newPosition.y - this.center.y) ** 2', (b.newPosition.y - this.center.y) ** 2);

                            console.log('(b.newPosition.x - this.center.x)', b.newPosition.x - this.center.x);
                            console.log('(b.newPosition.x - this.center.x) ** 2', (b.newPosition.x - this.center.x) ** 2);
                            console.log('(b.newPosition.y - this.center.y)', b.newPosition.y - this.center.y);
                            console.log('(b.newPosition.y - this.center.y) ** 2', (b.newPosition.y - this.center.y) ** 2);


                            console.log('distanceA', distanceA);
                            console.log('distanceB', distanceB);

                            let result =
                                this.tieBreakMethod === TieBreakMethod.FURTHEST_FROM_CENTER
                                    ? distanceB - distanceA // For furthest from center, sort descending
                                    : distanceA - distanceB; // For closest to center, sort ascending

                            // if distance is equal, we randomize
                            if (result === 0) {
                                return Math.random() - 0.5;
                            } else {
                                return result;
                            }
                        });
                        candidateMoves = movesWithSmallestDegree.concat(candidateMoves.filter((move) => move.degree !== smallestDegree));
                    }
                }
            }

            for (let i = 0; i < candidateMoves.length; i++) {
                const newPosition = candidateMoves[i].newPosition;

                this.chessboard.board[newPosition.x][newPosition.y] = path.length;
                const result = await this.calculateNextMove([...path, newPosition]);

                if (result) {
                    return result;
                } else {
                    this.chessboard.board[newPosition.x][newPosition.y] = null;
                }
            }

            return null;
        }

        return null;
    }

    async solveKnightTour(): Promise<KnightTourOutput> {
        // handle proved edge cases with no solutions
        if ((this.chessboard.width * this.chessboard.height) % 2 !== 0 && (this.startX + this.startY) % 2 !== 0) {
            return { chessboard: null, path: null, success: false, message: 'No solutions for odd board size and black square start position' };
        }

        if (this.closedTour && (this.chessboard.width * this.chessboard.height) % 2 !== 0) {
            return { chessboard: null, path: null, success: false, message: 'No solutions for odd board size and closed tour option' };
        }

        // initialize
        const board = this.chessboard.board;
        const path: Position[] = [];

        path.push({ x: this.startX, y: this.startY, move: null }); // add initial position to path array
        board[this.startX][this.startY] = 0; // index of the first move

        let solutionPath: Position[] | null = null;
        this.totalIterationCount = 0;

        for (this.attemptCount = 0; this.attemptCount < this.attemptLimit; this.attemptCount++) {
            this.iterationCount = 0;
            solutionPath = await this.calculateNextMove(path);

            this.totalIterationCount += this.iterationCount;

            if (solutionPath) {
                return {
                    chessboard: this.chessboard,
                    path: solutionPath,
                    success: true,
                    message: `Tour completed in ${this.iterationCount} iterations on attempt ${this.attemptCount + 1}. Total iterations: ${
                        this.totalIterationCount
                    }.`,
                };
            }
        }

        return {
            chessboard: this.chessboard,
            path: null,
            success: false,
            message: `No solution found after ${this.attemptCount} attempts. Total iterations: ${this.totalIterationCount}.`,
        };
    }
}

export type Position = {
    x: number;
    y: number;
    label?: string;
    move: Move | null;
};

export type Move = {
    x: number;
    y: number;
    order: number;
};

export type Board = (number | null)[][];

export class Chessboard {
    width: number;
    height: number;
    board: Board;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.board = [...Array(width)].map(() => Array(height).fill(null));
    }
}

export type KnightTourConfig = {
    startX: number;
    startY: number;
    chessboard: Chessboard;
    iterationLimit: number;
    attemptLimit: number;
    closedTour: boolean;
    algorithm: Algorithm;
    tieBreakMethod: TieBreakMethod;
    moveOrdering: number;
};

export type KnightTourOutput = {
    chessboard: Chessboard | null;
    path: Position[] | null;
    success?: boolean;
    message: string;
};

export type BaseCell = {
    type: CellType;
    cellSize: number;
};

export type EmptyCell = BaseCell & {
    type: CellType.EMPTY;
};

export type LabelCell = BaseCell & {
    type: CellType.LABEL;
    label: string;
};

export type ChessSquareCell = BaseCell & {
    type: CellType.CHESS_SQUARE;
    x: number;
    y: number;
    cellValue: number | null;
    onClick: (x: number, y: number) => void;
    showLabel: boolean;
};

export enum Algorithm {
    BRUTEFORCE = 'bruteforce',
    WARNSDORF = 'warnsdorf',
    MOVE_ORDERING = 'move_ordering',
}

export enum TieBreakMethod {
    FIRST = 'first',
    RANDOM = 'random',
    POHL = 'pohl',
    CLOSEST_TO_CENTER = 'closest_to_center',
    FURTHEST_FROM_CENTER = 'furthest_from_center',
    MOVE_ORDERING = 'move_ordering',
}

export enum CellType {
    EMPTY = 'empty',
    LABEL = 'label',
    CHESS_SQUARE = 'chess_square',
}

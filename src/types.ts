export type Position = {
    x: number;
    y: number;
    label?: string;
};

export type Move = {
    x: number;
    y: number;
    order: number;
};

export type Board = (number | null)[][];

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

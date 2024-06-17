import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import { calculateKnightPath } from '../knightTour';
import { Algorithm, Position, TieBreakMethod, Chessboard, EmptyCell, LabelCell, ChessSquareCell, CellType } from '../types';
import ChessboardRow from './ChessboardRow';

// Chessboard interface
interface ChessboardComponentProps {
    width: number;
    height: number;
    opacity: number;
    showLabel: boolean;
    squareSize: number;
    iterationLimit: number;
    attemptLimit: number;
    closedTour: boolean;
    algorithm: Algorithm;
    tieBreakMethod: TieBreakMethod;
    moveOrdering: number;
}

const ChessboardComponent: React.FC<ChessboardComponentProps> = ({
    width,
    height,
    opacity,
    showLabel,
    squareSize,
    iterationLimit,
    attemptLimit,
    closedTour,
    algorithm,
    tieBreakMethod,
    moveOrdering,
}) => {
    const [chessboard, setChessboard] = useState<Chessboard>(new Chessboard(width, height));
    const [path, setPath] = useState<Position[]>([]);

    useEffect(() => {
        setChessboard(new Chessboard(width, height));
        setPath([]);
    }, [width, height]);

    const handleCellClick = useCallback(
        async (x: number, y: number) => {
            console.log('Clicked cell:', x, y);

            const startX = x;
            const startY = y;

            // const knightPathResult = await calculateKnightPath(
            //     startX,
            //     startY,
            //     width,
            //     height,
            //     iterationLimit,
            //     attemptLimit,
            //     closedTour,
            //     algorithm,
            //     tieBreakMethod,
            //     moveOrdering
            // );

            // console.log('Knight Path Result:', knightPathResult);

            // if (knightPathResult) {
            //     setBoard(knightPathResult.board);
            //     knightPathResult.path.forEach((position) => (position.label = getLabel(position.x, position.y, board)));
            //     setPath(knightPathResult.path);
            // } else {
            //     setBoard([...Array(width)].map(() => Array(height).fill(null)));
            //     setPath([]);
            //     alert('No solution found from this position.');
            // }
        },
        [width, height, iterationLimit, attemptLimit, closedTour, algorithm, tieBreakMethod, moveOrdering, chessboard]
    );

    const getAlphabetLabel = (index: number) => String.fromCharCode(65 + index);

    const getAlphabetLabelsRow = (chessboard: Chessboard): (EmptyCell | LabelCell)[] => {
        let cells: (EmptyCell | LabelCell)[] = [
            { type: CellType.EMPTY, cellSize: squareSize },
            ...[...Array(chessboard.width)].map(
                (_, index) =>
                    ({
                        type: CellType.LABEL,
                        cellSize: squareSize,
                        label: getAlphabetLabel(index),
                    } as LabelCell)
            ),
            { type: CellType.EMPTY, cellSize: squareSize },
        ];
        return cells;
    };

    const getNumeratedChessboardRow = (y: number, chessboard: Chessboard): (ChessSquareCell | LabelCell)[] => {
        let cells: (ChessSquareCell | LabelCell)[] = [
            { type: CellType.LABEL, cellSize: squareSize, label: (y + 1).toString() },
            ...[...Array(chessboard.width)].map(
                (_, x) =>
                    ({
                        type: CellType.CHESS_SQUARE,
                        cellSize: squareSize,
                        x,
                        y,
                        cellValue: chessboard.board[x][y],
                        onClick: handleCellClick,
                        showLabel: showLabel,
                    } as ChessSquareCell)
            ),
            { type: CellType.LABEL, cellSize: squareSize, label: (y + 1).toString() },
        ];

        return cells;
    };

    const renderChessboard = useMemo(() => {
        const rows = [];

        rows.push(getAlphabetLabelsRow(chessboard));

        for (let y = 0; y < chessboard.height; y++) {
            rows.push(getNumeratedChessboardRow(y, chessboard));
        }

        rows.push(getAlphabetLabelsRow(chessboard));

        return rows.map((row, index) => <ChessboardRow key={index} cells={row} cellSize={squareSize} />);
    }, [chessboard, showLabel, squareSize, handleCellClick]);

    const renderPath = useMemo(() => {
        if (path.length === 0) return null;
        const offsetX = squareSize + squareSize / 2; // Label Cell + Half of cellSize to center the path line in the cell
        const offsetY = squareSize + squareSize / 2; // Label Cell + Half of cellSize to center the path line in the cell

        const getCoordinates = (position: Position) => {
            const x = position.x * squareSize + offsetX;
            const y = position.y * squareSize + offsetY;
            return { x, y };
        };

        const pathElements = [];
        for (let i = 0; i < path.length - 1; i++) {
            const start = getCoordinates(path[i]);
            const end = getCoordinates(path[i + 1]);
            pathElements.push(<line key={i} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="red" strokeWidth="2" strokeOpacity={opacity} />);
        }

        return (
            <svg className="absolute" width={(width + 2) * squareSize} height={(height + 2) * squareSize} style={{ top: 0, left: 0, pointerEvents: 'none' }}>
                {pathElements}
            </svg>
        );
    }, [path, width, height, opacity]);

    return (
        <div className="relative flex flex-col items-center">
            <div className="relative" style={{ width: (width + 2) * squareSize, height: (height + 2) * squareSize }}>
                {renderPath}
                {renderChessboard}
                {path.length > 0 && (
                    <div className="flex flex-col items-center">
                        <div className="text-lg font-bold mt-4">Path:</div>
                        <div className="text-lg font-bold">{path.map((position) => `${position.label}`).join(' -> ')}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChessboardComponent;

import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import { calculateKnightPath } from '../knightTour';
import { Algorithm, Position, TieBreakMethod, Chessboard, EmptyCell, LabelCell, ChessSquareCell, CellType, KnightTourConfig, KnightTourOutput } from '../types';
import ChessboardRow from './ChessboardRow';
import { KnightTour } from '../knightTour';

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

const getLabel = (x: number, y: number, chessboard: Chessboard) => {
    const letter = String.fromCharCode(65 + x);
    const number = chessboard.height - y;
    return `${letter}${number}`;
};

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
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        setChessboard(new Chessboard(width, height));
        setPath([]);
    }, [width, height]);

    const handleCellClick = useCallback(
        async (x: number, y: number) => {
            console.log('Clicked cell:', x, y);

            const config: KnightTourConfig = {
                startX: x,
                startY: y,
                chessboard: new Chessboard(width, height),
                iterationLimit,
                attemptLimit,
                closedTour,
                algorithm,
                tieBreakMethod,
                moveOrdering,
            };

            const knightTour = new KnightTour(config);
            const result: KnightTourOutput = await knightTour.solveKnightTour();

            console.log('Knight Path Result:', result);

            if (result.success && result.chessboard && result.path) {
                setChessboard(result.chessboard);
                result.path.forEach((position) => (position.label = getLabel(position.x, position.y, result.chessboard!)));
                setPath(result.path);
            } else {
                setChessboard(new Chessboard(width, height));
                setPath([]);
            }

            setMessage(result.message!);
        },
        [width, height, iterationLimit, attemptLimit, closedTour, algorithm, tieBreakMethod, moveOrdering]
    );

    const getAlphabetLabel = useCallback((index: number) => String.fromCharCode(65 + index), []);

    const getAlphabetLabelsRow = useCallback(
        (chessboard: Chessboard): (EmptyCell | LabelCell)[] => {
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
        },
        [squareSize, getAlphabetLabel]
    );

    const getNumeratedChessboardRow = useCallback(
        (y: number, chessboard: Chessboard): (ChessSquareCell | LabelCell)[] => {
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
        },
        [squareSize, showLabel, handleCellClick]
    );

    const renderChessboard = useMemo(() => {
        const rows = [];

        rows.push(getAlphabetLabelsRow(chessboard));

        for (let y = 0; y < chessboard.height; y++) {
            rows.push(getNumeratedChessboardRow(y, chessboard));
        }

        rows.push(getAlphabetLabelsRow(chessboard));

        return rows.map((row, index) => <ChessboardRow key={index} cells={row} cellSize={squareSize} />);
    }, [chessboard, squareSize, getAlphabetLabelsRow, getNumeratedChessboardRow]);

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
    }, [path, width, height, opacity, squareSize]);

    return (
        <div className="relative flex flex-col items-center">
            <div className="relative" style={{ width: (width + 2) * squareSize, height: (height + 2) * squareSize }}>
                {renderPath}
                {renderChessboard}
                {message && <div className="text-lg font-bold mt-4">{message}</div>}
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

import React, { useState, useMemo, useEffect } from 'react';
import { calculateKnightPath } from '../knightTour';
import { Board, Position } from '../types';

const ChessboardLabel: React.FC<{ label: string }> = ({ label }) => <div className="w-16 h-16 flex items-center justify-center">{label}</div>;

const ChessboardCell: React.FC<{ x: number; y: number; onClick: (x: number, y: number) => void; cellValue: number | null; showLabel: boolean }> = ({
    x,
    y,
    onClick,
    cellValue,
    showLabel,
}) => (
    <div
        className={`w-16 h-16 flex items-center justify-center cursor-pointer ${(x + y) % 2 === 0 ? 'bg-gray-200' : 'bg-gray-800 text-white'}`}
        onClick={() => onClick(x, y)}
    >
        {cellValue !== null && showLabel ? cellValue + 1 : ''}
    </div>
);

const ChessboardRow: React.FC<{ y: number; width: number; height: number; onClick: (x: number, y: number) => void; board: Board; showLabel: boolean }> = ({
    y,
    width,
    height,
    onClick,
    board,
    showLabel,
}) => (
    <div className="flex">
        <ChessboardLabel label={`${height - y}`} />
        {[...Array(width)].map((_, x) => (
            <ChessboardCell
                key={x}
                x={x}
                y={y}
                onClick={onClick}
                cellValue={board[x] && board[x][y] !== undefined ? board[x][y] : null}
                showLabel={showLabel}
            />
        ))}
        <ChessboardLabel label={`${height - y}`} />
    </div>
);

const Chessboard: React.FC<{ width: number; height: number; opacity: number; showLabel: boolean }> = ({ width, height, opacity, showLabel }) => {
    const [board, setBoard] = useState<Board>([]);
    const [path, setPath] = useState<Position[]>([]);

    useEffect(() => {
        setBoard([...Array(height)].map(() => Array(width).fill(null)));
        setPath([]);
    }, [width, height]);

    const handleCellClick = (x: number, y: number) => {
        console.log('Clicked cell:', x, y);

        const startX = x;
        const startY = y;

        const knightPathResult = calculateKnightPath(startX, startY, width, height);
        console.log('Knight Path Result:', knightPathResult);
        if (knightPathResult) {
            setBoard(knightPathResult.board);
            setPath(knightPathResult.path);
        } else {
            setBoard([...Array(width)].map(() => Array(height).fill(null)));
            setPath([]);
            alert('No solution found from this position.');
        }
    };

    const renderChessboard = useMemo(() => {
        const rows = [];
        rows.push(
            <div key="top-labels" className="flex">
                <div className="w-8 h-8" />
                {[...Array(width)].map((_, x) => (
                    <ChessboardLabel key={`top-${x}`} label={String.fromCharCode(65 + x)} />
                ))}
                <div className="w-8 h-8" />
            </div>
        );

        for (let y = 0; y < height; y++) {
            rows.push(<ChessboardRow key={y} y={y} width={width} height={height} onClick={handleCellClick} board={board} showLabel={showLabel} />);
        }

        rows.push(
            <div key="bottom-labels" className="flex">
                <div className="w-8 h-8" />
                {[...Array(width)].map((_, x) => (
                    <ChessboardLabel key={`bottom-${x}`} label={String.fromCharCode(65 + x)} />
                ))}
                <div className="w-8 h-8" />
            </div>
        );

        return rows;
    }, [width, height, board, showLabel]);

    const renderPath = useMemo(() => {
        if (path.length === 0) return null;
        const cellSize = 64; // 16 * 4 for the cell size
        const offsetX = 64 + 32; // Label Cell + Half of cellSize to center the path line in the cell
        const offsetY = 64 + 32; // Label Cell + Half of cellSize to center the path line in the cell

        const getCoordinates = (position: Position) => {
            const x = position.x * cellSize + offsetX;
            const y = position.y * cellSize + offsetY;
            return { x, y };
        };

        const pathElements = [];
        for (let i = 0; i < path.length - 1; i++) {
            const start = getCoordinates(path[i]);
            const end = getCoordinates(path[i + 1]);
            pathElements.push(<line key={i} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="red" strokeWidth="2" strokeOpacity={opacity} />);
        }

        return (
            <svg className="absolute" width={(width + 2) * cellSize} height={(height + 2) * cellSize} style={{ top: 0, left: 0, pointerEvents: 'none' }}>
                {pathElements}
            </svg>
        );
    }, [path, width, height, opacity]);

    return (
        <div className="relative flex flex-col items-center">
            <div className="relative" style={{ width: (width + 2) * 64, height: (height + 2) * 64 }}>
                {renderPath}
                {renderChessboard}
            </div>
        </div>
    );
};

export default Chessboard;

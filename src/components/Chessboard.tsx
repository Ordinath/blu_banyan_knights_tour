import React, { useState, useMemo } from 'react';
import { calculateKnightPath } from '../knightTour';
import { Board } from '../types';

const ChessboardLabel: React.FC<{ label: string }> = ({ label }) => <div className="w-16 h-16 flex items-center justify-center">{label}</div>;

const ChessboardCell: React.FC<{ x: number; y: number; onClick: (x: number, y: number) => void; cellValue: number | null }> = ({
    x,
    y,
    onClick,
    cellValue,
}) => (
    <div
        className={`w-16 h-16 flex items-center justify-center cursor-pointer ${(x + y) % 2 === 0 ? 'bg-gray-200' : 'bg-gray-800 text-white'}`}
        onClick={() => onClick(x, y)}
    >
        {cellValue !== null ? cellValue + 1 : ''}
    </div>
);

const ChessboardRow: React.FC<{ y: number; width: number; height: number; onClick: (x: number, y: number) => void; board: Board }> = ({
    y,
    width,
    height,
    onClick,
    board,
}) => (
    <div className="flex">
        <ChessboardLabel label={`${height - y}`} />
        {[...Array(width)].map((_, x) => (
            <ChessboardCell key={x} x={x} y={y} onClick={onClick} cellValue={board[x][y]} />
        ))}
        <ChessboardLabel label={`${height - y}`} />
    </div>
);

const Chessboard: React.FC<{ width: number; height: number }> = ({ width, height }) => {
    const [board, setBoard] = useState<Board>([...Array(width)].map(() => Array(height).fill(null)));

    const handleCellClick = (x: number, y: number) => {
        console.log('Clicked cell:', x, y);

        const startX = x;
        const startY = y;

        const knightPathResult = calculateKnightPath(startX, startY, width, height);
        console.log('Knight Path Result:', knightPathResult);
        if (knightPathResult) {
            setBoard(knightPathResult.board);
        } else {
            setBoard([...Array(width)].map(() => Array(height).fill(null)));
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
            rows.push(<ChessboardRow key={y} y={y} width={width} height={height} onClick={handleCellClick} board={board} />);
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
    }, [width, height, board]);

    return <div className="flex flex-col items-center">{renderChessboard}</div>;
};

export default Chessboard;

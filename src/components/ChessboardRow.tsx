import React from 'react';
import { EmptyCell, LabelCell, ChessSquareCell } from '../types';
import ChessboardCell from './ChessboardCell';

interface ChessboardRowProps {
    cells: (EmptyCell | LabelCell | ChessSquareCell)[];
    cellSize: number;
}

const ChessboardRow: React.FC<ChessboardRowProps> = ({ cells, cellSize }) => (
    <div className="flex">
        {cells.map((cellProps, index) => (
            <ChessboardCell key={index} {...cellProps} cellSize={cellSize} />
        ))}
    </div>
);

export default ChessboardRow;
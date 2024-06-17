import React from 'react';
import { BaseCell, EmptyCell, LabelCell, ChessSquareCell, CellType } from '../types';

type ChessboardCellProps = BaseCell & (EmptyCell | LabelCell | ChessSquareCell);

const ChessboardCell: React.FC<ChessboardCellProps> = (props) => {
    const getSizeClass = (size: number) => {
        const tailwindSize = size / 4;
        return `w-${tailwindSize} h-${tailwindSize}`;
    };

    const getColorClass = (props: ChessboardCellProps) => {
        if (props.type === CellType.LABEL) return 'font-bold';
        if (props.type === CellType.EMPTY) return '';
        if (props.type === CellType.CHESS_SQUARE) return (props.x + props.y) % 2 === 0 ? 'bg-gray-200' : 'bg-gray-800 text-white';
        return '';
    };

    const getPointerClass = (props: ChessboardCellProps) => {
        return props.type === CellType.CHESS_SQUARE ? 'cursor-pointer' : '';
    };

    const getHoverClass = (props: ChessboardCellProps) => {
        if (props.type === CellType.CHESS_SQUARE) {
            return (props.x + props.y) % 2 === 0 ? 'hover:bg-gray-300' : 'hover:bg-gray-700';
        }
        return '';
    };

    const handleClick = () => {
        if (props.type === CellType.CHESS_SQUARE && props.onClick) {
            props.onClick(props.x, props.y);
        }
    };

    const getContent = () => {
        if (props.type === CellType.LABEL) return props.label;
        if (props.type === CellType.CHESS_SQUARE && props.cellValue !== null && props.showLabel) return props.cellValue + 1;
        return '';
    };

    return (
        <div
            className={`flex items-center justify-center ${getHoverClass(props)} ${getSizeClass(props.cellSize)} ${getPointerClass(props)} ${getColorClass(props)}`}
            onClick={handleClick}
        >
            {getContent()}
        </div>
    );
};

export default ChessboardCell;

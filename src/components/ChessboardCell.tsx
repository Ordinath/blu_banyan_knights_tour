import React from 'react';
import { BaseCell, EmptyCell, LabelCell, ChessSquareCell, CellType } from '../types';

type ChessboardCellProps = BaseCell & (EmptyCell | LabelCell | ChessSquareCell);

const ChessboardCell: React.FC<ChessboardCellProps> = (props) => {
    const getSizeClass = (size: number) => {
        // const tailwindSize = size / 4;
        // return `w-${tailwindSize} h-${tailwindSize}`;
        // dinamic string literal injection does not work ...

        if (size === 16) return 'w-4 h-4';
        if (size === 32) return 'w-8 h-8';
        if (size === 48) return 'w-12 h-12';
        if (size === 64) return 'w-16 h-16';
        if (size === 80) return 'w-20 h-20';
        if (size === 96) return 'w-24 h-24';
        if (size === 112) return 'w-28 h-28';
        if (size === 128) return 'w-32 h-32';
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
            className={`flex items-center justify-center ${getHoverClass(props)} ${getSizeClass(props.cellSize)} ${getPointerClass(props)} ${getColorClass(
                props
            )}`}
            onClick={handleClick}
        >
            {getContent()}
        </div>
    );
};

export default ChessboardCell;

import React, { useEffect, useState } from 'react';
import Chessboard from './components/Chessboard';
import { Algorithm, TieBreakMethod } from './types';

const SQUARE_SIZE = 64;

function App() {
    const [width, setWidth] = useState<number>(8);
    const [height, setHeight] = useState<number>(8);

    const [opacity, setOpacity] = useState<number>(0.5);
    const [showLabel, setShowLabel] = useState<boolean>(true);

    const [iterationLimit, setIterationLimit] = useState<number>(64);
    const [attemptLimit, setAttemptLimit] = useState<number>(1);

    const [closedTour, setClosedTour] = useState<boolean>(false);
    const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.WARNSDORF);
    const [tieBreakMethod, setTieBreakMethod] = useState<TieBreakMethod>(TieBreakMethod.FIRST);
    const [moveOrdering, setMoveOrdering] = useState<number>(12345678);

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWidth(Number(e.target.value));
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeight(Number(e.target.value));
    };

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpacity(Number(e.target.value));
    };

    const handleShowLabelChange = () => {
        setShowLabel((prevShowLabel) => !prevShowLabel);
    };

    const handleClosedTourChange = () => {
        setClosedTour((prevClosedTour) => !prevClosedTour);
    };

    const handleIterationLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIterationLimit(Number(e.target.value));
    };

    const handleAttemptLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttemptLimit(Number(e.target.value));
    };

    const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAlgorithm(e.target.value as Algorithm);
    };

    const handleTieBreakMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTieBreakMethod(e.target.value as TieBreakMethod);
    };

    const handleMoveOrderingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMoveOrdering(Number(e.target.value));
    };

    useEffect(() => {
        setIterationLimit(width * height);
    }, [width, height]);

    return (
        <div className="App flex flex-col items-center">
            <h1 className="text-3xl font-bold underline my-4">Knight's Tour</h1>
            <div className="mb-4">
                <label className="mr-2">Width:</label>
                <input type="number" value={width} onChange={handleWidthChange} className="border rounded p-1" />
                <label className="ml-4 mr-2">Height:</label>
                <input type="number" value={height} onChange={handleHeightChange} className="border rounded p-1" />
            </div>
            <div className="mb-4">
                <label className="mr-2">Path Opacity:</label>
                <input type="range" min="0" max="1" step="0.1" value={opacity} onChange={handleOpacityChange} />
                <label className="ml-4 mr-2">Show Labels:</label>
                <input type="checkbox" checked={showLabel} onChange={handleShowLabelChange} />
            </div>
            <div className="mb-4">
                <label className="mr-2">Iteration Limit:</label>
                <input type="number" value={iterationLimit} onChange={handleIterationLimitChange} className="border rounded p-1" />
                <label className="ml-4 mr-2">Attempt Limit:</label>
                <input type="number" value={attemptLimit} onChange={handleAttemptLimitChange} className="border rounded p-1" />
            </div>
            <div className="mb-4">
                <label className="mr-2">Closed Tour:</label>
                <input type="checkbox" checked={closedTour} onChange={handleClosedTourChange} />
                <label className="mr-2 ml-4 ">Method:</label>
                <select className="border rounded p-1" onChange={handleMethodChange}>
                    <option value={Algorithm.WARNSDORF}>Warnsdorf's Rule</option>
                    <option value={Algorithm.MOVE_ORDERING}>Move Ordering</option>
                    <option value={Algorithm.BRUTEFORCE}>Brute Force</option>
                </select>
                {algorithm === Algorithm.MOVE_ORDERING && (
                    <>
                        <label className="mr-2 ml-4 ">Ordering:</label>
                        <input type="number" value={moveOrdering} onChange={handleMoveOrderingChange} className="border rounded p-1" />
                    </>
                )}
                {algorithm === Algorithm.WARNSDORF && (
                    <>
                        <label className="ml-4 mr-2">Tie Break Method:</label>
                        <select className="border rounded p-1" onChange={handleTieBreakMethodChange}>
                            <option value={TieBreakMethod.FIRST}>First</option>
                            <option value={TieBreakMethod.RANDOM}>Random</option>
                            <option value={TieBreakMethod.POHL}>Pohl</option>
                            <option value={TieBreakMethod.CLOSEST_TO_CENTER}>Closest to Center</option>
                            <option value={TieBreakMethod.FURTHEST_FROM_CENTER}>Furthest from Center</option>
                            <option value={TieBreakMethod.MOVE_ORDERING}>Move Ordering</option>
                        </select>
                        {tieBreakMethod === TieBreakMethod.MOVE_ORDERING && (
                            <>
                                <label className="mr-2 ml-4 ">Ordering:</label>
                                <input type="number" value={moveOrdering} onChange={handleMoveOrderingChange} className="border rounded p-1" />
                            </>
                        )}
                    </>
                )}
            </div>
            <Chessboard
                width={width}
                height={height}
                opacity={opacity}
                showLabel={showLabel}
                squareSize={SQUARE_SIZE}
                iterationLimit={iterationLimit}
                attemptLimit={attemptLimit}
                closedTour={closedTour}
                algorithm={algorithm}
                tieBreakMethod={tieBreakMethod}
                moveOrdering={moveOrdering}
            />
        </div>
    );
}

export default App;

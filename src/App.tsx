import React, { useState } from 'react';
import Chessboard from './components/Chessboard';

function App() {
    const [width, setWidth] = useState(8);
    const [height, setHeight] = useState(8);

    const [opacity, setOpacity] = useState(0.5);
    const [showLabel, setShowLabel] = useState(true);

    const [iterationLimit, setIterationLimit] = useState(10000000);
    const [attemptLimit, setAttemptLimit] = useState(1);

    const [closedTour, setClosedTour] = useState(false);
    const [method, setMethod] = useState('warnsdorf');
    const [tieBreakMethod, setTieBreakMethod] = useState('first');
    const [moveOrdering, setMoveOrdering] = useState(12345678);

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
        setMethod(e.target.value);
    };

    const handleTieBreakMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTieBreakMethod(e.target.value);
    };

    const handleMoveOrderingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMoveOrdering(Number(e.target.value));
    };

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
                    <option value="warnsdorf">Warnsdorf's Rule</option>
                    <option value="move_ordering">Move Ordering</option>
                    <option value="bruteforce">Brute Force</option>
                </select>
                {method === 'move_ordering' && (
                    <>
                        <label className="mr-2 ml-4 ">Ordering:</label>
                        <input type="number" value={moveOrdering} onChange={handleMoveOrderingChange} className="border rounded p-1" />
                    </>
                )}
                {method === 'warnsdorf' && (
                    <>
                        <label className="ml-4 mr-2">Tie Break Method:</label>
                        <select className="border rounded p-1" onChange={handleTieBreakMethodChange}>
                            <option value="first">First</option>
                            <option value="random">Random</option>
                            <option value="pohl">Pohl</option>
                            <option value="closest_to_center">Closest to Center</option>
                            <option value="furthest_from_center">Furthest from Center</option>
                            <option value="furthest_from_center">Furthest from Center</option>
                            <option value="move_ordering">Move Ordering</option>
                        </select>
                        {tieBreakMethod === 'move_ordering' && (
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
                iterationLimit={iterationLimit}
                attemptLimit={attemptLimit}
                closedTour={closedTour}
                method={method}
                tieBreakMethod={tieBreakMethod}
                moveOrdering={moveOrdering}
            />
        </div>
    );
}

export default App;

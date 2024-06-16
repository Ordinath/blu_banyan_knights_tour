import React, { useState } from 'react';
import Chessboard from './components/Chessboard';

function App() {
    const [width, setWidth] = useState(8);
    const [height, setHeight] = useState(8);
    const [opacity, setOpacity] = useState(0.5);
    const [showLabel, setShowLabel] = useState(true);
    const [closedTour, setClosedTour] = useState(false);

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
                <label className="ml-4 mr-2">Closed Tour:</label>
                <input type="checkbox" checked={closedTour} onChange={handleClosedTourChange} />
            </div>
            <Chessboard width={width} height={height} opacity={opacity} showLabel={showLabel} closedTour={closedTour} />
        </div>
    );
}

export default App;

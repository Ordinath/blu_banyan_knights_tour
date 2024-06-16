import React, { useState } from 'react';
import Chessboard from './components/Chessboard';

function App() {
    const [width, setWidth] = useState(8);
    const [height, setHeight] = useState(8);

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Math.min(20, Number(e.target.value))); // Limit between 1 and 20
        setWidth(value);
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Math.min(20, Number(e.target.value))); // Limit between 1 and 20
        setHeight(value);
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
            <Chessboard width={width} height={height} />
        </div>
    );
}

export default App;

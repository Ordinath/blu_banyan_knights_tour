import React from 'react';
import Chessboard from './components/Chessboard';

function App() {
    return (
        <div className="App">
            <h1 className="text-3xl font-bold underline">Knight's Tour</h1>
            <Chessboard width={7} height={9} />
        </div>
    );
}

export default App;

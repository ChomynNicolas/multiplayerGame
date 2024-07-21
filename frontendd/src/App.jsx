import React from 'react';
import { BrowserRouter ,Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import RoomPage from './Pages/RoomPage/RoomPage';

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" exact element={<HomePage/>} />
            <Route path="/room/:roomId" element={<RoomPage/>} />
        </Routes>
    </BrowserRouter>
);

export default App;

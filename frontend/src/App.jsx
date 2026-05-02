import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Players from './pages/Players';
import Games from './pages/Games';
import CreateGame from './pages/CreateGame';
import ViewGame from './pages/ViewGame';
import Ranks from './pages/Ranks';
import UpdatePlayer from './pages/UpdatePlayer';
import ViewPlayer from './pages/ViewPlayer';
import PlayerRecords from './pages/PlayerRecords';
import Teams from './pages/Teams'

// Components
import Navigation from './components/Navigation';

// Define the backend port and URL for API requests
const backendPort = 1787;  // Use the port you assigned to the backend server, this would normally go in a .env file
const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}`;

function App() {

    return (
        <>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/players" element={<Players />} />
                <Route path="/games" element={<Games />} />
                <Route path="/creategame" element={<CreateGame />} />
                <Route path="/viewgame" element={<ViewGame />} />
                <Route path="/ranks" element={<Ranks />} />
                <Route path="/updateplayer" element={<UpdatePlayer />} />
                <Route path="/viewplayer" element={<ViewPlayer />} />
                <Route path="/playerrecords" element={<PlayerRecords />} />
                <Route path="/teams" element={<Teams />} />
            </Routes>
        </>
    );

} export default App;

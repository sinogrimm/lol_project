import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// Pages
import Home from './pages/Home';
import Players from './pages/Players';
import ViewPlayer from './pages/ViewPlayer';
import UpdatePlayer from './pages/UpdatePlayer';
import Games from './pages/Games';
import CreateGame from './pages/CreateGame';
import ViewGame from './pages/ViewGame';
import UpdateGame from './pages/UpdateGame';
import Teams from './pages/Teams'
import PlayerRecords from './pages/PlayerRecords';
import Ranks from './pages/Ranks';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Define the backend port and URL for API requests
const backendPort = 1787;  // Use the port you assigned to the backend server, this would normally go in a .env file
const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}`;
//const backendURL = `http://localhost:${backendPort}`;

function App() {
    return (
        <>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/players" element={<Players />} />
                <Route path="/viewplayer/:id" element={<ViewPlayer />} />
                <Route path="/updateplayer/:id" element={<UpdatePlayer />} />
                <Route path="/games" element={<Games />} />
                <Route path="/creategame" element={<CreateGame backendURL={backendURL} />} />
                <Route path="/viewgame" element={<ViewGame backendURL={backendURL}/>} />
                <Route path="/updategame" element={<UpdateGame backendURL={backendURL} />} />
                <Route path="/teams" element={<Teams backendURL={backendURL}/>} />
                <Route path="/playerrecords" element={<PlayerRecords backendURL={backendURL}/>} />
                <Route path="/ranks" element={<Ranks backendURL={backendURL}/>} />
            </Routes>
            <Footer />
        </>
    );

} export default App;

import Navigation from '../components/Navigation';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

function ViewPlayer() {
    
    const navigate = useNavigate();

    return (
        <>
        <h1>player_id - name - rank </h1>

        <p>Displays the selected player's game history.</p>
        <ul>
            <li>Back: returns the user to the Players page.</li>
        </ul>

        <h2>Game History</h2>
        
        <table>
            <thead>
                <tr>
                    <th>game_id</th>
                    <th>start_time</th>
                    <th>result</th>
                    <th>lp_change</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>

        <button onClick={() => navigate("/players")}>Back</button>
        </>
    )
}

export default ViewPlayer;
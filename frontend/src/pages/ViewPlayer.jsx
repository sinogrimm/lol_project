import Navigation from '../components/Navigation';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getViewPlayerTitle, getViewPlayerHistory } from '../api/PlayersApi';
import HistoryTableRow from '../components/HistoryTableRow';

function ViewPlayer() {
    const {id} = useParams();
    const [playerTitle, setPlayerTitle] = useState([]);
    const [playerHistory, setPlayerHistory] = useState([]);
    const navigate = useNavigate();

    const getTitleText = async () => {
        try {
            const player = await getViewPlayerTitle(id); 
            setPlayerTitle(player);

        } catch (error) {
            console.log(`Failed to load page title text: ${error.message}`);
        }
    }

    const loadHistoryTable = async () => {
        try {
            const { playerHistory } = await getViewPlayerHistory(id);
            setPlayerHistory(playerHistory);
            console.log(playerHistory);

        } catch (error) {
            console.log(`Failed to load history table: ${error.message}`);
        }
    }

    useEffect(() => {
        getTitleText();
        loadHistoryTable();
    }, []);

    return (
        <>
        <h1>Player {id}: {playerTitle.name} [{playerTitle.title}]</h1>

        <p>Displays the selected player's game history by listing the Game ID, game Start Time,
            team Result, and player record League Point (LP) Change.
        </p>
        <hr />
        <ul>
            <li>Back: returns the user to the Players page.</li>
        </ul>
        <hr />

        <h2>Game History</h2>
        
        <table>
            <thead>
                <tr>
                    {playerHistory.length === 0 &&
                        <th>No games played yet.</th>}
                    {playerHistory.length > 0 &&
                        Object.keys(playerHistory[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                </tr>
            </thead>
            <tbody>
                {playerHistory.length > 0 &&
                    playerHistory.map((game, index) => (
                        <HistoryTableRow key={index} game={game}/>
                    ))}
            </tbody>
        </table>

        <button id="back" onClick={() => navigate("/players")}>Back</button>
        </>
    )
}

export default ViewPlayer;
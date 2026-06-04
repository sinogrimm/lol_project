import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PlayerDropdown from '../components/PlayerDropdown';
import { getGame, updateGame } from '../api/GamesApi';

function UpdateGame({ backendURL }) {
    const navigate = useNavigate();
    const { game_id } = useParams();
    const [formData, setFormData] = useState({ start_time: '', duration: '' });
    const [players, setPlayers] = useState([]);
    

    const getPlayersForDropdown = async function () {
        try {
            const response = await fetch(backendURL + '/player-dropdown');
            const {players} = await response.json();

            setPlayers(players);

        } catch (error) {
            console.log(error);
        }
    }

    const loadPrefill = async () => {
    try {
        const game = await getGame(game_id);
        setFormData({ 
            start_time: game.start_time, 
            duration: game.duration 
        });
    } catch (error) {
        console.log(`Failed to load prefill data: ${error.message}`);
    }
    }   

    useEffect(() => {
        getPlayersForDropdown();
        loadPrefill();
    }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();

    // prompt user to confirm
    const confirmed = window.confirm(`Update game ${game_id}?`);

    if (confirmed) {
        const response = await updateGame({ game_id, ...formData });

        if (response.ok) {
            console.log("Game update was successful.");
            alert("Game has been updated.");

            // return
            navigate("/games");

        } else {
            console.error("Error during PUT request.");
            alert("Failed to update game.");
        }
    }
}

    return (
        <>
        <h1>Update Game</h1>
        <p>Allows user to input and submit changes to the selected game, teams, and
            player records.</p>
        <hr />
        <ul>
            <li>Update: initiates confirmation popup. If 'OK', validates the inputs before sending them in a request.
                Once everything is successfully updated, the user will be navigated back to the Games page.
            </li>
            <li>Cancel: returns the user to the Games page.</li>
        </ul>
        <hr />

        <form>
            <label>Start Time: </label>
            <input
                type="text"
                name="start_time"
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
            />
            <br />
            <label>Duration: </label>
            <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
            />

        <br />

            <h3>Team ID</h3>

            <label>Player 1: </label>
            <PlayerDropdown players={players}/><br />
            <label>Player 2: </label>
            <PlayerDropdown players={players}/><br />
            <label>Player 3: </label>
            <PlayerDropdown players={players}/><br />
            <label>Player 4: </label>
            <PlayerDropdown players={players}/><br />
            <label>Player 5: </label>
            <PlayerDropdown players={players}/><br />

        <br />

            <h3>Team ID</h3>

            <label>Player 1: </label>
            <PlayerDropdown players={players}/><br />
            <label>Player 2: </label>
            <PlayerDropdown players={players}/><br />
            <label>Player 3: </label>
            <PlayerDropdown players={players}/><br />
            <label>Player 4: </label>
            <PlayerDropdown players={players}/><br />
            <label>Player 5: </label>
            <PlayerDropdown players={players}/><br />

        </form>

        <hr />

        <button id="submit" onClick={handleSubmit}>Update</button>
        <button id="cancel" onClick={() => navigate("/games")}>Cancel</button>

        </>
    )

}

export default UpdateGame;
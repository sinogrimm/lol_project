import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GamesTableRow from '../components/GamesTableRow';
import { getGames } from '../api/GamesApi';

function Games() {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    
    const loadGamesTable = async function () {
        try {
            const { games } = await getGames();
            setGames(games);
    
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadGamesTable();
    }, []);

    return (
        <>

        <h1>Games</h1>
        <p>Displays a table showing the Game ID, Start Time, and Duration for each recorded game.
            Allows the addition of a new game via clicking the "Add New Game" button,
            which routes to the CreateGame page. Allows the deletion of a game and its corresponding 
            records via clicking the "Delete" button and then confirming.</p>
        <hr />
        <ul>
            <li>Add New Game: takes the user to the CreateGame page.</li>
            <li>View: takes the user to the ViewGame page.</li>
            <li>Delete: deletes the game and all corresponding data, after confirmation.</li>
        </ul>
        <hr />
        
        <button id="submit" onClick={() => navigate("/creategame")}>Add New Game</button>

        <table>
            <thead>
                <tr>
                    {games.length > 0 && Object.keys(games[0]).map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                    <th></th>{/* empty column for view buttons*/}
                    <th></th>{/* empty column for delete buttons*/}
                </tr>
            </thead>
            <tbody>
                {games.map((games, index) => (
                    <GamesTableRow key={index} rowObject={games} loadGamesTable={loadGamesTable}/>
                ))}
            </tbody>
        </table>

        </>
    )
}

export default Games;
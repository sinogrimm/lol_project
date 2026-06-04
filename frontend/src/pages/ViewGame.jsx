import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGame, getTeams, getPlayers } from '../api/GamesApi';
import TableRow from '../components/TableRow';

function ViewGame() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [game, setGame] = useState([]);
    const [teams, setTeams] = useState([]);
    const [players1, setPlayers1] = useState([]);
    const [players2, setPlayers2] = useState([]);


    const loadGame = async () => {
        const game = await getGame(id);
        setGame(game);
    }

    const loadTeams = async() => {
        const teams = await getTeams(id);
        setTeams(teams);

        const players1 = await getPlayers(teams[0].team_id);
        setPlayers1(players1);
        const players2 = await getPlayers(teams[1].team_id);
        setPlayers2(players2);
    }

    useEffect(() => {
        loadGame();
        loadTeams();
    }, [])

    return (
        <>
        <h1>Game {game.game_id}: ({game.start_time}) - ({game.duration})</h1>
        <p>Allows the user to view the Team ID and Results associated with the selected game.
            For each team, displays the player Name, Rank, and league point (LP) change from 
            their respective records.
        </p>
        <hr />
        <ul>
            <li>Back: returns the user to the Games page.</li>
        </ul>
        <hr />

        {teams.length > 0 &&
            <h2>Team {teams[0].team_id}: {teams[0].result}</h2>
        }

        <table>
            <thead>
                <tr>
                    {players1.length > 0 &&
                        Object.keys(players1[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                </tr>
            </thead>
            <tbody>
                {players1.length > 0 &&
                players1.map((record, index) => (
                    <TableRow key={index} object={record}/>
                ))}
            </tbody>
        </table>
        <hr />

        {teams.length > 1 &&
            <h2>Team {teams[1].team_id}: {teams[1].result}</h2>
        }

        <table>
            <thead>
                <tr>
                    {players2.length > 0 &&
                        Object.keys(players2[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                </tr>
            </thead>
            <tbody>
                {players2.length > 0 &&
                players2.map((record, index) => (
                    <TableRow key={index} object={record}/>
                ))}
            </tbody>
        </table>
        <hr />

        <button id="back" onClick={() => navigate("/games")}>Back</button>

        </>
    )

}

export default ViewGame;
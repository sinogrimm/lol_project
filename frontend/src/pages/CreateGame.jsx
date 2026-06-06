/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: Form to Create Game, Teams, and PlayerRecords

 * This react page is our own work based on knowledge gained from explorations,
 * past courses, and hours of debugging.
*/

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerDropdown from '../components/PlayerDropdown';
import { getPlayersForDropdown, createGame, createTeam, createRecords } from '../api/GamesApi';


function CreateGame() {
    const navigate = useNavigate();

    // holds data for player dropdown
    const [players, setPlayers] = useState([]);

    // holds data for creating game
    const [gameData, setGameData] = useState({ start_time: '', duration: '', });

    // holds data for creating teams
    const [redTeamData, setRedTeamData] = useState ({ game_id: '', result: '', });
    const [blueTeamData, setBlueTeamData] = useState ({ game_id: '', result: '', });

    // labels for player record section in form
    const labels = ['Top Lane', 'Jungler', 'Mid Lane', 'Bot Lane', 'Support'];

    // array holding possible teams
    // r = red, b = blue
    const teams = ['r', 'b'];

    // array holding possible lanes
    // top = top lane, jgl = jungle, mid = middle lane, bot = bottom lane, sup = support
    const lanes = ['top', 'jgl', 'mid', 'bot', 'sup'];

    // holds data for creating player records
    // pid = player id, lpc = league point change
    const [redPlayersData, setRedPlayersData] = useState ({
        team_id: '',
        top_pid: '', jgl_pid: '', mid_pid: '', bot_pid: '', sup_pid: '',
        top_lpc: '', jgl_lpc: '', mid_lpc: '', bot_lpc: '', sup_lpc: '',
    });
    const [bluePlayersData, setBluePlayersData] = useState ({
        team_id: '',
        top_pid: '', jgl_pid: '', mid_pid: '', bot_pid: '', sup_pid: '',
        top_lpc: '', jgl_lpc: '', mid_lpc: '', bot_lpc: '', sup_lpc: '',
    });

    /**
     * Fills out player dropdowns with player names for display and ids for operations.
     */
    const loadDropdowns = async function () {
        try {
            // send request for data
            const {players} = await getPlayersForDropdown();

            // update players data
            setPlayers(players);

        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Updates game information based on text box input.
     */
    const handleGameInput = (e) => {
        // get data from form event
        const { name, value } = e.target;

        // update game data
        const updated = { ...gameData, [name]: value };
        setGameData(updated);
    };

    /**
     * Updates result value for red team based on dropdown selection.
     */
    const handleRedTeamSelect = (e) => {
        // get data from form event
        const { name, value } = e.target;

        // update red team data
        const updated = { ...redTeamData, [name]: value };
        setRedTeamData(updated);
    };

    /**
     * Updates result value for blue team based on dropdown selection.
     */
    const handleBlueTeamSelect = (e) => {
        // get data from form event
        const { name, value } = e.target;

        // update blue team data
        const updated = { ...blueTeamData, [name]: value };
        setBlueTeamData(updated);
    };

    /**
     * Updates player_id portion of player record information based on dropdown selection.
     */
    const handlePlayerSelect = (e, lane, team) => {
        // get data from form event
        const pid = e.target.value;
        
        // update respective data field
        let updatedData;
        if (team === 'r') {
            updatedData = { ...redPlayersData, [`${lane}_pid`]: pid};
            setRedPlayersData(updatedData);
        } else {
            updatedData = { ...bluePlayersData, [`${lane}_pid`]: pid};
            setBluePlayersData(updatedData);
        }
    };

    /**
     * Updates lp_change portion of player record information based on text box input.
     */
    const handleLPInput = (e, lane, team) => {
        // get data from form event
        const lpc = e.target.value;
        
        // update respective data field
        let updatedData;
        if (team === 'r') {
            updatedData = { ...redPlayersData, [`${lane}_lpc`]: lpc};
            setRedPlayersData(updatedData);
        } else {
            updatedData = { ...bluePlayersData, [`${lane}_lpc`]: lpc};
            setBluePlayersData(updatedData);
        }
    }; 

    /**
     * Validates the submitted information before sending requests
     * to create the required game, teams, and player records.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // validate submission

        
        // prompt user to confirm
        const confirmed = window.confirm(`Create new game?`);

        if (confirmed) {
            // create game and receive game id
            const {new_game_id} = await createGame(gameData);

            // pass game id to teams
            const updatedRedTeamData = { ...redTeamData, game_id: new_game_id };
            const updatedBlueTeamData = { ...blueTeamData, game_id: new_game_id };

            // create red team and receive team id
            let {new_team_id} = await createTeam(updatedRedTeamData);

            // create player records for red team
            const updatedRedPlayersData = { ...redPlayersData, team_id: new_team_id };            
            const response1 = await createRecords(updatedRedPlayersData);

            // create blue team and receive team id
            ({new_team_id} = await createTeam(updatedBlueTeamData));
            const updatedBluePlayersData = { ...bluePlayersData, team_id: new_team_id };            
            const response2 = await createRecords(updatedBluePlayersData);

            if (response1.ok && response2.ok) {
                console.log("Game creation was successful.");
                alert("New game created.");

                // return to table
                navigate("/games");

            } else {
                console.error("Error during POST request.");
                alert("Failed to create new game.");
            }
        }

    }

    useEffect(() => {
        loadDropdowns();
    }, []);

    return (
        <>
        <h2>Create New Game</h2>
        <p>Enter information required to create a game, its two teams, and the player records for each team.</p>
        <p>Note: All fields must be filled. Requirement will be enforced through frontend.</p>

        <hr />
        
        <ul>
            <li>Submit: Validates the inputs before sending them in a request.
                Once the game, its two teams, and its ten player records are successfully created,
                the user will be navigated back to the Games page.
            </li>
            <li>Cancel: returns the user to the Games page.</li>
        </ul>

        <hr />

        <form>

            {/* section for game */}

            <div className='form-grid'>
                <label htmlFor="start_time">Start Time: </label>
                <input
                    type="text"
                    name="start_time"
                    id="start_time"
                    value={gameData.start_time}
                    placeholder="YYYY-MM-DD HH:MM:SS"
                    onChange={handleGameInput}
                />
                <label htmlFor="duration">Duration: </label>
                <input
                    type="text"
                    name="duration"
                    id="duration"
                    value={gameData.duration}
                    placeholder="HH:MM:SS"
                    onChange={handleGameInput}
                />
            </div>

            <br />

            {/* section for teams and player records */}

            <h3>Red Team</h3>

            {lanes.map((lane, index) => {
                const label = labels[index];
                return (
                    <div className='form-grid' key={index}>
                        <label>{label}: </label>
                        <PlayerDropdown players={players} handlePlayerSelect={handlePlayerSelect}
                            playersData={redPlayersData} lane={lane} team={teams[0]}
                        />
                        <label>LP Change: </label>
                        <input
                            type='number'
                            value={redPlayersData[`${lane}_lpc`]}
                            onChange={(e) => handleLPInput(e, lane, teams[0])}
                        />
                    </div>
                )        
            })}

            <br />

            <label>Result: </label>
            <select
                name="result"
                id="result"
                value={redTeamData.result}
                onChange={handleRedTeamSelect}
            >
                <option value="">Select Result</option>
                <option value="VICTORY">VICTORY</option>
                <option value="DEFEAT">DEFEAT</option>
            </select>
            
            <br />
            <br />

            <h3>Blue Team</h3>

            {lanes.map((lane, index) => {
                const label = labels[index];
                return (
                    <div className='form-grid' key={index}>
                        <label>{label}: </label>
                        <PlayerDropdown players={players} handlePlayerSelect={handlePlayerSelect}
                            playersData={bluePlayersData} lane={lane} team={teams[1]}
                        />
                        <label>LP Change: </label>
                        <input
                            type='number'
                            value={bluePlayersData[`${lane}_lpc`]}
                            onChange={(e) => handleLPInput(e, lane, teams[1])}
                        />
                    </div>
                )        
            })}

            <br />
            
            <label>Result: </label>
            <select
                name="result"
                id="result"
                value={blueTeamData.result}
                onChange={handleBlueTeamSelect}
            >
                <option value="">Select Result</option>
                <option value="VICTORY">VICTORY</option>
                <option value="DEFEAT">DEFEAT</option>
            </select>

            <br />

        </form>

        <hr />

        {/* section for buttons */}

        <button id="submit" onClick={handleSubmit}>Submit</button>
        <button id="cancel" onClick={() => navigate("/games")}>Cancel</button>

        </>
    )

}

export default CreateGame;
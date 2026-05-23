import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import RankDropdown from '../components/RankDropdown';
import PlayersTableRow from '../components/PlayersTableRow';


function Players({ backendURL }) {
    const [ranks, setRanks] = useState([]);
    const [players, setPlayers] = useState([]);
    const [formData, setFormData] = useState({
        new_player_name: '',
        new_player_rank: '',
        new_player_lp: ''
    });
    
    const getRanksForDropdown = async function() {
        try {
            // GET request for rank data
            const response = await fetch(backendURL + '/rank-dropdown');
            // convert response to JSON and destructure into array
            const {ranks} = await response.json();

            setRanks(ranks); // update state with data

        } catch (error) {
            console.log(error);
        }
    }

    const getPlayers = async function () {
        try {
            // GET request for all player data
            const response = await fetch(backendURL + '/players');
            // convert response to JSON and destructure into array
            const {players} = await response.json();

            setPlayers(players); // update state with data

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getRanksForDropdown();
        getPlayers();  
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updated = {
            ...formData,
            [name]: value
        };

        // console.log("UPDATED STATE:", updated); // for debug

        setFormData(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // validate name
            if (!formData.new_player_name) {
                throw new Error("Name is required.");
            }
            // validate rank
            if (!formData.new_player_rank) {
                throw new Error("Rank is required.");
            }
            // validate league points
            if (!formData.new_player_lp) {
                throw new Error("LP is required.");
            }

            const rid   = Number(formData.new_player_rank);     // rank id
            const roi   = rid - 1;                              // rank object index
            const lp    = Number(formData.new_player_lp);       // league points

            if (lp < ranks[roi].lp_threshold) {
                throw new Error(`LP for ${ranks[roi].title} ranked player cannot be below ${ranks[roi].lp_threshold}.`);
            }
            if (rid == 10) {
                if (lp > 1000) {
                    throw new Error(`LP for ${ranks[roi].title} ranked player cannot be above 1000.`);
                }
            } else {
                if (lp >= ranks[rid].lp_threshold) {
                    throw new Error(`LP for ${ranks[roi].title} ranked player cannot be ${ranks[rid].lp_threshold} or above.`);
                }
            }

            const confirmed = window.confirm("Create new player?");
            if (confirmed) {
                // send POST request
                const response = await fetch(backendURL + '/players/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    console.log("Player created successfully.");

                    // notify user
                    alert("New player created.");
                    // clear form
                    setFormData({
                        new_player_name: '',
                        new_player_rank: '',
                        new_player_lp: ''
                    });
                    // refresh table
                    getPlayers();

                } else {
                    console.error("Error creating player.");

                    // notify user
                    alert("Failed to create new player.");
                }
            }
            
        } catch (error) {
            console.error('Error during form submission:', error.message);
            alert(error);
        };
    }

    return (
        <>
            <h1>Players</h1>

            <p>Includes a section for adding players and a table showing each 
                Player ID, Name, Rank, and amount of League Points (LP).
            </p>
            <hr />
            <ul>
                <li>Add: Validates submitted data. If invalid, shows user error message. If valid,
                    shows user confirmation popup. If 'OK', sends request to create new player.
                    Notifies the user whether the new player was successfully created.</li>
                <li>View: takes the user to the ViewPlayer page.</li>
                <li>Edit: take the user to the UpdatePlayer page.</li>
                <li>Delete: initiates a confirmation popup. If 'OK', a request will be sent to delete 
                the associated player and a popup will notify the user whether the new player was
                successfully deleted.</li>
            </ul>
            <hr />

            <h2>Add New Player</h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="new_player_name">Name: </label>
                <input
                    type="text"
                    name="new_player_name"
                    id="new_player_name"
                    value={formData.new_player_name}
                    onChange={handleChange}
                />

                <label htmlFor="new_player_rank">Rank: </label>
                <RankDropdown ranks={ranks} formData={formData} handleChange={handleChange}/>

                <label htmlFor="new_player_lp">League Points: </label>
                <input
                    type="number"
                    name="new_player_lp"
                    id="new_player_lp"
                    value={formData.new_player_lp}
                    onChange={handleChange}
                />

                <button onClick={handleSubmit}>Add</button>
            </form>
            <hr />
            
            <h2>List of Players</h2>

            <table>
                <thead>
                    <tr>
                        {players.length > 0 && Object.keys(players[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th></th>{/* empty column for view*/}
                        <th></th>{/* empty column for edit*/}
                        <th></th>{/* empty column for delete*/}
                    </tr>
                </thead>
                <tbody>
                    {players.map((player, index) => (
                        <PlayersTableRow key={index} rowObject={player} backendURL={backendURL} getPlayers={getPlayers}/>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Players;
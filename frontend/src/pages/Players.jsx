/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: Form, Table, and Buttons for Players page

 * Citation:
 * This react page is adapted from the Module 6 starter code,
 * but specific handle logic is our own work.
*/

import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import RankDropdown from '../components/RankDropdown';
import PlayersTableRow from '../components/PlayersTableRow';
import { getRanks, getPlayers, createPlayer } from '../api/PlayersApi';
import { is_valid_player } from '../utils/validations';


function Players() {
    const [ranks, setRanks] = useState([]);
    const [players, setPlayers] = useState([]);
    const [formData, setFormData] = useState({
        player_name: '',
        player_rank: '',
        player_lp: '',
    });
    
    const loadDropdown = async () => {
        try {
            const { ranks } = await getRanks();
            setRanks(ranks);

        } catch (error) {
            console.log(`Failed to load ranks dropdown: ${error.message}`);
        }
    }

    const loadTable = async () => {
        try {
            const { players } = await getPlayers();
            setPlayers(players); 

        } catch (error) {
            console.log(`Failed to load players table: ${error.message}`);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = {
            ...formData,
            [name]: value
        };

        setFormData(updated);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        // validate submission
        if (!is_valid_player(formData, ranks)) {
            return;
        }

        // prompt user to confirm
        const confirmed = window.confirm("Create new player?");

        if (confirmed) {
            const response = await createPlayer(formData);

            if (response.ok) {
                console.log("Player creation was successful.");
                alert("New player created.");

                // clear form
                setFormData({
                    player_name: '',
                    player_rank: '',
                    player_lp: ''
                });
                // refresh table
                loadTable();

            } else {
                console.error("Error during POST request.");
                alert("Failed to create new player.");
            }
        }

    }

    useEffect(() => {
        loadDropdown();
        loadTable();
    }, []);

    return (
        <>
            <h1>Players</h1>

            <p>Includes a section for adding players. Displays a table showing the 
                Player ID, Name, Rank, and amount of League Points for each player.
            </p>
            <hr />
            <ul>
                <li>Add: Validates submitted data. If invalid, shows user error message. If valid,
                    shows confirmation popup. If 'OK', sends request to create new player.
                    Notifies whether new player was successfully created.</li>
                <li>View: Takes the user to the ViewPlayer page.</li>
                <li>Edit: Takes the user to the UpdatePlayer page.</li>
                <li>Delete: Shows confirmation popup. If 'OK', sends request to delete 
                the associated player. Notifies whether new player was successfully deleted.</li>
            </ul>
            <hr />

            <h2>Add New Player</h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="player_name">Name: </label>
                <input
                    type="text"
                    name="player_name"
                    id="player_name"
                    value={formData.player_name}
                    onChange={handleChange}
                />

                <label htmlFor="player_rank">Rank: </label>
                <RankDropdown ranks={ranks} formData={formData} handleChange={handleChange}/>

                <label htmlFor="player_lp">League Points: </label>
                <input
                    type="number"
                    name="player_lp"
                    id="player_lp"
                    value={formData.player_lp}
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
                        <PlayersTableRow key={index} rowObject={player} loadTable={loadTable}/>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Players;
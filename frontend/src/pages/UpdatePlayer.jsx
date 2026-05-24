import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RankDropdown from '../components/RankDropdown';
import { getRanks, getPlayer, updatePlayer } from '../api/PlayersApi';
import { is_valid_player } from '../utils/PlayersUtility';

function UpdatePlayer() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [ranks, setRanks] = useState([]);
    const [formData, setFormData] = useState({
        player_id: String(id),
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

    const loadPrefill = async () => {
        try {
            const player = await getPlayer(id);
            setFormData({
                ...formData,
                player_name: player.name,
                player_rank: String(player.rank_id),
                player_lp: String(player.lp)
            });
        } catch (error) {
            console.log(`Failed to load prefill data: ${error.message}`);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = {
            ...formData,
            [name]: value
        };
        //console.log("UPDATED STATE:", updated); // for debug

        setFormData(updated);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // validate submission
        if (!is_valid_player(formData, ranks)) {
            return;
        }
        
        // prompt user to confirm
        const confirmed = window.confirm(`Update player ${id}?`);

        if (confirmed) {
            const response = await updatePlayer(formData);

            if (response.ok) {
                console.log("Player update was successful.");
                alert("Player has been updated.");

                // return to table
                navigate("/players");

            } else {
                console.error("Error during PUT request.");
                alert("Failed to update player.");
            }
        }
            
    }

    useEffect(() => {
        loadDropdown();
        loadPrefill();
    }, []);

    //console.log('SNAPSHOT:', formData); // for debug

    return (
        <>

        <h1>Update Player</h1>
        <p>Allows the user to input and submit changes to the selected player.</p>
        <hr />
        <ul>
            <li>Update: Validates submitted data. If invalid, shows user error message. If valid,
                shows user confirmation popup. If 'OK', sends update request.
                Notifies the user whether the player was successfully updated.
            </li>
            <li>Cancel: returns the user back to the Players page.</li>
        </ul>
        <hr />

        <form>
            <label htmlFor="player_name">Name: </label>
            <input
                type="text"
                name="player_name"
                id="player_name"
                value={formData.player_name}
                placeholder="Player Name"
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
                placeholder="Current LP"
                onChange={handleChange}
            />
            <button onClick={handleSubmit}>Update</button>
        </form>
        
        <button id="cancel" onClick={() => navigate("/players")}>Cancel</button>
        </>
    )
    
}

export default UpdatePlayer;
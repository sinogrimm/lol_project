import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RankDropdown from '../components/RankDropdown';

function UpdatePlayer({ backendURL }) {
    const navigate = useNavigate();
    const {id} = useParams();
    const [ranks, setRanks] = useState([]);
    const [formData, setFormData] = useState({
        player_id: String(id),
        player_name: '',
        new_player_rank: '',
        player_lp: '',
    });

    const getPlayerToUpdate = async() => {
        const response = await fetch(`${backendURL}/player/${id}`);
        const {players} = await response.json();
        const player = players[0];
        //console.log(player);

        setFormData({
            player_id: String(id),
            player_name: player.name,
            new_player_rank: String(player.rank_id),
            player_lp: String(player.lp)
        });
    }

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
            if (!formData.player_name) {
                throw new Error("Name is required.");
            }
            // validate rank
            if (!formData.new_player_rank) {
                throw new Error("Rank is required.");
            }
            // validate league points
            if (!formData.player_lp) {
                throw new Error("LP is required.");
            }

            const rid   = Number(formData.new_player_rank);     // rank id
            const roi   = rid - 1;                              // rank object index
            const lp    = Number(formData.player_lp);       // league points

            if (lp < ranks[roi].lp_threshold) {
                throw new Error(`LP for ${ranks[roi].title} ranked player cannot be below ${ranks[roi].lp_threshold}.`);
            }
            if (rid != 10) {
                if (lp >= ranks[rid].lp_threshold) {
                    throw new Error(`LP for ${ranks[roi].title} ranked player cannot be ${ranks[rid].lp_threshold} or above.`);
                }
            }

            const confirmed = window.confirm(`Update player ${id}?`);
            if (confirmed) {
                // send POST request
                const response = await fetch(backendURL + '/players/update', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    console.log("Player updated successfully.");

                    // notify user
                    alert("Player has been updated.");
                    // return to table
                    navigate("/players");

                } else {
                    console.error("Error updating player.");

                    // notify user
                    alert("Failed to update player.");
                }
            }
            
        } catch (error) {
            console.error('Error during form submission:', error.message);
            alert(error);
        };
    }

    const getRanksForDropdown = async function () {
        try {
            // GET request for rank data
            const response = await fetch(backendURL + '/rank-dropdown');
            // convert response to JSON and destructure into array
            const {ranks} = await response.json();

            setRanks(ranks);    // update state with data

        } catch (error) {
            console.log(error);
        }
    }

    const confirmUpdate = () => {
        event.preventDefault();
        const confirmed = window.confirm("Update player ID?");
        if (confirmed) {
            alert("Updated player ID");
            navigate("/players");
        }
    }

    useEffect(() => {
        getPlayerToUpdate();
        getRanksForDropdown();
    }, []);

    // console.log("SNAPSHOT:", { ...formData });

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
            <label>Name: </label>
            <input
                type="text"
                name='player_name'
                value={formData.player_name}
                placeholder="Player Name"
                onChange={handleChange}
            />

            <label>Rank: </label>
            <RankDropdown ranks={ranks} formData={formData} handleChange={handleChange}/>


            <label>League Points: </label>
            <input
                type="number"
                name='player_lp'
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
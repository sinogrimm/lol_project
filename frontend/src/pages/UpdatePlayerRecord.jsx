import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPlayerRecord, updatePlayerRecord } from '../api/PlayerRecordsApi';

function UpdatePlayerRecord() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        record_id: String(id),
        player_id: '',
        lp_change: '',
    });

    const loadPrefill = async () => {
        try {
            const record = await getPlayerRecord(id);
            setFormData({
                ...formData,
                player_id: record.player_name,
                lp_change: String(record.lp_change),
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
        setFormData(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmed = window.confirm(`Update player record ${id}?`);
        if (confirmed) {
            const response = await updatePlayerRecord(formData);
            if (response.ok) {
                console.log("Player record update was successful.");
                alert("Player record has been updated.");
                navigate("/player-records");
            } else {
                console.error("Error during PUT request.");
                alert("Failed to update player record.");
            }
        }
    }

    useEffect(() => {
        loadPrefill();
    }, []);

    return (
        <>
            <h1>Update Player Record</h1>
            <p>Allows the user to input and submit changes to the selected player record.</p>
            <hr />
            <ul>
                <li>Update: Shows confirmation popup. If 'OK', sends update request and
                    notifies the user whether it was successful.</li>
                <li>Cancel: Returns the user back to the Player Records page.</li>
            </ul>
            <hr />
            <form>
                <label htmlFor="player_id">Player Name: </label>
                <input
                    type="text"
                    name="player_id"
                    id="player_id"
                    value={formData.player_id}
                    placeholder="Player Name"
                    onChange={handleChange}
                />
                <label htmlFor="lp_change">LP Change: </label>
                <input
                    type="number"
                    name="lp_change"
                    id="lp_change"
                    value={formData.lp_change}
                    placeholder="LP Change"
                    onChange={handleChange}
                />
                <button onClick={handleSubmit}>Update</button>
            </form>
            <button id="cancel" onClick={() => navigate("/player-records")}>Cancel</button>
        </>
    )
}

export default UpdatePlayerRecord;
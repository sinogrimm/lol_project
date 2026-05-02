import Navigation from '../components/Navigation';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UpdatePlayer() {

    const navigate = useNavigate();

    const confirmUpdate = () => {
        event.preventDefault();
        const confirmed = window.confirm("Update player ID?");
        if (confirmed) {
            alert("Updated player ID");
        }
        navigate("/players");
    }

    return (
        <>

        <h1>Update Player</h1>
        <p>Allows the user to input and submit changes to the selected player.</p>
        <ul>
            <li>Update: initiates confirmation popup. If 'OK', validates information
                before sending an update request. Notifies the user whether the player
                information was successfully updated.
            </li>
            <li>Cancel: returns the user back to the Players page.</li>
        </ul>

        <form>
            <label>Name: </label>
            <input
                type="text"
                placeholder="Player Name"
            />
            <label>Rank: </label>
            <select>
                <option>Select Rank</option>
            </select>
            <label>LP: </label>
            <input
                type="number"
                placeholder="Current LP"
            />
            <button onClick={confirmUpdate}>Update</button>
        </form>
        
        <button onClick={() => navigate("/players")}>Cancel</button>
        </>
    )
    
}

export default UpdatePlayer;
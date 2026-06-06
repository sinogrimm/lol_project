/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: Table for Teams page

 * This react page is our own work.
*/

import { useState, useEffect } from 'react';
import TableRow from "../components/TableRow";

function Teams({ backendURL }) {
    const [teams, setTeams] = useState([]);

    const getTeams = async function() {
        try {
            // GET request for teams data
            const response = await fetch(backendURL + '/teams');
            // convert response to JSON and destructure into array
            const {teams} = await response.json();

            setTeams(teams); // update state with data

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTeams();  
    }, []);

    return (
        <>
            <h1>Teams</h1>
            <p>Displays the Team ID, Game ID, and Result for each team.</p>
            <p>Note: New teams are  added through the CreateGames page. Teams are tied to games and player records,
                so existing teams cannot be edited, but are deleted by cascade when deleting a game through
                the Games page.</p>
            <hr />
            <table>
                <thead>
                    <tr>
                        {teams.length > 0 && Object.keys(teams[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team, index) => (
                        <TableRow key={index} object={team}/>
                    ))}
                </tbody>
            </table>
        </>        
    )

}

export default Teams;
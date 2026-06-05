import { useState, useEffect } from 'react';
import RecordsTableRow from "../components/RecordsTableRow";

function PlayerRecords({ backendURL }) {
    const [records, setRecords] = useState([]);

    const getRecords = async function() {
        try {
            // GET request for player records data
            const response = await fetch(backendURL + '/player-records');
            // convert response to JSON and destructure into array
            const {records} = await response.json();

            setRecords(records); // update state with data

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getRecords();  
    }, []);
    
    return (
        <>
            <h1>Player Records</h1>
            <p>Displays the Player Record ID, Team ID, Player Name, and league
                point (LP) Change for each Player Record. </p>
            <p>Note: This is a static lookup page. New player records are automatically added through 
                the CreateGames page and can be edited through the UpdateGames page. Cannot be deleted
                as to retain a complete record of games and how they affected each player.</p>
            <hr />
            <table>
                <thead>
                    <tr>
                        {records.length > 0 && Object.keys(records[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    <th></th>{/* empty column for edit buttons*/}
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <RecordsTableRow key={index} rowObject={record} loadTable={getRecords}/>
                    ))}
                </tbody>
            </table>
        </>        
    )

}

export default PlayerRecords;
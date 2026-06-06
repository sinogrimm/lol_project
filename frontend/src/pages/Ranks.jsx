/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: Table for Ranks page

 * This react page is our own work.
*/

import { useState, useEffect } from 'react';
import TableRow from '../components/TableRow';

function Ranks({ backendURL }) {
    const [ranks, setRanks] = useState([]);
    
    const getRanks = async function () {
        try {
            // GET request for rank data
            const response = await fetch(backendURL + '/ranks');
            // convert response into JSON and destructure into array
            const {ranks} = await response.json();

            setRanks(ranks);
    
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        getRanks();
    }, []);

    return (
        <>
            <h1>Ranks</h1>
            <p>Displays the Rank ID, Title, and lower league point Threshold for
                each available rank.</p>
            <p>Note: This is a static lookup page. New ranks cannot be added, current ranks cannot be
                updated, and current ranks cannot be deleted. The scope of our project is limited to
                these ten ranks.</p>
            <hr />
            <table>
                <thead>
                    <tr>
                        {ranks.length > 0 && Object.keys(ranks[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {ranks.map((rank, index) => (
                        <TableRow key={index} object={rank}/>
                    ))}
                </tbody>
            </table>
        </>        
    )

}

export default Ranks;
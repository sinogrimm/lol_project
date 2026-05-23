import { Navigate, useNavigate } from 'react-router-dom';

const PlayersTableRow = ({ rowObject, backendURL, getPlayers }) => {
    const navigate = useNavigate();

    // console.log(rowObject); // for debug

    const handleDelete = async (e) => {
        const data = {
            delete_player_id: rowObject['Player ID'],
            delete_player_name: rowObject['Name']
        };

        try {
            const confirmed = window.confirm(`Delete player ${rowObject['Player ID']}?`);
            if (confirmed) {
                // send POST request
                const response = await fetch(backendURL + '/players/delete', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    console.log("Player deleted.");

                    // notify user
                    alert("Player has been deleted.");
                    // refresh table
                    getPlayers();

                } else {
                    console.error("Error deleting person.");

                    // notify user
                    alert("Failed to delete player.");
                }
            } 
            } catch (error) {
                console.error('Error during form submission:', error);
            }
            
            
    };
    

    const confirmDelete = () => {
        const confirmed = window.confirm("Delete player ID?");
        if (confirmed) {
            alert("Deleted player ID");
        }
    }

    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}
            <td><button onClick={() => navigate("/viewplayer")}>View</button></td>
            <td><button onClick={() => navigate(`/updateplayer/${rowObject['Player ID']}`)}>Edit</button></td>
            <td><button onClick={handleDelete}>Delete</button></td>
        </tr>
    )
}

export default PlayersTableRow;
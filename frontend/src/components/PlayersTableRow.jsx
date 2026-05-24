import { Navigate, useNavigate } from 'react-router-dom';
import { deletePlayer } from '../api/PlayersApi';

const PlayersTableRow = ({ rowObject, loadTable }) => {
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        const data = {
            delete_player_id: rowObject['Player ID'],
            delete_player_name: rowObject['Name']
        };

        // prompt user to confirm
        const confirmed = window.confirm(`Delete player ${rowObject['Player ID']}?`);

        if (confirmed) {
            const response = await deletePlayer(data);

            if (response.ok) {
                console.log("Player deletion was successful.");
                alert("Player has been deleted.");

                // refresh table
                loadTable();

            } else {
                console.error("Error during DELETE request.");
                alert("Failed to delete player.");
            }
        }
            
    };

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
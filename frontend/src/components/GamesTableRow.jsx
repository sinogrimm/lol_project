import { Navigate, useNavigate } from 'react-router-dom';
import { deleteGame } from '../api/GamesApi';


const GamesTableRow = ({ rowObject, loadGamesTable }) => {
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        const data = {
            delete_game_id: rowObject['Game ID']};

        // prompt user to confirm
        const confirmed = window.confirm(`Delete game ${rowObject['Game ID']}?`);

        if (confirmed) {
            const response = await deleteGame(data);

            if (response.ok) {
                console.log("Game deletion was successful.");
                alert("Game has been deleted.");

                // refresh table
                loadGamesTable();

            } else {
                console.error("Error during DELETE request.");
                alert("Failed to delete game.");
            }
        }
            
    };

    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}
            <td><button onClick={() => navigate(`/viewgame/${rowObject['Game ID']}`)}>View</button></td>
            <td><button onClick={() => navigate("/updategame")}>Edit</button></td>
            <td><button onClick={handleDelete}>Delete</button></td>
        </tr>
    )
}

export default GamesTableRow;
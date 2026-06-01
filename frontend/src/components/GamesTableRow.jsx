import { Navigate, useNavigate } from 'react-router-dom';

const GamesTableRow = ({ games }) => {
    const navigate = useNavigate();

    return (
        <tr>
            {Object.values(games).map((value, index) => (
                <td key={index}>{value}</td>
            ))}
            <td><button onClick={() => navigate(`/viewgame/${games['Game ID']}`)}>View</button></td>
            <td><button onClick={() => navigate("/updategame")}>Edit</button></td>
        </tr>
    )
}

export default GamesTableRow;
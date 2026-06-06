/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: TableRow for PlayerRecords page

 The following code is all our own work.
*/

import { Navigate, useNavigate } from 'react-router-dom';

const RecordsTableRow = ({ rowObject, loadTable }) => {
    const navigate = useNavigate();

    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}
            <td><button onClick={() => navigate(`/updateplayerrecord/${rowObject['Player Record ID']}`)}>Edit</button></td>
        </tr>
    )
}

export default RecordsTableRow;
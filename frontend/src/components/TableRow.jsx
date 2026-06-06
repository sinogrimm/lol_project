/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: generic TableRow for Teams and Ranks page

 The following code is all our own work.
*/

const TableRow = ({ object }) => {
    return (
        <tr>
            {Object.values(object).map((value, index) => (
                <td key={index}>{value}</td>
            ))}
        </tr>
    )
}

export default TableRow;

const HistoryTableRow = ({ game }) => {

    return (
        <tr>
            {Object.values(game).map((value, index) => (
                <td key={index}>{value}</td>
            ))}
        </tr>
    )
}

export default HistoryTableRow;
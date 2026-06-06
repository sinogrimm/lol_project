/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: PlayerDropdown for CreateGame page

 * Citation:
 * The following react component is adapted from the Module 6 starter code.
 * The handling of values is our own work.
 * (see full citation in README)
*/

const PlayerDropdown = ({ players, playersData, handlePlayerSelect, lane, team }) => {
    return (
        <select
            value={playersData[lane + '_pid']}
            onChange={(e) => { handlePlayerSelect(e, lane, team); }}
        >
            <option value="">Select Player</option>
            {players.map((player, index) => (
                <option value={player.player_id} key={index}>{player.name}</option>
            ))}
        </select>
    )
}

export default PlayerDropdown;
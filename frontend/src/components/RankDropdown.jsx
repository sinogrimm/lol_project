/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: PlayerDropdown for Players and UpdatePlayers page

 * Citation:
 * The following react component is based on the Module 6 starter code.
 * (see full citation in README)
*/

const RankDropdown = ({ ranks, formData, handleChange }) => {

    return (
        <select
            name="player_rank"
            id="player_rank"
            value={formData.player_rank}
            onChange={handleChange}
        >
            <option value="">Select Rank</option>
            {ranks.map((rank, index) => (
                <option value={rank['Rank ID']} key={index}>{rank['Title']}</option>
            ))}
        </select>
    )
}

export default RankDropdown;
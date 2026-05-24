
const RankDropdown = ({ ranks, formData, handleChange }) => {

    return (
        <select
            name="player_rank"
            id="player_rank"
            value={formData.player_rank}
            onChange={(e) => {
                //console.log("SELECT VALUE:", e.target.value); // for debug
                handleChange(e);
            }}
        >
            <option value="">Select Rank</option>
            {ranks.map((rank, index) => (
                <option value={rank['Rank ID']} key={index}>{rank['Title']}</option>
            ))}
        </select>
    )
}

export default RankDropdown;
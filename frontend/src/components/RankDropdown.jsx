
const RankDropdown = ({ ranks, formData, handleChange }) => {

    // console.log(ranks); // for debug

    return (
        <select
            name="new_player_rank"
            id="rank_dropdown"
            value={formData.new_player_rank}
            onChange={(e) => {
                console.log("SELECT VALUE:", e.target.value); // for debug
                handleChange(e);
            }}
        >
            <option value="">Select Rank</option>
            {ranks.map((rank, index) => (
                <option value={rank.rank_id} key={index}>{rank.title}</option>
            ))}
        </select>
    )
}

export default RankDropdown;
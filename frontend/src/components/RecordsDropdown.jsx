const RecordsDropdown = ({ players, formData, handleChange }) => {
    return (
        <select
            name="player_id"
            id="player_id"
            value={formData.player_id}
            onChange={(e) => {
                handleChange(e);
            }}
        >
            <option value="">Select Player</option>
            {players.map((player, index) => (
                <option value={player.player_id} key={index}>{player.name}</option>
            ))}
        </select>
    );
};

export default RecordsDropdown;
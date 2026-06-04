const backendURL = import.meta.env.VITE_BACKEND_URL;

/**
 * Sends GET request for SELECT to fill out games table.
 */
const getGames = async () => {
    const response = await fetch(backendURL + '/games');
    return response.json();
}

/**
 * Gets info for specified game id.
 */
const getGame = async(id) => {
    const response = await fetch(`${backendURL}/viewgame-game/${id}`);
    const {games} = await response.json();
    const game = games[0];

    return game;
}

/**
 * Gets teams for specified game id.
 */
const getTeams = async(id) => {
    const response = await fetch(`${backendURL}/viewgame-teams/${id}`);
    const {teams} = await response.json();

    return teams;
}

/**
 * Gets players for specified team id.
 */
const getPlayers = async(id) => {
    const response = await fetch(`${backendURL}/viewgame-players/${id}`);
    const {players} = await response.json();

    return players;
}

/**
 * Sends DELETE request to DELETE game data.
 */
const deleteGame = async (data) => {
    const response = await fetch(backendURL + '/games/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response;
}

export { getGames, getGame, getTeams, getPlayers, deleteGame }
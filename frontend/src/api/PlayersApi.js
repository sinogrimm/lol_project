const backendURL = import.meta.env.VITE_BACKEND_URL;

/**
 * Sends GET request for SELECT to fill out ranks dropdown menu.
 */
const getRanks = async () => {
    const response = await fetch(backendURL + '/ranks');
    return await response.json();
}

/**
 * Sends GET request for SELECT to fill out players table.
 */
const getPlayers = async () => {
    const response = await fetch(backendURL + '/players');
    return response.json();
}

/**
 * Sends GET request for SELECT to retrieve player from ID.
 */
const getPlayer = async (id) => {
    const response = await fetch(`${backendURL}/player/${id}`);
    const {players} = await response.json();
    const player = players[0];

    return player;
}

/**
 * Sends POST request to INSERT new player data.
 */
const createPlayer = async (formData) => {
    const response = await fetch(backendURL + '/players/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });
    return response;
}

/**
 * Sends PUT request to UPDATE player data.
 */
const updatePlayer = async (formData) => {
    const response = await fetch(backendURL + '/players/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });
    return response;
}

/**
 * Sends DELETE request to DELETE player data.
 */
const deletePlayer = async (data) => {
    const response = await fetch(backendURL + '/players/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response;
}


export { getRanks, getPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer };
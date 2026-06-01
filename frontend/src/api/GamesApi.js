const backendURL = import.meta.env.VITE_BACKEND_URL;

/**
 * Sends GET request for SELECT to fill out games table.
 */
const getGames = async () => {
    const response = await fetch(backendURL + '/games');
    return response.json();
}

export { getGames }
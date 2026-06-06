/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: API functions for PlayerRecords related pages.

 The following functions are all our own work.
*/

const backendURL = import.meta.env.VITE_BACKEND_URL;

const getPlayerRecord = async (id) => {
    const response = await fetch(`${backendURL}/playerrecord/${id}`);
    const { playerRecords } = await response.json();
    return playerRecords[0];
};

const updatePlayerRecord = async (formData) => {
    const response = await fetch(backendURL + '/playerrecords/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });
    return response;
};

const getPlayerByName = async (name) => {
    const response = await fetch(backendURL + '/player-dropdown');
    const { players } = await response.json();
    return players.find(p => p.name === name) ?? null;
};

export { getPlayerRecord, updatePlayerRecord, getPlayerByName };
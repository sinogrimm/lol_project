const backendURL = import.meta.env.VITE_BACKEND_URL;

/**
 * Sends POST request to CALL reset_db() stored procedure.
 */
const resetDB = async () => {
    const response = await fetch(backendURL + '/reset', {
        method: 'POST',
    });
    return response;
}

export { resetDB };
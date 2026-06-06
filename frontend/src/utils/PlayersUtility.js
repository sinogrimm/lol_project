/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: Validation Functions

 * Citation:
 * ChatGPT was used to write the functions for checking date and time
 * string formats?
 * The rest of the work is our own.
 * (see specific citations per function)
*/

/////////////////////////////////////////////////////////////////////////////

/**
 * Determines whether the player data submitted from the form is valid.
 * 
 * Citation:
 * RW - This function is completely my own work.
 * 
 * @param {*} formData dictionary of submitted player data
 * @param {*} ranks array of dictionaries of rank data
 * @returns true if valid, false if invalid
 */
const is_valid_player = (formData, ranks) => {
    try {
        // validate name
        if (!formData.player_name) {
            throw new Error("Name is required.");
        }
        // validate rank
        if (!formData.player_rank) {
            throw new Error("Rank is required.");
        }    
        // validate league points
        if (!formData.player_lp) {
            throw new Error("LP is required.");
        }

        const rid   = Number(formData.player_rank); // rank id
        const roi   = rid - 1;                      // rank object index
        const lp    = Number(formData.player_lp);   // league points

        if (lp < ranks[roi]['Threshold']) {
            throw new Error(`LP for ${ranks[roi]['Title']} ranked player cannot be below ${ranks[roi]['Threshold']}.`);
        }
        if (rid == 10) {
            if (lp > 1000) {
                throw new Error(`LP for ${ranks[roi]['Title']} ranked player cannot be above 1000.`);
            }
        } else {
            if (lp >= ranks[rid]['Threshold']) {
                throw new Error(`LP for ${ranks[roi]['Title']} ranked player cannot be ${ranks[rid]['Threshold']} or above.`);
            }
        }

        return true;

    } catch (error) {
        console.error('Error during form submission:', error.message);
        alert(error);

        return false;
    }
}

/**
 * Determines whether the start_time submitted is in the correct datetime format
 * for MySQL and that the datetime exists.
 * 
 * Citation: 
 * 
 * @param {string} datetime string for start_time
 * @returns true if valid, false if invalid
 */
function is_valid_datetime(datetime) {
    try {
        // must be in YYYY-MM-DD HH:MM:SS


        return true;
    } catch(error) {
        console.error('Error during datetime validation:', error.message);
    }
    
}

export { is_valid_player };
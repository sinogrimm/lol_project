/**
 * Determines whether the player data submitted from the form is valid.
 * @param {*} formData dictionary of submitted player data
 * @param {*} ranks array of dictionaries of rank data
 * @returns true if valid
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

export { is_valid_player };
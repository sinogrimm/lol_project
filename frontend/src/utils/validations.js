/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: Validation Functions

 * Citation:
 * ChatGPT was used to assist in the formation of two functions.
 * The rest of the work is our own.
 * (see full citation in README and specific citations per function)
*/

/////////////////////////////////////////////////////////////////////////////

/**
 * Determines whether the player data submitted from the form is valid.
 * 
 * This function is original.
 * 
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

/**
 * Determines whether the start_time submitted is in the correct datetime format
 * and that the datetime actually exists.
 * 
 * Citation (6/6/2026):
 * Adapted from ChatGPT written function. Added error handling.
 * Prompt: "Write a concise yet thorough function that will test if a string is in mysql
 * datetime format and exists on the calendar in jsx."
 * 
 * @param {string} start_time
 * @returns true if valid
 */
function is_valid_start_time(start_time) {
    try {
        const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(start_time);

        if (!regex) {
            throw new Error("Start time must be in YYYY-MM-DD HH:MM:SS format.");
        }

        const [, y, mo, d, h, mi, s] = regex.map(Number);
        const dt = new Date(Date.UTC(y, mo - 1, d, h, mi, s));

        if (dt.getUTCFullYear() === y && dt.getUTCMonth() + 1 === mo && dt.getUTCDate() === d
            && dt.getUTCHours() === h && dt.getUTCMinutes() === mi && dt.getUTCSeconds() === s) {
                return true;
        } else {
            throw new Error("Start time must exist in the calendar.");
        }

    } catch (error) {
        console.error('Error during form submission:', error.message);
        alert(error);

        return false;
    }
}

/**
 * Determines whether the duration submitted is a valid time in the correct format.
 * 
 * Citation (6/6/2026):
 * Copied regex from ChatGPT response. The rest of the function is original.
 * Prompt: "Write a regex that will test if a string is in mysql time format and is a valid time."
 * 
 * @param {string} duration
 * @returns true if valid
 */
function is_valid_duration(duration) {
    try {
        const regex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

        if (!regex.test(duration)) {
            throw new Error("Duration must be a valid time in HH:MM:SS format.");
        } else {
            return true;
        }
    } catch (error) {
        console.error('Error during form submission:', error.message);
        alert(error);
    }
}

/**
 * Determines whether the players selected form valid team compositions.
 * 
 * This function is original.
 * 
 * @param {*} redteam object for red team players data
 * @param {*} blueteam object for blue team players data
 * @returns true if valid
 */
function is_valid_team_comp(redteam, blueteam) {
    try {
        let unique_set = new Set();

        // add players from red team
        unique_set.add(redteam.top_pid);
        unique_set.add(redteam.jgl_pid);
        unique_set.add(redteam.mid_pid);
        unique_set.add(redteam.bot_pid);
        unique_set.add(redteam.sup_pid);

        // add players from blue team
        unique_set.add(blueteam.top_pid);
        unique_set.add(blueteam.jgl_pid);
        unique_set.add(blueteam.mid_pid);
        unique_set.add(blueteam.bot_pid);
        unique_set.add(blueteam.sup_pid);

        if (unique_set.size !== 10) {
            throw new Error("Players can only be selected once.");
        }
        for (const player of unique_set) {
            if (player === "") {
                throw new Error("There must be ten participating players.");
            }
        }
        return true;

    } catch (error) {
        console.error('Error during form submission:', error.message);
        alert(error);
    }
}

/**
 * Determines whether the team results are valid.
 * 
 * This function is original.
 * 
 * @param {*} redteam object for red team data
 * @param {*} blueteam object for blue team data
 * @returns true if valid
 */
function is_valid_result(redteam, blueteam) {
    try {
        if (redteam.result === 'VICTORY' && redteam.result === blueteam.result) {
            throw new Error("Teams cannot both win.");
        }
        if (redteam.result === 'DEFEAT' && redteam.result === blueteam.result) {
            throw new Error("Teams cannot both lose.");
        }

        return true;

    } catch (error) {
        console.error('Error during form submission:', error.message);
        alert(error);
    }
}

/**
 * Determines whether the lp changes for players are
 * valid based on their team results.
 * 
 * This function is original.
 * 
 * @param {*} team object for team data
 * @param {*} players object for team players data
 * @returns true if valid
 */
function is_valid_change(team, players) {
    try {
        if (team.result === 'VICTORY') {
            if (players.top_lpc < 1 || players.jgl_lpc < 1 || players.mid_lpc < 1
                || players.bot_lpc < 1 || players.sup_lpc < 1) {
                    throw new Error("Winning team players must have positive LP Change.");
                }
            return true;
        } else {
            if (players.top_lpc > -1 || players.jgl_lpc > -1 || players.mid_lpc > -1
                || players.bot_lpc > -1 || players.sup_lpc > -1) {
                    throw new Error("Losing team players must have negative LP Change.");
                }
            return true;
        }
    } catch (error) {
        console.error('Error during form submission:', error.message);
        alert(error);
    }

}

export { is_valid_player, is_valid_start_time, is_valid_duration, is_valid_team_comp,
    is_valid_result, is_valid_change }
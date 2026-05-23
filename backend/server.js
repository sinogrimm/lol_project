// ########################################
// ########## SETUP

// Database
const db = require('./database/rw-db-connector');   // match to local file to use!

// Express
const express = require('express');
const app = express();

// Middleware
const cors = require('cors');
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests


const PORT = 1787;

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/players', async (req, res) => {
    try {
        // get all player information for table
        const players_query = `
            SELECT Players.player_id AS "Player ID", Players.name AS "Name",
                Ranks.title AS "Rank", Players.lp AS "League Points"
            FROM Players
                INNER JOIN Ranks
                ON Players.rank_id = Ranks.rank_id
            ORDER BY Players.player_id DESC
            ;`;

        const [players] = await db.query(players_query);
    
        res.status(200).json({ players });  // send results to frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }

});

app.get('/rank-dropdown', async (req, res) => {
    try {
        // get rank id and title for dropdown
        // get lp_threshold for validation
        const rank_util_query = `
            SELECT Ranks.rank_id, Ranks.title, Ranks.lp_threshold
            FROM Ranks
            ORDER BY Ranks.lp_threshold ASC
            ;`;

        const [ranks] = await db.query(rank_util_query);
    
        res.status(200).json({ ranks });  // send results to frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
    
});

app.get('/player-dropdown', async (req, res) => {
    try {
        // get player id and name for dropdown
        const players_query = `
            SELECT Players.player_id, Players.name
            FROM Players
            ORDER BY Players.name ASC
            ;`;
        
        const [players] = await db.query(players_query);
    
        res.status(200).json({ players });  // send results to frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
    
});

app.get('/games', async (req, res) => {
    try {
        // get all game information for table
        const games_query = `
            SELECT Games.game_id AS "Game ID", Games.start_time AS "Start Time",
                Games.duration AS "Duration"
            FROM Games
            ORDER BY Games.game_id DESC
            ;`;

        const [games] = await db.query(games_query);
    
        res.status(200).json({ games });  // send results to frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
    
});

app.get('/teams', async (req, res) => {
    try {
        // get all team information for table
        const teams_query = `
            SELECT Teams.team_id AS "Team ID", Teams.game_id AS "Game ID",
                Teams.result AS "Result"
            FROM Teams
            ORDER BY Teams.team_id DESC
            ;`;

        const [teams] = await db.query(teams_query);
    
        res.status(200).json({ teams });  // send results to frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }

});

app.get('/player-records', async (req, res) => {
    try {
        // get all player records information for table
        const records_query = `
            SELECT PlayerRecords.player_record_id AS "Player Record ID",
                PlayerRecords.team_id AS "Team ID",
                Players.name AS "Player Name", PlayerRecords.lp_change AS "LP Change"
            FROM PlayerRecords
                INNER JOIN Players
                ON PlayerRecords.player_id = Players.player_id
            ORDER BY PlayerRecords.player_record_id DESC
            ;`;

        const [records] = await db.query(records_query);
    
        res.status(200).json({ records });  // send results to frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }

});

app.get('/ranks', async (req, res) => {
    try {
        // get all rank information for table
        const ranks_query = `
            SELECT Ranks.rank_id AS "Rank ID", Ranks.title AS "Title", Ranks.lp_threshold "Threshold"
            FROM Ranks
            ORDER BY Ranks.lp_threshold ASC
            ;`;

        const [ranks] = await db.query(ranks_query);
    
        res.status(200).json({ ranks });  // send results to frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
    
});


// CREATE ROUTES
app.post('/players/create', async function (req, res) {
    try {
        // parse request
        let data = req.body;

        const query = `CALL sp_CreatePlayer(?, ?, ?, @new_player_id);`;

        const [[[result]]] = await db.query(query, [
            data.new_player_name,
            data.new_player_rank,
            data.new_player_lp,
        ]);
        // console.log(result); // for debug

        console.log(`CREATED Player. ID: ${result.new_player_id }` +
            ` Name: ${data.new_player_name}`
        );

        res.status(200).json({ message: 'New player created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send('An error occurred while executing database queries.');
    }
});

// DELETE ROUTES
app.delete('/players/delete', async function (req, res) {
    try {
        let data = req.body;
        const query =  `CALL sp_delete_player(?);`;
        await db.query(query, [data.delete_player_id]);

        console.log(`DELETE Player. ID: ${data.delete_player_id} ` +
            `Name: ${data.delete_player_name}`
        );
        res.status(204).json({ message: 'Deleted player successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send('An error occurred while executing the database queries.');
    }
});



// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});
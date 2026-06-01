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
            SELECT Games.game_id AS "Game ID", 
                DATE_FORMAT(Games.start_time, '%Y-%m-%d %H:%i:%s') AS "Start Time",
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

app.get('/viewgame-game/:id', async(req, res) => {
    const id = req.params.id;

    try {
        const query = `
            SELECT Games.game_id,
                DATE_FORMAT(Games.start_time, '%Y-%m-%d %H:%i:%s') AS start_time,
                Games.duration
            FROM Games
            WHERE Games.game_id = ${id}
            ;`;
        const [games] = await db.query(query);
        
        res.status(200).json({ games });

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
})

app.get('/viewgame-teams/:id', async(req, res) => {
    const id = req.params.id; // game id

    try {
        const query = `
            SELECT team_id, result
            FROM Teams
            WHERE game_id = ${id}
            ORDER BY team_id ASC
            ;`;
        const [teams] = await db.query(query);

        res.status(200).json({teams});

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
})

app.get('/viewgame-players/:id', async(req, res) => {
    const id = req.params.id // team id

    try {
        const query = `
            SELECT PlayerRecords.player_record_id AS 'Player Record ID',
                Players.name AS 'Name', Ranks.title AS 'Rank',
                PlayerRecords.lp_change AS 'LP Change'
            FROM PlayerRecords
                INNER JOIN Players
                    ON PlayerRecords.player_id = Players.player_id
                INNER JOIN Ranks
                    ON Players.rank_id = Ranks.rank_id
            WHERE PlayerRecords.team_id = ${id}
            ;`;
        const [players] = await db.query(query);

        res.status(200).json({players});

    } catch (error) {
        console.error("Error executing queries:", error);
        res.status(500).send("An error occurred while executing the database queries.");
    }
})

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
        console.error('Error during query execution:', error.message);
        res.status(500).send("An error occurred while executing the database queries.");
    }
    
});

app.get('/player/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const query = `
            SELECT Players.name, Players.rank_id, Players.lp
            FROM Players
            WHERE Players.player_id = ${id}
            ;`;

        const [players] = await db.query(query);

        console.log(`FETCHED PLAYER: ID = ${id}`);
        res.status(200).json({ players });

    } catch (error) {
        console.error('Error during query execution:', error.message);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

app.get('/viewplayer-title/:id', async(req, res) => {
    const id = req.params.id;

    try {
        const query = `
            SELECT Players.name, Ranks.title
            FROM Players
                INNER JOIN Ranks
                ON Players.rank_id = Ranks.rank_id
            WHERE Players.player_id = ${id}
            ;`;
        const [player] = await db.query(query);

        console.log(`FETCHED PLAYER: ID = ${id}`);
        res.status(200).json({ player });

    } catch (error) {
        console.error('Error during query execution:', error.message);
        res.status(500).send("An error occurred while executing the database queries.");
    }
})

app.get('/viewplayer-history/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const query = `
            SELECT Games.game_id AS "Game ID", 
                DATE_FORMAT(Games.start_time, '%Y-%m-%d %H:%i:%s') AS "Start Time",
                Teams.result AS "Result", PlayerRecords.lp_change AS "LP Change"
            FROM Games
                INNER JOIN Teams
                    ON Teams.game_id = Games.game_id
                INNER JOIN PlayerRecords
                    ON PlayerRecords.team_id = Teams.team_id
                INNER JOIN Players
                    ON Players.player_id = PlayerRecords.player_id
            WHERE Players.player_id = ${id}
            ORDER BY Games.start_time DESC
            ;`;
        
        const [playerHistory] = await db.query(query);

        console.log(`FETCHED PLAYER: ID = ${id}`);
        res.status(200).json({ playerHistory });

    } catch (error) {
        console.error('Error during query execution:', error.message);
        res.status(500).send("An error occurred while executing the database queries.");
    }
});

// CREATE ROUTES
app.post('/players/create', async function (req, res) {
    try {
        let data = req.body;

        const query = `CALL sp_create_player(?, ?, ?, @new_player_id);`;

        const [[[result]]] = await db.query(query, [
            data.player_name,
            data.player_rank,
            data.player_lp,
        ]);

        console.log(`CREATED PLAYER: ID = ${result.new_player_id }, ` +
            `Name = ${data.player_name}`
        );
        res.status(200).json({ message: 'Player created successfully.' });

    } catch (error) {
        console.error('Error during query execution:', error.message);
        res.status(500).send('An error occurred while executing database queries.');
    }
});


// UPDATE ROUTES
app.put('/players/update', async function (req, res) {
    try {
        let data = req.body;

        query = 'CALL sp_update_player(?, ?, ?, ?);';
        await db.query(query, [
            data.player_id,
            data.player_name,
            data.player_rank,
            data.player_lp,
        ]);

        console.log(`UPDATED PLAYER: ID = ${data.player_id}`);
        res.status(200).json({ message: 'Player updated successfully.' });

    } catch (error) {
        console.error('Error during query execution:', error.message);
        res.status(500).send('An error occured while executing database queries.');
    }
});

// DELETE ROUTES
app.delete('/players/delete', async function (req, res) {
    try {
        let data = req.body;

        const query =  `CALL sp_delete_player(?);`;
        await db.query(query, [data.delete_player_id]);

        console.log(`DELETED PLAYER: ID = ${data.delete_player_id}, ` +
            `Name = ${data.delete_player_name}`
        );
        res.status(204).json({ message: 'Player deleted successfully.' });

    } catch (error) {
        console.error('Error during query execution:', error.message);
        res.status(500).send('An error occurred while executing database queries.');
    }
});

// RESET ROUTE
app.post('/reset', async function (req, res) {
    try {
        await db.query('CALL reset_db()');
        console.log('Database reset successfully.');
        res.status(200).json({ message: 'Database reset successfully.' });

    } catch (error) {
        console.error('Error during query execution:', error.message);
        res.status(500).send('An error occurred while executing database queries.');
    }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});
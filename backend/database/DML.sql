/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: Data Manipulation Queries

 The following queries are all our own work.
*/

/*************************************************************************
 * SELECTs (READ)
 * to display the contents of each table on their respective web page
 ************************************************************************/

-- RW: get all player information for Players page

SELECT Players.player_id AS "Player ID", Players.name AS "Name",
    Ranks.title AS "Rank", Players.lp AS "League Points"
FROM Players
    INNER JOIN Ranks
        ON Players.rank_id = Ranks.rank_id
ORDER BY Players.player_id DESC
;

-- RW: get all game information for Games page

SELECT Games.game_id AS "Game ID", 
    DATE_FORMAT(Games.start_time, '%Y-%m-%d %H:%i:%s') AS "Start Time",
    Games.duration AS "Duration"
FROM Games
ORDER BY Games.game_id DESC
;

-- RW: get all team information for Teams page

SELECT Teams.team_id AS "Team ID", Teams.game_id AS "Game ID",
    Teams.result AS "Result"
FROM Teams
ORDER BY Teams.team_id DESC
;

-- RW: get all player record information for PlayerRecords page

SELECT PlayerRecords.player_record_id AS "Player Record ID",
    PlayerRecords.team_id AS "Team ID",
    IFNULL(Players.name, '[Deleted Player]') AS "Player Name",
    PlayerRecords.lp_change AS "LP Change"
FROM PlayerRecords
    LEFT JOIN Players
    ON PlayerRecords.player_id = Players.player_id
ORDER BY PlayerRecords.player_record_id DESC
;

-- RW: get all rank information for the Ranks page
-- RW: also used for rank dropdown and lp input validation

SELECT Ranks.rank_id AS "Rank ID", Ranks.title AS "Title", Ranks.lp_threshold "Threshold"
FROM Ranks
ORDER BY Ranks.lp_threshold ASC
;

/*************************************************************************
 * SELECTs
 * to display special views showing information for a table row that
 * are from other tables
 ************************************************************************/

-- RW: get player game history for ViewPlayer page
/*
 * Each view button is linked to the `player_id` for the row they are on.
*/

-- RW: get player information for page text
SELECT Players.name, Ranks.title
FROM Players
    INNER JOIN Ranks
    ON Players.rank_id = Ranks.rank_id
WHERE Players.player_id = :player_id_from_click
;

-- RW: get all game information associated with player
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
WHERE Players.player_id = :player_id_from_click
ORDER BY Games.start_time DESC
;

-- RW: get comprehensive game information for ViewGame page
/*
 * Each view button is linked to the `game_id` for the row they are on.
*/

-- RW: get basic game information
SELECT Games.game_id,
    DATE_FORMAT(Games.start_time, '%Y-%m-%d %H:%i:%s') AS start_time,
    Games.duration
FROM Games
WHERE Games.game_id = :game_id_from_click
;

-- RW: get teams information associated with game
SELECT team_id, result
FROM Teams
WHERE game_id = :game_id_from_click
ORDER BY team_id ASC
;

-- RW: get basic player and player record information associated with team
SELECT PlayerRecords.player_record_id AS 'Player Record ID',
    IFNULL(Players.name, '[Deleted Player]') AS 'Name',
    PlayerRecords.lp_change AS 'LP Change'
FROM PlayerRecords
    LEFT JOIN Players
        ON PlayerRecords.player_id = Players.player_id
    LEFT JOIN Ranks
        ON Players.rank_id = Ranks.rank_id
WHERE PlayerRecords.team_id = :team_id_from_query
;

/*************************************************************************
 * SELECTs
 * for utility purposes
 ************************************************************************/

-- RW: get player information for prefilling form in UpdatePlayer page

SELECT Players.name, Players.rank_id, Players.lp
FROM Players
WHERE Players.player_id = :player_id_from_click
;

-- RW: get player ID and name to populate player dropdown

SELECT Players.player_id, Players.name
FROM Players
ORDER BY Players.name ASC
;

-- ?? RW: get player record IDs for player records associated with team

SELECT PlayerRecords.player_record_id
FROM PlayerRecords
    INNER JOIN Teams
    ON PlayerRecords.team_id = Teams.team_id
WHERE Teams.team_id = :team_id_from_func
ORDER BY PlayerRecords.player_record_id ASC
;

/*************************************************************************
 * INSERTs (CREATE)
 * to add new rows of data into an entity
 ************************************************************************/

-- RW: add new player

INSERT INTO Players (name, rank_id, lp)
VALUES (:name_input, :rank_id_from_dropdown, :lp_input);

-- RW: add a components necessary to record a new game
/*
 * There will be a procedure to group the function calls for creating
 * a game, two teams, and ten player records.
*/

-- RW: add new game
INSERT INTO Games (`start_time`, `duration`)
VALUES (:start_time_input, :duration_input);
SET @new_game = LAST_INSERT_ID();

-- RW: add new team for game
INSERT INTO Teams (`game_id`, `result`)
VALUES (@new_game, :result_from_dropdown);
SET @new_team = LAST_INSERT_ID();

-- RW: add new player records for team
/*
 * There will be a function that calculates the awarded lp based on the
 * team result, individual player rank, and average rank of players in 
 * the team.
*/
INSERT INTO PlayerRecords (team_id, player_id, lp_change)
VALUES
(   @new_team,
    (SELECT Players.player_id FROM Players WHERE Players.name = :name_input),
    :lp_from_func
);

/*************************************************************************
 * UPDATEs (UPDATE)
 * to edit values in a row of data in an entity
 ************************************************************************/

-- RW: update player information for UpdatePlayer page

UPDATE Players SET Players.name = :name_input, Players.rank_id = :rank_id_from_dropdown, Players.lp = :lp_input
WHERE Players.player_id = :player_id_from_click
;

-- HS: update a players rank upon their lp being changed (if necessary)
UPDATE Players
SET Players.rank_id = (
    SELECT Ranks.rank_id FROM Ranks 
    WHERE Ranks.lp_threshold <= Players.lp 
    ORDER BY Ranks.lp_threshold DESC 
    LIMIT 1
)
WHERE Players.player_id = :player_id_from_func;

-- RW: update comprehensive game information for UpdateGame page
/*
* There will be a procedure grouping the updates for the game entries,
* its related playerrecords entries, and its related players entries.
*/

-- RW: update game information
UPDATE Games
SET Games.start_time = :start_time_input, Games.duration = :duration_input
WHERE Games.game_id = :game_id_from_click
;

-- HS: subtract lp_change from old player based on playerrecord.player_id change
UPDATE Players
SET Players.lp = Players.lp - (
    SELECT PlayerRecords.lp_change
    FROM PlayerRecords
    WHERE PlayerRecords.player_record_id = :record_id_from_func
)
WHERE Players.player_id = :old_player_id_from_func
;

-- RW: update player_id in playerrecord entry
/* 
 * Changes the value of the `player_id` FK in the PlayerRecords intersection table.
 * The player name input box needs to somehow link to the appropriate `player_record_id`.
*/
UPDATE PlayerRecords
SET PlayerRecords.player_id = (
    SELECT Players.player_id
    FROM Players
    WHERE Players.name = :name_input
)
WHERE PlayerRecords.player_record_id = :record_id_from_func
;

-- HS: add lp_change to new player based on playerrecord.player_id change
UPDATE Players
SET Players.lp = Players.lp + (
    SELECT PlayerRecords.lp_change
    FROM PlayerRecords
    WHERE PlayerRecords.player_record_id = :record_id_from_func
)
WHERE Players.player_id = :new_player_id_from_func

/*************************************************************************
 * DELETEs (DELETE)
 * to remove rows of data from an entity
 ************************************************************************/

-- RW: remove player information for deleting a player

DELETE FROM Players
WHERE Players.player_id = :player_id_from_click
;



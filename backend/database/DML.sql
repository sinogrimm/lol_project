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

-- QUERY 1
-- RW: get all player information for Players page

SELECT Players.player_id AS "Player ID", Players.name AS "Name",
    Ranks.title AS "Rank", Players.lp AS "League Points"
FROM Players
    INNER JOIN Ranks
    ON Players.rank_id = Ranks.rank_id
ORDER BY Players.player_id DESC
;

-- QUERY 2
-- RW: get all game information for Games page

SELECT Games.game_id AS "Game ID", 
    DATE_FORMAT(Games.start_time, '%Y-%m-%d %H:%i:%s') AS "Start Time",
    Games.duration AS "Duration"
FROM Games
ORDER BY Games.game_id DESC
;

-- QUERY 3
-- RW: get all team information for Teams page

SELECT Teams.team_id AS "Team ID", Teams.game_id AS "Game ID",
    Teams.result AS "Result"
FROM Teams
ORDER BY Teams.team_id DESC
;

-- QUERY 4
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

-- QUERY 5
-- RW: get all rank information for the Ranks page
-- RW: also used for rank dropdown and lp input validation

SELECT Ranks.rank_id AS "Rank ID", Ranks.title AS "Title", Ranks.lp_threshold "Threshold"
FROM Ranks
ORDER BY Ranks.lp_threshold ASC
;

/*************************************************************************
 * SELECTs
 * to display special views showing information from combined tables
 ************************************************************************/

-- QUERY 6
-- RW: get player information for ViewPlayer page text

SELECT Players.name, Ranks.title
FROM Players
    INNER JOIN Ranks
    ON Players.rank_id = Ranks.rank_id
WHERE Players.player_id = :player_id_from_click
;

-- QUERY 7
-- RW: get all game information associated with player for ViewPlayer page

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

-- QUERY 8
-- RW: get basic game information

SELECT Games.game_id,
    DATE_FORMAT(Games.start_time, '%Y-%m-%d %H:%i:%s') AS start_time,
    Games.duration
FROM Games
WHERE Games.game_id = :game_id_from_click
;

-- QUERY 9
-- RW: get teams information associated with game

SELECT team_id, result
FROM Teams
WHERE game_id = :game_id_from_click
ORDER BY team_id ASC
;

-- QUERY 10
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

-- QUERY 11
-- RW: get player information for prefilling form in UpdatePlayer page

SELECT Players.name, Players.rank_id, Players.lp
FROM Players
WHERE Players.player_id = :player_id_from_click
;

-- QUERY 12
-- RW: get player ID and name to populate player dropdown

SELECT Players.player_id, Players.name
FROM Players
ORDER BY Players.name ASC
;

-- QUERY 13
-- HS: get player record information for prefilling form in UpdatePlayerRecord page

SELECT PlayerRecords.player_record_id, PlayerRecords.team_id,
    PlayerRecords.player_id, PlayerRecords.lp_change,
    IFNULL(Players.name, '[Deleted Player]') AS player_name
FROM PlayerRecords
    LEFT JOIN Players
        ON PlayerRecords.player_id = Players.player_id
WHERE PlayerRecords.player_record_id = :player_record_id_from_click
;

/*************************************************************************
 * INSERTs (CREATE)
 * to add new rows of data into an entity
 ************************************************************************/

-- QUERY 14
-- RW: add new player

INSERT INTO Players (name, rank_id, lp)
VALUES (:name_input, :rank_id_from_dropdown, :lp_input);

-- QUERY 15
-- RW: add new game

INSERT INTO Games (`start_time`, `duration`)
VALUES (:start_time_input, :duration_input);
SELECT LAST_INSERT_ID() AS 'new_game_id';

-- QUERY 16
-- RW: add new team for game

INSERT INTO Teams (`game_id`, `result`)
VALUES (@new_game_id, :result_from_dropdown);
SELECT LAST_INSERT_ID() AS 'new_team_id';

-- QUERY 17
-- RW: add new player records for team

INSERT INTO PlayerRecords (`team_id`, `player_id`, `lp_change`)
VALUES
(@new_team_id, p_pid1, p_lpc1),
(@new_team_id, p_pid2, p_lpc2),
(@new_team_id, p_pid3, p_lpc3),
(@new_team_id, p_pid4, p_lpc4),
(@new_team_id, p_pid5, p_lpc5);

/*************************************************************************
 * UPDATEs (UPDATE)
 * to edit values in a row of data in an entity
 ************************************************************************/

-- QUERY 18
-- RW: update player information for UpdatePlayer page

UPDATE Players SET Players.name = :name_input, Players.rank_id = :rank_id_from_dropdown, Players.lp = :lp_input
WHERE Players.player_id = :player_id_from_click
;

-- QUERY 19
-- HS: update player records information for UpdatePlayerRecords page

UPDATE PlayerRecords
SET PlayerRecords.player_id = :player_id_from_dropdown,
    PlayerRecords.lp_change = :lp_change_from_input
WHERE PlayerRecords.player_record_id = :player_record_id_from_click;

/*************************************************************************
 * UPDATEs (UPDATE)
 * for when certain player record events are triggered
 ************************************************************************/

-- QUERY 20
-- HS: update a players rank upon their lp being changed (if necessary)

UPDATE Players
SET Players.rank_id = (
    SELECT Ranks.rank_id FROM Ranks 
    WHERE Ranks.lp_threshold <= Players.lp 
    ORDER BY Ranks.lp_threshold DESC 
    LIMIT 1
)
WHERE Players.player_id = :player_id_from_func;

-- QUERY 21
-- HS: subtract lp_change from old player based on playerrecord.player_id change

UPDATE Players
SET Players.lp = Players.lp - (
    SELECT PlayerRecords.lp_change
    FROM PlayerRecords
    WHERE PlayerRecords.player_record_id = :record_id_from_func
)
WHERE Players.player_id = :old_player_id_from_func
;

-- QUERY 22
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

-- QUERY 23
-- RW: remove player information for deleting a player

DELETE FROM Players WHERE Players.player_id = :player_id_from_click;

-- QUERY 24
-- HS: remove related player records information for deleting a game

DELETE FROM PlayerRecords
WHERE team_id IN (SELECT team_id FROM Teams WHERE game_id = :game_id_from_click);

-- QUERY 25
-- HS: remove game information for deleting a game

DELETE FROM Games WHERE Games.game_id = :game_id_from_click;


/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 3 Draft
 * Description: Data Manipulation Queries

 The following queries are all our own work.
*/

-- RW: view player ranked leaderboard

SELECT Players.player_id, Players.name, Ranks.title AS `rank`, Players.lp
FROM Players
    INNER JOIN Ranks
        ON Players.rank_id = Ranks.rank_id
ORDER BY Players.lp DESC
;

-- RW: get player ranked history when search for player name

SELECT Games.game_id, Teams.result,
    Games.start_time, Games.duration
FROM Games
    INNER JOIN Teams
        ON Teams.game_id = Games.game_id
    INNER JOIN PlayerRecords
        ON PlayerRecords.team_id = Teams.team_id
    INNER JOIN Players
        ON Players.player_id = PlayerRecords.player_id
WHERE Players.player_id = (
    SELECT Players.player_id
    FROM Players
    WHERE Players.name = :player_name_from_search_bar
)
ORDER BY Games.start_time DESC
;


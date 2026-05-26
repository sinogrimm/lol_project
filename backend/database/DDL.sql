/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 3 Draft
 * Description: Data Definition Queries and Sample Data

 The following queries are all our own work.
*/

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;


/* CREATE TABLES */

-- RW: create Ranks table

DROP TABLE IF EXISTS Ranks;
CREATE TABLE Ranks (
    `rank_id` INT(11) AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) UNIQUE NOT NULL,
    `lp_threshold` INT(11) UNIQUE NOT NULL
);

-- HS: create Players table
-- RW: added ON DELETE to `rank_id`

DROP TABLE IF EXISTS Players;
CREATE TABLE Players(
    `player_id` INT(11) AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) UNIQUE NOT NULL,
    `rank_id` INT(11) NOT NULL,
    `lp` INT(11) NOT NULL,
    FOREIGN KEY (`rank_id`) REFERENCES Ranks(`rank_id`) ON DELETE RESTRICT
);

-- HS: create Games table

DROP TABLE IF EXISTS Games;
CREATE TABLE Games(
    `game_id` INT(11) AUTO_INCREMENT PRIMARY KEY,
    `start_time` DATETIME(0) NOT NULL,
    `duration` TIME(0) NOT NULL 
);

-- HS: create Teams table
-- RW: added ON DELETE to `game_id`

DROP TABLE IF EXISTS Teams;
CREATE TABLE Teams(
    `team_id` INT(11) AUTO_INCREMENT PRIMARY KEY,
    `game_id` INT(11) NOT NULL,
    `result` ENUM('VICTORY', 'DEFEAT') NOT NULL,
    FOREIGN KEY (`game_id`) REFERENCES Games(`game_id`) ON DELETE RESTRICT
);

-- HS: create PlayerRecords table
-- RW: removed NOT NULL from `player_id` and added ON DELETE
-- RW: added ON DELETE to `team_id`

DROP TABLE IF EXISTS PlayerRecords;
CREATE TABLE PlayerRecords(
    `player_record_id` INT(11) AUTO_INCREMENT PRIMARY KEY,
    `team_id` INT(11) NOT NULL,
    `player_id` INT(11),
    `lp_change` INT(11) NOT NULL,
    FOREIGN KEY (`team_id`) REFERENCES Teams(`team_id`) ON DELETE RESTRICT,
    FOREIGN KEY (`player_id`) REFERENCES Players(`player_id`) ON DELETE SET NULL
);

/* INSERT DATA */

-- RW: insert Ranks data

INSERT INTO Ranks
(`title`, `lp_threshold`)
VALUES
('Iron', 0),
('Bronze', 100),
('Silver', 200),
('Gold', 300),
('Platinum', 400),
('Emerald', 500),
('Diamond', 600),
('Master', 700),
('Grandmaster', 800),
('Challenger', 900);

-- HS: insert Players data

INSERT INTO Players
(`name`, `rank_id`, `lp`)
VALUES
('Doran', (SELECT rank_id FROM Ranks WHERE title = 'Master'), 785),
('Oner', (SELECT rank_id FROM Ranks WHERE title = 'Master'), 798),
('Faker', (SELECT rank_id FROM Ranks WHERE title = 'Challenger'), 937),
('Gumayusi', (SELECT rank_id FROM Ranks WHERE title = 'Challenger'), 959),
('Keria', (SELECT rank_id FROM Ranks WHERE title = 'Grandmaster'), 856),
('PerfecT', (SELECT rank_id FROM Ranks WHERE title = 'Master'), 763),
('Cuzz', (SELECT rank_id FROM Ranks WHERE title = 'Grandmaster'), 832),
('Bddd', (SELECT rank_id FROM Ranks WHERE title = 'Challenger'), 947),
('deokdam', (SELECT rank_id FROM Ranks WHERE title = 'Grandmaster'), 897),
('Peter', (SELECT rank_id FROM Ranks WHERE title = 'Master'), 791);

-- HS: insert Games data

INSERT INTO Games
(`start_time`, `duration`)
VALUES
('2025-11-08 17:13:23', '00:36:52'),
('2025-11-08 17:28:51', '00:29:40'),
('2025-11-08 17:43:48', '00:36:46');

-- HS: insert Teams data

INSERT INTO Teams
(`game_id`, `result`)
VALUES
((SELECT game_id FROM Games WHERE start_time = '2025-11-08 17:13:23'), 'VICTORY'),
((SELECT game_id FROM Games WHERE start_time = '2025-11-08 17:13:23'), 'DEFEAT'),
((SELECT game_id FROM Games WHERE start_time = '2025-11-08 17:28:51'), 'VICTORY'),
((SELECT game_id FROM Games WHERE start_time = '2025-11-08 17:28:51'), 'DEFEAT'),
((SELECT game_id FROM Games WHERE start_time = '2025-11-08 17:43:48'), 'VICTORY'),
((SELECT game_id FROM Games WHERE start_time = '2025-11-08 17:43:48'), 'DEFEAT');

-- HS: insert PlayerRecords data

INSERT INTO PlayerRecords
(`team_id`, `player_id`, `lp_change`)
VALUES
(1, 1, 20),
(1, 2, 20),
(1, 3, 20),
(1, 4, 20),
(1, 5, 20),
(2, 6, -20),
(2, 7, -20),
(2, 8, -20),
(2, 9, -20),
(2, 10, -20);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;


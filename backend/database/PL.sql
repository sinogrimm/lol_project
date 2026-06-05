/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: Procedural Language Queries

 * Citation:
 * The procedure formats are adapted from the Module 8 starter code,
 * but the logic inside each procedure is our own work.
 * (see full citation under README)
*/

/*************************************************************************
 * CREATE Players
 * for Add New Player form under Players page
 ************************************************************************/
DROP PROCEDURE IF EXISTS sp_create_player;

DELIMITER //
CREATE PROCEDURE sp_create_player
(
    IN p_name VARCHAR(255),
    IN p_rank INT,
    IN p_lp INT,
    OUT p_id INT
)
BEGIN
    INSERT INTO Players (name, rank_id, lp)
    VALUES (p_name, p_rank, p_lp);

    SELECT LAST_INSERT_ID() INTO p_id;
    SELECT LAST_INSERT_ID() AS 'new_player_id';

END //
DELIMITER ;

/*************************************************************************
 * CREATE Games
 * for Create New Game form under CreateGame page
 ************************************************************************/
DROP PROCEDURE IF EXISTS sp_create_game;

DELIMITER //
CREATE PROCEDURE sp_create_game
(
    IN p_start_time VARCHAR(255),
    IN p_duration VARCHAR(255),
    OUT p_id INT
)
BEGIN
    INSERT INTO Games (start_time, duration)
    VALUES (p_start_time, p_duration);

    SELECT LAST_INSERT_ID() INTO p_id;
    SELECT LAST_INSERT_ID() AS 'new_game_id';

END //
DELIMITER ;

/*************************************************************************
 * UPDATE Players
 * for editing form under Update Players page
 ************************************************************************/
DROP PROCEDURE IF EXISTS sp_update_player;

DELIMITER //
CREATE PROCEDURE sp_update_player
(
    IN p_id INT,
    IN p_name VARCHAR(255),
    IN p_rank INT,
    IN p_lp INT
)
BEGIN
    UPDATE Players SET Players.name = p_name, Players.rank_id = p_rank, Players.lp = p_lp
    WHERE Players.player_id = p_id;

END //
DELIMITER ;

/*************************************************************************
 * UPDATE PlayerRecords
 * for editing form under Update Player Record page
 ************************************************************************/
DROP PROCEDURE IF EXISTS sp_update_player_record;

DELIMITER //
CREATE PROCEDURE sp_update_player_record
(
    IN p_record_id INT,
    IN p_player_id INT,
    IN p_lp_change INT
)
BEGIN
    UPDATE PlayerRecords
    SET PlayerRecords.player_id = p_player_id,
        PlayerRecords.lp_change = p_lp_change
    WHERE PlayerRecords.player_record_id = p_record_id;

END //
DELIMITER ;

/*************************************************************************
 * DELETE Players
 * for Delete buttons in Players page
 ************************************************************************/
DROP PROCEDURE IF EXISTS sp_delete_player;

DELIMITER //
CREATE PROCEDURE sp_delete_player(IN p_id INT)
BEGIN
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM Players WHERE Players.player_id = p_id;

        IF ROW_COUNT() = 0 THEN
        SET error_message = CONCAT('No matching record found in Players for id: ', p_id);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    
    COMMIT;

END //
DELIMITER ;

/*************************************************************************
 * DELETE Games
 * for Delete buttons in Games page
 ************************************************************************/
DROP PROCEDURE IF EXISTS sp_delete_game;

DELIMITER //
CREATE PROCEDURE sp_delete_game(IN g_id INT)
BEGIN
    DECLARE error_message VARCHAR(255);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- explicitly delete PlayerRecords to fire LP update triggers.
        -- deletion from cascade doesnt fire triggers
        DELETE FROM PlayerRecords
        WHERE team_id IN (SELECT team_id FROM Teams WHERE game_id = g_id);

        DELETE FROM Games WHERE Games.game_id = g_id;

        IF ROW_COUNT() = 0 THEN
        SET error_message = CONCAT('No matching record found in Games for id: ', g_id);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    
    COMMIT;

END //
DELIMITER ;

/*************************************************************************
 * UPDATE Players
 * Called by triggers to update a players rank upon playerrecord insert/delete
 ************************************************************************/
DROP PROCEDURE IF EXISTS sp_update_player_rank;
DELIMITER //
CREATE PROCEDURE sp_update_player_rank(IN p_id INT)
BEGIN
    UPDATE Players
    SET rank_id = (
        SELECT rank_id FROM Ranks
        WHERE lp_threshold <= (
            SELECT lp FROM (SELECT lp FROM Players WHERE player_id = p_id) AS p
        )
        ORDER BY lp_threshold DESC
        LIMIT 1
    )
    WHERE player_id = p_id;
END //
DELIMITER ;

/*************************************************************************
 * TRIGGER, update player lp
 * upon playerrecord insertion
 ************************************************************************/
DROP TRIGGER IF EXISTS trg_after_playerrecord_insert;
DELIMITER //
CREATE TRIGGER trg_after_playerrecord_insert
AFTER INSERT ON PlayerRecords
FOR EACH ROW
BEGIN
    IF NEW.player_id IS NOT NULL THEN
        UPDATE Players
        SET lp = lp + NEW.lp_change
        WHERE player_id = NEW.player_id;

        CALL sp_update_player_rank(NEW.player_id);
    END IF;
END //
DELIMITER ;

/*************************************************************************
 * TRIGGER, update player lp
 * upon playerrecord deletion
 ************************************************************************/
DROP TRIGGER IF EXISTS trg_after_playerrecord_delete;
DELIMITER //
CREATE TRIGGER trg_after_playerrecord_delete
AFTER DELETE ON PlayerRecords
FOR EACH ROW
BEGIN
    IF OLD.player_id IS NOT NULL THEN
        UPDATE Players
        SET lp = lp - OLD.lp_change
        WHERE player_id = OLD.player_id;

        CALL sp_update_player_rank(OLD.player_id);
    END IF;
END //
DELIMITER ;
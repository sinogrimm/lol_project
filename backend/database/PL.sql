/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 4 Draft
 * Description: Procedural Language Queries

 The following queries are all our own work.
*/

/*************************************************************************
 * CREATE Players
 * for Add New Player form under Players page
 ************************************************************************/
DROP PROCEDURE IF EXISTS sp_CreatePlayer;

DELIMITER //
CREATE PROCEDURE sp_CreatePlayer
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

    -- example of usage
    -- CALL sp_CreatePlayer('sin0grimm', 1, 0);
    -- SELECT @new_id AS 'New Player ID';
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

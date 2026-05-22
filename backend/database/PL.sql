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
-- Project 2 - Beach Edition 15 Puzzle
-- Create this table with the MySQL command-line client only.
-- GUI tools (MySQL Workbench, phpMyAdmin, etc.) are not allowed for this course.
--
--   mysql -u yjacob1 -p yjacob1 < db/schema.sql

CREATE TABLE IF NOT EXISTS puzzle_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player VARCHAR(24) NOT NULL,
    mode VARCHAR(20) NOT NULL,
    moves INT UNSIGNED NOT NULL,
    time_seconds INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

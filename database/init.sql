CREATE DATABASE IF NOT EXISTS vocaltrainer_db;
USE vocaltrainer_db;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
    user_id CHAR(36) PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(8) DEFAULT 'normal',
    CONSTRAINT ck_role CHECK (role IN ('normal', 'employee', 'admin'))
);

DROP TABLE IF EXISTS profile;
CREATE TABLE profile (
    user_id CHAR(36) PRIMARY KEY,
    biography VARCHAR(300),
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(30),
    vocal_range_max INT,
    vocal_range_min INT
);

DROP TABLE IF EXISTS publication;
CREATE TABLE publication (
    publication_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(300),
    type VARCHAR(10) NOT NULL,
    public BOOLEAN DEFAULT false,
    rating_total INT DEFAULT 0,
    review_amt INT DEFAULT 0,
    rating_stars FLOAT GENERATED ALWAYS AS (rating_total/GREATEST(review_amt, 1)),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_publication_type CHECK (type IN ('b-exercise', 'm-exercise', 'list'))
);

DROP TABLE IF EXISTS comment;
CREATE TABLE comment (
    comment_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    publication_id CHAR(36),
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    content VARCHAR(500) NOT NULL
);

DROP TABLE IF EXISTS exercise_list;
CREATE TABLE exercise_list (
    list_id CHAR(36),
    exercise_id CHAR(36),
    position INT UNSIGNED,
    CONSTRAINT pk_exercise_list PRIMARY KEY (list_id, exercise_id, position)
);

DROP TABLE IF EXISTS melody_fragment;
CREATE TABLE melody_fragment (
    melody_id CHAR(36),
    position INT UNSIGNED,
    midiNumber INT UNSIGNED,
    duration FLOAT,
    CONSTRAINT pk_melody_fragment PRIMARY KEY (melody_id, position)
);

DROP TABLE IF EXISTS breathing_fragment;
CREATE TABLE breathing_fragment (
    breathing_id CHAR(36),
    position INT UNSIGNED,
    inhale_time INT UNSIGNED,
    hold_time INT UNSIGNED,
    exhale_time INT UNSIGNED,
    CONSTRAINT pk_breathing_fragment PRIMARY KEY (breathing_id, position)
);

/*FOREIGN KEYS*/
ALTER TABLE profile ADD CONSTRAINT fk_profile_user_id FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE;
ALTER TABLE publication ADD CONSTRAINT fk_publication_user_id FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE;
ALTER TABLE comment ADD CONSTRAINT fk_comment_user_id FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE;
ALTER TABLE comment ADD CONSTRAINT fk_comment_publication_id FOREIGN KEY (publication_id) REFERENCES publication (publication_id) ON DELETE CASCADE;
ALTER TABLE exercise_list ADD CONSTRAINT fk_exercise_list_list_id FOREIGN KEY (list_id) REFERENCES publication (publication_id) ON DELETE CASCADE;
ALTER TABLE exercise_list ADD CONSTRAINT fk_exercise_list_exercise_id FOREIGN KEY (exercise_id) REFERENCES publication (publication_id) ON DELETE CASCADE;
ALTER TABLE melody_fragment ADD CONSTRAINT fk_melody_fragment_melody_id FOREIGN KEY (melody_id) REFERENCES publication (publication_id) ON DELETE CASCADE;
ALTER TABLE breathing_fragment ADD CONSTRAINT fk_breathing_fragment_breathing_id FOREIGN KEY (breathing_id) REFERENCES publication (publication_id) ON DELETE CASCADE;

/*TRIGGERS*/
DROP TRIGGER IF EXISTS tr_user_AfterInsert;
DELIMITER //
CREATE TRIGGER tr_user_AfterInsert
    AFTER INSERT ON user
    FOR EACH ROW
BEGIN
    IF new.role = 'normal' THEN
        INSERT INTO profile (user_id, biography, vocal_range_max, vocal_range_min) VALUES (new.user_id, NULL, NULL, NULL);
    END IF;
END; //
DELIMITER ;

/*PROCEDURES*/
DROP PROCEDURE IF EXISTS pr_publication_rating;
DELIMITER //
CREATE PROCEDURE pr_publication_rating 
    (IN id INT, IN rating INT)
BEGIN
    UPDATE publication SET rating_total = rating_total + rating, review_amt = review_amt + 1 WHERE publication_id = id;
END //
DELIMITER ;
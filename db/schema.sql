-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS floors;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS todos;

-- CREATE TABLE users(
-- id INTEGER PRIMARY KEY,
-- username TEXT,
-- password TEXT,
-- mainPic TEXT,
-- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE floors(
-- id INTEGER PRIMARY KEY AUTOINCREMENT,
-- user_id INTEGER,
-- fl_name TEXT
-- );

CREATE TABLE rooms(
id INTEGER PRIMARY KEY AUTOINCREMENT,
floor_id INTEGER,
roomname TEXT,
color_1	TEXT,
color_2	TEXT,
color_3 TEXT,
to_do TEXT,
rmPic TEXT
);

-- Active: 1675093719268@@127.0.0.1@3306
CREATE TABLE videos(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration REAL NOT NULL,
    uploaded_at TEXT DEFAULT(DATETIME())
);

INSERT INTO videos(id,title,duration)
VALUES("v001","musica", 3.54);

DROP TABLE videos;
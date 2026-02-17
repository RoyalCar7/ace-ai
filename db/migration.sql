DROP TABLE IF EXISTS tools;

CREATE TABLE tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT,
    emoji TEXT,
    url TEXT NOT NULL,
    audience TEXT NOT NULL DEFAULT 'Both'
);



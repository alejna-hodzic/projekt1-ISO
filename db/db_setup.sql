CREATE DATABASE IF NOT EXISTS todo_db;
USE todo_db;

CREATE TABLE IF NOT EXISTS users (
    user_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_hash)
);

CREATE TABLE IF NOT EXISTS task_lists (
    id BIGINT NOT NULL,
    user_hash VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_hash) REFERENCES users(user_hash) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT NOT NULL,
    list_id BIGINT NOT NULL,
    text TEXT NOT NULL,
    priority INT NOT NULL DEFAULT 3,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at BIGINT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (list_id) REFERENCES task_lists(id) ON DELETE CASCADE
);
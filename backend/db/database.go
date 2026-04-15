package db

import (
	"database/sql"
	"fmt"
	"log/slog"

	"projekt1-ISO/backend/config"
	"projekt1-ISO/backend/types"

	_ "github.com/go-sql-driver/mysql"
)

type Database struct {
	db *sql.DB
}

func Connect(cfg config.MySqlConf) (*Database, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		cfg.User, cfg.Password, cfg.Address, cfg.Port, cfg.Database)

	slog.Info("Connecting to MySQL...")
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		slog.Error("Database ping failed", "error", err)
		return nil, err
	}

	slog.Info("Successfully connected to the database")
	return &Database{db: db}, nil
}

func (db *Database) CreateUserIfNotExists(hash string) error {
	query := "INSERT IGNORE INTO users (user_hash, created_at, last_active) VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
	_, err := db.db.Exec(query, hash)
	return err
}

func (db *Database) UpdateUserActivity(hash string) error {
	query := "UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE user_hash = ?"
	_, err := db.db.Exec(query, hash)
	return err
}

func (db *Database) CreateList(userHash string, list types.TaskList) error {
	query := "INSERT INTO task_lists (id, user_hash, title) VALUES (?, ?, ?)"

	_, err := db.db.Exec(query, list.ID, userHash, list.Title)
	if err != nil {
		slog.Error("Failed to insert new list", "error", err)
		return err
	}

	return nil
}

func (db *Database) GetLists(userHash string) ([]types.TaskList, error) {
	query := "SELECT id, title FROM task_lists WHERE user_hash = ?"

	rows, err := db.db.Query(query, userHash)
	if err != nil {
		slog.Error("Error while reading from database.", "error", err)
		return nil, err
	}
	defer rows.Close()

	var lists []types.TaskList

	for rows.Next() {
		var list types.TaskList
		if err := rows.Scan(&list.ID, &list.Title); err != nil {
			return nil, err
		}
		lists = append(lists, list)
	}

	return lists, nil
}

func (db *Database) CleanupOldUsers() error {
	query := "DELETE FROM users WHERE last_active < NOW() - INTERVAL 1 MONTH"
	_, err := db.db.Exec(query)
	return err
}

func (db *Database) CreateTask(task types.Task) error {
	query := "INSERT INTO tasks (id, list_id, text, priority, completed, completed_at) VALUES (?, ?, ?, ?, ?, ?)"

	_, err := db.db.Exec(query, task.ID, task.ListID, task.Text, task.Priority, task.Completed, task.CompletedAt)
	if err != nil {
		slog.Error("Failed to insert new task.", "error", err)
		return err
	}

	return nil
}

func (db *Database) UpdateTask(task types.Task) error {
	query := "UPDATE tasks SET completed = ?, completed_at = ? WHERE id = ?"

	_, err := db.db.Exec(query, task.Completed, task.CompletedAt, task.ID)
	if err != nil {
		slog.Error("Failed to update task completion status in database.", "error", err)
		return err
	}

	return nil
}

func (db *Database) GetTasks(userHash string) ([]types.Task, error) {
	query := "SELECT t.* FROM tasks t JOIN task_lists tl ON t.list_id = tl.id WHERE tl.user_hash = ?"

	rows, err := db.db.Query(query, userHash)
	if err != nil {
		slog.Error("Error while reading tasks from database.", "error", err)
		return nil, err
	}
	defer rows.Close()

	var tasks []types.Task
	for rows.Next() {
		var t types.Task
		err := rows.Scan(&t.ID, &t.ListID, &t.Text, &t.Priority, &t.Completed, &t.CompletedAt)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}

	return tasks, nil
}

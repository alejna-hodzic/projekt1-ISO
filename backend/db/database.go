package db

import (
	"database/sql"
	"fmt"
	"log/slog"

	"projekt1-ISO/backend/config" 

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


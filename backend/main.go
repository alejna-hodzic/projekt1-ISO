package main

import (
	"log/slog"
	"os"
	"time"

	"backend/config"
	"backend/db"
	api "backend/http"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		slog.Warn("No .env file found")
	}

	cfg := config.LoadConfig()

	database, err := db.Connect(cfg.MySQL)
	if err != nil {
		slog.Error("Connection to MySQL database failed", "error", err)
		os.Exit(1)
	}

	go func() {
		database.CleanupOldUsers()

		ticker := time.NewTicker(24 * time.Hour)
		for range ticker.C {
			err := database.CleanupOldUsers()
			if err != nil {
				slog.Error("Failed to clean up old users:", "error", err)
			}
		}
	}()

	api.InitHttp(database)
}

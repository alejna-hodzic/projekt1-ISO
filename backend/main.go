package main

import (
	"log/slog"
	"os"

	"projekt1-ISO/backend/config"
	"projekt1-ISO/backend/db" 

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

	_ = database 
}
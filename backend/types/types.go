package types

import "errors"

var ErrDatabaseConnection = errors.New("failed to connect to database")
var ErrItemNotFound = errors.New("item not found")

type User struct {
	Hash string `json:"hash"`
}

type TaskList struct {
	ID    int64  `json:"id"`
	UserHash string `json:"user_hash"`
	Title string `json:"title"`
}

type Task struct {
	ID          int64  `json:"id"`
	ListID      int64  `json:"list_id"`
	Text        string `json:"text"`
	Priority    int    `json:"priority"`
	Completed   bool   `json:"completed"`
	CompletedAt *int64 `json:"completed_at"` 
}
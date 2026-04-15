package api

import (
	"encoding/json"
	"net/http"

	"projekt1-ISO/backend/db"
	"projekt1-ISO/backend/types"
)

type ApiHandler struct {
	DB *db.Database
}

func (h *ApiHandler) CreateListHandler(w http.ResponseWriter, r *http.Request) {
	userHash := r.Header.Get("User-Hash")
	if userHash == "" {
		http.Error(w, "User hash is missing.", http.StatusUnauthorized)
		return
	}

	var newTaskList types.TaskList
	err := json.NewDecoder(r.Body).Decode(&newTaskList)
	if err != nil {
		http.Error(w, "Failed to get data from response.", http.StatusBadRequest)
		return
	}

	h.DB.CreateUserIfNotExists(userHash)
	h.DB.UpdateUserActivity(userHash)

	err = h.DB.CreateList(userHash, newTaskList)
	if err != nil {
		http.Error(w, "Failed to save list to database.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "poruka": "Task list created."})
}

func (h *ApiHandler) GetListsHandler(w http.ResponseWriter, r *http.Request) {
	userHash := r.Header.Get("User-Hash")
	if userHash == "" {
		http.Error(w, "User hash is missing", http.StatusUnauthorized)
		return
	}

	h.DB.UpdateUserActivity(userHash)

	lists, err := h.DB.GetLists(userHash)
	if err != nil {
		http.Error(w, "Error geting task lists:", http.StatusInternalServerError)
		return
	}

	if lists == nil {
		lists = []types.TaskList{}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(lists)
}

func (h *ApiHandler) CreateTaskHandler(w http.ResponseWriter, r *http.Request) {
	userHash := r.Header.Get("User-Hash")
	if userHash == "" {
		http.Error(w, "User hash is missing", http.StatusUnauthorized)
		return
	}

	var newTask types.Task
	err := json.NewDecoder(r.Body).Decode(&newTask)
	if err != nil {
		http.Error(w, "Failed to get data from response", http.StatusBadRequest)
		return
	}

	h.DB.UpdateUserActivity(userHash)

	err = h.DB.CreateTask(newTask)
	if err != nil {
		http.Error(w, "Failed to save task.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "poruka": "Task created,"})
}

func (h *ApiHandler) UpdateTaskHandler(w http.ResponseWriter, r *http.Request) {
	userHash := r.Header.Get("User-Hash")
	if userHash == "" {
		http.Error(w, "User hash is missing", http.StatusUnauthorized)
		return
	}

	var updatedTask types.Task
	err := json.NewDecoder(r.Body).Decode(&updatedTask)
	if err != nil {
		http.Error(w, "Failed to get data from response", http.StatusBadRequest)
		return
	}

	h.DB.UpdateUserActivity(userHash)

	err = h.DB.UpdateTask(updatedTask)
	if err != nil {
		http.Error(w, "Failed to update task:", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "poruka": "Task updated."})
}

func (h *ApiHandler) GetTasksHandler(w http.ResponseWriter, r *http.Request) {
	userHash := r.Header.Get("User-Hash")
	if userHash == "" {
		http.Error(w, "User hash is missing", http.StatusUnauthorized)
		return
	}

	tasks, err := h.DB.GetTasks(userHash)
	if err != nil {
		http.Error(w, "Failed to get data from response", http.StatusInternalServerError)
		return
	}

	if tasks == nil {
		tasks = []types.Task{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

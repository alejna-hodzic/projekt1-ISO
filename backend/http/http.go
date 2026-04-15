package api

import (
	"fmt"
	"net/http"
	"os"

	"projekt1-ISO/backend/db"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func InitHttp(database *db.Database) {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*", "*", "null"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "User-Hash"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	h := &ApiHandler{
		DB: database,
	}

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Todo Backend is running!"))
	})

	r.Route("/api", func(r chi.Router) {
		r.Post("/lists", h.CreateListHandler)
		r.Get("/lists", h.GetListsHandler)
	})

	port := os.Getenv("HTTP_PORT")
	if port == "" {
		port = "5555"
	}

	fmt.Printf("Starting HTTP server on port %s...\n", port)
	http.ListenAndServe(fmt.Sprintf(":%s", port), r)
}

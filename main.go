package main

import (
	"log"
)

func main() {
	db, err := initDatabase("data.db")
	if err != nil {
		log.Fatalf("init database: %v", err)
	}

	r := setupRouter(db)

	if err := r.Run(":8080"); err != nil {
		log.Fatalf("serveur interrompu: %v", err)
	}
}

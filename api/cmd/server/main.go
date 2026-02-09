package main

import (
	"log"
	"brokebuddy/api/internal/db"
	"brokebuddy/api/internal/server"
)

func main() {
	db.Connect()
	db.InitUsersCollection()
	if err := db.InitUsersCollection(); err != nil {
		log.Fatal("users collection init failed:", err)
	}
	server.Start()
}

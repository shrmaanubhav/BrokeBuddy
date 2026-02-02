package main

import (
	"brokebuddy/api/internal/db"
	"brokebuddy/api/internal/server"
)

func main() {
	db.Connect()
	server.Start()
}

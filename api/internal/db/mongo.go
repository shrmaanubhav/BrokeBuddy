package db
import "github.com/joho/godotenv"

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	Client   *mongo.Client
	Database *mongo.Database
)

func Connect() {
	// load env vars
	err := godotenvLoad()
	if err != nil {
		log.Fatal("Failed to load .env:", err)
	}

	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("MONGO_URI not set")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal("Mongo connect error:", err)
	}

	// verify connection
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal("Mongo ping failed:", err)
	}

	Client = client
	db_name := os.Getenv("MONGO_DB_NAME")
	if db_name == "" {
		db_name = "brokebuddy"
	}
	Database = client.Database(db_name)
	log.Println("MongoDB connected")
}

func godotenvLoad() error {
	if _, err := os.Stat(".env"); err == nil {
		return godotenv.Load()
	}
	return nil
}

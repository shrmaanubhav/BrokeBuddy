package db

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Users *mongo.Collection

func InitUsersCollection() error {
	Users = Database.Collection("users")

	index := mongo.IndexModel{
		Keys: bson.M{"firebase_uid": 1},
		Options: options.Index().
			SetUnique(true).
			SetName("firebase_uid_unique"),
	}

	_, err := Users.Indexes().CreateOne(context.Background(), index)
	return err
}

type User struct {
	FirebaseUID string    `bson:"firebase_uid"`
	Name        string    `bson:"name,omitempty"`
	Phone       string    `bson:"phone,omitempty"`
	Email       string    `bson:"email,omitempty"`
	CreatedAt   time.Time `bson:"created_at"`
	UpdatedAt   time.Time `bson:"updated_at"`
	Onboarding  struct {
		SoftCompleted bool `bson:"soft_completed"`
	} `bson:"onboarding"`
}

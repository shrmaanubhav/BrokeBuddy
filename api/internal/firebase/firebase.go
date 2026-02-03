package firebase

import (
	"context"
	"log"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
)

var AuthClient *auth.Client

func Init() {
	ctx := context.Background()

	app, err := firebase.NewApp(ctx, nil,
		option.WithCredentialsFile("secrets/firebase-service-account.json"),
	)
	if err != nil {
		log.Fatalf("firebase init failed: %v", err)
	}

	AuthClient, err = app.Auth(ctx)
	if err != nil {
		log.Fatalf("firebase auth client failed: %v", err)
	}
}

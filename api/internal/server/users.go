package server

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"

	"brokebuddy/api/internal/db"
)

type InitUserRequest struct {
	Name string `json:"name"`
}

func InitUser(c *gin.Context) {
	uid := c.GetString("firebase_uid")
	if uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "unauthorized",
		})
		return
	}

	var req InitUserRequest
	_ = c.ShouldBindJSON(&req)

	now := time.Now()

	update := bson.M{
		"$setOnInsert": bson.M{
			"firebase_uid": uid,
			"created_at":   now,
		},
		"$set": bson.M{
			"name":                    req.Name,
			"updated_at":              now,
			"onboarding.soft_completed": true,
		},
	}

	opts := options.Update().SetUpsert(true)

	_, err := db.Users.UpdateOne(
		context.Background(),
		bson.M{"firebase_uid": uid},
		update,
		opts,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to init user",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}

package server

import (
	"github.com/gin-gonic/gin"

	"brokebuddy/api/internal/firebase"
	"brokebuddy/api/internal/middleware"
)

func Start() {
	firebase.Init()

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	auth := r.Group("/")
	auth.Use(middleware.FirebaseAuth())
	{
		auth.GET("/health/auth", func(c *gin.Context) {
			uid, _ := c.Get("firebase_uid")
			c.JSON(200, gin.H{"uid": uid})
		})
		auth.POST("/users/init", InitUser)
	}

	r.Run(":4000")
}

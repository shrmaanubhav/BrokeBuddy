package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"brokebuddy/api/internal/firebase"
)

func FirebaseAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "missing auth token",
			})
			return
		}

		idToken := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := firebase.AuthClient.VerifyIDToken(context.Background(), idToken)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "invalid auth token",
			})
			return
		}

		// Attach identity to context
		c.Set("firebase_uid", token.UID)
		c.Set("firebase_claims", token.Claims)

		c.Next()
	}
}

package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Expense struct {
	ID       int
	Title    string
	Amount   float64
	Currency string
}

func main() {
	r := gin.Default()

	// Servir les fichiers statiques (CSS, JS, images…)
	r.Static("/static", "./static")

	// Charger les templates (tous les fichiers .html)
	r.LoadHTMLGlob("templates/*")

	// Route page d’accueil
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "home.html", gin.H{
			"title":            "Bienvenue sur SplitMate",
			"ContentTemplate": "home_content",
		})
	})

	// Exemple : afficher une liste de dépenses
	r.GET("/expenses", func(c *gin.Context) {
		expenses := []Expense{
			{ID: 1, Title: "Pizza", Amount: 24.5, Currency: "EUR"},
			{ID: 2, Title: "Uber", Amount: 12.0, Currency: "EUR"},
		}
		c.HTML(http.StatusOK, "expenses.html", gin.H{
			"title":            "Dépenses",
			"ContentTemplate": "expenses_content",
			"expenses":        expenses,
		})
	})

	r.Run(":8080")
}

package main

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Expense struct {
	ID        uint    `gorm:"primaryKey"`
	Title     string  `gorm:"not null"`
	Amount    float64 `gorm:"not null"`
	Currency  string  `gorm:"size:3;not null"`
	DateAchat string  `gorm:"not null;default:CURRENT_TIMESTAMP"`
	Category  string  `gorm:"size:50"`
}

func main() {
	db, err := initDatabase("data.db")
	if err != nil {
		log.Fatalf("init database: %v", err)
	}

	r := gin.Default()

	// Servir les fichiers statiques (CSS, JS, images…)
	r.Static("/static", "./static")

	// Charger les templates (tous les fichiers .html)
	r.LoadHTMLGlob("templates/*")

	// Route page d’accueil
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "home.html", gin.H{
			"title":           "Bienvenue sur CheckMate",
			"ContentTemplate": "home_content",
		})
	})
	r.GET("/expenses/create", func(c *gin.Context) {
		c.HTML(http.StatusOK, "create_expense.html", gin.H{
			"title":           "Créer une dépense",
			"ContentTemplate": "create_expense_content",
			"today":           time.Now().Format("2006-01-02"),
		})
	})

	r.DELETE("/expenses/delete/:id", func(c *gin.Context) {
		var expense Expense
		if err := db.Delete(&expense, c.Param("id")).Error; err != nil {
			log.Printf("suppression de la dépense: %v", err)
			c.String(http.StatusInternalServerError, "Erreur lors de la suppression de la dépense")
			return
		}
		c.Status(http.StatusNoContent)
	})
	r.POST("/get_expenses_by_category", func(c *gin.Context) {
		var expenses []Expense
		if err := db.Find(&expenses).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des dépenses"})
			return
		}
		c.JSON(http.StatusOK, expenses)
	})

	r.POST("/expense/create_expense", func(c *gin.Context) {
		var expense Expense

		switch {
		case strings.Contains(c.GetHeader("Content-Type"), "application/json"):
			if err := c.ShouldBindJSON(&expense); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides"})
				return
			}
		default:
			if err := c.ShouldBind(&expense); err != nil {
				c.HTML(http.StatusBadRequest, "create_expense.html", gin.H{
					"title":           "Créer une dépense",
					"ContentTemplate": "create_expense_content",
					"today":           time.Now().Format("2006-01-02"),
					"error":           "Formulaire invalide",
				})
				return
			}
		}

		if expense.DateAchat == "" {
			expense.DateAchat = time.Now().Format("2006-01-02")
		}

		if err := db.Create(&expense).Error; err != nil {
			log.Printf("création de la dépense: %v", err)
			if strings.Contains(c.GetHeader("Accept"), "application/json") || strings.Contains(c.GetHeader("Content-Type"), "application/json") {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Impossible de créer la dépense"})
			} else {
				c.HTML(http.StatusInternalServerError, "create_expense.html", gin.H{
					"title":           "Créer une dépense",
					"ContentTemplate": "create_expense_content",
					"today":           time.Now().Format("2006-01-02"),
					"error":           "Impossible de créer la dépense",
				})
			}
			return
		}

		if strings.Contains(c.GetHeader("Accept"), "application/json") || strings.Contains(c.GetHeader("Content-Type"), "application/json") || c.GetHeader("X-Requested-With") == "XMLHttpRequest" {
			c.JSON(http.StatusCreated, gin.H{
				"message": "Dépense créée",
				"expense": expense,
			})
			return
		}

		c.Redirect(http.StatusSeeOther, "/expenses")
	})

	r.GET("/expenses", func(c *gin.Context) {
		var expenses []Expense
		if err := db.Order("id ASC").Find(&expenses).Error; err != nil {
			log.Printf("liste des dépenses: %v", err)
			c.String(http.StatusInternalServerError, "Impossible de charger les dépenses")
			return
		}
		c.HTML(http.StatusOK, "expenses.html", gin.H{
			"title":           "Dépenses",
			"ContentTemplate": "expenses_content",
			"expenses":        expenses,
		})
	})

	if err := r.Run(":8080"); err != nil {
		log.Fatalf("serveur interrompu: %v", err)
	}
}

func initDatabase(path string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(path), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(&Expense{}); err != nil {
		return nil, err
	}

	var count int64
	if err := db.Model(&Expense{}).Count(&count).Error; err != nil {
		return nil, err
	}

	if count == 0 {
		seedExpenses := []Expense{
			{Title: "Pizza", Amount: 24.50, Currency: "EUR", DateAchat: "2025-10-01", Category: "Nourriture"},
			{Title: "Uber", Amount: 12.00, Currency: "EUR", DateAchat: "2025-10-02", Category: "Transport"},
		}
		if err := db.Create(&seedExpenses).Error; err != nil {
			return nil, err
		}
	}

	return db, nil
}

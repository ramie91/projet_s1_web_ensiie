package main

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func setupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	r.Static("/static", "./static")
	r.LoadHTMLGlob("templates/*")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "home.html", gin.H{
			"title":           "Bienvenue sur CheckMate",
			"ContentTemplate": "home_content",
		})
	})

	r.GET("/expenses/create", func(c *gin.Context) {
		var users []User
		if err := db.Order("name ASC").Find(&users).Error; err != nil {
			log.Printf("chargement des utilisateurs: %v", err)
			c.String(http.StatusInternalServerError, "Impossible de charger les utilisateurs")
			return
		}

		if len(users) == 0 {
			defaultUser, err := ensureDefaultUser(db)
			if err != nil {
				log.Printf("création de l'utilisateur par défaut: %v", err)
				c.String(http.StatusInternalServerError, "Impossible de préparer le formulaire")
				return
			}
			users = append(users, defaultUser)
		}

		c.HTML(http.StatusOK, "create_expense.html", gin.H{
			"title":           "Créer une dépense",
			"ContentTemplate": "create_expense_content",
			"today":           time.Now().Format("2006-01-02"),
			"users":           users,
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
		if err := db.Preload("User").Find(&expenses).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des dépenses"})
			return
		}
		c.JSON(http.StatusOK, expenses)
	})

	r.POST("/expense/create_expense", func(c *gin.Context) {
		var expense Expense
		expectsJSON := strings.Contains(c.GetHeader("Accept"), "application/json") ||
			strings.Contains(c.GetHeader("Content-Type"), "application/json") ||
			c.GetHeader("X-Requested-With") == "XMLHttpRequest"

		getUsers := func() []User {
			var users []User
			if err := db.Order("name ASC").Find(&users).Error; err != nil {
				log.Printf("chargement des utilisateurs: %v", err)
				return users
			}
			if len(users) == 0 {
				if defaultUser, err := ensureDefaultUser(db); err == nil {
					users = append(users, defaultUser)
				}
			}
			return users
		}

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
					"users":           getUsers(),
				})
				return
			}
		}

		if expense.UserID == 0 {
			defaultUser, err := ensureDefaultUser(db)
			if err != nil {
				log.Printf("récupération utilisateur par défaut: %v", err)
				if expectsJSON {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Utilisateur introuvable"})
				} else {
					c.HTML(http.StatusInternalServerError, "create_expense.html", gin.H{
						"title":           "Créer une dépense",
						"ContentTemplate": "create_expense_content",
						"today":           time.Now().Format("2006-01-02"),
						"error":           "Utilisateur introuvable",
						"users":           getUsers(),
					})
				}
				return
			}
			expense.UserID = defaultUser.ID
		} else {
			var user User
			if err := db.First(&user, expense.UserID).Error; err != nil {
				if expectsJSON {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Utilisateur inconnu"})
				} else {
					c.HTML(http.StatusBadRequest, "create_expense.html", gin.H{
						"title":           "Créer une dépense",
						"ContentTemplate": "create_expense_content",
						"today":           time.Now().Format("2006-01-02"),
						"error":           "Utilisateur sélectionné invalide",
						"users":           getUsers(),
					})
				}
				return
			}
		}

		if expense.DateAchat == "" {
			expense.DateAchat = time.Now().Format("2006-01-02")
		}

		if err := db.Create(&expense).Error; err != nil {
			log.Printf("création de la dépense: %v", err)
			if expectsJSON {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Impossible de créer la dépense"})
			} else {
				c.HTML(http.StatusInternalServerError, "create_expense.html", gin.H{
					"title":           "Créer une dépense",
					"ContentTemplate": "create_expense_content",
					"today":           time.Now().Format("2006-01-02"),
					"error":           "Impossible de créer la dépense",
					"users":           getUsers(),
				})
			}
			return
		}

		if err := db.Preload("User").First(&expense, expense.ID).Error; err != nil {
			log.Printf("chargement de la dépense créée: %v", err)
		}

		if expectsJSON {
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
		if err := db.Preload("User").Order("id ASC").Find(&expenses).Error; err != nil {
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

	return r
}

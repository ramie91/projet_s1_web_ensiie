package main

import (
	"errors"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func setupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	store := cookie.NewStore([]byte("change-this-secret"))
	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   60 * 60 * 24 * 30, // 30 days
		HttpOnly: true,
	})
	r.Use(sessions.Sessions("checkmate_session", store))
	r.Use(withCurrentUser(db))

	r.Static("/static", "./static")
	r.LoadHTMLGlob("templates/*")

	r.GET("/", func(c *gin.Context) {
		currentUser := getCurrentUser(c)
		c.HTML(http.StatusOK, "home.html", gin.H{
			"title":           "Bienvenue sur CheckMate",
			"ContentTemplate": "home_content",
			"currentUser":     currentUser,
		})
	})

	r.GET("/login", func(c *gin.Context) {
		if currentUser := getCurrentUser(c); currentUser != nil {
			c.Redirect(http.StatusSeeOther, "/")
			return
		}
		c.HTML(http.StatusOK, "login.html", gin.H{
			"title":           "Connexion",
			"ContentTemplate": "login_content",
		})
	})

	r.GET("/register", func(c *gin.Context) {
		if currentUser := getCurrentUser(c); currentUser != nil {
			c.Redirect(http.StatusSeeOther, "/")
			return
		}
		c.HTML(http.StatusOK, "register.html", gin.H{
			"title":           "Créer un compte",
			"ContentTemplate": "register_content",
		})
	})

	r.POST("/register", func(c *gin.Context) {
		var payload struct {
			Name     string `form:"name" json:"name" binding:"required"`
			Email    string `form:"email" json:"email" binding:"required,email"`
			Password string `form:"password" json:"password" binding:"required,min=6"`
		}

		expectsJSON := expectsJSON(c)

		if err := c.ShouldBind(&payload); err != nil {
			message := "Informations invalides"
			if expectsJSON {
				c.JSON(http.StatusBadRequest, gin.H{"error": message})
			} else {
				c.HTML(http.StatusBadRequest, "register.html", gin.H{
					"title":           "Créer un compte",
					"ContentTemplate": "register_content",
					"error":           message,
				})
			}
			return
		}

		payload.Email = strings.TrimSpace(strings.ToLower(payload.Email))

		var existing User
		if err := db.Where("email = ?", payload.Email).First(&existing).Error; err == nil {
			message := "Un compte avec cet email existe déjà"
			if expectsJSON {
				c.JSON(http.StatusConflict, gin.H{"error": message})
			} else {
				c.HTML(http.StatusConflict, "register.html", gin.H{
					"title":           "Créer un compte",
					"ContentTemplate": "register_content",
					"error":           message,
				})
			}
			return
		} else if !errors.Is(err, gorm.ErrRecordNotFound) {
			log.Printf("vérification email: %v", err)
			if expectsJSON {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur interne"})
			} else {
				c.HTML(http.StatusInternalServerError, "register.html", gin.H{
					"title":           "Créer un compte",
					"ContentTemplate": "register_content",
					"error":           "Erreur interne",
				})
			}
			return
		}

		user := User{
			Name:  strings.TrimSpace(payload.Name),
			Email: payload.Email,
		}
		if err := user.SetPassword(payload.Password); err != nil {
			log.Printf("hash mot de passe: %v", err)
			if expectsJSON {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Impossible de créer le compte"})
			} else {
				c.HTML(http.StatusInternalServerError, "register.html", gin.H{
					"title":           "Créer un compte",
					"ContentTemplate": "register_content",
					"error":           "Impossible de créer le compte",
				})
			}
			return
		}

		if err := db.Create(&user).Error; err != nil {
			log.Printf("création utilisateur: %v", err)
			if expectsJSON {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Impossible de créer le compte"})
			} else {
				c.HTML(http.StatusInternalServerError, "register.html", gin.H{
					"title":           "Créer un compte",
					"ContentTemplate": "register_content",
					"error":           "Impossible de créer le compte",
				})
			}
			return
		}

		session := sessions.Default(c)
		session.Set("user_id", user.ID)
		if err := session.Save(); err != nil {
			log.Printf("sauvegarde session après inscription: %v", err)
			if expectsJSON {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur de session"})
			} else {
				c.HTML(http.StatusInternalServerError, "register.html", gin.H{
					"title":           "Créer un compte",
					"ContentTemplate": "register_content",
					"error":           "Erreur de session",
				})
			}
			return
		}

		if expectsJSON {
			c.JSON(http.StatusCreated, gin.H{"message": "Compte créé", "user": gin.H{"id": user.ID, "name": user.Name, "email": user.Email}})
			return
		}

		c.Redirect(http.StatusSeeOther, "/")
	})

	r.POST("/login", func(c *gin.Context) {
		var payload struct {
			Email    string `form:"email" json:"email" binding:"required,email"`
			Password string `form:"password" json:"password" binding:"required"`
		}

		expectsJSON := expectsJSON(c)

		if err := c.ShouldBind(&payload); err != nil {
			if expectsJSON {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Identifiants invalides"})
				return
			}
			c.HTML(http.StatusBadRequest, "login.html", gin.H{
				"title":           "Connexion",
				"ContentTemplate": "login_content",
				"error":           "Identifiants invalides",
			})
			return
		}

		var user User
		if err := db.Where("email = ?", payload.Email).First(&user).Error; err != nil || !user.CheckPassword(payload.Password) {
			if expectsJSON {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Email ou mot de passe incorrect"})
			} else {
				c.HTML(http.StatusUnauthorized, "login.html", gin.H{
					"title":           "Connexion",
					"ContentTemplate": "login_content",
					"error":           "Email ou mot de passe incorrect",
				})
			}
			return
		}

		session := sessions.Default(c)
		session.Set("user_id", user.ID)
		if err := session.Save(); err != nil {
			log.Printf("sauvegarde session: %v", err)
			if expectsJSON {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Impossible de créer la session"})
			} else {
				c.HTML(http.StatusInternalServerError, "login.html", gin.H{
					"title":           "Connexion",
					"ContentTemplate": "login_content",
					"error":           "Erreur interne",
				})
			}
			return
		}

		if expectsJSON {
			c.JSON(http.StatusOK, gin.H{"message": "Connexion réussie"})
			return
		}

		c.Redirect(http.StatusSeeOther, "/")
	})

	r.POST("/logout", requireAuth(), func(c *gin.Context) {
		session := sessions.Default(c)
		session.Clear()
		if err := session.Save(); err != nil {
			log.Printf("suppression session: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Impossible de se déconnecter"})
			return
		}
		if expectsJSON(c) {
			c.JSON(http.StatusOK, gin.H{"message": "Déconnexion effectuée"})
			return
		}
		c.Redirect(http.StatusSeeOther, "/login")
	})

	r.GET("/expenses/create", requireAuth(), func(c *gin.Context) {
		currentUser := getCurrentUser(c)
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
			"currentUser":     currentUser,
			"users":           users,
		})
	})

	r.DELETE("/expenses/delete/:id", requireAuth(), func(c *gin.Context) {
		var expense Expense
		if err := db.Delete(&expense, c.Param("id")).Error; err != nil {
			log.Printf("suppression de la dépense: %v", err)
			c.String(http.StatusInternalServerError, "Erreur lors de la suppression de la dépense")
			return
		}
		c.Status(http.StatusNoContent)
	})

	r.POST("/get_expenses_by_category", requireAuth(), func(c *gin.Context) {
		var expenses []Expense
		if err := db.Preload("User").Where("user_id = ?", getCurrentUserID(c)).Find(&expenses).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des dépenses"})
			return
		}
		c.JSON(http.StatusOK, expenses)
	})
	r.POST("/get_user", requireAuth(), func(c *gin.Context) {
		c.JSON(http.StatusOK, getCurrentUserID(c))
	})

	r.POST("/expense/create_expense", requireAuth(), func(c *gin.Context) {
		var expense Expense
		expectsJSON := expectsJSON(c)

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
					"currentUser":     getCurrentUser(c),
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
						"currentUser":     getCurrentUser(c),
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
						"currentUser":     getCurrentUser(c),
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
					"currentUser":     getCurrentUser(c),
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

	r.GET("/expenses", requireAuth(), func(c *gin.Context) {
		var expenses []Expense
		if err := db.Preload("User").Order("id ASC").Find(&expenses).Error; err != nil {
			log.Printf("liste des dépenses: %v", err)
			c.String(http.StatusInternalServerError, "Impossible de charger les dépenses")
			return
		}
		currentUser := getCurrentUser(c)
		c.HTML(http.StatusOK, "expenses.html", gin.H{
			"title":           "Dépenses",
			"ContentTemplate": "expenses_content",
			"expenses":        expenses,
			"currentUser":     currentUser,
		})
	})

	return r
}

func expectsJSON(c *gin.Context) bool {
	return strings.Contains(c.GetHeader("Accept"), "application/json") ||
		strings.Contains(c.GetHeader("Content-Type"), "application/json") ||
		c.GetHeader("X-Requested-With") == "XMLHttpRequest"
}

func withCurrentUser(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		userID := session.Get("user_id")
		if userID == nil {
			c.Next()
			return
		}

		var id uint
		switch v := userID.(type) {
		case uint:
			id = v
		case int:
			id = uint(v)
		case int64:
			id = uint(v)
		case float64:
			id = uint(v)
		default:
			id = 0
		}

		if id == 0 {
			c.Next()
			return
		}

		var user User
		if err := db.First(&user, id).Error; err != nil {
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				log.Printf("lecture utilisateur session: %v", err)
			}
			session.Delete("user_id")
			_ = session.Save()
			c.Next()
			return
		}

		c.Set("currentUser", &user)
		c.Next()
	}
}

func getCurrentUser(c *gin.Context) *User {
	if user, ok := c.Get("currentUser"); ok {
		if u, ok := user.(*User); ok {
			return u
		}
	}
	return nil
}

func getCurrentUserID(c *gin.Context) uint {
	if user := getCurrentUser(c); user != nil {
		return user.ID
	}
	return 0
}

func requireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		if getCurrentUser(c) == nil {
			if expectsJSON(c) {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authentification requise"})
			} else {
				c.Redirect(http.StatusSeeOther, "/login")
				c.Abort()
			}
			return
		}
		c.Next()
	}
}

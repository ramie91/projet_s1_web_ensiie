package main

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type User struct {
	ID           uint      `gorm:"primaryKey"`
	Name         string    `gorm:"not null"`
	Email        string    `gorm:"uniqueIndex;not null"`
	Password     string    `gorm:"-"` // helper field for form binding
	PasswordHash string    `gorm:"not null"`
	Expenses     []Expense `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
}

type Expense struct {
	ID        uint    `gorm:"primaryKey"`
	Title     string  `gorm:"not null"`
	Amount    float64 `gorm:"not null"`
	Currency  string  `gorm:"size:3;not null"`
	DateAchat string  `gorm:"not null;default:CURRENT_TIMESTAMP"`
	Category  string  `gorm:"size:50"`
	UserID    uint    `gorm:"not null"`
	User      User    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
}

func initDatabase(path string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(path), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(&User{}, &Expense{}); err != nil {
		return nil, err
	}

	defaultUser, err := ensureDefaultUser(db)
	if err != nil {
		return nil, err
	}

	if err := db.Model(&Expense{}).Where("user_id = ? OR user_id IS NULL", 0).Update("user_id", defaultUser.ID).Error; err != nil {
		return nil, err
	}

	var count int64
	if err := db.Model(&Expense{}).Count(&count).Error; err != nil {
		return nil, err
	}

	if count == 0 {
		seedExpenses := []Expense{
			{Title: "Pizza", Amount: 24.50, Currency: "EUR", DateAchat: "2025-10-01", Category: "Nourriture", UserID: defaultUser.ID},
			{Title: "Uber", Amount: 12.00, Currency: "EUR", DateAchat: "2025-10-02", Category: "Transport", UserID: defaultUser.ID},
		}
		if err := db.Create(&seedExpenses).Error; err != nil {
			return nil, err
		}
	}

	return db, nil
}

func ensureDefaultUser(db *gorm.DB) (User, error) {
	var user User
	if err := db.Order("id ASC").First(&user).Error; err == nil {
		if user.PasswordHash == "" {
			if err := user.SetPassword("demo"); err != nil {
				return User{}, err
			}
			if err := db.Model(&user).Update("password_hash", user.PasswordHash).Error; err != nil {
				return User{}, err
			}
		}
		return user, nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return User{}, err
	}

	defaultUser := User{
		Name:  "Utilisateur Démo",
		Email: "demo@example.com",
	}
	if err := defaultUser.SetPassword("demo"); err != nil {
		return User{}, err
	}
	if err := db.Create(&defaultUser).Error; err != nil {
		return User{}, err
	}

	return defaultUser, nil
}

func (u *User) SetPassword(password string) error {
	if password == "" {
		return errors.New("password empty")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.PasswordHash = string(hash)
	return nil
}

func (u *User) CheckPassword(password string) bool {
	if u.PasswordHash == "" {
		return false
	}
	return bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password)) == nil
}

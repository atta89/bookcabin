package main

import (
	"bc_backend/handlers"
	"bc_backend/models"
	"bc_backend/repositories"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	app := fiber.New()

	app.Use(cors.New())

	db, err := gorm.Open(sqlite.Open("vouchers.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err.Error())
	}

	db.AutoMigrate(&models.Voucher{})

	api := app.Group("/api")

	voucherRepo := repositories.NewVoucherRepo(db)
	handlers.NewVoucherHandler(api, db, voucherRepo)

	app.Listen(":8080")
}

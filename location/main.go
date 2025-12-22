package main

import (
	"log"

	"location/internal/location"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	repo, err := location.NewRepository(
		"mongodb://root:example@localhost:27017/?authSource=admin",
		"location_db",
		"locations",
	)
	if err != nil {
		log.Fatal(err)
	}

	svc := location.NewService(repo)
	handler := location.NewHandler(svc)

	app.Post("/location/update", handler.CreateLocation)
	app.Get("/location/:driverId", handler.GetLocation)

	log.Fatal(app.Listen(":8084"))

}

package location

import (
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (handler *Handler) CreateLocation(c *fiber.Ctx) error {
	var loc Location

	if err := c.BodyParser(&loc); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
	}

	if err := handler.service.Create(c.Context(), loc); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"status": "ok"})
}

func (handler *Handler) GetLocation(c *fiber.Ctx) error {
	id := c.Params("supplierId")
	loc, err := handler.service.GetLocation(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "location not found"})
	}

	return c.JSON(loc)
}

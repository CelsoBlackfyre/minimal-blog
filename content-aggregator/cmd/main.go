package main

import (
	"blackfyre-codex/content-aggregator/scraper"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	app := fiber.New()
	app.Use(cors.New())

	err := godotenv.Load("../.env") // Loading from the root .env file
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	log.Println("Successfully loaded .env file")

	// Debug: Print all environment variables (be careful with this in production)
	log.Println("Environment variables:")
	for _, env := range os.Environ() {
		log.Println(env)
	}
	log.Println("TMDB_API_KEY exists:", os.Getenv("TMDB_API_KEY") != "")

	app.Get("/api/movies", func(c *fiber.Ctx) error {
		movies, err := scraper.FetchMovies()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.JSON(movies)
	})

	app.Get("/api/tvshows", func(c *fiber.Ctx) error {
		tvshows, err := scraper.FetchTVShows()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.JSON(tvshows)
	})

	log.Fatal(app.Listen(":8080"))
}

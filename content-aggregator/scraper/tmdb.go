package scraper

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
)

// safeSubstring returns a substring of s from start to end, handling out of bounds
func safeSubstring(s string, start, end int) string {
	runes := []rune(s)
	if start < 0 {
		start = 0
	}
	if end > len(runes) {
		end = len(runes)
	}
	if start >= end {
		return ""
	}
	return string(runes[start:end])
}

type Movie struct {
	Title  string `json:"title"`
	ID     int    `json:"id"`
	Poster string `json:"poster_path"`
	// add more stuff later
}

type TMDBResponse struct {
	Results []Movie `json:"results"`
}

func FetchMovies() ([]Movie, error) {
	apiKey := os.Getenv("TMDB_API_KEY")
	if apiKey == "" {
		log.Println("TMDB_API_KEY is empty in environment variables")
		return nil, errors.New("TMDB_API_KEY not set in environment variables")
	}
	log.Printf("TMDB_API_KEY length: %d, starts with: %s, ends with: %s\n",
		len(apiKey),
		safeSubstring(apiKey, 0, 10),
		safeSubstring(apiKey, len(apiKey)-10, len(apiKey)),
	)

	log.Printf("Using API Key: %s...%s\n", apiKey[:8], apiKey[len(apiKey)-4:])

	baseURL := "https://api.themoviedb.org/3/discover/movie"
	params := url.Values{}
	params.Add("api_key", apiKey)
	params.Add("language", "en-US")
	params.Add("sort_by", "popularity.desc")
	params.Add("page", "1")

	endpoint := fmt.Sprintf("%s?%s", baseURL, params.Encode())
	log.Printf("Making request to: %s\n", endpoint)

	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %v", err)
	}

	req.Header.Add("accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch TMDB data: %v", err)
	}
	defer resp.Body.Close()

	// Read the response body to include in the error message
	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("TMDB API error (%d): %s - %s", resp.StatusCode, resp.Status, string(body))
	}

	var tmdbResp TMDBResponse
	if err := json.Unmarshal(body, &tmdbResp); err != nil {
		return nil, fmt.Errorf("failed to decode TMDB response: %v - Body: %s", err, string(body))
	}

	fmt.Println("Latest  Movies: ")
	for _, movie := range tmdbResp.Results {
		fmt.Println(movie.Title, movie.ID, movie.Poster)
	}

	return tmdbResp.Results, nil
}

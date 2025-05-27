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
func safeSubstringTV(s string, start, end int) string {
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

type TVShow struct {
	Name       string `json:"name"`
	ID         int    `json:"id"`
	PosterPath string `json:"poster_path"`
	// add more stuff later
}

type TMDBResponseTV struct {
	ResultsTV []TVShow `json:"results"`
}

func FetchTVShows() ([]TVShow, error) {
	apiKey := os.Getenv("TMDB_API_KEY")
	if apiKey == "" {
		log.Println("TMDB_API_KEY is empty in environment variables")
		return nil, errors.New("TMDB_API_KEY not set in environment variables")
	}
	log.Printf("TMDB_API_KEY length: %d, starts with: %s, ends with: %s\n",
		len(apiKey),
		safeSubstringTV(apiKey, 0, 10),
		safeSubstringTV(apiKey, len(apiKey)-10, len(apiKey)),
	)

	log.Printf("Using API Key: %s...%s\n", apiKey[:8], apiKey[len(apiKey)-4:])

	baseURL := "https://api.themoviedb.org/3/trending/tv/week"
	params := url.Values{}
	params.Add("api_key", apiKey)
	params.Add("language", "en-US")

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

	var tmdbResp TMDBResponseTV
	if err := json.Unmarshal(body, &tmdbResp); err != nil {
		return nil, fmt.Errorf("failed to decode TMDB response: %v - Body: %s", err, string(body))
	}

	fmt.Println("Latest  TV Shows: ")
	for _, tvshow := range tmdbResp.ResultsTV {
		fmt.Println(tvshow.Name, tvshow.ID, tvshow.PosterPath)
	}

	return tmdbResp.ResultsTV, nil
}

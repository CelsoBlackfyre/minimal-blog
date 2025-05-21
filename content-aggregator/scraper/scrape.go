package scraper

import (
	"fmt"
	"log"

	"github.com/gocolly/colly/v2"
)

type Post struct {
	Title string
	Link  string
}

func FetchLatestPosts() ([]Post, error) {
	var posts []Post
	collector := colly.NewCollector()

	collector.OnHTML("h1", func(e *colly.HTMLElement) {
		// Store the title in the last post
		if len(posts) > 0 {
			posts[len(posts)-1].Title = e.Text
		}
	})

	collector.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		posts = append(posts, Post{
			Link: link,
			Title: "", // Title will be set when we encounter the corresponding h1
		})
	})

	collector.OnResponse(func(r *colly.Response) {
		log.Printf("Visited %q", r.Request.URL.String())
	})

	collector.OnError(func(r *colly.Response, e error) {
		fmt.Println("Error: ", e)
		log.Fatal(e)
	})

	if err := collector.Visit("https://getcomics.info/"); err != nil {
		return nil, fmt.Errorf("failed to fetch posts: %w", err)
	}

	return posts, nil
}

# Content Aggregator

A Go application for aggregating content from various sources.

## Project Structure

```
content-aggregator/
├── cmd/
│   └── aggregator/      # Main application entry point
├── internal/
│   └── config/          # Application configuration
├── pkg/
│   ├── fetcher/         # Content fetching functionality
│   ├── parser/          # Content parsing functionality
│   └── storage/         # Content storage functionality
├── go.mod               # Go module file
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Go 1.16 or higher

### Running the Application

```bash
# From the project root
go run cmd/aggregator/main.go
```

## Features

- Fetch content from various sources (RSS, Atom, JSON)
- Parse content into a standardized format
- Store content for later use

## Configuration

Currently, the application uses a hardcoded configuration. Future versions will support configuration via files or environment variables.

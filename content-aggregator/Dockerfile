# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .


# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o aggregator

# Final stage
FROM alpine:latest
WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/aggregator .

# Copy any necessary files (configs, templates, etc.)
# COPY --from=builder /app/configs ./configs

# Expose port
EXPOSE 8080

# Run the binary
CMD ["./aggregator"]

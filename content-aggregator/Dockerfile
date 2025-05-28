# Check if Dockerfile exists
if [ ! -f Dockerfile ]; then
  cat > Dockerfile << 'EOF'
# Use the official Golang image
FROM golang:1.21-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd

# Use a minimal alpine image
FROM alpine:latest

# Install CA certificates
RUN apk --no-cache add ca-certificates

# Set the working directory
WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/main .

# Expose the port your app runs on
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
EOF
fi
.PHONY: build build-api build-all run run-api clean test

# Build variables
BINARY_NAME=content-aggregator
API_BINARY_NAME=content-api
BUILD_DIR=./build
AGGREGATOR_CMD_DIR=./cmd/aggregator
API_CMD_DIR=./cmd/api

# Build the aggregator application
build:
	@echo "Building $(BINARY_NAME)..."
	@mkdir -p $(BUILD_DIR)
	@go build -o $(BUILD_DIR)/$(BINARY_NAME) $(AGGREGATOR_CMD_DIR)

# Build the API application
build-api:
	@echo "Building $(API_BINARY_NAME)..."
	@mkdir -p $(BUILD_DIR)
	@go build -o $(BUILD_DIR)/$(API_BINARY_NAME) $(API_CMD_DIR)

# Build all applications
build-all: build build-api

# Run the aggregator application
run:
	@go run $(AGGREGATOR_CMD_DIR)

# Run the API application
run-api:
	@go run $(API_CMD_DIR)

# Clean build artifacts
clean:
	@echo "Cleaning..."
	@rm -rf $(BUILD_DIR)

# Run tests
test:
	@go test ./...

# Download dependencies
deps:
	@echo "Downloading dependencies..."
	@go mod tidy

# Build and run aggregator
dev: build run

# Build and run API
dev-api: build-api run-api

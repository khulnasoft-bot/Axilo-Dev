# AXILO CLI Project Makefile
# Build automation and development tasks

.PHONY: help install build dev test lint clean setup ci package

# Default target
help:
	@echo "AXILO CLI - Available commands:"
	@echo ""
	@echo "Installation & Setup:"
	@echo "  install      Install dependencies for all packages"
	@echo "  setup        Full setup (install + build)"
	@echo ""
	@echo "Development:"
	@echo "  dev          Start development servers for all packages"
	@echo "  build        Build all packages"
	@echo "  test         Run tests for all packages"
	@echo "  test-watch   Run tests in watch mode"
	@echo "  lint         Lint all packages"
	@echo "  lint-fix     Fix linting issues"
	@echo "  clean        Clean build artifacts"
	@echo ""
	@echo "CI/CD:"
	@echo "  ci           Run full CI pipeline (lint + test + build)"
	@echo ""
	@echo "Containerization:"
	@echo "  docker-build Build Docker image"
	@echo "  docker-run   Run Docker container"
	@echo "  docker-dev   Run container in development mode"
	@echo ""
	@echo "Other:"
	@echo "  package      Show package information"

# Installation and setup
install:
	@echo "Installing dependencies..."
	pnpm install

setup: install
	@echo "Setting up project..."
	$(MAKE) build

# Development commands
dev:
	@echo "Starting development servers..."
	pnpm dev

build:
	@echo "Building all packages..."
	pnpm build

# Testing
test:
	@echo "Running tests..."
	pnpm test

test-watch:
	@echo "Running tests in watch mode..."
	pnpm test:watch

test-coverage:
	@echo "Running tests with coverage..."
	pnpm test:coverage

# Code quality
lint:
	@echo "Linting code..."
	pnpm lint

lint-fix:
	@echo "Fixing linting issues..."
	pnpm lint:fix

typecheck:
	@echo "Running TypeScript type checking..."
	pnpm --filter 'packages/*' run typecheck

# Cleaning
clean:
	@echo "Cleaning build artifacts..."
	pnpm clean
	@echo "Removing node_modules and lock files..."
	rm -rf node_modules pnpm-lock.yaml
	@echo "Clean complete. Run 'make install' to reinstall dependencies."

# CI/CD pipeline
ci: lint test build
	@echo "CI pipeline completed successfully!"

# Package information
package:
	@echo "AXILO CLI Project"
	@echo "=================="
	@echo "Version: $$(node -p "require('./package.json').version")"
	@echo "Package Manager: $$(node -p "require('./package.json').packageManager")"
	@echo "Node Version: $$(node -p "require('./package.json').engines.node")"
	@echo ""
	@echo "Packages:"
	@find packages -name "package.json" -exec sh -c 'echo "  - $$(node -p "require(\"$$1\").name + \"@\" + require(\"$$1\").version")"' _ {} \;

# Integration tests
integration-test:
	@echo "Running integration tests..."
	pnpm integration-test

# Development shortcuts
quick-dev: clean build dev

# Production build
dist: build
	@echo "Production build complete. Check dist/ directories in packages."

# Docker commands
DOCKER_IMAGE_NAME := axilo-cli
DOCKER_TAG := latest

docker-build:
	@echo "Building Docker image..."
	docker build -t $(DOCKER_IMAGE_NAME):$(DOCKER_TAG) .

docker-run:
	@echo "Running Docker container..."
	docker run --rm $(DOCKER_IMAGE_NAME):$(DOCKER_TAG)

docker-dev:
	@echo "Running Docker container in development mode..."
	docker run --rm -it \
		-v $$(pwd):/app \
		-w /app \
		$(DOCKER_IMAGE_NAME):$(DOCKER_TAG) \
		/bin/sh

docker-clean:
	@echo "Cleaning up Docker resources..."
	docker rmi $(DOCKER_IMAGE_NAME):$(DOCKER_TAG) 2>/dev/null || true

# Installation and setup
install:
	@echo "Installing dependencies..."
	pnpm install

setup: install
	@echo "Setting up project..."
	$(MAKE) build

# Development commands
dev:
	@echo "Starting development servers..."
	pnpm dev

build:
	@echo "Building all packages..."
	pnpm build

# Testing
test:
	@echo "Running tests..."
	pnpm test

test-watch:
	@echo "Running tests in watch mode..."
	pnpm test:watch

test-coverage:
	@echo "Running tests with coverage..."
	pnpm test:coverage

# Code quality
lint:
	@echo "Linting code..."
	pnpm lint

lint-fix:
	@echo "Fixing linting issues..."
	pnpm lint:fix

typecheck:
	@echo "Running TypeScript type checking..."
	pnpm --filter 'packages/*' run typecheck

# Cleaning
clean:
	@echo "Cleaning build artifacts..."
	pnpm clean
	@echo "Removing node_modules and lock files..."
	rm -rf node_modules pnpm-lock.yaml
	@echo "Clean complete. Run 'make install' to reinstall dependencies."

# CI/CD pipeline
ci: lint test build
	@echo "CI pipeline completed successfully!"

# Package information
package:
	@echo "AXILO CLI Project"
	@echo "=================="
	@echo "Version: $$(node -p "require('./package.json').version")"
	@echo "Package Manager: $$(node -p "require('./package.json').packageManager")"
	@echo "Node Version: $$(node -p "require('./package.json').engines.node")"
	@echo ""
	@echo "Packages:"
	@find packages -name "package.json" -exec sh -c 'echo "  - $$(node -p "require(\"$$1\").name + \"@\" + require(\"$$1\").version")"' _ {} \;

# Integration tests
integration-test:
	@echo "Running integration tests..."
	pnpm integration-test

# Development shortcuts
quick-dev: clean build dev

# Production build
dist: build
	@echo "Production build complete. Check dist/ directories in packages."

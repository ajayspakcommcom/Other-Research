#!/bin/bash

# Docker utilities script for the Node.js application
# Provides common Docker operations with proper error handling

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="nodejs-docker-app"
CONTAINER_NAME="nodejs-app"
NETWORK_NAME="nodejs-network"

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to display usage
usage() {
    echo "Docker Utilities for Node.js Application"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  build           Build Docker image"
    echo "  run             Run container"
    echo "  dev             Start development environment"
    echo "  prod            Start production environment"
    echo "  stop            Stop all containers"
    echo "  clean           Clean up containers and images"
    echo "  logs            Show container logs"
    echo "  shell           Open shell in running container"
    echo "  test            Run tests in container"
    echo "  push            Push image to registry"
    echo "  security-scan   Run security scan on image"
    echo ""
    echo "Options:"
    echo "  --rebuild       Force rebuild without cache"
    echo "  --detach        Run in detached mode"
    echo "  --follow        Follow logs output"
    echo ""
}

# Build Docker image
build_image() {
    local rebuild_flag=""
    if [[ "$1" == "--rebuild" ]]; then
        rebuild_flag="--no-cache"
    fi
    
    log_info "Building Docker image: $IMAGE_NAME"
    docker build $rebuild_flag -t $IMAGE_NAME .
    log_success "Image built successfully"
}

# Run container
run_container() {
    local detach_flag=""
    if [[ "$1" == "--detach" ]]; then
        detach_flag="-d"
    fi
    
    log_info "Running container: $CONTAINER_NAME"
    docker run $detach_flag --name $CONTAINER_NAME -p 3000:3000 --rm $IMAGE_NAME
}

# Start development environment
start_dev() {
    log_info "Starting development environment with Docker Compose"
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
}

# Start production environment
start_prod() {
    log_info "Starting production environment with Docker Compose"
    docker-compose up -d --build
    log_success "Production environment started"
    
    # Wait for health check
    log_info "Waiting for application to be healthy..."
    sleep 10
    
    if ./scripts/health-check.sh; then
        log_success "Application is healthy and ready!"
    else
        log_error "Application health check failed"
        exit 1
    fi
}

# Stop containers
stop_containers() {
    log_info "Stopping all containers"
    docker-compose down
    
    # Stop individual container if running
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        docker stop $CONTAINER_NAME
    fi
    
    log_success "All containers stopped"
}

# Clean up
cleanup() {
    log_info "Cleaning up containers and images"
    
    # Stop and remove containers
    docker-compose down -v --remove-orphans
    
    # Remove individual container
    if docker ps -a -q -f name=$CONTAINER_NAME | grep -q .; then
        docker rm -f $CONTAINER_NAME
    fi
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    log_success "Cleanup completed"
}

# Show logs
show_logs() {
    local follow_flag=""
    if [[ "$1" == "--follow" ]]; then
        follow_flag="-f"
    fi
    
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        log_info "Showing logs for container: $CONTAINER_NAME"
        docker logs $follow_flag $CONTAINER_NAME
    else
        log_info "Showing logs for Docker Compose services"
        docker-compose logs $follow_flag
    fi
}

# Open shell
open_shell() {
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        log_info "Opening shell in container: $CONTAINER_NAME"
        docker exec -it $CONTAINER_NAME /bin/sh
    else
        log_error "Container $CONTAINER_NAME is not running"
        exit 1
    fi
}

# Run tests
run_tests() {
    log_info "Running tests in Docker container"
    docker run --rm --name test-container \
        -e NODE_ENV=test \
        -e MONGODB_URI=mongodb://mongo:27017/test_app \
        --network nodejs-docker-project_app-network \
        $IMAGE_NAME npm test
}

# Push to registry
push_image() {
    local registry=${REGISTRY:-"localhost:5000"}
    local tag="${registry}/${IMAGE_NAME}:latest"
    
    log_info "Tagging image for registry: $tag"
    docker tag $IMAGE_NAME $tag
    
    log_info "Pushing image to registry"
    docker push $tag
    
    log_success "Image pushed successfully"
}

# Security scan
security_scan() {
    log_info "Running security scan with Trivy"
    
    if ! command -v trivy &> /dev/null; then
        log_warning "Trivy not found. Please install Trivy for security scanning."
        return 1
    fi
    
    trivy image --exit-code 1 --severity HIGH,CRITICAL $IMAGE_NAME
    log_success "Security scan completed"
}

# Main script logic
case "$1" in
    build)
        build_image "$2"
        ;;
    run)
        run_container "$2"
        ;;
    dev)
        start_dev
        ;;
    prod)
        start_prod
        ;;
    stop)
        stop_containers
        ;;
    clean)
        cleanup
        ;;
    logs)
        show_logs "$2"
        ;;
    shell)
        open_shell
        ;;
    test)
        run_tests
        ;;
    push)
        push_image
        ;;
    security-scan)
        security_scan
        ;;
    *)
        usage
        exit 1
        ;;
esac
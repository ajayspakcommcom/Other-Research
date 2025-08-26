#!/bin/bash

# Health check script for the application
# This script can be used by Docker health checks or monitoring systems

set -e

HOST=${HOST:-localhost}
PORT=${PORT:-3000}
TIMEOUT=${TIMEOUT:-5}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🏥 Running health check for Node.js application..."

# Function to check endpoint
check_endpoint() {
    local endpoint=$1
    local expected_status=${2:-200}
    local description=$3
    
    echo -n "  ✓ Checking $description..."
    
    if response=$(curl -s -w "%{http_code}" --max-time $TIMEOUT "http://$HOST:$PORT$endpoint"); then
        status_code="${response: -3}"
        if [ "$status_code" -eq "$expected_status" ]; then
            echo -e " ${GREEN}OK${NC} ($status_code)"
            return 0
        else
            echo -e " ${RED}FAILED${NC} ($status_code)"
            return 1
        fi
    else
        echo -e " ${RED}FAILED${NC} (connection error)"
        return 1
    fi
}

# Run health checks
echo "📍 Target: http://$HOST:$PORT"
echo "⏱️  Timeout: ${TIMEOUT}s"
echo ""

# Basic health checks
check_endpoint "/" 200 "root endpoint"
check_endpoint "/health" 200 "health endpoint"
check_endpoint "/health/ready" 200 "readiness probe"
check_endpoint "/health/live" 200 "liveness probe"
check_endpoint "/metrics" 200 "metrics endpoint"

# API endpoints
check_endpoint "/api/users" 200 "users API"

# Invalid endpoint (should return 404)
check_endpoint "/invalid-endpoint" 404 "error handling"

echo ""
echo -e "${GREEN}✅ All health checks passed!${NC}"
exit 0
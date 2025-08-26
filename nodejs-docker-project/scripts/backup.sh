#!/bin/bash

# Backup script for MongoDB and Redis data
# This script creates backups of database data for disaster recovery

set -e

# Configuration
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
MONGO_CONTAINER="mongodb"
REDIS_CONTAINER="redis"
RETENTION_DAYS=7

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

# MongoDB backup
backup_mongodb() {
    log_info "Starting MongoDB backup..."
    
    local backup_file="$BACKUP_DIR/mongodb_backup_$TIMESTAMP.gz"
    
    if docker ps --format "table {{.Names}}" | grep -q "$MONGO_CONTAINER"; then
        docker exec "$MONGO_CONTAINER" mongodump --gzip --archive="/tmp/backup_$TIMESTAMP.gz" \
            --uri="mongodb://admin:password123@localhost:27017"
        
        docker cp "$MONGO_CONTAINER:/tmp/backup_$TIMESTAMP.gz" "$backup_file"
        docker exec "$MONGO_CONTAINER" rm "/tmp/backup_$TIMESTAMP.gz"
        
        log_info "MongoDB backup completed: $backup_file"
    else
        log_warn "MongoDB container not running, skipping backup"
    fi
}

# Redis backup
backup_redis() {
    log_info "Starting Redis backup..."
    
    local backup_file="$BACKUP_DIR/redis_backup_$TIMESTAMP.rdb"
    
    if docker ps --format "table {{.Names}}" | grep -q "$REDIS_CONTAINER"; then
        # Trigger Redis save
        docker exec "$REDIS_CONTAINER" redis-cli BGSAVE
        
        # Wait for save to complete
        while [ "$(docker exec "$REDIS_CONTAINER" redis-cli LASTSAVE)" = "$(docker exec "$REDIS_CONTAINER" redis-cli LASTSAVE)" ]; do
            sleep 1
        done
        
        # Copy the dump file
        docker cp "$REDIS_CONTAINER:/data/dump.rdb" "$backup_file"
        
        log_info "Redis backup completed: $backup_file"
    else
        log_warn "Redis container not running, skipping backup"
    fi
}

# Clean old backups
cleanup_old_backups() {
    log_info "Cleaning up old backups (older than $RETENTION_DAYS days)..."
    
    find "$BACKUP_DIR" -name "*_backup_*" -type f -mtime +$RETENTION_DAYS -delete
    
    log_info "Cleanup completed"
}

# Restore MongoDB from backup
restore_mongodb() {
    local backup_file="$1"
    
    if [[ -z "$backup_file" ]]; then
        log_error "Please provide backup file path"
        exit 1
    fi
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log_info "Restoring MongoDB from: $backup_file"
    
    # Copy backup to container
    docker cp "$backup_file" "$MONGO_CONTAINER:/tmp/restore.gz"
    
    # Restore
    docker exec "$MONGO_CONTAINER" mongorestore --gzip --archive="/tmp/restore.gz" \
        --uri="mongodb://admin:password123@localhost:27017" --drop
    
    # Cleanup
    docker exec "$MONGO_CONTAINER" rm "/tmp/restore.gz"
    
    log_info "MongoDB restore completed"
}

# Restore Redis from backup
restore_redis() {
    local backup_file="$1"
    
    if [[ -z "$backup_file" ]]; then
        log_error "Please provide backup file path"
        exit 1
    fi
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log_info "Restoring Redis from: $backup_file"
    
    # Stop Redis temporarily
    docker exec "$REDIS_CONTAINER" redis-cli SHUTDOWN NOSAVE || true
    
    # Copy backup file
    docker cp "$backup_file" "$REDIS_CONTAINER:/data/dump.rdb"
    
    # Restart Redis
    docker restart "$REDIS_CONTAINER"
    
    log_info "Redis restore completed"
}

# Display usage
usage() {
    echo "Database Backup and Restore Script"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  backup                  Create backups of MongoDB and Redis"
    echo "  restore-mongo <file>    Restore MongoDB from backup file"
    echo "  restore-redis <file>    Restore Redis from backup file"
    echo "  cleanup                 Remove old backup files"
    echo "  list                    List available backup files"
    echo ""
}

# List backups
list_backups() {
    log_info "Available backup files in $BACKUP_DIR:"
    ls -la "$BACKUP_DIR"/*_backup_* 2>/dev/null || log_warn "No backup files found"
}

# Main script logic
case "$1" in
    backup)
        backup_mongodb
        backup_redis
        cleanup_old_backups
        ;;
    restore-mongo)
        restore_mongodb "$2"
        ;;
    restore-redis)
        restore_redis "$2"
        ;;
    cleanup)
        cleanup_old_backups
        ;;
    list)
        list_backups
        ;;
    *)
        usage
        exit 1
        ;;
esac

log_info "Operation completed successfully!"
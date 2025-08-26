# Multi-stage Docker build for production optimization

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies including dev dependencies for building
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Development stage
FROM node:20-alpine AS development

# Create app directory and user for security first
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for development)
RUN npm ci && npm cache clean --force

# Copy source code
COPY --chown=nodejs:nodejs . .

# Create logs directory
RUN mkdir -p logs && chown -R nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
              const options = { host: 'localhost', port: 3000, path: '/health', timeout: 2000 }; \
              const req = http.request(options, (res) => { \
                if (res.statusCode === 200) process.exit(0); \
                else process.exit(1); \
              }); \
              req.on('error', () => process.exit(1)); \
              req.end();"

# Start the application in development mode
CMD ["npm", "run", "dev"]

# Stage 3: Production stage
FROM node:20-alpine AS production

# Create app directory and user for security first
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs src/ ./src/

# Create logs directory
RUN mkdir -p logs && chown -R nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
              const options = { host: 'localhost', port: 3000, path: '/health', timeout: 2000 }; \
              const req = http.request(options, (res) => { \
                if (res.statusCode === 200) process.exit(0); \
                else process.exit(1); \
              }); \
              req.on('error', () => process.exit(1)); \
              req.end();"

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "src/app.js"]

# Default target is production
FROM production
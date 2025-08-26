# Node.js Docker Production Application

A comprehensive Node.js application demonstrating all essential Docker features used in real-world production environments. This project showcases containerization, multi-stage builds, microservices architecture, security best practices, and complete CI/CD integration.

## 🚀 Features

### Docker Features Implemented

- ✅ **Containerization** - Complete application packaging with dependencies
- ✅ **Multi-stage Builds** - Optimized production images with separate build stages
- ✅ **Docker Compose** - Multi-container orchestration (Node.js + MongoDB + Redis + Nginx)
- ✅ **Volume Mounts** - Data persistence and development hot-reload
- ✅ **Networking** - Internal container communication with isolated networks
- ✅ **Environment Variables & Secrets** - Secure configuration management
- ✅ **Port Mapping** - Service exposure and load balancing
- ✅ **Base Images** - Alpine Linux for minimal attack surface
- ✅ **Health Checks** - Application and container health monitoring
- ✅ **Logging** - Structured logging with rotation and aggregation
- ✅ **Scaling** - Horizontal scaling ready configuration
- ✅ **Security Best Practices** - Non-root users, read-only filesystems, security headers
- ✅ **Caching Layers** - Optimized Docker layer caching for faster builds
- ✅ **CI/CD Integration** - Complete GitHub Actions pipeline
- ✅ **Cross-Platform Consistency** - Multi-architecture builds (AMD64/ARM64)

### Application Features

- 🔧 **Express.js REST API** with comprehensive middleware
- 🗄️ **MongoDB Integration** with Mongoose ODM
- 🔄 **Redis Caching** for performance optimization
- 🔒 **Security Middleware** (Helmet, CORS, Rate Limiting)
- 📊 **Prometheus Metrics** for monitoring
- 🧪 **Comprehensive Testing** (Unit, Integration, End-to-End)
- 📝 **Structured Logging** with Winston
- 🔍 **Health Check Endpoints** (/health, /ready, /live)
- ⚡ **Graceful Shutdown** handling
- 🛡️ **Input Validation** and error handling

## 📁 Project Structure

```
nodejs-docker-project/
├── src/                          # Application source code
│   ├── routes/                   # API routes
│   ├── models/                   # Database models
│   ├── middleware/               # Custom middleware
│   ├── utils/                    # Utility functions
│   └── app.js                    # Main application file
├── tests/                        # Test files
├── scripts/                      # Utility scripts
├── nginx/                        # Nginx configuration
├── .github/workflows/            # CI/CD pipelines
├── Dockerfile                    # Multi-stage Docker build
├── docker-compose.yml            # Production composition
├── docker-compose.dev.yml        # Development overrides
├── .dockerignore                 # Docker build optimization
├── .env.example                  # Environment template
└── package.json                  # Node.js dependencies
```

## 🛠️ Quick Start

### Prerequisites

- Docker Engine 20.10+
- Docker Compose v2.0+
- Node.js 18+ (for local development)
- Git

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd nodejs-docker-project

# Copy environment template
cp .env.example .env

# Edit .env file with your configurations
nano .env
```

### 2. Development Environment

```bash
# Start development environment with hot reload
npm run docker:dev

# Or using Docker Compose directly
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Access services:
# - Application: http://localhost:3000
# - MongoDB Express: http://localhost:8081
# - Redis Commander: http://localhost:8082
```

### 3. Production Environment

```bash
# Start production environment
npm run docker:prod

# Or using Docker Compose directly
docker-compose up -d --build

# Access application: http://localhost (via Nginx)
```

### 4. Using Utility Scripts

```bash
# Make scripts executable (if needed)
chmod +x scripts/*.sh

# Build Docker image
./scripts/docker-utils.sh build

# Start production environment
./scripts/docker-utils.sh prod

# Run health checks
./scripts/health-check.sh

# View logs
./scripts/docker-utils.sh logs --follow

# Clean up everything
./scripts/docker-utils.sh clean
```

## 🏗️ Architecture

### Multi-Container Setup

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │    Node.js      │    │    MongoDB      │
│  Reverse Proxy  │────│   Application   │────│    Database     │
│   Load Balancer │    │      API        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         │              │     Redis       │             │
         └──────────────│     Cache       │─────────────┘
                        │                 │
                        └─────────────────┘
```

### Network Configuration

- **app-network**: Internal bridge network (172.20.0.0/16)
- **Service Discovery**: Containers communicate via service names
- **Port Mapping**: Only necessary ports exposed to host
- **Security**: Database services not directly accessible from outside

## 🔒 Security Features

### Container Security

- **Non-root User**: Application runs as `nodejs` user (UID 1001)
- **Read-only Root FS**: Container filesystem is read-only
- **Minimal Base Image**: Alpine Linux for reduced attack surface
- **Security Headers**: Comprehensive HTTP security headers via Helmet
- **Secrets Management**: Environment-based configuration
- **Network Isolation**: Internal container communication only

### Application Security

- **Input Validation**: Joi/Express-validator for request validation
- **Rate Limiting**: API and authentication endpoint protection
- **CORS Configuration**: Controlled cross-origin access
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication (when implemented)
- **Security Scanning**: Automated vulnerability scanning in CI/CD

## 📊 Monitoring & Observability

### Health Checks

```bash
# Application health
curl http://localhost:3000/health

# Readiness probe (Kubernetes-ready)
curl http://localhost:3000/health/ready

# Liveness probe (Kubernetes-ready)
curl http://localhost:3000/health/live

# Prometheus metrics
curl http://localhost:3000/metrics
```

### Logging

- **Structured JSON Logs**: Machine-readable log format
- **Log Levels**: Configurable logging levels
- **Log Rotation**: Daily rotation with compression
- **Request Tracking**: Unique request IDs for tracing
- **Error Tracking**: Comprehensive error logging with stack traces

### Metrics

- **Default Metrics**: Node.js runtime metrics
- **Custom Metrics**: HTTP request duration and counts
- **Business Metrics**: User operations and API usage
- **Health Metrics**: Database connection status

## 🧪 Testing

### Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests in Docker
./scripts/docker-utils.sh test
```

### Test Types

- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **Model Tests**: Database model validation
- **Health Check Tests**: Monitoring endpoint validation

## 🚢 Deployment

### CI/CD Pipeline

The project includes a comprehensive GitHub Actions pipeline:

1. **Code Quality**: Linting, security scanning, dependency audit
2. **Testing**: Multi-version Node.js testing with coverage
3. **Building**: Multi-architecture Docker image builds
4. **Security**: Container vulnerability scanning with Trivy
5. **Integration**: Full stack testing with Docker Compose
6. **Deployment**: Automated staging and production deployment

### Environment Promotion

```
Development → Staging → Production
     ↓           ↓         ↓
   Feature    Integration  Live
   Testing     Testing    Traffic
```

### Kubernetes Deployment (Example)

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodejs-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nodejs-app
  template:
    metadata:
      labels:
        app: nodejs-app
    spec:
      containers:
      - name: app
        image: ghcr.io/your-org/nodejs-docker-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongodb-uri
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Application port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://mongo:27017/production_app` |
| `REDIS_URL` | Redis connection string | `redis://redis:6379` |
| `LOG_LEVEL` | Logging level | `info` |
| `JWT_SECRET` | JWT signing secret | Required |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |

### Docker Compose Override

Create `docker-compose.override.yml` for local customizations:

```yaml
version: '3.8'
services:
  app:
    environment:
      - DEBUG=true
    volumes:
      - ./custom-config:/app/config
```

## 📈 Performance

### Optimization Features

- **Multi-stage Builds**: Reduced image size (production ~150MB)
- **Layer Caching**: Optimized Dockerfile instruction order
- **Compression**: Gzip compression via Nginx
- **Caching**: Redis for application-level caching
- **Connection Pooling**: Database connection optimization
- **Resource Limits**: Container resource constraints

### Benchmarking

```bash
# Install k6 for load testing
# Run performance tests
k6 run --vus 50 --duration 2m performance-test.js

# Monitor metrics during load test
curl http://localhost:3000/metrics | grep http_request_duration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and add tests
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check logs
docker-compose logs app

# Check health status
docker-compose ps

# Restart services
docker-compose restart
```

#### Database Connection Issues
```bash
# Verify MongoDB is running
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"

# Check network connectivity
docker-compose exec app ping mongo
```

#### Memory Issues
```bash
# Check container resource usage
docker stats

# Increase memory limits in docker-compose.yml
```

### Debug Mode

```bash
# Enable debug logging
echo "LOG_LEVEL=debug" >> .env

# Restart with debug
docker-compose up -d app

# Follow debug logs
docker-compose logs -f app
```

## 🔗 Related Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Prometheus Monitoring](https://prometheus.io/docs/)

---

**Built with ❤️ for production-ready containerized applications**
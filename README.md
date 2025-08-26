# Spak Communication Platform

A production-ready, full-stack communication platform built with modern technologies and DevOps best practices.

## 🏗️ Architecture Overview

This platform follows a microservices architecture with the following components:

- **Frontend**: React.js web application with TypeScript
- **Mobile**: React Native application
- **Backend**: Node.js with NestJS framework
- **Database**: MongoDB for primary data storage
- **Cache**: Redis for session management and caching
- **Authentication**: JWT + GitHub OAuth integration
- **Infrastructure**: AWS with Kubernetes (EKS)
- **Monitoring**: Prometheus + Grafana
- **CI/CD**: GitHub Actions
- **Infrastructure as Code**: Terraform
- **Configuration Management**: Ansible

## 📁 Project Structure

```
spak-communication-platform/
├── frontend/                   # React.js web application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # React context providers
│   │   ├── services/         # API services
│   │   ├── store/            # Redux store and slices
│   │   ├── styles/           # Theme and global styles
│   │   └── types/            # TypeScript type definitions
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                    # NestJS API application
│   ├── src/
│   │   ├── auth/             # Authentication module
│   │   ├── users/            # User management module
│   │   ├── common/           # Shared utilities
│   │   ├── config/           # Configuration files
│   │   ├── health/           # Health check endpoints
│   │   └── metrics/          # Prometheus metrics
│   └── Dockerfile
├── mobile/                     # React Native application
├── infrastructure/             # Infrastructure as Code
│   ├── terraform/            # AWS infrastructure
│   │   ├── modules/          # Reusable Terraform modules
│   │   └── environments/     # Environment-specific configs
│   ├── kubernetes/           # Kubernetes manifests
│   │   ├── base/            # Base configurations
│   │   └── overlays/        # Environment overlays
│   └── ansible/             # Server configuration
├── monitoring/                 # Monitoring configurations
│   ├── prometheus/          # Prometheus configuration
│   └── grafana/            # Grafana dashboards
├── .github/
│   └── workflows/           # GitHub Actions CI/CD
├── docker-compose.yml       # Local development environment
└── package.json            # Monorepo configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- AWS CLI (for deployment)
- kubectl (for Kubernetes)
- Terraform (for infrastructure)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ajayspakcommcom/Other-Research.git
   cd Other-Research
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development environment**
   ```bash
   docker-compose up -d
   ```

5. **Start the applications**
   ```bash
   # Terminal 1: Backend
   npm run dev:backend
   
   # Terminal 2: Frontend
   npm run dev:frontend
   
   # Terminal 3: Mobile (optional)
   npm run dev:mobile
   ```

### Accessing the Applications

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3002 (admin/admin123)
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

## 🔐 Authentication

The platform supports multiple authentication methods:

### Local Authentication
- Email/password registration and login
- JWT tokens with refresh token rotation
- Password hashing with bcryptjs

### GitHub OAuth
- OAuth 2.0 integration
- Automatic user creation from GitHub profile
- Seamless login experience

### Configuration

Set up GitHub OAuth:
1. Create a GitHub OAuth App at https://github.com/settings/developers
2. Set Authorization callback URL to: `http://localhost:3001/api/v1/auth/github/callback`
3. Add the credentials to your environment variables:
   ```
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

## 🏗️ Infrastructure

### Local Development
Uses Docker Compose with the following services:
- MongoDB (database)
- Redis (cache)
- Nginx (reverse proxy)
- Prometheus (metrics)
- Grafana (monitoring)

### Production Deployment

#### AWS Infrastructure (Terraform)

1. **Configure AWS credentials**
   ```bash
   aws configure
   ```

2. **Initialize Terraform**
   ```bash
   cd infrastructure/terraform
   terraform init
   ```

3. **Plan and apply infrastructure**
   ```bash
   terraform plan -var-file="environments/prod/terraform.tfvars"
   terraform apply -var-file="environments/prod/terraform.tfvars"
   ```

#### Kubernetes Deployment

1. **Configure kubectl**
   ```bash
   aws eks update-kubeconfig --region us-west-2 --name spak-communication-prod
   ```

2. **Deploy using Kustomize**
   ```bash
   # Development
   kubectl apply -k infrastructure/kubernetes/overlays/development
   
   # Production
   kubectl apply -k infrastructure/kubernetes/overlays/production
   ```

## 📊 Monitoring

### Prometheus Metrics

The backend exposes metrics at `/api/v1/metrics`:
- HTTP request metrics
- Database connection metrics
- Application-specific metrics
- Node.js runtime metrics

### Grafana Dashboards

Pre-configured dashboards for:
- Application performance
- Infrastructure metrics
- Business metrics
- Error tracking

### Health Checks

Multiple health check endpoints:
- `/api/v1/health` - General health
- `/api/v1/health/readiness` - Readiness probe
- `/api/v1/health/liveness` - Liveness probe

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

- **Backend CI/CD**: Build, test, and deploy backend services
- **Frontend CI/CD**: Build, test, and deploy frontend application
- **Infrastructure**: Terraform plan and apply
- **Security**: Dependency scanning and secret detection

### Deployment Strategies

- **Development**: Continuous deployment on every push to `develop`
- **Staging**: Manual approval required
- **Production**: Manual approval with blue-green deployment

## 🛡️ Security

### Best Practices Implemented

- **Authentication**: JWT with secure refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Input validation and sanitization
- **Network Security**: HTTPS/TLS everywhere
- **Container Security**: Non-root users, minimal base images
- **Secret Management**: AWS Secrets Manager integration
- **Monitoring**: Security event logging and alerting

### Security Headers

- Content Security Policy (CSP)
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Strict-Transport-Security (HSTS)

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
npm run test:cov    # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm run test        # Jest unit tests
npm run test:e2e    # Cypress E2E tests
```

## 📈 Performance

### Optimization Features

- **Frontend**: Code splitting, lazy loading, PWA capabilities
- **Backend**: Connection pooling, caching, compression
- **Database**: Indexing, connection optimization
- **Infrastructure**: Auto-scaling, load balancing

### Performance Monitoring

- Web Vitals tracking
- API response time monitoring
- Database query performance
- Resource utilization metrics

## 🔧 Configuration

### Environment Variables

#### Backend
```env
NODE_ENV=production
API_PORT=3001
MONGODB_URI=mongodb://localhost:27017/spak_communication
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### Frontend
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
```

## 📚 API Documentation

### Swagger/OpenAPI

The API documentation is automatically generated and available at:
- Local: http://localhost:3001/api/docs
- Production: https://api.spak.com/docs

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/github` - GitHub OAuth
- `POST /api/v1/auth/refresh` - Refresh tokens
- `POST /api/v1/auth/logout` - User logout

#### Users
- `GET /api/v1/users/profile` - Get current user
- `PATCH /api/v1/users/profile` - Update profile
- `GET /api/v1/users` - List users (admin)

#### Health & Metrics
- `GET /api/v1/health` - Health check
- `GET /api/v1/metrics` - Prometheus metrics

## 🚀 Deployment

### Production Checklist

- [ ] Configure production environment variables
- [ ] Set up SSL certificates
- [ ] Configure monitoring and alerting
- [ ] Set up backup strategies
- [ ] Configure log aggregation
- [ ] Set up DNS and domain routing
- [ ] Configure auto-scaling policies
- [ ] Set up disaster recovery procedures

### Scaling Considerations

- **Horizontal Scaling**: Kubernetes HPA and cluster autoscaler
- **Database Scaling**: Read replicas and sharding strategies
- **Cache Optimization**: Redis clustering for high availability
- **CDN Integration**: CloudFront for static assets
- **Load Balancing**: Application Load Balancer with health checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Document API changes
- Follow commit message conventions
- Ensure all CI checks pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact: support@spak.com
- Documentation: https://docs.spak.com

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [React](https://reactjs.org/) - UI library
- [Kubernetes](https://kubernetes.io/) - Container orchestration
- [Terraform](https://terraform.io/) - Infrastructure as Code
- [Prometheus](https://prometheus.io/) - Monitoring system
- [Grafana](https://grafana.com/) - Analytics platform

---

Built with ❤️ by Spak Communication Pvt Ltd
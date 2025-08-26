variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "spak-communication"
}

variable "environment" {
  description = "Environment name"
  type        = string
  validation {
    condition = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "owner" {
  description = "Owner of the resources"
  type        = string
  default     = "Spak Communication Pvt Ltd"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "azs" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-west-2a", "us-west-2b", "us-west-2c"]
}

variable "private_subnets" {
  description = "Private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnets" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

variable "database_subnets" {
  description = "Database subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.201.0/24", "10.0.202.0/24", "10.0.203.0/24"]
}

variable "eks_cluster_version" {
  description = "Kubernetes version for EKS cluster"
  type        = string
  default     = "1.28"
}

variable "eks_node_instance_types" {
  description = "EC2 instance types for EKS nodes"
  type        = list(string)
  default     = ["t3.medium", "t3.large"]
}

variable "eks_node_desired_size" {
  description = "Desired number of EKS nodes"
  type        = number
  default     = 2
}

variable "eks_node_max_size" {
  description = "Maximum number of EKS nodes"
  type        = number
  default     = 10
}

variable "eks_node_min_size" {
  description = "Minimum number of EKS nodes"
  type        = number
  default     = 1
}

variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "rds_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

variable "rds_max_allocated_storage" {
  description = "RDS maximum allocated storage in GB"
  type        = number
  default     = 100
}

variable "enable_rds" {
  description = "Enable RDS instance (for production use)"
  type        = bool
  default     = false
}

variable "enable_elasticache" {
  description = "Enable ElastiCache Redis cluster"
  type        = bool
  default     = false
}

variable "elasticache_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "elasticache_num_cache_nodes" {
  description = "Number of ElastiCache nodes"
  type        = number
  default     = 1
}

variable "s3_bucket_versioning" {
  description = "Enable S3 bucket versioning"
  type        = bool
  default     = true
}

variable "s3_bucket_encryption" {
  description = "Enable S3 bucket encryption"
  type        = bool
  default     = true
}

variable "enable_monitoring" {
  description = "Enable CloudWatch monitoring and alerting"
  type        = bool
  default     = true
}

variable "enable_backup" {
  description = "Enable backup solutions"
  type        = bool
  default     = true
}

variable "backup_retention_days" {
  description = "Backup retention period in days"
  type        = number
  default     = 30
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access resources"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # Restrict this in production
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "spak.com"
}

variable "certificate_arn" {
  description = "ARN of the SSL certificate"
  type        = string
  default     = ""
}

variable "github_oauth_app_id" {
  description = "GitHub OAuth App ID"
  type        = string
  default     = ""
  sensitive   = true
}

variable "github_oauth_app_secret" {
  description = "GitHub OAuth App Secret"
  type        = string
  default     = ""
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  default     = ""
  sensitive   = true
}

variable "jwt_refresh_secret" {
  description = "JWT refresh secret key"
  type        = string
  default     = ""
  sensitive   = true
}
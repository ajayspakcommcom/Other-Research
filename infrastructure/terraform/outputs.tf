output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.vpc.private_subnet_ids
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnet_ids
}

output "database_subnet_ids" {
  description = "IDs of the database subnets"
  value       = module.vpc.database_subnet_ids
}

output "eks_cluster_id" {
  description = "EKS cluster ID"
  value       = module.eks.cluster_id
}

output "eks_cluster_arn" {
  description = "EKS cluster ARN"
  value       = module.eks.cluster_arn
}

output "eks_cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_version" {
  description = "EKS cluster Kubernetes version"
  value       = module.eks.cluster_version
}

output "eks_cluster_security_group_id" {
  description = "EKS cluster security group ID"
  value       = module.eks.cluster_security_group_id
}

output "eks_node_groups" {
  description = "EKS node groups"
  value       = module.eks.node_groups
}

output "eks_oidc_issuer_url" {
  description = "EKS OIDC issuer URL"
  value       = module.eks.cluster_oidc_issuer_url
}

output "s3_bucket_id" {
  description = "S3 bucket ID"
  value       = module.s3.bucket_id
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = module.s3.bucket_arn
}

output "s3_bucket_domain_name" {
  description = "S3 bucket domain name"
  value       = module.s3.bucket_domain_name
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = var.enable_rds ? module.rds[0].db_instance_endpoint : null
}

output "rds_port" {
  description = "RDS instance port"
  value       = var.enable_rds ? module.rds[0].db_instance_port : null
}

output "elasticache_endpoint" {
  description = "ElastiCache cluster endpoint"
  value       = var.enable_elasticache ? module.elasticache[0].primary_endpoint : null
}

output "elasticache_port" {
  description = "ElastiCache cluster port"
  value       = var.enable_elasticache ? module.elasticache[0].port : null
}

output "nat_gateway_ips" {
  description = "IP addresses of the NAT gateways"
  value       = module.vpc.nat_gateway_ips
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "project_name" {
  description = "Project name"
  value       = var.project_name
}

# Kubernetes config
output "kubectl_config" {
  description = "kubectl config to connect to the EKS cluster"
  value = {
    cluster_name = module.eks.cluster_id
    endpoint     = module.eks.cluster_endpoint
    region       = var.aws_region
  }
}

# IAM roles
output "eks_cluster_role_arn" {
  description = "EKS cluster IAM role ARN"
  value       = module.iam.eks_cluster_role_arn
}

output "eks_node_group_role_arn" {
  description = "EKS node group IAM role ARN"
  value       = module.iam.eks_node_group_role_arn
}

output "eks_pod_execution_role_arn" {
  description = "EKS pod execution IAM role ARN"
  value       = module.iam.eks_pod_execution_role_arn
}

# Load balancer
output "load_balancer_dns" {
  description = "Load balancer DNS name"
  value       = module.eks.load_balancer_dns
}

output "load_balancer_zone_id" {
  description = "Load balancer hosted zone ID"
  value       = module.eks.load_balancer_zone_id
}
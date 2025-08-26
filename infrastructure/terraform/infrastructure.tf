# VPC Module
module "vpc" {
  source = "./modules/vpc"

  project_name        = var.project_name
  environment         = var.environment
  vpc_cidr           = var.vpc_cidr
  azs                = var.azs
  private_subnets    = var.private_subnets
  public_subnets     = var.public_subnets
  database_subnets   = var.database_subnets
}

# IAM Module
module "iam" {
  source = "./modules/iam"

  project_name = var.project_name
  environment  = var.environment
  aws_region   = var.aws_region
}

# EKS Module
module "eks" {
  source = "./modules/eks"

  project_name                = var.project_name
  environment                 = var.environment
  vpc_id                     = module.vpc.vpc_id
  private_subnet_ids         = module.vpc.private_subnet_ids
  public_subnet_ids          = module.vpc.public_subnet_ids
  cluster_version            = var.eks_cluster_version
  node_instance_types        = var.eks_node_instance_types
  node_desired_size          = var.eks_node_desired_size
  node_max_size              = var.eks_node_max_size
  node_min_size              = var.eks_node_min_size
  cluster_service_role_arn   = module.iam.eks_cluster_role_arn
  node_group_role_arn        = module.iam.eks_node_group_role_arn
  allowed_cidr_blocks        = var.allowed_cidr_blocks

  depends_on = [module.vpc, module.iam]
}

# S3 Module
module "s3" {
  source = "./modules/s3"

  project_name       = var.project_name
  environment        = var.environment
  enable_versioning  = var.s3_bucket_versioning
  enable_encryption  = var.s3_bucket_encryption
}

# RDS Module (optional)
module "rds" {
  count  = var.enable_rds ? 1 : 0
  source = "./modules/rds"

  project_name            = var.project_name
  environment             = var.environment
  vpc_id                  = module.vpc.vpc_id
  database_subnet_ids     = module.vpc.database_subnet_ids
  instance_class          = var.rds_instance_class
  allocated_storage       = var.rds_allocated_storage
  max_allocated_storage   = var.rds_max_allocated_storage
  backup_retention_period = var.backup_retention_days
  allowed_security_groups = [module.eks.cluster_security_group_id]

  depends_on = [module.vpc]
}

# ElastiCache Module (optional)
module "elasticache" {
  count  = var.enable_elasticache ? 1 : 0
  source = "./modules/elasticache"

  project_name        = var.project_name
  environment         = var.environment
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  node_type           = var.elasticache_node_type
  num_cache_nodes     = var.elasticache_num_cache_nodes
  allowed_security_groups = [module.eks.cluster_security_group_id]

  depends_on = [module.vpc]
}

# Kubernetes provider configuration
provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.cluster.token
  }
}

# Get EKS cluster auth token
data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_id
}

# Install AWS Load Balancer Controller using Helm
resource "helm_release" "aws_load_balancer_controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"
  version    = "1.6.2"

  set {
    name  = "clusterName"
    value = module.eks.cluster_id
  }

  set {
    name  = "serviceAccount.create"
    value = "false"
  }

  set {
    name  = "serviceAccount.name"
    value = "aws-load-balancer-controller"
  }

  depends_on = [
    module.eks,
    kubernetes_service_account.aws_load_balancer_controller
  ]
}

# Service account for AWS Load Balancer Controller
resource "kubernetes_service_account" "aws_load_balancer_controller" {
  metadata {
    name      = "aws-load-balancer-controller"
    namespace = "kube-system"
    annotations = {
      "eks.amazonaws.com/role-arn" = module.iam.aws_load_balancer_controller_role_arn
    }
    labels = {
      "app.kubernetes.io/component" = "controller"
      "app.kubernetes.io/name"      = "aws-load-balancer-controller"
    }
  }

  depends_on = [module.eks]
}

# Install Cluster Autoscaler
resource "helm_release" "cluster_autoscaler" {
  name       = "cluster-autoscaler"
  repository = "https://kubernetes.github.io/autoscaler"
  chart      = "cluster-autoscaler"
  namespace  = "kube-system"
  version    = "9.29.0"

  set {
    name  = "autoDiscovery.clusterName"
    value = module.eks.cluster_id
  }

  set {
    name  = "awsRegion"
    value = var.aws_region
  }

  set {
    name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = module.iam.cluster_autoscaler_role_arn
  }

  depends_on = [module.eks]
}

# Install EBS CSI Driver
resource "helm_release" "ebs_csi_driver" {
  name       = "aws-ebs-csi-driver"
  repository = "https://kubernetes-sigs.github.io/aws-ebs-csi-driver"
  chart      = "aws-ebs-csi-driver"
  namespace  = "kube-system"
  version    = "2.25.0"

  set {
    name  = "controller.serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = module.iam.ebs_csi_driver_role_arn
  }

  depends_on = [module.eks]
}
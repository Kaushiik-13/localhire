# S3 Bucket
resource "aws_s3_bucket" "localhire_assets" {
  bucket = "localhire-assets"

  tags = {
    Project     = "localhire"
    Environment = "production"
  }
}

# Block all public access
resource "aws_s3_bucket_public_access_block" "localhire_assets" {
  bucket = aws_s3_bucket.localhire_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Server-side encryption (AES-256)
resource "aws_s3_bucket_server_side_encryption_configuration" "localhire_assets" {
  bucket = aws_s3_bucket.localhire_assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Lifecycle - delete incomplete multipart uploads after 7 days
resource "aws_s3_bucket_lifecycle_configuration" "localhire_assets" {
  bucket = aws_s3_bucket.localhire_assets.id

  rule {
    id     = "delete-incomplete-uploads"
    status = "Enabled"

    filter {}

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# IAM User for the backend app
resource "aws_iam_user" "localhire_app_s3" {
  name = "localhire-app-s3"

  tags = {
    Project = "localhire"
  }
}

# Access Key for the IAM user
resource "aws_iam_access_key" "localhire_app_s3" {
  user = aws_iam_user.localhire_app_s3.name
}

# Least-privilege policy
resource "aws_iam_user_policy" "localhire_app_s3_policy" {
  name = "localhire-app-s3-policy"
  user = aws_iam_user.localhire_app_s3.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowBucketListing"
        Effect = "Allow"
        Action = "s3:ListBucket"
        Resource = "arn:aws:s3:::localhire-assets"
      },
      {
        Sid    = "AllowObjectOperations"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = "arn:aws:s3:::localhire-assets/*"
      }
    ]
  })
}

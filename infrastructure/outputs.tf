output "bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.localhire_assets.bucket
}

output "iam_access_key_id" {
  description = "IAM access key ID for the backend"
  value       = aws_iam_access_key.localhire_app_s3.id
}

output "iam_secret_access_key" {
  description = "IAM secret access key for the backend"
  value       = aws_iam_access_key.localhire_app_s3.secret
  sensitive   = true
}

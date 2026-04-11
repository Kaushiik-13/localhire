export enum ReportType {
  UNPAID_WAGE = 'unpaid_wage',
  NO_SHOW = 'no_show',
  FAKE_JOB_POST = 'fake_job_post',
  HARASSMENT = 'harassment',
  OTHER = 'other',
}

export enum ReportPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum ReportStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  REVIEWING = 'reviewing',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum ReportAction {
  POST_REMOVED = 'post_removed',
  WARNING_ISSUED = 'warning_issued',
  ACCOUNT_SUSPENDED = 'account_suspended',
  DISMISSED = 'dismissed',
}

export enum EvidenceType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  SCREENSHOT = 'screenshot',
}

export enum ReporterType {
  WORKER = 'worker',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
  SERVICE_PROVIDER = 'service_provider',
  CUSTOMER = 'customer',
}

export enum EntityType {
  WORKER = 'worker',
  EMPLOYER = 'employer',
  SERVICE_PROVIDER = 'service_provider',
  JOB_POST = 'job_post',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export enum ListingStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  PAUSED = 'paused',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ApplicationStatus {
  APPLIED = 'applied',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export enum WorkerAvailability {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  DAILY = 'daily',
}

export enum WorkerType {
  JOB_SEEKER = 'job_seeker',
  SERVICE_PROVIDER = 'service_provider',
  BOTH = 'both',
}

export enum AddressType {
  HOME = 'home',
  BUSINESS = 'business',
}

export enum DocumentType {
  AADHAAR = 'Aadhaar',
  PAN = 'PAN',
  DRIVING_LICENSE = 'Driving License',
}

export enum DocumentVerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum NotificationType {
  BOOKING_UPDATE = 'booking_update',
  APPLICATION_UPDATE = 'application_update',
  KYC_STATUS = 'kyc_status',
  APPROVAL_UPDATE = 'approval_update',
}

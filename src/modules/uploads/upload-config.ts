export const UPLOAD_CONFIG = {
  profile_photo: {
    folder: 'users/profiles',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024,
  },
  kyc_document: {
    folder: 'users/kyc',
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 10 * 1024 * 1024,
  },
  resume: {
    folder: 'resumes',
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    maxSize: 10 * 1024 * 1024,
  },
  portfolio_image: {
    folder: 'service-providers/portfolio',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024,
  },
  business_logo: {
    folder: 'employers/logos',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    maxSize: 2 * 1024 * 1024,
  },
  listing_image: {
    folder: 'listings/images',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024,
  },
  report_evidence: {
    folder: 'reports/evidence',
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 10 * 1024 * 1024,
  },
  test: {
    folder: 'test',
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    maxSize: 10 * 1024 * 1024,
  },
} as const;

export type UploadType = keyof typeof UPLOAD_CONFIG;

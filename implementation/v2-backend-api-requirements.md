# Required Backend API Endpoints for Service Provider & Customer Roles

**Date**: 2026-04-20
**Status**: Required for Frontend Feature Completion

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🔒 | Requires JWT Bearer token |
| 👤 | Requires specific role (enforced by JWT guard) |
| 🌐 | Public (no auth required) |
| ✅ | Already exists on backend |
| ❌ | Missing — needs implementation |
| 🔄 | Exists but needs modification |

---

## 1. Service Providers (`/service-providers`)

### 1.1 Create Service Provider Profile
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/service-providers` |
| **Status** | ✅ Already exists |
| **Auth** | 🔒 Any authenticated user |
| **Purpose** | Create SP profile during registration |

**Request Body** (`ServiceProviderCreateRequest`):
```json
{
  "job_title": "Electrician",
  "description": "Residential and commercial electrical work",
  "experience_years": 5,
  "hourly_rate": 500,
  "availability": "full-time",
  "skills": ["507f1f77bcf86cd799439011"],
  "available_from": "2026-04-21",
  "current_location": "Chennai",
  "willing_to_relocate": true,
  "bio": "Licensed electrician with 5+ years experience",
  "portfolio_urls": ["https://example.com/work1.jpg"],
  "languages": ["Tamil", "English"]
}
```

**Response Body** (`ServiceProviderResponse`):
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "user_id": "507f1f77bcf86cd799439011",
  "job_title": "Electrician",
  "description": "Residential and commercial electrical work",
  "experience_years": 5,
  "hourly_rate": 500,
  "availability": "full-time",
  "skills": [
    { "_id": "507f1f77bcf86cd799439011", "skill_name": "electrical", "is_active": true }
  ],
  "available_from": "2026-04-21",
  "current_location": "Chennai",
  "willing_to_relocate": true,
  "bio": "Licensed electrician with 5+ years experience",
  "portfolio_urls": ["https://example.com/work1.jpg"],
  "languages": ["Tamil", "English"],
  "rating": 0,
  "completed_jobs": 0,
  "approval_status": "pending",
  "createdAt": "2026-04-20T10:00:00.000Z",
  "updatedAt": "2026-04-20T10:00:00.000Z"
}
```

### 1.2 Get All Service Providers
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/service-providers` |
| **Status** | ✅ Already exists |
| **Auth** | 🌐 Public |
| **Purpose** | Browse all SPs (customer home) |

**Response Body**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "user_id": "507f1f77bcf86cd799439011",
    "job_title": "Electrician",
    "hourly_rate": 500,
    "skills": [{ "_id": "...", "skill_name": "electrical", "is_active": true }],
    "rating": 4.5,
    "current_location": "Chennai",
    "approval_status": "approved"
  }
]
```

### 1.3 Get Service Provider by ID
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/service-providers/{id}` |
| **Status** | ✅ Already exists |
| **Auth** | 🌐 Public |
| **Purpose** | View SP public profile |

**Response Body**: Same as 1.1 response.

### 1.4 Get Service Provider by User ID
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/service-providers/user/{userId}` |
| **Status** | ✅ Already exists |
| **Auth** | 🌐 Public |
| **Purpose** | Fetch SP profile by user ID (used in settings.tsx) |

**Response Body**: Same as 1.1 response.

### 1.5 Update Service Provider
| | |
|---|---|
| **Method** | `PATCH` |
| **Path** | `/service-providers/{id}` |
| **Status** | ✅ Already exists |
| **Auth** | 🔒 Must be the SP owner or admin |
| **Purpose** | Edit SP profile details |

**Request Body** (`ServiceProviderUpdateRequest`):
```json
{
  "job_title": "Senior Electrician",
  "hourly_rate": 600,
  "bio": "Updated bio",
  "skills": ["507f1f77bcf86cd799439011"],
  "languages": ["Tamil", "English"]
}
```

**Response Body**: Updated `ServiceProviderResponse`.

### 1.6 Delete Service Provider
| | |
|---|---|
| **Method** | `DELETE` |
| **Path** | `/service-providers/{id}` |
| **Status** | ✅ Already exists |
| **Auth** | 🔒 Must be the SP owner or admin |
| **Purpose** | Delete SP profile |

**Response Body**:
```json
{ "message": "Service provider deleted successfully" }
```

### 1.7 ❌ Get Own Service Provider Profile (`/me`)
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/service-providers/me` |
| **Status** | ❌ **MISSING** |
| **Auth** | 🔒 👤 `service_provider` role required |
| **Purpose** | Get current user's SP profile (like `/workers/me`, `/employers/me`) |

**Response Body**: `ServiceProviderResponse` with embedded `user` object (like `WorkerUserIdDto`).

```json
{
  "_id": "507f1f77bcf86cd799439021",
  "user_id": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ravi Kumar",
    "phone": "+919876543210",
    "email": "ravi@example.com",
    "profile_photo": "https://example.com/photo.jpg",
    "language": "en",
    "approval_status": "approved",
    "addresses": []
  },
  "job_title": "Electrician",
  ...
}
```

### 1.8 ❌ Update Own Service Provider Profile (`/me`)
| | |
|---|---|
| **Method** | `PATCH` |
| **Path** | `/service-providers/me` |
| **Status** | ❌ **MISSING** |
| **Auth** | 🔒 👤 `service_provider` role required |
| **Purpose** | Update own SP profile without knowing the SP ID |

**Request Body**: `ServiceProviderUpdateRequest` (same as 1.5)

**Response Body**: Updated `ServiceProviderResponse`.

### 1.9 ❌ Delete Own Service Provider Profile (`/me`)
| | |
|---|---|
| **Method** | `DELETE` |
| **Path** | `/service-providers/me` |
| **Status** | ❌ **MISSING** |
| **Auth** | 🔒 👤 `service_provider` role required |
| **Purpose** | Delete own SP profile and account |

**Response Body**:
```json
{ "message": "Service provider account deleted successfully" }
```

### 1.10 ❌ Toggle Own Service Provider Status (`/me/status`)
| | |
|---|---|
| **Method** | `PATCH` |
| **Path** | `/service-providers/me/status` |
| **Status** | ❌ **MISSING** |
| **Auth** | 🔒 👤 `service_provider` role required |
| **Purpose** | Toggle active/deactive status |

**Response Body**:
```json
{ "message": "Status updated successfully", "status": "inactive" }
```

### 1.11 ❌ Search/Filter Service Providers
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/service-providers/search` |
| **Status** | ❌ **MISSING** |
| **Auth** | 🌐 Public |
| **Purpose** | Search SPs by skill, location, rating, price |

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| `skill` | string | Skill ID or name |
| `location` | string | City/area |
| `min_rating` | number | Minimum rating (0-5) |
| `max_hourly_rate` | number | Max hourly rate |
| `availability` | string | `"full-time"` or `"part-time"` |
| `page` | number | Pagination |
| `limit` | number | Page size |

**Response Body**:
```json
{
  "count": 25,
  "results": [
    {
      "_id": "507f1f77bcf86cd799439021",
      "user_id": "507f1f77bcf86cd799439011",
      "job_title": "Electrician",
      "hourly_rate": 500,
      "rating": 4.5,
      "current_location": "Chennai",
      "skills": [{ "_id": "...", "skill_name": "electrical" }]
    }
  ]
}
```

---

## 2. Customers (`/customers`)

All customer endpoints are **❌ MISSING** — the entire `/customers` resource does not exist on the backend.

### 2.1 ❌ Create Customer Profile
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/customers` |
| **Status** | ❌ **MISSING** |
| **Auth** | 🔒 Any authenticated user |
| **Purpose** | Create customer profile during onboarding |

**Request Body**:
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "preferred_location": "Chennai",
  "preferences": {
    "service_categories": ["electrical", "plumbing"]
  }
}
```

**Response Body**:
```json
{
  "_id": "507f1f77bcf86cd799439031",
  "user_id": "507f1f77bcf86cd799439011",
  "preferred_location": "Chennai",
  "preferences": {
    "service_categories": ["electrical", "plumbing"]
  },
  "approval_status": "approved",
  "createdAt": "2026-04-20T10:00:00.000Z"
}
```

### 2.2 ❌ Get Own Customer Profile (`/me`)
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/customers/me` |
| **Status** | ❌ **MISSING** |
| **Auth** | 🔒 👤 `customer` role required |
| **Purpose** | Get current user's customer profile |

**Response Body**:
```json
{
  "_id": "507f1f77bcf86cd799439031",
  "user_id": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ravi Kumar",
    "phone": "+919876543210",
    "email": "ravi@example.com",
    "profile_photo": "https://example.com/photo.jpg",
    "language": "en",
    "approval_status": "approved",
    "addresses": []
  },
  "preferred_location": "Chennai",
  "preferences": {
    "service_categories": ["electrical", "plumbing"]
  }
}
```

### 2.3 ❌ Update Own Customer Profile (`/me`)
| | |
|---|---|
| **Method** | `PATCH` |
| **Path** | `/customers/me` |
| **Status** | ❌ **MISSING** |
| **Auth** | 🔒 👤 `customer` role required |
| **Purpose** | Update customer preferences/location |

**Request Body**:
```json
{
  "preferred_location": "Bangalore",
  "preferences": {
    "service_categories": ["plumbing", "cleaning"]
  }
}
```

### 2.4 ❌ Delete Own Customer Profile (`/me`)
| | |
|---|---|
| **Method** | `DELETE` |
| **Path** | `/customers/me` |
| **Status** | ❌ **MISSING** |
| **Auth** | 🔒 👤 `customer` role required |
| **Purpose** | Delete customer role/profile |

### 2.5 ❌ Toggle Customer Status (`/me/status`)
| | |
|---|---|
| **Method** | `PATCH` |
| **Path** | `/customers/me/status` |
| **Status** | ❌ **MISSING** |
| **Auth** | 🔒 👤 `customer` role required |
| **Purpose** | Toggle active/deactive status |

---

## 3. Service Bookings (`/service-bookings`)

### 3.1 Create Service Booking
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/service-bookings` |
| **Status** | ✅ Already exists |
| **Auth** | 🔒 👤 `service_provider` role required |
| **Purpose** | SP applies to a service listing |

**Request Body** (`CreateServiceBookingInputDto`):
```json
{
  "listing_id": "507f1f77bcf86cd799439041",
  "service_provider_id": "507f1f77bcf86cd799439021"
}
```

**Response Body** (`ServiceBookingOutputDto`):
```json
{
  "_id": "507f1f77bcf86cd799439051",
  "listing_id": "507f1f77bcf86cd799439041",
  "service_provider_id": "507f1f77bcf86cd799439021",
  "customer_id": "507f1f77bcf86cd799439011",
  "status": "applied",
  "applied_at": "2026-04-20T10:00:00.000Z",
  "createdAt": "2026-04-20T10:00:00.000Z",
  "updatedAt": "2026-04-20T10:00:00.000Z"
}
```

### 3.2 Get Available Listings
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/service-bookings/available-listings` |
| **Status** | ✅ Already exists |
| **Auth** | 🔒 Any authenticated user |
| **Purpose** | SP browses available service listings |

**Response Body**: Array of `ListingOutputDto` (service-type listings).

### 3.3 Get Customer Bookings
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/service-bookings/customer/my-applications` |
| **Status** | ✅ Already exists |
| **Auth** | 🔒 👤 `customer` role required |
| **Purpose** | Customer views their service bookings |

**Response Body**: Array of `ServiceBookingOutputDto` with populated `listing_id` and `service_provider_id`.

### 3.4 Get Service Provider Bookings
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/service-bookings/service-provider/my-bookings` |
| **Status** | ✅ Already exists |
| **Auth** | 🔒 👤 `service_provider` role required |
| **Purpose** | SP views their bookings |

**Response Body**: Array of `ServiceBookingOutputDto`.

### 3.5 Get Bookings by Listing
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/service-bookings/listing/{listingId}` |
| **Status** | ✅ Already exists |
| **Auth** | 🔒 Must be listing owner (customer or SP) |
| **Purpose** | View bookings for a specific listing |

**Response Body**: Array of `ServiceBookingOutputDto`.

### 3.6 Get Bookings by Service Provider
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/service-bookings/service-provider/{spId}` |
| **Status** | ✅ Already exists |
| **Auth** | 🌐 Public (or 🔒 for private history) |
| **Purpose** | View all bookings for a specific SP |

**Response Body**: Array of `ServiceBookingOutputDto`.

### 3.7 Update Booking Status (Accept/Reject)
| | |
|---|---|
| **Method** | `PATCH` |
| **Path** | `/service-bookings/{id}/status` |
| **Status** | ✅ Already exists |
| **Auth** | 🔒 👤 `customer` role required (ONLY customer can accept/reject) |
| **Purpose** | Customer accepts or rejects an SP's booking application |

**Request Body**:
```json
{ "status": "accepted" }
```
Status enum: `"applied" | "accepted" | "rejected"`

**Response Body**: Updated `ServiceBookingOutputDto`.

### 3.8 Withdraw Booking
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/service-bookings/{id}/withdraw` |
| **Status** | ✅ Already exists |
| **Auth** | 🔒 👤 `service_provider` role required |
| **Purpose** | SP withdraws their booking application |

**Response Body**: Updated `ServiceBookingOutputDto`.

### 3.9 Delete Booking
| | |
|---|---|
| **Method** | `DELETE` |
| **Path** | `/service-bookings/{id}` |
| **Status** | ✅ Already exists |
| **Auth** | 🔒 Must be customer or SP involved in the booking |
| **Purpose** | Remove a booking record |

**Response Body**:
```json
{ "message": "Booking deleted successfully" }
```

---

## 4. Listings (`/listings`)

### 4.1 Create Listing (🔄 NEEDS UPDATE)
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/listings` |
| **Status** | 🔄 **NEEDS UPDATE** |
| **Auth** | 🔒 Any authenticated user |
| **Purpose** | Post a job or service listing |

**🔄 REQUIRED CHANGE**: The `created_by_role` field currently only accepts `"employer" | "customer"`. It must also accept `"service_provider"`.

**Request Body** (`CreateListingInputDto`):
```json
{
  "title": "Plumbing Repair Needed",
  "listing_type": "service",
  "created_by": "507f1f77bcf86cd799439011",
  "created_by_role": "service_provider",
  "description": "Leaking pipe in kitchen",
  "address": {
    "address_line1": "123 Main St",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "postal_code": "600001"
  },
  "service_details": {
    "price": 500
  },
  "images": [{ "url": "https://example.com/pipe.jpg", "order": 1 }]
}
```

### 4.2 Get Listings by Type
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/listings/type/{type}` |
| **Status** | ✅ Already exists |
| **Auth** | 🔒 Any authenticated user |
| **Purpose** | Get listings by type (`job` or `service`) |

### 4.3 Get My Listings
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/listings/my-listings` |
| **Status** | ✅ Already exists |
| **Auth** | 🔒 Any authenticated user |
| **Purpose** | Get listings created by the authenticated user |

**🔄 REQUIRED CHANGE**: Must return listings where `created_by` matches the authenticated user's ID, regardless of `created_by_role`.

---

## 5. Reviews (`/reviews`)

### 5.1 Create Review
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/reviews` |
| **Status** | 🔄 **NEEDS UPDATE** |
| **Auth** | 🔒 Any authenticated user |
| **Purpose** | Rate a completed job or service booking |

**🔄 REQUIRED CHANGE**: Currently only supports `job_application_id`. Must also support `booking_id` for service bookings.

**Request Body**:
```json
{
  "job_application_id": "507f1f77bcf86cd799439061",
  "booking_id": "507f1f77bcf86cd799439051",
  "rating": 5,
  "comment": "Excellent work, very professional!"
}
```

Either `job_application_id` OR `booking_id` must be provided (validate at least one).

**Response Body** (`ReviewOutputDto`):
```json
{
  "id": "507f1f77bcf86cd799439071",
  "reviewer_id": { "id": "507f1f77bcf86cd799439011", "name": "Customer Name" },
  "review_type": "service",
  "job_application_id": null,
  "booking_id": "507f1f77bcf86cd799439051",
  "worker_id": { "id": "507f1f77bcf86cd799439021", "name": "SP Name" },
  "employer_id": null,
  "service_provider_id": { "id": "507f1f77bcf86cd799439021", "name": "SP Name" },
  "customer_id": { "id": "507f1f77bcf86cd799439011", "name": "Customer Name" },
  "rating": 5,
  "comment": "Excellent work!",
  "createdAt": "2026-04-20T10:00:00.000Z"
}
```

---

## 6. Admin Endpoints (`/admin`)

### 6.1 Moderate Customers

All admin customer moderation endpoints are **❌ MISSING**.

#### 6.1.1 ❌ Get Pending Customers
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/admin/customers/pending` |
| **Auth** | 🔒 👤 `admin` role required |

#### 6.1.2 ❌ Get Approved Customers
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/admin/customers/approved` |
| **Auth** | 🔒 👤 `admin` role required |

#### 6.1.3 ❌ Get Rejected Customers
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/admin/customers/rejected` |
| **Auth** | 🔒 👤 `admin` role required |

#### 6.1.4 ❌ Get Suspended Customers
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/admin/customers/suspended` |
| **Auth** | 🔒 👤 `admin` role required |

#### 6.1.5 ❌ Approve Customer
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/admin/customers/{id}/approve` |
| **Auth** | 🔒 👤 `admin` role required |

#### 6.1.6 ❌ Reject Customer
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/admin/customers/{id}/reject` |
| **Auth** | 🔒 👤 `admin` role required |

#### 6.1.7 ❌ Suspend Customer
| | |
|---|---|
| **Method** | `POST** |
| **Path** | `/admin/customers/{id}/suspend` |
| **Auth** | 🔒 👤 `admin` role required |

### 6.2 Moderate Service Providers (already exist)

The following exist and are already functional:
- `GET /admin/service-providers/pending`
- `GET /admin/service-providers/approved`
- `GET /admin/service-providers/rejected`
- `GET /admin/service-providers/suspended`
- `POST /admin/service-providers/{id}/approve`
- `POST /admin/service-providers/{id}/reject`
- `POST /admin/service-providers/{id}/suspend`

---

## 7. User Registration (`/users/register`)

### 7.1 Register User (🔄 NEEDS UPDATE)
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/users/register` |
| **Status** | 🔄 **NEEDS UPDATE** |
| **Auth** | 🌐 Public |
| **Purpose** | Create new user account |

**🔄 REQUIRED CHANGE**: The backend must accept and persist `roles: ["service_provider"]` and `roles: ["customer"]` in addition to the existing `["worker"]` and `["employer"]`.

**Request Body** (`RegisterRequest`):
```json
{
  "name": "Ravi Kumar",
  "phone": "+919876543210",
  "email": "ravi@example.com",
  "password": "securePassword123",
  "profile_photo": "https://example.com/photo.jpg",
  "language": "en",
  "status": "active",
  "roles": ["customer"],
  "approval_status": "pending",
  "addresses": [],
  "identity_docs": []
}
```

**Response Body** (`RegisterResponse`):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Ravi Kumar",
    "phone": "+919876543210",
    "email": "ravi@example.com",
    "profile_photo": "https://example.com/photo.jpg",
    "language": "en",
    "status": "active",
    "roles": ["customer"],
    "approval_status": "pending",
    "addresses": [],
    "identity_docs": []
  }
}
```

**Validation Rules**:
- `roles` array must not be empty
- `roles` must contain valid values: `"service_provider"`, `"customer"`, `"employer"`, `"worker"` (backward compat)
- If `roles` includes `"service_provider"`, the user may need to complete SP onboarding
- If `roles` includes `"customer"`, the user is approved immediately (no complex onboarding)
- If `roles` includes `"employer"`, the user follows the existing employer approval flow

---

## Gap Summary Table

| Priority | Endpoint | Status | Effort |
|----------|----------|--------|--------|
| 🔴 High | `GET /service-providers/me` | ❌ Missing | Small |
| 🔴 High | `PATCH /service-providers/me` | ❌ Missing | Small |
| 🔴 High | `DELETE /service-providers/me` | ❌ Missing | Small |
| 🔴 High | `PATCH /service-providers/me/status` | ❌ Missing | Small |
| 🔴 High | All `/customers/*` endpoints | ❌ Missing | Medium |
| 🔴 High | Update `/users/register` role validation | 🔄 Needs update | Small |
| 🟡 Medium | `GET /service-providers/search` | ❌ Missing | Medium |
| 🟡 Medium | Update `/listings` `created_by_role` enum | 🔄 Needs update | Tiny |
| 🟡 Medium | Update `/reviews` for `booking_id` | 🔄 Needs update | Small |
| 🟢 Low | All `/admin/customers/*` endpoints | ❌ Missing | Medium |

---

## Role-Based Guard Rules

```
POST /service-providers              → 🔒 (any authenticated user)
GET  /service-providers              → 🌐 (public)
GET  /service-providers/me           → 🔒 + role: service_provider
PATCH /service-providers/me          → 🔒 + role: service_provider
DELETE /service-providers/me         → 🔒 + role: service_provider
PATCH /service-providers/me/status   → 🔒 + role: service_provider

POST /customers                      → 🔒 + role: customer (or during onboarding)
GET  /customers/me                   → 🔒 + role: customer
PATCH /customers/me                → 🔒 + role: customer
DELETE /customers/me               → 🔒 + role: customer
PATCH /customers/me/status         → 🔒 + role: customer

POST /service-bookings             → 🔒 + role: service_provider
GET /service-bookings/customer/*   → 🔒 + role: customer
GET /service-bookings/service-provider/* → 🔒 + role: service_provider
PATCH /service-bookings/{id}/status → 🔒 + role: customer (customer accepts/rejects)
POST /service-bookings/{id}/withdraw → 🔒 + role: service_provider

POST /listings                     → 🔒 (any authenticated user)
POST /reviews                      → 🔒 (reviewer must be involved in the listing/application)

All /admin/*                       → 🔒 + role: admin
```

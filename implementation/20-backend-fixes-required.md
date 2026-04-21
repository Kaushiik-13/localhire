# Backend Fixes Required — Based on API Spec Review (April 2026)

**Backend URL**: http://35.154.208.82:3000/api#/
**Status**: Re-checked against current live spec

---

## Fix #1: `POST /listings` — Add `created_by_role` to `CreateListingInputDto`

**Priority**: 🔴 High

**Problem**: `CreateListingInputDto` has NO field to specify who created the listing. The frontend sends `created_by_role` in the request body, but the backend doesn't accept it. However, `ListingOutputDto` already has `created_by_role` (enum: `"employer"`, `"customer"`) and `created_by` (string) — so the backend infers these server-side but doesn't allow the client to specify them.

**Issue**: When a `service_provider` creates a service listing, the backend has no way to know the listing was created by an SP vs an employer/customer. The output enum also only allows `"employer"` | `"customer"` — missing `"service_provider"`.

**Required Changes**:

### 1a. Add `created_by_role` to `CreateListingInputDto`

```typescript
// Add to CreateListingInputDto
created_by_role?: "employer" | "customer" | "service_provider";
```

This field should be **optional** — if not provided, the backend can infer it from the authenticated user's role (current behavior). If provided, use the client-specified value.

### 1b. Update `ListingOutputDto.created_by_role` enum

```typescript
// Current enum
created_by_role: "employer" | "customer"

// Required enum  
created_by_role: "employer" | "customer" | "service_provider"
```

**Why this matters**: The `post-job.tsx` screen is used by both employers and service providers to create listings. When an SP creates a service listing, `created_by_role: "service_provider"` must be persisted and returned.

---

## Fix #2: `POST /service-bookings` — Add `customer_id` to response and clarify request schema

**Priority**: 🟡 Medium

**Problem**: `CreateServiceBookingDto` only requires `listing_id`. The `service_provider_id` and `customer_id` are not in the request schema but appear in `ServiceBookingOutputDto`. This is fine if the backend infers them:
- `service_provider_id` → from the authenticated user (SP is the one applying)
- `customer_id` → from the listing's `created_by` field

**However**, the frontend `CreateServiceBookingInputDto` currently sends:

```json
{
  "listing_id": "string",
  "service_provider_id": "string"
}
```

**Required Change**: Either:

**Option A** (Recommended): Accept `service_provider_id` in the request but make it optional. If not provided, infer from the authenticated user. This matches the current frontend contract:

```typescript
// Update CreateServiceBookingDto
interface CreateServiceBookingDto {
  listing_id: string;           // required
  service_provider_id?: string; // optional, inferred from JWT if not provided
}
```

**Option B**: Keep the backend as-is (only `listing_id` required) and update the frontend to not send `service_provider_id`. The backend always infers the SP from the auth token.

---

## Fix #3: `PATCH /customers/me/status` — Endpoint exists but likely needs implementation fix

**Priority**: 🟡 Medium

**Problem**: The endpoint `PATCH /customers/me/status` appears in routes but the original spec exploration noted that `GET /customers/me/status` was found (not `PATCH`). Need to verify:

1. `PATCH /customers/me/status` toggles customer status between `active` and `inactive` (like `/workers/me/status` and `/employers/me/status`)
2. Response should return: `{ "message": "Status updated", "status": "active" | "inactive" }`

**Required Change**: Ensure `PATCH /customers/me/status` is a toggle (not just a getter). If only `GET` exists, add the `PATCH` variant.

---

## Fix #4: Response schemas missing for customer endpoints

**Priority**: 🟢 Low (frontend works without explicit schemas)

**Problem**: Several customer endpoint responses have no explicit `$ref` schema defined:
- `POST /customers` → 201 response has no schema
- `GET /customers/me` → 200 response has no schema
- `PATCH /customers/me` → no response schema

While the runtime responses are likely working, the OpenAPI spec doesn't document what shape they return.

**Required Change**: Add response schemas to match the frontend types:

### `POST /customers` response (201):

```typescript
interface CustomerResponse {
  _id: string;
  user_id: string;
  preferred_location?: string;
  preferences?: {
    service_categories?: string[];
  };
  approval_status: "pending" | "approved" | "rejected" | "suspended";
  createdAt: string;
  updatedAt: string;
}
```

### `GET /customers/me` response (200):

```typescript
interface CustomerMeResponse {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    profile_photo?: string;
    language?: string;
    approval_status?: string;
    addresses?: Address[];
  };
  preferred_location?: string;
  preferences?: {
    service_categories?: string[];
  };
  approval_status: string;
  createdAt: string;
  updatedAt: string;
}
```

### `PATCH /customers/me` response (200):

Same as `CustomerMeResponse`.

---

## Fix #5: `POST /service-bookings` — Update `CreateServiceBookingDto` request body

**Priority**: 🟡 Medium

**Current schema**:
```typescript
interface CreateServiceBookingDto {
  listing_id: string; // only field
}
```

**Frontend sends**:
```typescript
interface CreateServiceBookingInputDto {
  listing_id: string;
  service_provider_id: string;
}
```

**Required Change**: Either accept `service_provider_id` as optional (see Fix #2), or document that the backend infers `service_provider_id` from the JWT token so the frontend can stop sending it.

---

## Fix #6: Service Provider `/me` response — Document user embedding

**Priority**: 🟢 Low

**Problem**: `GET /service-providers/me` says "with user details" in its summary but the OpenAPI spec doesn't define the response schema. The frontend expects the response to include an embedded user object (like `WorkerUserIdDto`).

**Required Change**: Add explicit response schema:

```typescript
interface ServiceProviderMeResponse {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    profile_photo?: string;
    language?: string;
    approval_status?: string;
    addresses?: Address[];
  };
  job_title?: string;
  description?: string;
  experience_years?: number;
  hourly_rate?: number;
  availability?: string;
  skills?: { _id: string; skill_name: string; is_active: boolean }[];
  available_from?: string;
  current_location?: string;
  willing_to_relocate?: boolean;
  bio?: string;
  portfolio_urls?: string[];
  languages?: string[];
  rating?: number;
  completed_jobs?: number;
  approval_status?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## Summary Table

| # | Fix | Priority | Effort |
|---|-----|----------|--------|
| 1a | Add `created_by_role` to `CreateListingInputDto` | 🔴 High | Tiny |
| 1b | Add `"service_provider"` to `ListingOutputDto.created_by_role` enum | 🔴 High | Tiny |
| 2 | Accept optional `service_provider_id` in `CreateServiceBookingDto` | 🟡 Medium | Tiny |
| 3 | Ensure `PATCH /customers/me/status` toggle works | 🟡 Medium | Small |
| 4 | Add response schemas for customer endpoints | 🟢 Low | Small |
| 5 | Document or accept `service_provider_id` in booking creation | 🟡 Medium | Tiny |
| 6 | Document SP `/me` response with embedded user | 🟢 Low | Small |

**Only #1a and #1b are blocking the frontend right now.** The rest are documentation/robustness improvements.
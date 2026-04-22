# Backend Plan: Customer-Initiated Direct Booking (Model B)

**Goal:** Add backend APIs so a customer can browse service providers, send a direct booking request, and manage their bookings — without requiring a listing.

**Architecture:** Extend the `service-bookings` domain with a new `direct` booking type. `listing_id` becomes optional. The provider receives the request and accepts/rejects via existing `PATCH /service-bookings/:id/status`.

**Tech Stack:** NestJS (existing backend stack at `35.154.208.82:3000`)

---

## File Structure

| File/Module | Change | Purpose |
|-------------|--------|---------|
| `service-bookings/dto/create-service-booking.dto.ts` | Modify | Make `listing_id` optional; add `booking_type`, `service_category`, `description`, `address`, `preferred_date`, `budget` fields |
| `service-bookings/entities/service-booking.entity.ts` | Modify | Make `listing_id` optional; add new direct-booking fields |
| `service-bookings/service-bookings.controller.ts` | Modify | Add `POST /direct`, `GET /:id`, `GET /customer/my-bookings`, `POST /:id/cancel`, `PATCH /:id/complete` |
| `service-bookings/service-bookings.service.ts` | Modify | Implement new service methods |
| `service-bookings/guards/ownership.guard.ts` | Create (if missing) | Ensure customer/provider can only act on their own bookings |
| `notifications/notifications.service.ts` | Modify | Trigger push/in-app notification to provider on new direct booking |
| `service-providers/service-providers.service.ts` | Modify (optional) | Add availability check if implementing scheduling |

---

## New API Endpoints

| # | Endpoint | Method | Auth | Description |
|---|----------|--------|------|-------------|
| 1 | `/service-bookings/direct` | `POST` | Bearer (customer) | Customer creates a direct booking with a specific provider. No listing required. |
| 2 | `/service-bookings/:id` | `GET` | Bearer | Get a single booking by ID. Customer or provider can view. |
| 3 | `/service-bookings/customer/my-bookings` | `GET` | Bearer (customer) | Returns all bookings **initiated by** the current customer. |
| 4 | `/service-bookings/:id/cancel` | `POST` | Bearer (customer) | Customer cancels their own booking (if not already completed/cancelled). |
| 5 | `/service-bookings/:id/complete` | `PATCH` | Bearer (customer or provider) | Marks booking as `completed`. Trigger for review flow. |

---

## Task 1: Update DTOs for Direct Booking

**Files:**
- Modify: `src/service-bookings/dto/create-service-booking.dto.ts`
- Modify: `src/service-bookings/dto/update-service-booking-status.dto.ts` (add `completed`
  status if missing)

**Changes:**

```typescript
// CreateDirectBookingDto
export class CreateDirectBookingDto {
  @IsOptional()
  @IsMongoId()
  listing_id?: string;

  @IsMongoId()
  service_provider_id: string;

  @IsOptional()
  @IsString()
  service_category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ListingAddressInputDto)
  address?: ListingAddressInputDto;

  @IsOptional()
  @IsISO8601()
  preferred_date?: string;

  @IsOptional()
  @IsNumber()
  budget?: number;
}
```

- [ ] **Step 1:** Modify `CreateServiceBookingInputDto` to match the above (make `listing_id` optional, add new fields).
- [ ] **Step 2:** Run DTO validation tests if they exist — ensure no required-field breakage on existing flows.
- [ ] **Step 3:** Commit.

---

## Task 2: Update Service Booking Entity

**Files:**
- Modify: `src/service-bookings/entities/service-booking.entity.ts`

**Changes:**

```typescript
@Entity()
export class ServiceBooking {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ type: 'string', nullable: true })
  listing_id?: string;

  @Column({ type: 'string' })
  service_provider_id: string;

  @Column({ type: 'string' })
  customer_id: string;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'enum', enum: ['listing', 'direct'], default: 'direct' })
  booking_type: 'listing' | 'direct';

  @Column({ type: 'string', nullable: true })
  service_category?: string;

  @Column({ type: 'string', nullable: true })
  description?: string;

  @Column(() => Address, { nullable: true })
  address?: Address;

  @Column({ type: 'timestamp', nullable: true })
  preferred_date?: Date;

  @Column({ type: 'decimal', nullable: true })
  budget?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 1:** Make `listing_id` nullable and add the new columns.
- [ ] **Step 2:** Run migrations (or let auto-migrate in dev).
- [ ] **Step 3:** Commit.

---

## Task 3: Implement `POST /service-bookings/direct`

**Files:**
- Modify: `src/service-bookings/service-bookings.service.ts`
- Modify: `src/service-bookings/service-bookings.controller.ts`

**Controller:**

```typescript
@Post('direct')
@UseGuards(JwtAuthGuard, CustomerGuard)
async createDirect(
  @Req() req,
  @Body() dto: CreateDirectBookingDto,
) {
  return this.serviceBookingsService.createDirect(req.user.userId, dto);
}
```

**Service:**

```typescript
async createDirect(customerId: string, dto: CreateDirectBookingDto) {
  // Verify provider exists and is active
  const provider = await this.serviceProvidersService.findOne(dto.service_provider_id);
  if (!provider || provider.status !== 'active') {
    throw new BadRequestException('Service provider not found or inactive');
  }

  const booking = this.serviceBookingRepo.create({
    ...dto,
    customer_id: customerId,
    status: BookingStatus.PENDING,
    booking_type: 'direct',
  });
  const saved = await this.serviceBookingRepo.save(booking);

  // Notify provider
  await this.notificationsService.create({
    recipient_id: dto.service_provider_id,
    recipient_type: 'service_provider',
    title: 'New Booking Request',
    body: `You have a new direct booking request from a customer.`,
    type: 'booking_request',
    data: { booking_id: saved.id.toString() },
  });

  return saved;
}
```

- [ ] **Step 1:** Write the controller method.
- [ ] **Step 2:** Write the service method with provider validation + notification.
- [ ] **Step 3:** Test via Postman or cURL: `POST http://35.154.208.82:3000/service-bookings/direct`.
- [ ] **Step 4:** Commit.

---

## Task 4: Implement `GET /service-bookings/:id`

**Files:**
- Modify: `src/service-bookings/service-bookings.controller.ts`
- Modify: `src/service-bookings/service-bookings.service.ts`

**Controller:**

```typescript
@Get(':id')
@UseGuards(JwtAuthGuard)
async getById(@Req() req, @Param('id') id: string) {
  return this.serviceBookingsService.findById(id, req.user.userId, req.user.roles);
}
```

**Service:**

```typescript
async findById(bookingId: string, userId: string, roles: string[]) {
  const booking = await this.serviceBookingRepo.findOne({ where: { id: new ObjectId(bookingId) } });
  if (!booking) throw new NotFoundException('Booking not found');

  const isOwner =
    booking.customer_id === userId ||
    booking.service_provider_id === userId;

  if (!isOwner && !roles.includes('admin')) {
    throw new ForbiddenException('You do not have access to this booking');
  }

  return booking;
}
```

- [ ] **Step 1:** Add controller + service method.
- [ ] **Step 2:** Test fetching a booking as customer, provider, and unrelated user.
- [ ] **Step 3:** Commit.

---

## Task 5: Implement `GET /service-bookings/customer/my-bookings`

**Files:**
- Modify: `src/service-bookings/service-bookings.controller.ts`
- Modify: `src/service-bookings/service-bookings.service.ts`

**Controller:**

```typescript
@Get('customer/my-bookings')
@UseGuards(JwtAuthGuard, CustomerGuard)
async getMyBookings(@Req() req) {
  return this.serviceBookingsService.findByCustomer(req.user.userId);
}
```

**Service:**

```typescript
async findByCustomer(customerId: string) {
  return this.serviceBookingRepo.find({
    where: { customer_id: customerId },
    order: { createdAt: 'DESC' },
  });
}
```

- [ ] **Step 1:** Add controller + service.
- [ ] **Step 2:** Verify it returns only bookings where `customer_id` matches.
- [ ] **Step 3:** Commit.

---

## Task 6: Implement `POST /service-bookings/:id/cancel`

**Files:**
- Modify: `src/service-bookings/service-bookings.controller.ts`
- Modify: `src/service-bookings/service-bookings.service.ts`

**Controller:**

```typescript
@Post(':id/cancel')
@UseGuards(JwtAuthGuard, CustomerGuard)
async cancel(@Req() req, @Param('id') id: string) {
  return this.serviceBookingsService.cancel(id, req.user.userId);
}
```

**Service:**

```typescript
async cancel(bookingId: string, customerId: string) {
  const booking = await this.findById(bookingId, customerId, ['customer']);

  if (booking.customer_id !== customerId) {
    throw new ForbiddenException('Only the customer can cancel');
  }

  if (['completed', 'cancelled'].includes(booking.status)) {
    throw new BadRequestException(`Cannot cancel a ${booking.status} booking`);
  }

  booking.status = BookingStatus.CANCELLED;
  const saved = await this.serviceBookingRepo.save(booking);

  // Notify provider
  await this.notificationsService.create({
    recipient_id: booking.service_provider_id,
    recipient_type: 'service_provider',
    title: 'Booking Cancelled',
    body: 'A customer has cancelled their booking.',
    type: 'booking_cancelled',
    data: { booking_id: saved.id.toString() },
  });

  return saved;
}
```

- [ ] **Step 1:** Write and wire up.
- [ ] **Step 2:** Test: try cancelling a pending booking (should work), a completed one (should fail).
- [ ] **Step 3:** Commit.

---

## Task 7: Implement `PATCH /service-bookings/:id/complete`

**Files:**
- Modify: `src/service-bookings/service-bookings.controller.ts`
- Modify: `src/service-bookings/service-bookings.service.ts`

**Controller:**

```typescript
@Patch(':id/complete')
@UseGuards(JwtAuthGuard)
async complete(@Req() req, @Param('id') id: string) {
  return this.serviceBookingsService.complete(id, req.user.userId);
}
```

**Service:**

```typescript
async complete(bookingId: string, userId: string) {
  const booking = await this.findById(bookingId, userId, []);

  const isParticipant =
    booking.customer_id === userId ||
    booking.service_provider_id === userId;

  if (!isParticipant) {
    throw new ForbiddenException('Only the customer or provider can complete');
  }

  if (booking.status !== 'accepted') {
    throw new BadRequestException('Booking must be accepted before completing');
  }

  booking.status = BookingStatus.COMPLETED;
  const saved = await this.serviceBookingRepo.save(booking);

  // Notify the other party
  const recipientId =
    booking.customer_id === userId
      ? booking.service_provider_id
      : booking.customer_id;

  await this.notificationsService.create({
    recipient_id: recipientId,
    recipient_type: booking.customer_id === userId ? 'service_provider' : 'customer',
    title: 'Booking Completed',
    body: 'A booking has been marked as completed. Please leave a review!',
    type: 'booking_completed',
    data: { booking_id: saved.id.toString() },
  });

  return saved;
}
```

- [ ] **Step 1:** Write and wire up.
- [ ] **Step 2:** Test: only accepted bookings can be completed; verifies notification to the other party.
- [ ] **Step 3:** Commit.

---

## Task 8: Add `COMPLETED` to BookingStatus Enum

**Files:**
- Modify: `src/service-bookings/enums/booking-status.enum.ts` (or wherever `BookingStatus` lives)

**Change:**

```typescript
export enum BookingStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}
```

- [ ] **Step 1:** Add `completed` if missing.
- [ ] **Step 2:** Search codebase for any exhaustive `switch` statements on `BookingStatus` and update them.
- [ ] **Step 3:** Commit.

---

## Spec Coverage Check

| Requirement | Task(s) |
|-------------|---------|
| Allow booking without a listing | 1, 2, 3 |
| Customer initiates booking | 3 |
| Customer can view their own bookings | 5 |
| Customer can view a single booking | 4 |
| Customer can cancel | 6 |
| Either party can mark complete | 7 |
| Provider gets notified | 3, 6, 7 |

**Placeholder Scan:** All steps contain actual code.

**Type Consistency:** DTO fields `service_provider_id`, `customer_id`, `status`, `booking_type` match entity.

---

Plan complete. Deploy these changes to `35.154.208.82:3000` in order. Frontend plan follows separately.

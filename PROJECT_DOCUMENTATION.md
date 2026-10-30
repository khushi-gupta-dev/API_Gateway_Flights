# API Gateway Documentation

The Gateway is the browser-facing Express service. It authenticates users,
enforces roles, applies request limits, forwards trusted identity headers, and
proxies requests to the domain services.

## Runtime

- Default port: `5000`
- User database: Gateway Sequelize database
- Start: `npm run dev`
- Required configuration: `JWT_SECRET`, `JWT_EXPIRY`, `SALT_ROUNDS`,
  `FLIGHT_SERVICE`, `BOOKING_SERVICE`
- Optional: `SUPPORT_SERVICE` (default `http://localhost:3003`)

## Routes

### User API

- `POST /api/v1/user/signup` — create a customer account.
- `POST /api/v1/user/signin` — issue a JWT.
- `GET /api/v1/user/me` — return the authenticated user.
- `POST /api/v1/user/role` — add a role; admin only.
- `GET /api/v2/info` — API v2 information response.

### Flight proxy

`/flightsService/*` proxies Flights Service routes. Catalogue reads are public.
Mutations and disruption simulator operations require an authenticated admin.

### Booking proxy

`/bookingService/api/v1/*` proxies customer and admin booking routes.
Authenticated requests receive a Gateway-controlled `x-user-id`.
`/bookingService/api/v1/bookings/admin` and all
`/bookingService/api/v1/recovery-operations/*` routes require an admin.

### Recovery proxy

`/bookingService/api/v1/recovery-cases/*` requires authentication and forwards
the verified customer ID. Recovery operation routes require the verified admin
ID and expose filtered operations, summary metrics, retries, manual
alternative assignment, and operational overrides.

### Payment webhook

`POST /bookingService/webhooks/razorpay` is public to Razorpay, preserves the
raw request body, and forwards it for signature verification in Booking
Service. It must not be protected by customer JWT middleware.

### Support proxy

`/supportService/api/v1/*` requires an authenticated non-admin customer. The
Gateway supplies a trusted customer-role header; clients cannot self-assign
the role. Support Service applies its own rate limit.

## Security boundaries

- JWT validation happens at the Gateway.
- Admin writes to catalogue and disruption APIs are role protected.
- Customer IDs are overwritten from the verified token.
- Support access is customer-only.
- Razorpay webhook authenticity is verified by Booking Service.
- Secrets remain in local environment/configuration files.

## Development

Apply Gateway migrations, configure `src/config/config.json` and local
environment values, then run `npm run dev`. The frontend should target the
Gateway rather than individual domain services.

# API Gateway

The gateway (default port `5000`) owns user authentication and role lookup, limits request rates, and proxies frontend traffic to Flights Service, Flight Booking Service, and Support Service. It is the only backend origin used by the frontend in normal development.

## Routes and access

- `POST /api/v1/user/signup`, `POST /api/v1/user/signin`, `GET /api/v1/user/me`, `POST /api/v1/user/role` (admin only).
- `/flightsService/*`: catalogue/search reads are public; POST, PUT, PATCH, and DELETE under `/api/v1` require an authenticated admin.
- Disruption simulator writes under `/flightsService/api/v1/disruptions` use the
  same admin policy and receive the verified administrator ID as `x-user-id`.
- `/bookingService/api/v1/bookings*`: requires authentication. The gateway overwrites `x-user-id` with the verified user ID; `GET /bookingService/api/v1/bookings/admin` additionally requires admin role.

Booking routes support creating a hold, Razorpay Checkout, listing/viewing/cancelling a customer's own bookings, and admin booking review. The Gateway applies customer/admin authentication to booking APIs and forwards payment requests to Booking Service.

`POST /bookingService/webhooks/razorpay` is the public Razorpay webhook path. The gateway preserves its raw JSON body and forwards it to Booking Service without customer JWT authentication; Booking Service verifies the webhook signature. Configure `payment.captured`, `payment.failed`, `refund.created`, `refund.processed`, and `refund.failed` in Razorpay Test Mode.

`/supportService/api/v1/*` requires an authenticated non-admin customer account before proxying AI assistance to Support Service. The gateway forwards a trusted customer-role header after validating the JWT; direct clients cannot grant themselves access. Set `SUPPORT_SERVICE` (default `http://localhost:3003`) in the Gateway environment. Support Service applies its own chat request limit.

## Run

Configure `PORT` (default `5000`), `JWT_SECRET`, `JWT_EXPIRY`, `SALT_ROUNDS`, `FLIGHT_SERVICE` (default `http://localhost:3001`), `BOOKING_SERVICE` (default `http://localhost:4000`), optional `SUPPORT_SERVICE` (default `http://localhost:3003`), and the gateway database in `src/config/config.json`/environment. Apply gateway migrations and run `npm run dev`. Keep `.env` secrets local.

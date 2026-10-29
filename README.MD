# API Gateway

The gateway (default port `5000`) owns user authentication and role lookup, limits request rates, and proxies frontend traffic to Flights Service and Flight Booking Service.

## Routes and access

- `POST /api/v1/user/signup`, `POST /api/v1/user/signin`, `GET /api/v1/user/me`, `POST /api/v1/user/role` (admin only).
- `/flightsService/*`: catalogue/search reads are public; POST, PUT, PATCH, and DELETE under `/api/v1` require an authenticated admin.
- `/bookingService/api/v1/bookings*`: requires authentication. The gateway overwrites `x-user-id` with the verified user ID; `GET /bookingService/api/v1/bookings/admin` additionally requires admin role.

Booking routes support creating a hold, Razorpay Checkout, listing/viewing/cancelling a customer's own bookings, and admin booking review. The Gateway applies customer/admin authentication to booking APIs and forwards payment requests to Booking Service.

`POST /bookingService/webhooks/razorpay` is the public Razorpay webhook path. The gateway preserves its raw JSON body and forwards it to Booking Service without customer JWT authentication; Booking Service verifies the webhook signature.

## Run

Configure `PORT`, `JWT_SECRET`, `JWT_EXPIRY`, `SALT_ROUNDS`, `FLIGHT_SERVICE`, `BOOKING_SERVICE`, and the gateway database in `src/config/config.json`. Apply gateway migrations and run `npm run dev`. Keep `.env` secrets local.

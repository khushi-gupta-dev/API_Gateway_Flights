# API Gateway

The gateway provides signup/login/current-user APIs, JWT authentication, admin checks, rate limiting, and proxies to Flights Service and Flight Booking Service.

## Routing and access

- `/api/v1/user/*`: authentication and user APIs.
- `/flightsService/*`: public reads; admin authentication for POST/PUT/PATCH/DELETE under `/api/v1`.
- `/bookingService/api/v1/bookings*`: requires authentication; gateway overwrites `x-user-id` from the verified token. The exact `GET /bookings/admin` route also requires the admin role.

## Run

Configure `PORT`, `JWT_SECRET`, `JWT_EXPIRY`, `SALT_ROUNDS`, `FLIGHT_SERVICE`, `BOOKING_SERVICE`, and the MySQL database. Apply gateway migrations, then `npm run dev` (default port 5000).

const express = require("express");

const rateLimit = require("express-rate-limit");

const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware");

const {serverConfig , logger}  = require("./config");
const apiRoutes = require("./routes");
const { authRequestMiddlewares } = require("./middlewares");

const app = express();

// Preserve the exact signed payload for Razorpay; this route is public and verified by Booking Service.
app.use('/bookingService/webhooks/razorpay', express.raw({ type: 'application/json', limit: '1mb' }), createProxyMiddleware({
    target: serverConfig.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl.replace(/^\/bookingService/, ''),
    on: {
        proxyReq: (proxyReq, req) => {
            if (!Buffer.isBuffer(req.body)) return;
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', req.body.length);
            proxyReq.write(req.body);
        },
    },
}));

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    limit: 120, // Supports normal multi-page use while still limiting bursts per IP.
	
});

app.use(express.json());

app.use(express.urlencoded({extended:true}));


app.use(limiter);

app.use('/flightsService/api/v1', (req, res, next) => {
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();
    return authRequestMiddlewares.checkAuth(req, res, () =>
        authRequestMiddlewares.isAdmin(req, res, () => {
            req.headers['x-user-id'] = String(req.user);
            return next();
        }),
    );
});

app.use('/flightsService', createProxyMiddleware({
    target: serverConfig.FLIGHT_SERVICE,
    changeOrigin: true,
    on: { proxyReq: fixRequestBody },
}));

// Booking ownership is always derived from the verified token, never a client supplied userId.
app.use('/bookingService/api/v1/bookings', (req, res, next) =>
    authRequestMiddlewares.checkAuth(req, res, () => {
        const forwardBookingRequest = () => {
            req.headers['x-user-id'] = String(req.user);
            next();
        };
        const bookingPath = req.originalUrl.split('?')[0].replace(/\/+$/, '').toLowerCase();
        const isAdminBookingList = req.method === 'GET'
            && bookingPath === '/bookingservice/api/v1/bookings/admin';
        if (isAdminBookingList) {
            return authRequestMiddlewares.isAdmin(req, res, forwardBookingRequest);
        }
        return forwardBookingRequest();
    }),
);

app.use('/bookingService/api/v1/recovery-cases', (req, res, next) =>
    authRequestMiddlewares.checkAuth(req, res, () => {
        req.headers['x-user-id'] = String(req.user);
        return next();
    }),
);

app.use('/bookingService/api/v1/recovery-operations', (req, res, next) =>
    authRequestMiddlewares.checkAuth(req, res, () =>
        authRequestMiddlewares.isAdmin(req, res, () => {
            req.headers['x-user-id'] = String(req.user);
            return next();
        }),
    ),
);

app.use('/bookingService', createProxyMiddleware({
    target: serverConfig.BOOKING_SERVICE,
    changeOrigin: true,
    on: { proxyReq: fixRequestBody },
}));

app.use('/supportService/api/v1', (req, res, next) =>
    authRequestMiddlewares.checkAuth(req, res, () =>
        authRequestMiddlewares.isCustomer(req, res, next),
    ),
);

app.use('/supportService', createProxyMiddleware({
    target: serverConfig.SUPPORT_SERVICE,
    changeOrigin: true,
    on: { proxyReq: fixRequestBody },
}));

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the API Gateway");
});

// console.log(process.env);
app.listen(serverConfig.PORT, () => {
    console.log(`Server is running on port ${serverConfig.PORT}`);
    // logger.info(`Server is running on port ${serverConfig.PORT}`, "root" , {})
});


/*
*  user
*    |
*    v
* localhost:3001 (api gateway)   ----> localhost:4000/api/v1/bookings
*    |
*    v
* localhost:3001/api/v1/flights
*/

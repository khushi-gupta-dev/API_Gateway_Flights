const express = require("express");

const rateLimit = require("express-rate-limit");

const { createProxyMiddleware } = require("http-proxy-middleware");

const {serverConfig , logger}  = require("./config");
const apiRoutes = require("./routes");
const { authRequestMiddlewares } = require("./middlewares");

const app = express();

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    limit: 3, // Limit each IP to 2 requests per `window` (here, per 15 minutes)
	
});

app.use(express.json());

app.use(express.urlencoded({extended:true}));


app.use(limiter);

app.post(
    "/flightsService/api/v1/flights",
    authRequestMiddlewares.checkAuth,
    authRequestMiddlewares.isAdmin,
);

app.patch(
    "/flightsService/api/v1/flights/:id/seats",
    authRequestMiddlewares.checkAuth,
    authRequestMiddlewares.isAdmin,
);

app.use('/flightsService' , createProxyMiddleware({target:serverConfig.FLIGHT_SERVICE , changeOrigin:true}));

app.use('/bookingService' , createProxyMiddleware({target:serverConfig.BOOKING_SERVICE , changeOrigin:true}));

app.use("/api", apiRoutes);



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
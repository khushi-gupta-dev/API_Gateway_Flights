const express = require("express");
const {authRequestMiddlewares} = require("../../middlewares")
const router = express.Router();
const userRoutes = require("./user-routes");


router.use("/user", userRoutes);

module.exports = router;
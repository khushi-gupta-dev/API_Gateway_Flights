const { StatusCodes } = require("http-status-codes");
const { errorResponse } = require("../utils/common");

const AppError = require("../utils/errors/app-error");
const { userService } = require("../services");
function validateAuthRequest(req, res, next) {

const requestBody = req.body || {};

if(!requestBody.email ) {
    errorResponse.message = "Something went wrong while authenticating the user";
    errorResponse.error = new AppError(
      ["Email not found in the incoming request"],
      StatusCodes.BAD_REQUEST,
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }




if(!requestBody.password ) {
    errorResponse.message = "Something went wrong while authenticating the user";
    errorResponse.error = new AppError(
      ["password not found in the incoming request"],
      StatusCodes.BAD_REQUEST,
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }
  next();
}


async function checkAuth(req, res, next) {
  try {
    const response = await userService.isAuthenticated(req.headers["x-access-token"]);
    if (response) {
      req.user = response          // setting the user id in the req object 
      next();
    }
  }catch (error) {
    return res.status(error.statusCode).json(error);
    
}

}


module.exports = {
  validateAuthRequest,
  checkAuth
};
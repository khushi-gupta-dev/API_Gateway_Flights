const { StatusCodes } = require("http-status-codes");
const { errorResponse } = require("../utils/common");

const AppError = require("../utils/errors/app-error");
function validateAuthRequest(req, res, next) {

if(!req.body.email) {
    errorResponse.message = "Something went wrong while authenticating the user";
    errorResponse.error = new AppError(
      ["Email not found in the incoming request"],
      StatusCodes.BAD_REQUEST,
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }




if(!req.body.password) {
    errorResponse.message = "Something went wrong while authenticating the user";
    errorResponse.error = new AppError(
      ["password not found in the incoming request"],
      StatusCodes.BAD_REQUEST,
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }
  next();
}





module.exports = {
  validateAuthRequest,
};
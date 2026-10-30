const { StatusCodes } = require("http-status-codes");
const { userService } = require("../services");
function validateAuthRequest(req, res, next) {

const requestBody = req.body || {};

if(!requestBody.email ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Email not found in the incoming request",
      data: {},
      error: { message: "Email is required" },
    });
  }




if(!requestBody.password ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Password not found in the incoming request",
      data: {},
      error: { message: "Password is required" },
    });
  }
  next();
}


async function checkAuth(req, res, next) {
  try {
    const response = await userService.isAuthenticated(req.headers["x-access-token"]);
    if (!response) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication required" });
    }
    req.user = response;
    return next();
  }catch (error) {
    return res.status(error.statusCode).json(error);
    
}

}


async function isAdmin(req, res, next) {
  try {
    const response = await userService.isAdmin(req.user);
    if (!response) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "User not authorized for this action" });
    }

    return next();
  } catch (error) {
    return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Could not verify administrator access",
    });
}
  }

  async function isCustomer(req, res, next) {
    try {
      const response = await userService.isCustomer(req.user);
      if (!response) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: "Customer access required" });
      }
      req.headers["x-user-role"] = "customer";
      return next();
    } catch (error) {
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Could not verify customer access",
      });
    }
  }


  module.exports = {
  validateAuthRequest,
  checkAuth,
  isAdmin,
  isCustomer
};

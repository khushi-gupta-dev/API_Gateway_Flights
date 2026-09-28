const { StatusCodes } = require("http-status-codes");

const { userService } = require("../services");

const { successResponse , errorResponse } = require("../utils/common");
// POST: /signup
// req-body {
//   email: "john.doe@example.com",
//   password: "password123"
// }
async function signUp(req, res) {
  try {
    
    const user = await userService.create({
    
        email : req.body.email,
        password : req.body.password,
        });

     successResponse.data = user
    return res
    .status(StatusCodes.CREATED)
    .json(successResponse);
  } catch (error) {
      console.log(error);
    errorResponse.error = error;
  return  res
    .status(error.statusCode)
    .json(errorResponse);
}
}


async function signIn(req, res) {
  try {
    
    const user = await userService.signIn({
    
        email : req.body.email,
        password : req.body.password,
        });

     successResponse.data = user
    return res
    .status(StatusCodes.CREATED)
    .json(successResponse);
  } catch (error) {
      console.log(error);
    errorResponse.error = error;
  return  res
    .status(error.statusCode)
    .json(errorResponse);
}
}


async function addRoleToUser(req, res) {
  try {
    
    const user = await userService.addRoleToUser({
    
        role : req.body.role,
        id : req.body.id,
        });

     successResponse.data = user
    return res
    .status(StatusCodes.CREATED)
    .json(successResponse);
  } catch (error) {
      console.log(error);
    errorResponse.error = error;
  return  res
    .status(error.statusCode)
    .json(errorResponse);
}
}

async function getCurrentUser(req, res) {
  try {
    const user = await userService.getUserWithRoles(req.user);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Successfully completed the request",
      data: user,
      error: {},
    });
  } catch (error) {
    return res.status( StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Could not load the current user",
      data: {},
      error: { message: error.message },
    });
  }
}

module.exports = {
  signUp,
  signIn,
  addRoleToUser,
  getCurrentUser
};




const { StatusCodes } = require("http-status-codes");

const { userService } = require("../services");

function sendError(res, error) {
  return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Something went wrong",
    data: {},
    error: { message: error.message || "Unexpected error" },
  });
}
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

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Account created successfully",
      data: { id: user.id, email: user.email },
      error: {},
    });
  } catch (error) {
    return sendError(res, error);
}
}


async function signIn(req, res) {
  try {
    
    const user = await userService.signIn({
    
        email : req.body.email,
        password : req.body.password,
        });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Successfully completed the request",
      data: user,
      error: {},
    });
  } catch (error) {
    return sendError(res, error);
}
}


async function addRoleToUser(req, res) {
  try {
    
    const user = await userService.addRoleToUser({
    
        role : req.body.role,
        id : req.body.id,
        });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Role assigned successfully",
      data: { id: user.id, email: user.email },
      error: {},
    });
  } catch (error) {
    return sendError(res, error);
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




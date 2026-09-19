const express = require('express');
const { userController } = require('../../controllers');

const { authRequestMiddlewares } = require('../../middlewares');
const { auth } = require('../../utils/common');
const router = express.Router();

router.post('/signup',authRequestMiddlewares.validateAuthRequest, userController.signUp);
router.post('/signin', authRequestMiddlewares.validateAuthRequest, userController.signIn);
router.post("/role",authRequestMiddlewares.checkAuth ,authRequestMiddlewares.isAdmin ,  userController.addRoleToUser);

module.exports = router;
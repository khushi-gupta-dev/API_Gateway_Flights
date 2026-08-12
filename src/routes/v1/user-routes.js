const express = require('express');
const { userController } = require('../../controllers');

const { authRequestMiddlewares } = require('../../middlewares');
const { auth } = require('../../utils/common');
const router = express.Router();

router.post('/signup',authRequestMiddlewares.validateAuthRequest, userController.signUp);
router.post('/signin', authRequestMiddlewares.validateAuthRequest, userController.signIn);

module.exports = router;
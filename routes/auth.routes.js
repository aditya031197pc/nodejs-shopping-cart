const router = require('express').Router();

const isAuth = require('./../middlewares/is-auth.middleware');
const authController = require('./../controllers/auth.controller');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', isAuth, authController.postLogout);

router.get('/signup', authController.getSignUp);

router.post('/signup', authController.postSignUp);

module.exports = {router};
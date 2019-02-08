const router = require('express').Router();

const isAuth = require('./../middlewares/is-auth.middleware');
const authController = require('./../controllers/auth.controller');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', isAuth, authController.postLogout);

router.get('/signup', authController.getSignUp);

router.post('/signup', authController.postSignUp);

router.get('/password-reset', authController.getReset);

router.post('/password-reset', authController.postReset);

router.get('/password-reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = {router};
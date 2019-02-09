const router = require('express').Router();
const isAuth = require('./../middlewares/is-auth.middleware');
const authController = require('./../controllers/auth.controller');
const validations = require('./../utils/validations');
router.get('/login', authController.getLogin);

router.post('/login',
    [validations.isValidEmail, validations.isValidPassword],   
authController.postLogin);

router.post('/logout', isAuth, authController.postLogout);

router.get('/signup', authController.getSignUp);

router.post('/signup',
    [   
        validations.isValidName,
        validations.isValidEmail,
        validations.isNotExistingEmail, // if email exists it returns an error message
        validations.isValidPassword,
        validations.doPasswordsMatch
    ],
 authController.postSignUp
);

router.get('/password-reset', authController.getReset);

router.post('/password-reset',[validations.isValidEmail], authController.postReset);

router.get('/password-reset/:token', authController.getNewPassword);

router.post('/new-password',
    [validations.isValidPassword, validations.doPasswordsMatch],
 authController.postNewPassword);

module.exports = {router};
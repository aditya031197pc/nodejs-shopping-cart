const {check, body} = require('express-validator/check');
const User = require('./../models/user.model');

module.exports.isValidEmail = body('email').isEmail()
    .withMessage('Please enter a valid email');


module.exports.isValidPassword = body('password')
    .isLength({min: 6}).withMessage('Password must be 6 characters long')
    .isAlphanumeric().withMessage('Password should be only letters and numbers');

module.exports.isNotExistingEmail = body('email')
.custom((value, { req }) => {
    return User.findOne({ email: value }).then(userDoc => {
      if (userDoc) {
        return Promise.reject(
          'E-Mail exists already, please pick a different one.'
        );
      }
    });
});

module.exports.doPasswordsMatch = body('confirmPassword').custom((value, {req}) => {
    if(value !== req.body.password) {
        throw new Error('Passwords have to match !');
    } else {
        return true;
    }
});
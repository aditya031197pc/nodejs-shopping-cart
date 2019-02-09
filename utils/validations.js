const {body} = require('express-validator/check');
const User = require('./../models/user.model');


module.exports.isValidName = body('name').trim().isAlpha().withMessage('Name should only contain alphabets');

module.exports.isValidEmail = body('email').isEmail().normalizeEmail()
    .withMessage('Please enter a valid email');


module.exports.isValidPassword = body('password').trim()
    .isLength({min: 6}).withMessage('Password must be 6 characters long')
    .isAlphanumeric().withMessage('Password should be only letters and numbers');

module.exports.isNotExistingEmail = body('email').normalizeEmail()
.custom((value, { req }) => {
    return User.findOne({ email: value }).then(userDoc => {
      if (userDoc) {
        return Promise.reject(
          'E-Mail exists already, please pick a different one.'
        );
      }
    });
});

module.exports.doPasswordsMatch = body('confirmPassword').trim().custom((value, {req}) => {
    if(value !== req.body.password) {
        throw new Error('Passwords have to match !');
    } else {
        return true;
    }
});

module.exports.isValidProductTitle = body('title').trim()
.isString().withMessage('The title must have only letters or numbers')
.isLength({min: 3, max: 100}).withMessage('The title length should be between 3-100 letters');

module.exports.isValidImageURL = body('imageURL').trim()
.isURL().withMessage('The imageURL is not a valid URL');

module.exports.isValidProductPrice = body('price')
.isFloat().withMessage('The Product price should have a decimal value');

module.exports.isValidProductDescription = body('description').trim()
.isLength({min: 5, max: 400}).withMessage('The description length should be between 5-400 letters');
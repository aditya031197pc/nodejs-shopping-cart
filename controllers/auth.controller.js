const process = require('process');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {validationResult} = require('express-validator/check');
const User = require('./../models/user.model');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// CHANGE THE BELOW CREDENTIALS FOR YOU APP

const oAuth2Client = new OAuth2(process.env.Client_Id,
process.env.Client_Secret, 'https://developers.google.com/oauthplayground');

oAuth2Client.setCredentials({
    refresh_token: process.env.First_Refresh_Token
});
let accessToken;
let smtpTransport;
oAuth2Client.refreshAccessToken().then(token => {
    accessToken = token.credentials.access_token;

    smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
             type: "OAuth2",
             user: process.env.Users_Email, 
             clientId: process.env.Client_Id,
             clientSecret: process.env.Client_Secret,
             refreshToken: process.env.First_Refresh_Token,
             accessToken: accessToken
        }
    });
});

// TODO: fix this errors and errorMessage parameters

exports.getSignUp = (req, res, next) =>{
    res.render('auth/signup', {
        docTitle: 'SignUp',
        path: '/signup',
        isLoggedIn: req.session.isLoggedIn,
        oldInput: {
            email: '',
            password: '',
            name: '',
            confirmPassword: ''
        },
        errors: [],
        errorMessage: null
    });
};

exports.postSignUp = (req, res, next) => {
    const {name, email, password} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            docTitle: 'SignUp',
            errorMessage: null,
            oldInput: {
                email: req.body.email,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
                name: req.body.name
            },
            errors: errors.array()
        });
    }

    bcrypt.hash(password, 12).then(hashedPassword =>{
        const newUser = new User({
            email,name, 
            password: hashedPassword,
            cart: {items: []}
        });
        return newUser.save().then( result => {
            res.redirect('/login');

            const mailOptions = {
                from: process.env.Users_Email,
                to: email,
                subject: "Node.js Email with Secure OAuth",
                generateTextFromHTML: true,
                html: "<h1> This email has been sent by aditya via nodemailer in shop</h1><br><h3>Congrats you are successfully signed in</h3>"
            };

            smtpTransport.sendMail(mailOptions, (error, response) => {
                error ? console.log(error) : console.log(response);
                smtpTransport.close();
            });
        });
    });
};

exports.getLogin = (req, res, next) => {
    console.log('isLoggedIn', req.session.isLoggedIn);
    let message = req.flash('authError');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        docTitle: 'Login',
        path: '/login',
        isLoggedIn: req.session.isLoggedIn, 
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        errors: []
    });
};

exports.postLogin = (req, res, next) => {
    const {email, password} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/login', {
            path: '/login',
            docTitle: 'Login',
            oldInput: {
                email: req.body.email,
                password: req.body.password,
            },
            errors: errors.array(),
            errorMessage: null
        });
    }

    User.findOne({email}).then(user => {
        if(!user) {
            req.flash('authError', 'Invalid Email or password')
            return res.redirect('/login');
        } else {
            return bcrypt.compare(password, user.password).then(doMatch => {
                if(doMatch) {
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    req.session.save((err) => {
                        console.log('session save', err);
                        res.redirect('/');
                    });
                } else {
                    req.flash('authError', 'Invalid email or Password')
                    res.redirect('/login');
                }
            });
        }
    }).catch(err => console.log(err));
};

exports.postLogout = (req,res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
};

exports.getReset = (req,res,next) => {
    let message = req.flash('authError');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/password-reset', {
        docTitle: 'Reset Password',
        path: '/password-reset',
        errorMessage: message,
        oldInput: {
            email: ''
        },
        errors: []
    });
};

exports.postReset = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/password-reset', {
            path: '/password-reset',
            docTitle: 'Reset Password',
            oldInput: {
                email: req.body.email
            },
            errors: errors.array(),
            errorMessage: null
        });
    }

    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log('randombytes', err);
            return res.redirect('/password-reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email}).then((user) => {
            if(!user) {
                req.flash('authError', 'No user with this email found');
                return res.redirect('/password-reset');
            } else {
              user.resetToken = token;
              user.resetTokenExpiration = Date.now() + 3600000;
              return user.save().then(result => {
                req.session.destroy(err => {
                    res.redirect('/');
                    
                    const mailOptions = {
                        from: process.env.Users_Email,
                        to: req.body.email,
                        subject: "Password reset request",
                        generateTextFromHTML: true,
                        html: `
                        <p>You sent a request to reset the password</p>
                        <p>Click this <a href="http://localhost:3000/password-reset/${token}">Link</a> to reset password</p>
                        `
                    };

                    smtpTransport.sendMail(mailOptions, (error, response) => {
                        error ? console.log(error) : console.log(response);
                        smtpTransport.close();
                    });
                });
              })  
            }
        }).catch((err) => {
           console.log('err reset', err); 
        });
    });
};

exports.getNewPassword = (req,res,next) => {
    const token = req.params.token;

    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}}).then(user => {
        if(user) {
            let message = req.flash('authError');
            if(message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                docTitle: 'New Password',
                path: '/new-password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token,
                oldInput: {
                   password: '',
                   confirmPassword: '' 
                },
                errors: []
            });
        }
    }).catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
    const {password, userId, passwordToken} = req.body;
    let resetUser;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/new-password', {
            path: '/new-password',
            docTitle: 'New Password',
            errorMessage: null,
            oldInput: {
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
            },
            userId,
            passwordToken,
            errors: errors.array()
        });
    }

    User.findOne({
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: {$gt: Date.now()}
    }).then( user => {
        if(!user) {
            req.flash('authError', 'Couldnt complete the password reset process')
            return res.redirect('/password-reset');
        } else {
            resetUser = user;
            return bcrypt.hash(password, 12).then( hashedPassword => {
                resetUser.password = hashedPassword;
                resetUser.resetToken = undefined;
                resetUser.resetTokenExpiration = undefined;
                return resetUser.save();
            }).then(result => {
                return req.session.destroy(err => {
                    res.redirect('/login');
                });
            });
        }
    });
};
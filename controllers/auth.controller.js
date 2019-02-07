
const bcrypt = require('bcryptjs');

const User = require('./../models/user.model');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// CHANGE THE BELOW CREDENTIALS FOR YOU APP

const oAuth2Client = new OAuth2('ClientID',
'clientSecret', 'https://developers.google.com/oauthplayground');

oAuth2Client.setCredentials({
    refresh_token: 'First refresh token'
});
let accessToken;
let smtpTransport;
oAuth2Client.refreshAccessToken().then(token => {
    accessToken = token.credentials.access_token;

    smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
             type: "OAuth2",
             user: "email from which the mail has to be sent", 
             clientId: "",
             clientSecret: "",
             refreshToken: "first refresh token",
             accessToken: accessToken
        }
    });
});

exports.postSignUp = (req, res, next) => {
    const {name, email, password, confirmPassword} = req.body;
    User.findOne({email}).then(user => {
        if(user) {
            req.flash('authError', 'Email already exists')
                console.log('Reached here');
                res.redirect('/signup');
        } else {bcrypt.hash(password, 12).then(hashedPassword =>{
                const newUser = new User({
                    email,name, 
                    password: hashedPassword,
                    cart: {items: []}
                });
                return newUser.save().then( result => {
                    res.redirect('/login');

                    const mailOptions = {
                        from: "email for which we made the setup",
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
        }
    }).catch( err => console.log(err));
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
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const {email, password} = req.body;
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

exports.getSignUp = (req, res, next) =>{
    let message = req.flash('authError');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        docTitle: 'SignUp',
        path: '/signup',
        isLoggedIn: req.session.isLoggedIn,
        errorMessage: message
    });
};


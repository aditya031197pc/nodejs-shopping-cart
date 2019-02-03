
const bcrypt = require('bcryptjs');

const User = require('./../models/user.model');

exports.getLogin = (req, res, next) => {
    console.log('isLoggedIn', req.session.isLoggedIn);
    res.render('auth/login', {
        docTitle: 'Login',
        path: '/login',
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    const {email, password} = req.body;
    User.findOne({email}).then(user => {
        if(!user) {
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
    res.render('auth/signup', {
        docTitle: 'SignUp',
        path: '/signup',
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.postSignUp = (req, res, next) => {
    const {name, email, password, confirmPassword} = req.body;
    User.findOne({email}).then(user => {
        if(user) {
            return res.redirect('/signup');
        }
        bcrypt.hash(password, 12).then(hashedPassword =>{
            const newUser = new User({
                email,name, 
                password: hashedPassword,
                cart: {items: []}
            });
            return newUser.save();
        })
    }).then( result => {
        return res.redirect('/login');
    }).catch( err => console.log(err));
};
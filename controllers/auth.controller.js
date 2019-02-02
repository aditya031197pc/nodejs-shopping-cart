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
    User.findOne().then(user => {
        if(!user) {
            const dummyUser = new User({
                name: req.body.name,
                email: req.body.email,
                cart: {items: []}
            });
            return dummyUser.save();
        }
        else return user;
    }).then( user => {
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save((err) => {
            console.log('session save', err);
            res.redirect('/');
        });
    });
};

exports.postLogout = (req,res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
};
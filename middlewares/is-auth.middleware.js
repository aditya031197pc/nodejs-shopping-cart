module.exports = (req, res, next) => {
    if(req.session.user && req.session.isLoggedIn) {
        return next();
    } else {
        return res.redirect('/login')
    }
};
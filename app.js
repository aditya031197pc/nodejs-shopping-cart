// core modules
// const http = require('http');
const path = require('path');

// third party modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotEnv= require('dotenv');
dotEnv.config({path: './environment.env'});
const session = require('express-session');
const csrf= require('csurf');
const flash = require('connect-flash');
const MongoDBStore= require('connect-mongodb-session')(session);
const app = express();

// our modules
const User = require('./models/user.model');
const adminRouter = require('./routes/admin.routes').router;
const shopRouter = require('./routes/shop.routes').router;
const authRouter = require('./routes/auth.routes').router;
const errorController = require('./controllers/error.controller');

const MONGODB_URI = process.env.MONGODB_URI;
const csrfProtection = csrf(); 
const sessionStore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
// this does the work of combining the chunks and parsing the body of request.
// Must be done before the routing. 

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'a very looong string',
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
})); 

app.use(csrfProtection);

app.use(flash())

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id).then( user => {
        req.user = user;
        return next();
    });
})

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

// for all other routes:
app.use(errorController.get404);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
}).then(() => {
    console.log('Connected to mongoDb');
    return app.listen(3000);
}).then(() => {
    console.log('Server started');
}).catch((err) => {
    console.log('couldnt connect to db', err);
});
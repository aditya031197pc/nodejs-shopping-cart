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
const multer = require('multer');
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

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Done this');
         cb(null, 'images')
        },
    filename: (req, file, cb) => {
        console.log('This too');
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const filefilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
 }


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
// this does the work of combining the chunks and parsing the body of request.
// Must be done before the routing. 



app.use(multer({storage: fileStorage, fileFilter: filefilter}).single('image'));
// app.use(multer({dest: 'images'}).single('image'));

app.use('/images',express.static(path.join(__dirname, 'images')));
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
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id).then( user => {
        if(!user) {
            return next();
        }
        req.user = user;
        return next();
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

// for all other routes:
app.use(errorController.get404);

app.use((error, req, res,next) => {
    console.log(error);
    // res.status(error.httpStatusCode).render(...);
    res.status(500).render('500', {
        docTitle: 'Page Not Found',
        path: '/500',
        isLoggedIn: req.session.isLoggedIn
    });
})

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
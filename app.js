// core modules
// const http = require('http');
const path = require('path');

// third party modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// our modules
const adminRouter = require('./routes/admin.routes').router;
const shopRouter = require('./routes/shop.routes').router;
const errorController = require('./controllers/error.controller');
const User = require('./models/user.model');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
// this does the work of combining the chunks and parsing the body of request.
// Must be done before the routing. 

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("5c5324d1dceeb618b876f7a0").then((user) => {
        req.user = user;
        next(); // it is a must if you are not returning a response        
    }).catch((err) => {
        console.log('user middleware', err);
    });
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(errorController.get404);

mongoose.connect('mongodb+srv://aditya:aditya97@cluster0-bu1cz.mongodb.net/shop?retryWrites=true', {
    useNewUrlParser: true
}).then((result) => {
    console.log('Connected to mongo');
    return User.findOne().then(user => {
        if(!user) {
            const dummyUser = new User({
                name: 'Aditya',
                email: 'test@text.com',
                cart: {items: []}
            });
            return dummyUser.save();
        }
        else return;
    });
}).then(() => {
    return app.listen(3000);
}).then(() => {
    console.log('Server started');
}).catch((err) => {
    console.log('couldnt connect to db', err);
});
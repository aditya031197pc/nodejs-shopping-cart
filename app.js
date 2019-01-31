// core modules
// const http = require('http');
const path = require('path');

// third party modules
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// our modules
const adminRouter = require('./routes/admin.routes').router;
const shopRouter = require('./routes/shop.routes').router;
const errorController = require('./controllers/error.controller');
const { mongoConnect } = require('./utils/database.util');
const User = require('./models/user.model');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
// this does the work of combining the chunks and parsing the body of request.
// Must be done before the routing. 

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("5c50f945d5fb6a099428ae87").then((user) => {
        req.user = new User(user.name, user.email, user.cart, "5c50f945d5fb6a099428ae87");
        next(); // it is a must if you are not returning a response        
    }).catch((err) => {
        console.log('user middleware', err);
    });
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000, ()=> {
        console.log('Server Started');
    });
});
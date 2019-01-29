// core modules
// const http = require('http');
const path = require('path');

// third party modules
const express = require('express');
const bodyParser = require('body-parser');
// const hbs = require('express-handlebars');
const app = express();
const Sequelize = require('sequelize');
// our modules
// const rootDir = require('./utils/path');
const adminRouter = require('./routes/admin.routes').router;
const shopRouter = require('./routes/shop.routes').router;
const errorController = require('./controllers/error.controller');
const { mongoConnect } = require('./utils/database.util');

// app.engine('hbs', hbs({layoutsDir: './views/layout/', defaultLayout: 'main-layout', extname: 'hbs'}));
// app.set('view engine', 'hbs');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
// this does the work of combining the chunks and parsing the body of request.
// Must be done before the routing. 

app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findById(1).then((user) => {
//         req.user = user; //  this is the sequelize object being added to the request object and not on requestBody
//         next(); // it is a must if you are not returning a response        
//     }).catch((err) => {
//         console.log('user middleware', err);
//     });
// });

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000, ()=> {
        console.log('Server Started');
    });
});
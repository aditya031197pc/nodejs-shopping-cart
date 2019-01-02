// core modules
// const http = require('http');
const path = require('path');

// third party modules
const express = require('express');
const bodyParser = require('body-parser');
// const hbs = require('express-handlebars');
const app = express();

// our modules
// const rootDir = require('./utils/path');
const adminRouter = require('./routes/admin.routes').router;
const shopRouter = require('./routes/shop.routes').router;


// app.engine('hbs', hbs({layoutsDir: './views/layout/', defaultLayout: 'main-layout', extname: 'hbs'}));
// app.set('view engine', 'hbs');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
// this does the work of combining the chunks and parsing the body of request.
// Must be done before the routing. 

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use((req, res, next) => {
    res.status(404).render('404', {
        docTitle: 'Page Not Found',
        path: '/404'
    });
});

app.listen(3000); 
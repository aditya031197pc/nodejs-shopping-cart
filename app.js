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
const db = require('./utils/database.util');

const Product = require('./models/product.model');
const User = require('./models/user.model');
const Cart = require('./models/cart.model');
const CartItem = require('./models/cart-item.model');
const Order = require('./models/order.model');
const OrderItem = require('./models/order-item.model');

// app.engine('hbs', hbs({layoutsDir: './views/layout/', defaultLayout: 'main-layout', extname: 'hbs'}));
// app.set('view engine', 'hbs');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
// this does the work of combining the chunks and parsing the body of request.
// Must be done before the routing. 

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById(1).then((user) => {
        req.user = user; //  this is the sequelize object being added to the request object and not on requestBody
        next(); // it is a must if you are not returning a response        
    }).catch((err) => {
        console.log('user middleware', err);
    });
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(errorController.get404);

// ONE TO MANY
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'}); // A user has created the product ie offers the product
User.hasMany(Product); //  A user can add more than one product to the shop

// ONE TO ONE
Cart.belongsTo(User, {constraints: true, onDelete: 'CASCADE'}); // adds a userid to the cart
User.hasOne(Cart);

// MANY TO MANY
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

Order.belongsTo(User);
User.hasMany(Order);

Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });

// db.sync({force: true})
db.sync()
.then((result) => {
    // creating a dummy user here for now
    return User.findById(1)
    // console.log(result);
    
}).then((user) => {
    if(!user) {
        return User.create({ name: 'Aditya', emailId: 'test@test.com'})
    } else {
        return Promise.resolve(user); // it will immidiately resolve the promise.
    }
}).then((user) => {
    console.log('USER', user);
     return user.getCart().then((cart) => {
        if(!cart) {
            return user.createCart();
        }
        else {
            return Promise.resolve(cart);
        }
    })  
}).then(cart => {
    console.log('CArt', cart);
    app.listen(3000);
}).catch((err) => {
    console.log(err);
});
const Product = require('../models/product.model');
const Order = require('../models/order.model');

// GET /
exports.getIndex = (req, res, next) => {
    Product.find().then((products) => { 
        console.log('req.session', req.session);
        console.log('req.session.loggedIn', req.session.isLoggedIn);
        console.log('req.user', req.user);
        res.render('shop/index', {
            products,
            docTitle: 'Shop',
            path: '/',
            isLoggedIn: req.session.isLoggedIn
        });
    }).catch((err) => {
        console.log('[shop.controller.getIndex]', err); 
    });
};

// GET /products
exports.getProducts = (req, res, next) => {
    Product.find().then((products) => {
        res.render('shop/product-list', {
            products,
            docTitle: 'All Products',
            path: '/products',
            isLoggedIn: req.session.isLoggedIn
        });
    }).catch((err) => {
        console.log('[shop.controller.getProducts]', err); 
    });
};

// GET /products/:productId
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).then( (product) => {
        res.render('shop/product-details', {
            docTitle: product.title,
            path: '/products',
            product,
            isLoggedIn: req.session.isLoggedIn
        });
    }).catch((err) => {
        console.log('[shop.controller.getProduct]', err); 
    });;
}

// GET /cart
exports.getCart = (req, res, next) => {
    req.user.getCart().then((cart) => {
        console.log('cart', cart);
        res.render('shop/cart', {
            docTitle: 'Your Cart',
            path: '/cart',
            cart,
            isLoggedIn: req.session.isLoggedIn
        });
    }).catch((err) => {
    });
};

// POST /cart
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId).then(product => {
        return req.user.addToCart(product)
    }).then((result) => {
        res.redirect('/cart');
    }).catch(err => console.log('post cart', err));
};

// POST /cart-delete-product
exports.deleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.deleteCartItem(productId)
    .then((result) => {
        res.redirect('/cart');
    }).catch((err) => {
        console.log('err', err);
    });
}


// POST /create-order

exports.postCreateOrder = (req, res, next) => {
    req.user.getCart().then(cart => {
        const orderItems = cart.products;
        const order = new Order({
            user: {
                name: req.user.name,
                email: req.user.email,
                userId: req.user
            },
            items: orderItems
        });
        return order.save();
    }).then((result) => {
        return req.user.clearCart();
    }).then(result => {
        res.redirect('/orders');
    }).catch((err) => {
        console.log('create order', err);
    });
}

// GET /orders
exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id})
    .then((orders) => {
        res.render('shop/orders', {
            docTitle: 'Orders',
            path: '/orders',
            orders,
            isLoggedIn: req.session.isLoggedIn
        }); 
    }).catch((err) => {
        console.log('getOrders', err);
    });
};

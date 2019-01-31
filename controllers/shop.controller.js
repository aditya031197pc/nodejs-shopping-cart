const Product = require('../models/product.model');
// const Cart = require('../models/cart.model');

// GET /
exports.getIndex = (req, res, next) => {
    Product.fetchAll().then((products) => { 
        res.render('shop/index', {
            products,
            docTitle: 'Shop',
            path: '/',
        });
    }).catch((err) => {
        console.log('[shop.controller.getIndex]', err); 
    });
};

// GET /products
exports.getProducts = (req, res, next) => {
    Product.fetchAll().then((products) => {
        res.render('shop/product-list', {
            products,
            docTitle: 'All Products',
            path: '/products',
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
            product
        });
    }).catch((err) => {
        console.log('[shop.controller.getProduct]', err); 
    });;
}

// // GET /:id/details
// exports.getProductDetails = (req, res, next) => {
//     res.render('shop/product-details', {
//         docTitle: 'Product Details'
//     });
// };

// GET /cart
exports.getCart = (req, res, next) => {
    console.log('USer', req.user.cart.items);
    req.user.getCart().then((products) => {
        console.log('products', products);
        res.render('shop/cart', {
            docTitle: 'Your Cart',
            path: '/cart',
            products
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
    req.user.deleteCartItem(productId).then((result) => {
        res.redirect('/cart');
    }).catch((err) => {
        console.log('err');
    });
}


// POST /create-order

exports.postCreateOrder = (req, res, next) => {
    req.user.addOrder().then((result) => {
        res.redirect('/orders');
    }).catch((err) => {
        console.log('create order', err);
    });
}

// GET /orders
exports.getOrders = (req, res, next) => {
    req.user.getOrders().then((orders) => {
        res.render('shop/orders', {
            docTitle: 'Orders',
            path: '/orders',
            orders
        }); 
    }).catch((err) => {
        console.log('getOrders', err);
    });
};



// // GET /checkout
// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         docTitle: 'Checkout',
//         path: '/checkout'
//     });
// };

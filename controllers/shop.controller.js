const Product = require('../models/product.model');

// GET /
exports.getIndex = (req, res, next) => {
    Product.fetchAll( products => {
        console.log('product controller', products);
        res.render('shop/index', {
        products,
        docTitle: 'Shop',
        path: '/',
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll( products => {
        console.log('product controller', products);
        res.render('shop/product-list', {
        products,
        docTitle: 'All Products',
        path: '/products',
        });
    });
};

// GET /cart
exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        docTitle: 'Ypur Cart',
        path: '/cart'
    });
};


// GET /:id/details
exports.getProductDetails = (req, res, next) => {
    res.render('shop/product-details', {
        docTitle: 'Product Details'
    });
};

// GET /checkout
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout'
    });
};

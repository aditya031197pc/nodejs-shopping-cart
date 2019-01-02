const router = require('express').Router();
const path = require('path');

const rootDir = require('../utils/path.util');

const products = require('./admin.routes').products;

router.get('/', (req, res, next) => {
    console.log('shop.js', products);
    res.render('shop', {
        products,
        docTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    })
});

module.exports = {
    router
};

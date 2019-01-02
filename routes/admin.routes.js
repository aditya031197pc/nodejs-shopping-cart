const path = require('path');

const  router = require('express').Router();

const rootDir = require('../utils/path.util');

const products =[];

router.get('/add-product', (req, res, next) => {
    res.render('add-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
});

router.post('/add-product', (req, res, next) => {
    title = req.body.title;
    products.push({title});
    res.redirect('/');
});

module.exports = {
    router,
    products
};
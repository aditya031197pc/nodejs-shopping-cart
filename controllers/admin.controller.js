const Product = require('../models/product.model');

// GET /admin/add-products
exports.getAddProducts = (req, res, next) => {
    res.render('admin/add-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
    })
};

// POST /admin/add-products
exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const product = new Product(title);
    product.save();
    res.redirect('/');
};

// GET /admin/products
exports.getProducts = (req, res, next) => {
    Product.fetchAll( products => {
        console.log('admin controller', products);
        res.render('admin/products', {
        products,
        docTitle: 'Admin Products',
        path: '/admin/products',
        });
    });
};

// GET /admin/:id/edit-product
exports.getEditProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Edit Product'
    });
}

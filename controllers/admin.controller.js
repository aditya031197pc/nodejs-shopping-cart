const Product = require('../models/product.model');

// GET /admin/add-products
exports.getAddProducts = (req, res, next) => {
    res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
    });
};

// POST /admin/add-products
exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageURL, price, description);
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
    const editMode = req.query.edit;
    if(!editMode) {
       return res.redirect('/');
    }
    // "true" instead of true
    const productId = req.params.productId;
    Product.findById(productId, product => {
        if(!product) {
            console.log('not found');
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            docTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product  
        });
    });
};

// POST /admin/edit-product

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageURL = req.body.imageURL;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedProduct = new Product(id, updatedTitle, updatedImageURL, updatedPrice, updatedDescription);
    updatedProduct.save();
    res.redirect('/admin/products');
};

// POST /admin/delete-product

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.deleteById(id, () => {
        res.redirect('/admin/products');
    });
};
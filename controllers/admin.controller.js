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
    product.save().then(() =>{
        res.redirect('/');

    }).catch((err) => {
        console.log('[admin.controller.postAddProducts.save]', err);
    });
};

// GET /admin/products
exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        console.log('[admin.controller.fetchAll]', rows);
        res.render('admin/products', {
            products: rows,
            docTitle: 'Admin Products',
            path: '/admin/products',
        }); 
    }).catch((err) => {
        console.log('[admin.controller.fetchAll]', err);
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
    Product.findById(productId).then( ([rows, fieldData]) => {
        const product  = rows[0];
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
    }).catch((err)=>{
        consle.log('[admin.controller.getEditProduct]', err);
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
    updatedProduct.save().then(()=>{
        res.redirect('/admin/products');
    }).catch(() => {
        console.log('[admin.controller.postEditProduct]', err);        
    });
};

// POST /admin/delete-product

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.deleteById(id, (deletedProduct) => {
        res.redirect('/admin/products');
    });
};
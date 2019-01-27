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
    req.user.createProduct({ // this cool method is added specially after we setup our associations in the app.js
        title,
        imageURL,
        price,
        description
    }).then((result) => {
      console.log(result);  
      console.log("product created");
      res.redirect('/admin/products');  
    }).catch((err) => {
        console.log("cant create product", err);
    });
};

// GET /admin/products
exports.getProducts = (req, res, next) => {
    req.user.getProducts().then((products) => {
        res.render('admin/products', {
            products,
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
    req.user.getProducts({where: {id: productId}}).then( (products) => {
        // this ensures that the logged in user is only editing its own products
        const product = products[0];
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
    Product.findById(id).then((product) => {
        product.title = updatedTitle;
        product.imageURL = updatedImageURL;
        product.price = updatedPrice;
        product.description = updatedDescription;
        return product.save();
    }).then((result)=>{
        res.redirect('/admin/products');
    }).catch(() => {
        console.log('[admin.controller.postEditProduct]', err);        
    });
};

// POST /admin/delete-product

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.findById(id).then((product) => {
        return product.destroy();
    }).then( () => {
        console.log("Product Deleted")
        res.redirect('/admin/products');
    }).catch((err) => {
       console.log(err); 
    });
};
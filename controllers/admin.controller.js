const Product = require('../models/product.model');


// GET /admin/add-products
exports.getAddProducts = (req, res, next) => {
    res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isLoggedIn: req.session.isLoggedIn
    });
};

// POST /admin/add-products
exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
            title, price, imageURL, description, userId: req.user 
            // here we pass the entire user object but the objectId gets picked up automatically
        });
    
    product.save()
    .then((result) => {
      console.log("product created");
      res.redirect('/admin/products');  
    }).catch((err) => {
        console.log("cant create product", err);
    });
};

// GET /admin/products
exports.getProducts = (req, res, next) => {
    Product.find()
    // .select('title price -_id') // to select certain fields and exclude certain fields
    // .populate('user', 'name')
    .then((products) => {
        res.render('admin/products', {
            products,
            docTitle: 'Admin Products',
            path: '/admin/products',
            isLoggedIn: req.session.isLoggedIn
        }); 
    }).catch((err) => {
        console.log('[admin.controller.fetchAll]', err);
    });
};

// GET /admin/:id/edit-product
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    // "true" instead of true
    if(!editMode) {
       return res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId).then( (product) => {
        if(!product) {
            console.log('not found');
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            docTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product,
            isLoggedIn: req.session.isLoggedIn
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
    Product.findById(id).then( product => {
        product.title = updatedTitle;
        product.imageURL = updatedImageURL;
        product.description = updatedDescription;
        product.price = updatedPrice;
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
    Product.findByIdAndRemove(id).then((result) => {
        console.log("Product Deleted")
        res.redirect('/admin/products');
    }).catch((err) => {
       console.log(err); 
    });
};
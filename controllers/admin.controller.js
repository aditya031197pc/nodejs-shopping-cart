const {validationResult} = require('express-validator/check');

const Product = require('../models/product.model');


// GET /admin/add-products
exports.getAddProducts = (req, res, next) => {
    res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
    errors:[],
    oldInput: {
        title: '',
        description: '',
        imageURL: '',
        price: 0.00
    }
    });
};

// POST /admin/add-products
exports.postAddProducts = (req, res, next) => {

    const title = req.body.title;
    const image = req.file;
    console.log('Image ', req.file);
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);
    if(!image) {
        // This means that multer declined the incoming file
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            isLoggedIn: req.session.isLoggedIn,
            errors: [ {msg:'Image file should have png, jpg, or jpeg extension'}],
            oldInput: {
                title,
                price,
                description
            }
        });
    }
    
    if(!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            isLoggedIn: req.session.isLoggedIn,
            errors:errors.array(),
            oldInput: {
                title,
                price,
                description
            }
        });
    }
    const imageURL = '\\' + image.path;
    const product = new Product({
            title, price, imageURL, description, userId: req.user 
            // here we pass the entire user object but the objectId gets picked up automatically
        });
    
    product.save()
    .then((result) => {
      console.log("product created");
      res.redirect('/admin/products');  
    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

// GET /admin/products
exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id})
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
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
            oldInput: {
                productId: product._id,
                title: product.title,
                price: product.price,
                description: product.description,
                imageURL: product.imageURL
            },
            isLoggedIn: req.session.isLoggedIn,
            errors: []
        });
    }).catch((err)=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

// POST /admin/edit-product

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImage = req.file;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: "true",
            isLoggedIn: req.session.isLoggedIn,
            errors:errors.array(),
            oldInput: {
                productId: id,
                description: updatedDescription,
                title: updatedTitle,
                price: updatedPrice
            }
        });
    }
    const updatedImageURL = null;
    if(updatedImage) {
        updatedImageURL = '\\' +image.path; // necessary to add a / before it express.static error
    }
    Product.findById(id).then( product => {
        if(product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        product.title = updatedTitle;
        if(updatedImageURL) {
            product.imageURL = updatedImageURL;
        }
        product.description = updatedDescription;
        product.price = updatedPrice;
        return product.save().then((result)=>{
            return res.redirect('/admin/products');
        });
    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);       
    });
};

// POST /admin/delete-product

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.deleteOne({_id: id, userId: req.user._id}).then((result) => {
        console.log("Product Deleted")
        res.redirect('/admin/products');
    }).catch((err) => {
      
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
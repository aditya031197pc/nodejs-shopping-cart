const path = require('path');
const fs = require('fs');

const PDFDocument = require('pdfkit');

const Product = require('../models/product.model');
const Order = require('../models/order.model');

// GET /
exports.getIndex = (req, res, next) => {
    Product.find().then((products) => { 
        console.log('req.session', req.session);
        console.log('req.session.loggedIn', req.session.isLoggedIn);
        console.log('req.user', req.user);
        res.render('shop/index', {
            products,
            docTitle: 'Shop',
            path: '/',
            isLoggedIn: req.session.isLoggedIn
        });
    }).catch((err) => {
        console.log('[shop.controller.getIndex]', err); 
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

// GET /products
exports.getProducts = (req, res, next) => {
    Product.find().then((products) => {
        res.render('shop/product-list', {
            products,
            docTitle: 'All Products',
            path: '/products',
            isLoggedIn: req.session.isLoggedIn
        });
    }).catch((err) => {
        console.log('[shop.controller.getProducts]', err); 
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

// GET /products/:productId
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).then( (product) => {
        res.render('shop/product-details', {
            docTitle: product.title,
            path: '/products',
            product,
            isLoggedIn: req.session.isLoggedIn
        });
    }).catch((err) => {
        console.log('[shop.controller.getProduct]', err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error); 
    });;
}

// GET /cart
exports.getCart = (req, res, next) => {
    req.user.getCart().then((cart) => {
        console.log('cart', cart);
        res.render('shop/cart', {
            docTitle: 'Your Cart',
            path: '/cart',
            cart,
            isLoggedIn: req.session.isLoggedIn
        });
    }).catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

// POST /cart
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId).then(product => {
        return req.user.addToCart(product)
    }).then((result) => {
        res.redirect('/cart');
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

// POST /cart-delete-product
exports.deleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.deleteCartItem(productId)
    .then((result) => {
        res.redirect('/cart');
    }).catch((err) => {
        console.log('err', err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}


// POST /create-order

exports.postCreateOrder = (req, res, next) => {
    req.user.getCart().then(cart => {
        const orderItems = cart.products;
        const order = new Order({
            user: {
                name: req.user.name,
                email: req.user.email,
                userId: req.user
            },
            items: orderItems
        });
        return order.save();
    }).then((result) => {
        return req.user.clearCart();
    }).then(result => {
        res.redirect('/orders');
    }).catch((err) => {
        console.log('create order', err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

// GET /orders
exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id})
    .then((orders) => {
        res.render('shop/orders', {
            docTitle: 'Orders',
            path: '/orders',
            orders,
            isLoggedIn: req.session.isLoggedIn
        }); 
    }).catch((err) => {
        console.log('getOrders', err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoiceName = 'Invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);
    Order.findById(orderId).then((order) => {
        if(!order) {
            return next(new Error('NO order found to download invoice'));
        }
        if(req.user._id.toString() !== order.user.userId.toString()) {
            return next(new Error('Unauthorized to download the invoice'));
        }

        const pdfDoc = new PDFDocument()
        res.setHeader('Content-type', 'application/pdf');
        res.setHeader('Content-disposition', 'inline; filename="' + invoiceName + '"');
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text('Invoice');
        pdfDoc.text('----------------------------------------');
        let totalPrice = 0;

        order.items.forEach(item => {
            let itemPrice = (+item.qty)*(+item.productDetails.price);
            totalPrice += itemPrice;

            pdfDoc.fontSize(14).text(
                item.productDetails.title + '  -  '
                 + item.qty +  ' * '
                  + item.productDetails.price +
                   '  =  ' + itemPrice
            );
        });
        pdfDoc.fontSize(20).text('----------------------------');
        pdfDoc.fontSize(20).text('Total =    ' + totalPrice);
        pdfDoc.end();

        // For small files:
        // fs.readFile(invoicePath, (err, data)=> {
        //     if(err) {
        //         return next(err);
        //     } else {
        //         res.setHeader('Content-type', 'application/pdf');
        //         res.setHeader('Content-disposition', 'inline; filename="' + invoiceName + '"');
        //         res.send(data);
        //     }
        // });

        // for large files or large number of requests (RECOMMENDED)

        // const file = fs.createReadStream(invoicePath);
        // res.setHeader('Content-type', 'application/pdf');
        // res.setHeader('Content-disposition', 'inline; filename="' + invoiceName + '"');
        // res.pipe(file);


    }).catch((err) => {
        return next(err);
    });
}
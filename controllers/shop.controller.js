const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

// GET /
exports.getIndex = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        console.log('[shop.controller.getIndex.fetchAll]', rows); 
        res.render('shop/index', {
            products: rows,
            docTitle: 'Shop',
            path: '/',
        });
    }).catch((err) => {
        console.log('[shop.controller.getIndex.fetchAll]', err); 
    });
};

// GET /products
exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        console.log('[shop.controller.getIndex.fetchAll]', rows); 
        res.render('shop/product-list', {
            products: rows,
            docTitle: 'All Products',
            path: '/products',
        });
    }).catch((err) => {
        console.log('[shop.controller.getProducts.fetchAll]', err); 
    });
};

// GET /products/:productId
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).then( ([rows, fieldData]) => {
        const product = rows[0];
        res.render('shop/product-details', {
            docTitle: product.title,
            path: '/products',
            product
        });
    }).catch((err) => {
        console.log('[shop.controller.getProduct]', err); 
    });;
}

// GET /cart
exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll().then(([rows, fieldData]) => {
            const products = rows;
            let cartData = {products: [], totalPrice: cart.totalPrice};
            for(let product of products) {
                const cartProductData = cart.products.find(p => p.id === product.id);
                if(cartProductData) {
                    cartData.products.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                docTitle: 'Your Cart',
                path: '/cart',
                cartData
            });
        }).catch((err) => {
            console.log('[shop.controller.getCart.fetchAll]', err); 
        });
    });
};

// POST /cart
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId).then( ([rows,fieldData]) => {
        const product = rows[0];
        Cart.addProduct(productId, product.price);
        res.redirect('/cart');
    }).catch((err) => {
        console.log('[shop.controller.postCart.findById]', err); 
    });;
};

// POST /cart-delete-product
exports.deleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId).then(([rows, fieldData]) => {
        const product = rows[0];
        Cart.deleteProduct(productId, product.price, (deleteProduct) => {
            res.redirect('/cart');
        }).catch((err) => {
            console.log('[shop.controller.deleteCartProduct]', err); 
        });;
    });
}


// GET /orders
exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        docTitle: 'Orders',
        path: '/orders'
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

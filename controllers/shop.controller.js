const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

// GET /
exports.getIndex = (req, res, next) => {
    Product.fetchAll( products => {
        console.log('product controller', products);
        res.render('shop/index', {
        products,
        docTitle: 'Shop',
        path: '/',
        });
    });
};

// GET /products
exports.getProducts = (req, res, next) => {
    Product.fetchAll( products => {
        console.log('product controller', products);
        res.render('shop/product-list', {
        products,
        docTitle: 'All Products',
        path: '/products',
        });
    });
};

// GET /products/:productId
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
        res.render('shop/product-details', {
            docTitle: product.title,
            path: '/products',
            product
        });
    });
}

// GET /cart
exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll( products => {
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
        });
    });
};

// POST /cart
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price);
        res.redirect('/cart');
    });
};

// POST /cart-delete-product
exports.deleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price, (deleteProduct) => {
            res.redirect('/cart');
        });
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

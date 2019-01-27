const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

// GET /
exports.getIndex = (req, res, next) => {
    Product.findAll().then((products) => { 
        res.render('shop/index', {
            products,
            docTitle: 'Shop',
            path: '/',
        });
    }).catch((err) => {
        console.log('[shop.controller.getIndex]', err); 
    });
};

// GET /products
exports.getProducts = (req, res, next) => {
    Product.findAll().then((products) => {
        res.render('shop/product-list', {
            products,
            docTitle: 'All Products',
            path: '/products',
        });
    }).catch((err) => {
        console.log('[shop.controller.getProducts]', err); 
    });
};

// GET /products/:productId
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).then( product => {
        res.render('shop/product-details', {
            docTitle: product.title,
            path: '/products',
            product
        });
    }).catch((err) => {
        console.log('[shop.controller.getProduct]', err); 
    });;
}

// GET /:id/details
exports.getProductDetails = (req, res, next) => {
    res.render('shop/product-details', {
        docTitle: 'Product Details'
    });
};

// GET /cart
exports.getCart = (req, res, next) => {
    req.user.getCart().then((cart) => {
        console.log('cart', cart);
        return cart.getProducts();
    }).then((products) => {
        console.log('products', products);
        res.render('shop/cart', {
            docTitle: 'Your Cart',
            path: '/cart',
            products
        });
    }).catch((err) => {
    });
};

// POST /cart
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    let newQty = 1;
    req.user.getCart()
    .then( (cart) => {
        fetchedCart = cart;
        return cart.getProducts({where: {id: productId}});
    }).then(products =>{
        let product;

        if(products.length > 0 ) {
            // products array is not empty
            product = products[0];
        }
        if(product) {
            // Increment the qty by one
            const oldQty = product.cartItem.qty;
            newQty = oldQty +1;
            return Promise.resolve(product);
        } else {
            // create a new product
            return Product.findById(productId)
        }
    }).then(product => {
        // we add it to the cart
        // using the magic method provided by sequelize
        // this does not set the extra fields like QTY by default though. We have to do this on our own using through
        // it will replace the existing one if updating qty
        return fetchedCart.addProduct(product, {
            through: { qty: newQty }
        });
    }).then(() => {
        res.redirect('/cart');
    }).catch((err) => {
        console.log('[shop.controller.postCart]', err); 
    });
};

// POST /cart-delete-product
exports.deleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.getCart()
    .then((cart) => {
        // we get that particular product from the cart
        return cart.getProducts({where: { id: productId}})
    }).then( products => {
        const product = products[0];
        return product.cartItem.destroy();
    }).then((result) => {
        res.redirect('/cart');
    }).catch((err) => {
        console.log('err');
    });
}


// POST /create-order

exports.postCreateOrder = (req, res, next) => {
    let fetchedCart;
    let fetchedProducts;
    req.user.getCart()
    .then((cart) => {
        fetchedCart = cart;
        return cart.getProducts();
    }).then(products => {
        fetchedProducts = products;
        return req.user.createOrder();
    }).then((order) => {
        // here we map our products and there qty to the order
        return order.addProducts(
            fetchedProducts.map(product => {
                product.orderItem = { qty: product.cartItem.qty};
                return product; // returning from map  
            })
        );            
    }).then((result) => {
        return fetchedCart.setProducts(null);
    }).then((result) => {
        res.redirect('/orders');
    }).catch((err) => {
        console.log('create order', err);
    });
}

// GET /orders
exports.getOrders = (req, res, next) => {
    req.user.getOrders({include: ['products'] })
    .then((orders) => {
        res.render('shop/orders', {
            docTitle: 'Orders',
            path: '/orders',
            orders
        }); 
    }).catch((err) => {
        console.log('getOrders', err);
    });
};



// // GET /checkout
// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         docTitle: 'Checkout',
//         path: '/checkout'
//     });
// };

const router = require('express').Router();

const isAuth = require('./../middlewares/is-auth.middleware');
const shopController = require('../controllers/shop.controller');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-product', isAuth, shopController.deleteCartProduct);

router.post('/create-order', isAuth, shopController.postCreateOrder);

router.get('/orders', isAuth, shopController.getOrders);


module.exports = {
    router
};

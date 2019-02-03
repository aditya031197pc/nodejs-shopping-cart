const path = require('path');

const  router = require('express').Router();

const isAuth = require('./../middlewares/is-auth.middleware');

const adminController = require('../controllers/admin.controller');

// GET /admin/add-product
router.get('/add-product', isAuth, adminController.getAddProducts);

// POST /admin/add-product
router.post('/add-product', isAuth, adminController.postAddProducts);

// GET /admin/edit-product/:productId
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// POST /admin/edit-product
router.post('/edit-product', isAuth, adminController.postEditProduct);

// GET /admin/products
router.get('/products', isAuth, adminController.getProducts);

// POST /admin/delete-product
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = {
    router,
};
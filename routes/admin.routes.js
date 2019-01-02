const path = require('path');

const  router = require('express').Router();

const adminController = require('../controllers/admin.controller');

// GET /admin/add-product
router.get('/add-product', adminController.getAddProducts);
// POST /admin/add-product
router.post('/add-product', adminController.postAddProducts);

// GET /admin/products
router.get('/products', adminController.getProducts);

module.exports = {
    router,
};
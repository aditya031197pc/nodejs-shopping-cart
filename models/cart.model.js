const fs = require('fs');
const path = require('path');

const rootDirectory = require('./../utils/path.util').rootDirectory;


const cartPath = path.join(rootDirectory, 'data', 'cart.json');

const getCartFromFile = cb => {
    fs.readFile(cartPath, (err, data) =>{
        let cart = {products: [], totalPrice: 0};
        if(!err) {
            cart = JSON.parse(data);
        } 
        cb(cart);
    });
};

module.exports = class Cart {
    static addProduct(id, price) {
        getCartFromFile(cart => {
            // Finding if product already exists
            const existingProductIndex = cart.products.findIndex(p => p.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty = +updatedProduct.qty + 1;
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            // adding the price
            cart.totalPrice = +cart.totalPrice + +price;
            // saving  back
            fs.writeFile(cartPath, JSON.stringify(cart), (err) =>{
                if(err) {
                console.log('err in cart write', err);
                }
            });
        });
    }
}
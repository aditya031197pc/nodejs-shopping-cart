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
    static deleteProduct(id, productPrice, cb) {
        getCartFromFile( cart => {
            // right now we are removing all the products at once. We will fix this later
            if(cart.products === []){
                console.log("NO PRODUCTS IN CART");
                return;
            }
            console.log("PRODUCTS ARE IN CART", cart);
            
            let updatedCart = { products:[...cart.products], totalPrice: cart.totalPrice};
            
            const existingProduct = updatedCart.products.find(p => p.id === id);
            console.log("FOUND PRODUCT", existingProduct);
            if(existingProduct) {
            updatedCart.products = [...updatedCart.products.filter(p => p.id !== id)];
            updatedCart.totalPrice = updatedCart.totalPrice - existingProduct.qty * productPrice;  
            }
            fs.writeFile(cartPath, JSON.stringify(updatedCart), (err) =>{
                if(!err) {
                    cb(existingProduct);
                }
            });
        });
    }
    static getCart(cb) {
        getCartFromFile( cart => {
            cb(cart);
        });
    }
}
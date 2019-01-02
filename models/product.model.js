const fs = require('fs');
const path = require('path');

const rootDirectory = require('./../utils/path.util').rootDirectory;
// products = []; // to store all the products

const savePath = path.join(rootDirectory, 'data', 'products.json');
const getProductsFromFile = cb => {
        fs.readFile(savePath, (err,data) => {
        if(err) {
            cb([]);
        }
        else {
            const products = JSON.parse(data);
            cb(products);
        }
    });
};

module.exports = class Product {
    constructor(t) {
        this.title = t;
        // this creates a property title in the newly created object
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(savePath, JSON.stringify(products), (err) => {
                console.log('err', err);
            });
        });
    }

    static fetchAll(cb) {
        // a utility method to fetch all the products without having the need to create a dummy object
        getProductsFromFile(cb);
    }
}
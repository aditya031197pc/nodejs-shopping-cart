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
    constructor(title, imageURL, price, description) {
        this.title = title;
        this.imageURL = imageURL;
        this.price = price;
        this.description = description;
        // this creates a property title in the newly created object
    }

    save() {
        this.id = Math.random().toString();
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

    static findById(id, cb) {
        getProductsFromFile( products => {
            const product = products.find(p => p.id === id);
            console.log('Found', product)
            cb(product);
        });
    }
}
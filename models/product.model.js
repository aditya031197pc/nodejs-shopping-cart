const db = require('./../utils/database.util');

const Cart = require('./cart.model');

module.exports = class Product {
    constructor(id, title, imageURL, price, description) {
        this.id = id;
        this.title = title;
        this.imageURL = imageURL;
        this.price = price;
        this.description = description;
    }
    // changeing callbacks as will work with promises
    save() {
        return db.execute('INSERT INTO products (title, imageURL, price, description) VALUES (?, ?, ?, ?)',
         [this.title, this.imageURL, this.price, this.description ]);
        }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
        // we will return promises from each of these so that we can use them at respective places to execute async code
        }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
        }

    static deleteById(id) {
        }
}
const { ObjectId } = require('mongoDb');

const { getDB } = require('./../utils/database.util');

class Product {
    constructor(title, price, imageURL, description, id, userId) {
        this.title = title;
        this.description = description;
        this.imageURL = imageURL;
        this.price = price;
        this._id = id ? new ObjectId(id): null;
        this.userId = userId;
    }

    save() {
        const db = getDB();
        if(this._id) {
            // updation
            return db.collection('products').updateOne({_id: new ObjectId(this._id)}, {
                $set: this
            });
        } else {
            // creation
            return db.collection('products').insertOne(this);
        }
    }

    static fetchAll() {
        const db = getDB();
        return db.collection('products').find().toArray();
    }

    static findById(id) {
        const db = getDB();
        return db.collection('products').find({_id: new ObjectId(id)}).next();
    }

    static deleteById(id) {
        const db = getDB();
        return db.collection('products').deleteOne({_id: new ObjectId(id)});
    }
};

module.exports = Product;

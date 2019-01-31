const {ObjectId} = require('mongodb');

const {getDB} = require('./../utils/database.util');

class User {

    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart; // cart: {items: []}
        this._id = id ? new ObjectId(id): null;
    }

    addToCart(product) {
        console.log('add To cart called');
            let updatedCart;
            // if that product is not found
            // create an entry for it
            if(this.cart) {
                const cartProductIndex = this.cart.items.findIndex( p => p.productId.toString() === product._id.toString());
                if(cartProductIndex == -1) {
                    // add this product to items
                    updatedCart = {
                        items: [...this.cart.items, {productId: new ObjectId(product._id), qty: 1}]
                    };    
                }
                 else {
                    updatedCart = this.cart;
                    updatedCart.items[cartProductIndex].qty = updatedCart.items[cartProductIndex].qty + 1;
                }
            } else {
                // no cart is present yet
                updatedCart = {
                    items: [{productId: new ObjectId(product._id), qty: 1}]
                };
                // console.log('updatedCart', updatedCart);
            }
            const db = getDB();
            return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {
                $set: {
                    cart: updatedCart
                }
            }).then((result) => {
                // console.log('logging the result of the query');
               console.log(result); 
            }).catch((err) => {
                console.log('err', err);
            });;
    }

    getCart() {
        const db = getDB();
        const cartItems = this.cart.items;
        const productIds = cartItems.map( i => new ObjectId(i.productId));
        console.log('Product ids', productIds);
        return db.collection('products').find({_id: {
            $in: productIds
        }}).toArray().then(products => {
            console.log('Cart products', products);
                // we need to add the qty key back to each item
                return products.map(p => {
                    console.log('Mapping the product Ids');
                    return {
                        ...p,
                        qty: cartItems.find(i => i.productId.toString() === p._id.toString()).qty
                    }
                });
            }
        )
    }

    deleteCartItem(productId) {
        const updatedCartItems = this.cart.items.filter(i => i.productId.toString() !== productId.toString());
        const db = getDB();
        return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {
            $set: {
                cart: {
                    items: updatedCartItems
                }
            }
        });
    }

    addOrder() {
        const db = getDB();
        return this.getCart().then(products => {
            const order = {
                items: products,
                user: {
                    _id: new ObjectId(this._id),
                    name: this.name
                }
            };

            return db.collection('orders')
            .insertOne(order)
            .then( result => {
                this.cart = { items: [] };
                return db.collection('users')
                .updateOne({_id: new ObjectId(this._id)}, {
                    $set: { cart: { items: [] } }
                });
            });
        });
    }

    getOrders() {
        const db= getDB();
        return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
    }

    save() {
        const db= getDB();
        return db.collections('users').insertOne(this)
    }

    static findById(id) {
        const db = getDB();
        // console.log(db.collections('users').findById(id));
        return db.collection('users').find( { _id: new ObjectId(id) } ).next();
    }
}
module.exports = User;
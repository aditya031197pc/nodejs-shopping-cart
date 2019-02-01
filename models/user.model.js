const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true},
            qty: {type: String, required: true}
        }],
    },
});

userSchema.methods.addToCart = function(product) {
    let updatedCartItems = [];
    if(this.cart) {
        cartProductIndex = this.cart.items.findIndex(i => i.productId.toString() === product._id.toString());
        updatedCartItems = [...this.cart.items];
        
        if(cartProductIndex >=0) {
            // console.log('CartProductIndex', cartProductIndex);
            // console.log(updatedCartItems[cartProductIndex]);
            updatedCartItems[cartProductIndex].qty = +updatedCartItems[cartProductIndex].qty +1;
        } else {
            updatedCartItems.push({
                productId: product._id,
                qty: 1
            });
        }
    } else {
        updatedCartItems.push({
            productId: product._id,
            qty: 1
        });
    }
    this.cart = {
        items: updatedCartItems
    };
    return this.save();
};

userSchema.methods.getCart = function() {
    return this.populate('cart.items.productId').execPopulate()
    .then( user => {
        // console.log('USer', user);
        // console.log('user Obj has the following cart items currently', user.cart.items);
        const products = user.cart.items.map(i => {
            const product = i.productId._doc;
            // console.log('_doc', product);
            // console.log('Product that is going to be mapped', product);
            return {
                productDetails: product,
                qty: i.qty
            };
        });
        // console.log('Products mapped', products);
        let totalPrice = 0;
        products.forEach(p => {
            totalPrice = totalPrice + (p.qty*p.productDetails.price);            
        });
        // console.log('Total Price', totalPrice);

        // this methods a nested object of following structure:
        // {
        //     products: [{
        //         productDetails: Product,
        //         qty: Number
        //     }],
        //     totalPrice
        // }

        return Promise.resolve({
            products,
            totalPrice
        });
    });    
};

userSchema.methods.deleteCartItem = function(productId) {
    // console.log('Product Id of the product to be deleted', productId);
    const updatedCartItems = this.cart.items.filter(i => {
        // console.log('i.productID', i.productId);
        // console.log('productId', productId);
       return (i.productId.toString() !== productId.toString())
    });
    // console.log('UpdatedCartItems',updatedCartItems);
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function() {
    this.cart = {items: []};
    return this.save();
};

module.exports = mongoose.model('User', userSchema);

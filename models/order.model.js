const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items: [
        {
            productDetails: {
                type: Object,
                required:true
            },
            qty: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);
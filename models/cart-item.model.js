const Sequelize = require('sequelize');

const sequelize = require('./../utils/database.util');

const CartItem = sequelize.define('cartItem', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = CartItem;
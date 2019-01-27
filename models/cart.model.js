const Sequelize = require('sequelize');

const sequelize = require('./../utils/database.util');

const Cart = sequelize.define('cart', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    }
});

module.exports = Cart;
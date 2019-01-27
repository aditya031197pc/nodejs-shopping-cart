const Sequelize = require('sequelize');
const sequelize = require('../utils/database.util');

const User = sequelize.define('user', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    emailId: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = User;
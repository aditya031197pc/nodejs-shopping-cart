const Sequelize = require('sequelize');

const sequelize = new Sequelize(database='node-max', username='root', password='mysql@2019', options={
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
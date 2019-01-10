const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql@2019',
    database: 'node-max'
});

module.exports = pool.promise();
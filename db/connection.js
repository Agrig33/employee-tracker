const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'employees',
});

connection.connect();

module.exports = connection;

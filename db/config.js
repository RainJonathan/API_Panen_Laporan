const mysql = require('mysql2/promise');
require('dotenv').config();
const pool = mysql.createPool({
    host: 'gpasolution.id',
    user: 'gpasolu1_gpasolu1',
    database: 'gpasolu1_ho',
    password: '$!Gpa.9339#',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;

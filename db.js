const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin@123',
  database: 'DoarConecta_db',
});

module.exports = db;
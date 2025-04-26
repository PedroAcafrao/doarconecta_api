const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '12345',
  database: 'doarconecta_db',
});

module.exports = db;
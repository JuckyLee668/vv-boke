// config/pool.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10,        // 最大连接数
  queueLimit: 0,             // 等待队列限制
  acquireTimeout: 60000,     // 获取连接超时时间
  timeout: 60000,            // 查询超时时间
  reconnect: true,           // 自动重连
  charset: 'utf8mb4'         // 字符集
});

// 监听连接事件
pool.on('connection', function (connection) {
  console.log('新连接建立: ' + connection.threadId);
});

pool.on('error', function(err) {
  console.error('数据库连接池错误:', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('数据库连接丢失');
  }
});

module.exports = pool;
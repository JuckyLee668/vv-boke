// models/UserPool.js
const pool = require('../config/pool');

class UserPool {
  static create(userData) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
      pool.query(sql, [userData.name, userData.email, userData.age], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users ORDER BY created_at DESC';
      pool.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // 事务示例
  static createWithTransaction(userData) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.beginTransaction((err) => {
          if (err) {
            connection.release();
            return reject(err);
          }

          const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
          connection.query(sql, [userData.name, userData.email, userData.age], (err, result) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                reject(err);
              });
            }

            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  reject(err);
                });
              }
              connection.release();
              resolve(result);
            });
          });
        });
      });
    });
  }
}

module.exports = UserPool;
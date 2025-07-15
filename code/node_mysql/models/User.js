// models/User.js
const db = require('../config/database');

class User {
  // 创建用户
  static create(userData, callback) {
    const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
    db.query(sql, [userData.name, userData.email, userData.age], callback);
  }

  // 查询所有用户
  static findAll(callback) {
    const sql = 'SELECT * FROM users ORDER BY created_at DESC';
    db.query(sql, callback);
  }

  // 根据ID查询用户
  static findById(id, callback) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], callback);
  }

  // 根据邮箱查询用户
  static findByEmail(email, callback) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], callback);
  }

  // 更新用户
  static update(id, userData, callback) {
    const sql = 'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?';
    db.query(sql, [userData.name, userData.email, userData.age, id], callback);
  }

  // 删除用户
  static delete(id, callback) {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], callback);
  }

  // 分页查询
  static findWithPagination(page, limit, callback) {
    const offset = (page - 1) * limit;
    const sql = 'SELECT * FROM users LIMIT ? OFFSET ?';
    db.query(sql, [limit, offset], callback);
  }

  // 搜索用户
  static search(keyword, callback) {
    const sql = 'SELECT * FROM users WHERE name LIKE ? OR email LIKE ?';
    const searchTerm = `%${keyword}%`;
    db.query(sql, [searchTerm, searchTerm], callback);
  }
}

module.exports = User;
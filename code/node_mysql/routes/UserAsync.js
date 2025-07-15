// models/UserAsync.js
const pool = require('../config/promisePool');

class UserAsync {
  // 创建用户
  static async create(userData) {
    const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [userData.name, userData.email, userData.age]);
    return result;
  }

  // 查询所有用户
  static async findAll() {
    const sql = 'SELECT * FROM users ORDER BY created_at DESC';
    const [rows] = await pool.execute(sql);
    return rows;
  }

  // 根据ID查询用户
  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
  }

  // 更新用户
  static async update(id, userData) {
    const sql = 'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?';
    const [result] = await pool.execute(sql, [userData.name, userData.email, userData.age, id]);
    return result;
  }

  // 删除用户
  static async delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    const [result] = await pool.execute(sql, [id]);
    return result;
  }

  // 事务操作
  static async createWithLog(userData, logData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // 创建用户
      const [userResult] = await connection.execute(
        'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
        [userData.name, userData.email, userData.age]
      );

      // 创建日志
      await connection.execute(
        'INSERT INTO user_logs (user_id, action, details) VALUES (?, ?, ?)',
        [userResult.insertId, logData.action, logData.details]
      );

      await connection.commit();
      return userResult;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = UserAsync;
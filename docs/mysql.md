# Node.js 与 MySQL 教程

## 目录

1. [简介](#简介)
2. [环境准备](#环境准备)
3. [安装依赖](#安装依赖)
4. [数据库连接](#数据库连接)
5. [基本操作](#基本操作)
6. [连接池使用](#连接池使用)
7. [Promise 和 async/await](#promise-和-asyncawait)
8. [ORM 框架](#orm-框架)
9. [MySQL 常用命令](#mysql-常用命令)
10. [最佳实践](#最佳实践)
11. [错误处理](#错误处理)
12. [参考资料](#参考资料)

---

## 简介

本教程介绍如何在 Node.js 项目中使用 MySQL 数据库，包括基本的数据库操作、连接池管理、ORM 框架使用等内容。

## 环境准备

### 1. 安装 MySQL

**Windows:**
- 下载并安装 [MySQL Installer](https://dev.mysql.com/downloads/installer/)

**macOS:**
```bash
# 安装 MySQL
brew install mysql

# 启动 MySQL 服务
brew services start mysql
```

**Linux (Ubuntu):**
```bash
# 更新包列表
sudo apt update

# 安装 MySQL 服务器
sudo apt install mysql-server

# 启动 MySQL 服务
sudo systemctl start mysql

# 设置开机自启
sudo systemctl enable mysql
```

### 2. 创建数据库和用户

```sql
-- 登录 MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE node_app;

-- 创建用户并授权
CREATE USER 'nodeuser'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON node_app.* TO 'nodeuser'@'localhost';
FLUSH PRIVILEGES;

-- 使用数据库
USE node_app;
```

## 安装依赖

### 1. 初始化 Node.js 项目

```bash
# 创建项目目录
mkdir node-mysql-app
cd node-mysql-app

# 初始化 package.json
npm init -y
```

### 2. 安装 MySQL 驱动

```bash
# 安装 mysql2 (推荐，支持 Promise)
npm install mysql2

# 或者安装 mysql (旧版本)
npm install mysql

# 安装其他必要依赖
npm install express dotenv
```

### 3. 创建项目结构

```
node-mysql-app/
├── config/
│   └── database.js         # 数据库配置
├── models/
│   └── User.js            # 用户模型
├── routes/
│   └── users.js           # 用户路由
├── .env                   # 环境变量
├── app.js                 # 主应用文件
└── package.json           # 项目配置
```

## 数据库连接

### 1. 环境变量配置 (.env)

```bash
# 数据库连接配置
DB_HOST=127.0.0.1
DB_USER=nodeuser
DB_PASSWORD=password123
DB_NAME=node_app
DB_PORT=3306

# 应用配置
PORT=3000
NODE_ENV=development
```

### 2. 数据库配置文件 (config/database.js)

```javascript
const mysql = require('mysql2');
require('dotenv').config();

// 创建单个连接
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// 测试连接
connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败: ' + err.stack);
    return;
  }
  console.log('数据库连接成功，连接ID: ' + connection.threadId);
});

module.exports = connection;
```

## 基本操作

### 1. 创建表

```javascript
// createTables.js
const db = require('./config/database');

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

db.query(createUsersTable, (err, result) => {
  if (err) {
    console.error('创建表失败:', err);
  } else {
    console.log('用户表创建成功');
  }
});
```

### 2. 增删改查操作

```javascript
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
```

```javascript
//createUser.js
const User = require('./models/User');

const newUser = {
  name: '张三',
  email: 'zhangsan@example.com',
  age: 28
};

User.create(newUser, (error, results) => {
  if (error) {
    console.error('创建用户失败:', error);
    return;
  }
  console.log('创建成功，用户ID:', results.insertId);
});
```
```javascript
// findAllUsers.js
const User = require('./models/User');

const page = 2;  // 第2页
const limit = 10; // 每页10条

User.findWithPagination(page, limit, (error, results) => {
  if (error) {
    console.error('分页查询失败:', error);
    return;
  }
  console.log(`第${page}页用户数据:`, results);
});
```
### 3. 路由使用示例 (routes/users.js)

```javascript
const express = require('express');
const User = require('../models/User');

const app = express();//创建 Express 应用
const port = 3000;

// 中间件
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码请求体

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: '用户管理API服务器',
    version: '1.0.0',
    endpoints: {
      'GET /users': '获取所有用户',
      'GET /users/:id': '获取单个用户',
      'POST /users': '创建用户',
      'PUT /users/:id': '更新用户',
      'DELETE /users/:id': '删除用户'
    }
  });
});

// 获取所有用户
app.get('/users', (req, res) => {
  User.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 获取单个用户
app.get('/users/:id', (req, res) => {
  User.findById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: '用户未找到' });
    }
    res.json(results[0]);
  });
});

// 创建用户
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: '姓名和邮箱是必填项' });
  }

  User.create({ name, email, age }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      message: '用户创建成功', 
      userId: result.insertId 
    });
  });
});

// 更新用户
app.put('/users/:id', (req, res) => {
  const { name, email, age } = req.body;
  
  User.update(req.params.id, { name, email, age }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '用户未找到' });
    }
    res.json({ message: '用户更新成功' });
  });
});

// 删除用户
app.delete('/users/:id', (req, res) => {
  User.delete(req.params.id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '用户未找到' });
    }
    res.json({ message: '用户删除成功' });
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`用户管理API服务器已启动，端口：${port}`);
  console.log(`可以访问以下接口：`);
  console.log(`- GET    http://localhost:${port}/users      - 获取所有用户`);
  console.log(`- GET    http://localhost:${port}/users/:id  - 获取单个用户`);
  console.log(`- POST   http://localhost:${port}/users      - 创建用户`);
  console.log(`- PUT    http://localhost:${port}/users/:id  - 更新用户`);
  console.log(`- DELETE http://localhost:${port}/users/:id  - 删除用户`);
});

```

## 连接池使用
连接池可以有效地管理数据库连接，避免频繁创建和销毁连接带来的性能损耗。
### 1. 连接池配置

```javascript
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
```

### 2. 使用连接池
Promise 封装特点
- 所有方法都返回 Promise 对象
- 替代回调函数，支持 async/await 语法
- 使异步代码更易读和维护
```javascript
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
  // 适用场景：需要保证一组操作要么全部成功，要么全部失败
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
```

## Promise 和 async/await

### 1. Promise 版本

```javascript
// config/promisePool.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10,
  charset: 'utf8mb4'
});

module.exports = pool;
```

### 2. async/await 用法

```javascript
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
```

### 3. 使用 async/await 的路由

```javascript
// routes/usersAsync.js
const express = require('express');
const router = express.Router();
const UserAsync = require('../models/UserAsync');

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await UserAsync.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建用户
router.post('/', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: '姓名和邮箱是必填项' });
    }

    const result = await UserAsync.create({ name, email, age });
    res.status(201).json({ 
      message: '用户创建成功', 
      userId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## ORM 框架

### 1. Sequelize 使用示例

```bash
# 安装 Sequelize 和 MySQL 驱动
npm install sequelize mysql2

# 安装开发依赖（CLI 工具）
npm install -D sequelize-cli

# 初始化 Sequelize 项目结构
npx sequelize-cli init
```

#### 1.1 基本配置

```javascript
// config/sequelize.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    pool: {
      max: 10,           // 最大连接数
      min: 0,            // 最小连接数
      acquire: 30000,    // 获取连接的最大时间
      idle: 10000        // 连接空闲的最大时间
    },
    logging: console.log,  // 设置为 false 关闭 SQL 日志
    timezone: '+08:00',    // 设置时区
    define: {
      // 全局模型选项
      freezeTableName: true,    // 禁用表名复数化
      underscored: true,        // 使用下划线命名
      paranoid: true,           // 启用软删除
      charset: 'utf8mb4',       // 字符集
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

// 测试数据库连接
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功！');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}

testConnection();

module.exports = sequelize;
```

#### 1.2 模型定义

```javascript
// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'first_name'  // 数据库字段名
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'last_name'
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 120
    }
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    defaultValue: 'pending'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    field: 'last_login_at'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified'
  }
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true,  // 软删除
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    }
  ],
  // 实例方法
  instanceMethods: {},
  // 类方法
  classMethods: {},
  // 钩子函数
  hooks: {
    beforeCreate: async (user) => {
      // 密码加密等操作
      const bcrypt = require('bcrypt');
      user.password = await bcrypt.hash(user.password, 10);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const bcrypt = require('bcrypt');
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// 实例方法
User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password; // 不返回密码
  return values;
};

// 类方法
User.findByEmail = function(email) {
  return this.findOne({ where: { email } });
};

User.findActive = function() {
  return this.findAll({ where: { status: 'active' } });
};

module.exports = User;
```

```javascript
// models/Post.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200],
      notEmpty: true
    }
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  publishedAt: {
    type: DataTypes.DATE,
    field: 'published_at'
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'view_count'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'posts',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

module.exports = Post;
```

```javascript
// models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 1000]
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'post_id'
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'parent_id'
  }
}, {
  tableName: 'comments',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

module.exports = Comment;
```

#### 1.3 模型关联

```javascript
// models/index.js
const sequelize = require('../config/sequelize');
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// 定义关联关系
// 用户与文章的关系 (一对多)
User.hasMany(Post, {
  foreignKey: 'userId',
  as: 'posts',
  onDelete: 'CASCADE'
});
Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author'
});

// 用户与评论的关系 (一对多)
User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments',
  onDelete: 'CASCADE'
});
Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author'
});

// 文章与评论的关系 (一对多)
Post.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'comments',
  onDelete: 'CASCADE'
});
Comment.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post'
});

// 评论自关联 (父子评论)
Comment.hasMany(Comment, {
  foreignKey: 'parentId',
  as: 'replies'
});
Comment.belongsTo(Comment, {
  foreignKey: 'parentId',
  as: 'parent'
});

// 多对多关系示例：用户关注
User.belongsToMany(User, {
  through: 'user_follows',
  as: 'followers',
  foreignKey: 'followingId',
  otherKey: 'followerId'
});

User.belongsToMany(User, {
  through: 'user_follows',
  as: 'following',
  foreignKey: 'followerId',
  otherKey: 'followingId'
});

module.exports = {
  sequelize,
  User,
  Post,
  Comment
};
```

#### 1.4 数据库操作

```javascript
// services/UserService.js
const { User, Post, Comment } = require('../models');
const { Op } = require('sequelize');

class UserService {
  // 创建用户
  static async createUser(userData) {
    try {
      const user = await User.create(userData);
      return user;
    } catch (error) {
      throw new Error(`创建用户失败: ${error.message}`);
    }
  }

  // 查找用户（包含关联数据）
  static async findUserById(id, includeAssociations = false) {
    const options = {
      where: { id },
      attributes: { exclude: ['password'] }
    };

    if (includeAssociations) {
      options.include = [
        {
          model: Post,
          as: 'posts',
          where: { status: 'published' },
          required: false,
          include: [
            {
              model: Comment,
              as: 'comments',
              where: { status: 'approved' },
              required: false
            }
          ]
        },
        {
          model: Comment,
          as: 'comments',
          where: { status: 'approved' },
          required: false
        }
      ];
    }

    return await User.findByPk(id, options);
  }

  // 分页查询用户
  static async findUsersWithPagination(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    // 构建查询条件
    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${filters.search}%` } },
        { email: { [Op.like]: `%${filters.search}%` } },
        { firstName: { [Op.like]: `%${filters.search}%` } },
        { lastName: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    if (filters.ageMin || filters.ageMax) {
      where.age = {};
      if (filters.ageMin) where.age[Op.gte] = filters.ageMin;
      if (filters.ageMax) where.age[Op.lte] = filters.ageMax;
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    return {
      users: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }

  // 更新用户
  static async updateUser(id, updateData) {
    const [updatedRowsCount] = await User.update(updateData, {
      where: { id }
    });

    if (updatedRowsCount === 0) {
      throw new Error('用户不存在或更新失败');
    }

    return await this.findUserById(id);
  }

  // 软删除用户
  static async deleteUser(id) {
    const result = await User.destroy({
      where: { id }
    });

    if (result === 0) {
      throw new Error('用户不存在或删除失败');
    }

    return { message: '用户删除成功' };
  }

  // 批量操作
  static async bulkCreateUsers(usersData) {
    return await User.bulkCreate(usersData, {
      validate: true,
      individualHooks: true // 触发钩子函数
    });
  }

  // 复杂查询示例
  static async getUserStats() {
    return await User.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('age')), 'avgAge']
      ],
      group: ['status']
    });
  }

  // 事务操作
  static async createUserWithPost(userData, postData) {
    const transaction = await sequelize.transaction();

    try {
      // 创建用户
      const user = await User.create(userData, { transaction });

      // 创建文章
      const post = await Post.create({
        ...postData,
        userId: user.id
      }, { transaction });

      await transaction.commit();
      return { user, post };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 原生 SQL 查询
  static async executeRawQuery(query, replacements = {}) {
    return await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });
  }
}

module.exports = UserService;
```

#### 1.5 Migration 迁移

```javascript
// migrations/20231201000001-create-users.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      avatar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'pending'),
        defaultValue: 'pending'
      },
      last_login_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // 创建索引
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['status']);
    await queryInterface.addIndex('users', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
```

#### 1.6 Seeders 种子数据

```javascript
// seeders/20231201000001-demo-users.js
'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'User',
        age: 30,
        status: 'active',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: hashedPassword,
        first_name: 'John',
        last_name: 'Doe',
        age: 25,
        status: 'active',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: hashedPassword,
        first_name: 'Jane',
        last_name: 'Smith',
        age: 28,
        status: 'pending',
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
```

#### 1.7 配置文件

```javascript
// config/database.js (Sequelize CLI 配置)
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    timezone: '+08:00',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + '_test',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  }
};
```

#### 1.8 使用 Sequelize 的路由示例

```javascript
// routes/sequelizeUsers.js
const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');
const { User } = require('../models');

// 获取用户列表（带分页和过滤）
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      ageMin,
      ageMax
    } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    if (ageMin) filters.ageMin = parseInt(ageMin);
    if (ageMax) filters.ageMax = parseInt(ageMax);

    const result = await UserService.findUsersWithPagination(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个用户（包含关联数据）
router.get('/:id', async (req, res) => {
  try {
    const user = await UserService.findUserById(
      req.params.id,
      req.query.include === 'true'
    );

    if (!user) {
      return res.status(404).json({ error: '用户未找到' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建用户
router.post('/', async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: '验证失败',
        details: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// 更新用户
router.put('/:id', async (req, res) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除用户
router.delete('/:id', async (req, res) => {
  try {
    const result = await UserService.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 批量创建用户
router.post('/bulk', async (req, res) => {
  try {
    const users = await UserService.bulkCreateUsers(req.body);
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取用户统计信息
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await UserService.getUserStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### 1.9 Sequelize CLI 常用命令

```bash
# 项目初始化
npx sequelize-cli init

# 模型和迁移管理
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

# 数据库迁移
npx sequelize-cli db:migrate                # 运行所有迁移
npx sequelize-cli db:migrate:undo          # 撤销最后一次迁移
npx sequelize-cli db:migrate:undo:all      # 撤销所有迁移

# 种子数据管理
npx sequelize-cli seed:generate --name demo-user  # 创建种子文件
npx sequelize-cli db:seed:all                     # 运行所有种子文件
npx sequelize-cli db:seed:undo                    # 撤销最后一次种子
npx sequelize-cli db:seed:undo:all               # 撤销所有种子

# 数据库管理
npx sequelize-cli db:create                # 创建数据库
npx sequelize-cli db:drop                  # 删除数据库
```

## MySQL 常用命令

### 1. 数据库操作

```sql
-- 显示所有数据库
SHOW DATABASES;

-- 创建数据库
CREATE DATABASE database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 删除数据库
DROP DATABASE database_name;

-- 使用数据库
USE database_name;

-- 查看当前数据库
SELECT DATABASE();
```

### 2. 表操作

```sql
-- 显示所有表
SHOW TABLES;

-- 查看表结构
DESC table_name;
DESCRIBE table_name;
SHOW CREATE TABLE table_name;

-- 创建表
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 修改表结构
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users DROP COLUMN phone;
ALTER TABLE users MODIFY COLUMN age TINYINT;
ALTER TABLE users CHANGE old_column new_column VARCHAR(50);

-- 删除表
DROP TABLE table_name;

-- 清空表数据
TRUNCATE TABLE table_name;
```

### 3. 索引操作

```sql
-- 创建索引
CREATE INDEX idx_email ON users(email);
CREATE UNIQUE INDEX idx_phone ON users(phone);
CREATE INDEX idx_name_age ON users(name, age);

-- 查看索引
SHOW INDEX FROM users;

-- 删除索引
DROP INDEX idx_email ON users;
```

### 4. 数据查询

```sql
-- 基本查询
SELECT * FROM users;
SELECT name, email FROM users;

-- 条件查询
SELECT * FROM users WHERE age > 18;
SELECT * FROM users WHERE name LIKE '%john%';
SELECT * FROM users WHERE age BETWEEN 18 AND 65;
SELECT * FROM users WHERE status IN ('active', 'pending');

-- 排序和限制
SELECT * FROM users ORDER BY created_at DESC;
SELECT * FROM users ORDER BY age ASC, name DESC;
SELECT * FROM users LIMIT 10;
SELECT * FROM users LIMIT 10 OFFSET 20;

-- 聚合查询
SELECT COUNT(*) FROM users;
SELECT AVG(age) FROM users;
SELECT MAX(age), MIN(age) FROM users;
SELECT status, COUNT(*) FROM users GROUP BY status;

-- 连接查询
SELECT u.name, p.title 
FROM users u 
INNER JOIN posts p ON u.id = p.user_id;

SELECT u.name, p.title 
FROM users u 
LEFT JOIN posts p ON u.id = p.user_id;
```

### 5. 数据操作

```sql
-- 插入数据
INSERT INTO users (name, email, age) VALUES ('John Doe', 'john@example.com', 25);

INSERT INTO users (name, email, age) VALUES 
    ('Alice', 'alice@example.com', 30),
    ('Bob', 'bob@example.com', 28);

-- 更新数据
UPDATE users SET age = 26 WHERE id = 1;
UPDATE users SET status = 'inactive' WHERE age < 18;

-- 删除数据
DELETE FROM users WHERE id = 1;
DELETE FROM users WHERE status = 'inactive';
```

### 6. 用户和权限

```sql
-- 创建用户
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';

-- 授权
GRANT ALL PRIVILEGES ON database_name.* TO 'username'@'localhost';
GRANT SELECT, INSERT, UPDATE ON table_name TO 'username'@'localhost';

-- 查看权限
SHOW GRANTS FOR 'username'@'localhost';

-- 撤销权限
REVOKE ALL PRIVILEGES ON database_name.* FROM 'username'@'localhost';

-- 删除用户
DROP USER 'username'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;
```

### 7. 备份和恢复

**备份操作：**
```bash
# 备份整个数据库
mysqldump -u username -p database_name > backup.sql

# 备份特定表
mysqldump -u username -p database_name table_name > table_backup.sql

# 仅备份数据库结构（不包含数据）
mysqldump -u username -p --no-data database_name > structure.sql

# 备份数据库并压缩
mysqldump -u username -p database_name | gzip > backup.sql.gz
```

**恢复操作：**
```bash
# 从备份文件恢复数据库
mysql -u username -p database_name < backup.sql

# 恢复压缩的备份文件
gunzip < backup.sql.gz | mysql -u username -p database_name
```

### 8. 性能分析

```sql
-- 查看执行计划
EXPLAIN SELECT * FROM users WHERE email = 'john@example.com';

-- 查看慢查询
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- 查看连接状态
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Connections';
SHOW STATUS LIKE 'Threads_connected';

-- 查看表状态
SHOW TABLE STATUS FROM database_name;
```

## 最佳实践

### 1. 安全实践

**防止 SQL 注入：**
```javascript
// ✅ 正确：使用参数化查询
const sql = 'SELECT * FROM users WHERE email = ? AND status = ?';
db.query(sql, [email, status], callback);

// ❌ 错误：直接拼接字符串
const sql = `SELECT * FROM users WHERE email = '${email}'`; // 危险！
```

**输入验证：**
```javascript
// 邮箱格式验证
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 密码强度验证
function validatePassword(password) {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /\d/.test(password);
}
```

**环境变量管理：**
```javascript
// 使用 dotenv 管理敏感信息
require('dotenv').config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};
```

### 2. 连接管理

**连接池配置：**
```javascript
// 创建连接池
const pool = mysql.createPool({
  connectionLimit: 10,      // 最大连接数
  queueLimit: 0,           // 等待队列限制
  acquireTimeout: 60000,   // 获取连接超时时间
  timeout: 60000,          // 查询超时时间
  reconnect: true          // 自动重连
});
```

**正确使用连接：**
```javascript
// ✅ 正确：使用完后释放连接
pool.getConnection((err, connection) => {
  if (err) throw err;
  
  connection.query('SELECT * FROM users', (error, results) => {
    connection.release(); // 重要：释放连接回池中
    
    if (error) throw error;
    console.log(results);
  });
});

// ✅ 更好：使用 Promise 版本
const connection = await pool.getConnection();
try {
  const [results] = await connection.execute('SELECT * FROM users');
  console.log(results);
} finally {
  connection.release(); // 确保连接被释放
}
```

### 3. 错误处理

**统一错误处理中间件：**
```javascript
// Express 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // MySQL 特定错误处理
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ 
      error: '数据已存在',
      field: extractDuplicateField(err.message)
    });
  }
  
  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({ error: '数据表不存在' });
  }
  
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({ error: '数据库连接失败' });
  }
  
  // 默认错误响应
  res.status(500).json({ error: '服务器内部错误' });
});

// 提取重复字段信息
function extractDuplicateField(message) {
  const match = message.match(/for key '(\w+)'/);
  return match ? match[1] : 'unknown';
}
```

### 4. 日志记录

**Winston 日志配置：**
```javascript
const winston = require('winston');

// 创建日志记录器
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mysql-app' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// 开发环境添加控制台输出
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

**数据库操作日志：**
```javascript
// 连接池事件监听
pool.on('connection', function (connection) {
  logger.info(`New database connection established: ${connection.threadId}`);
});

pool.on('error', function(err) {
  logger.error('Database pool error:', err);
});

// 查询日志记录
const originalQuery = pool.query;
pool.query = function(...args) {
  const start = Date.now();
  logger.info(`Executing query: ${args[0]}`);
  
  return originalQuery.call(this, ...args, function(err, results) {
    const duration = Date.now() - start;
    if (err) {
      logger.error(`Query failed (${duration}ms):`, err);
    } else {
      logger.info(`Query completed (${duration}ms)`);
    }
  });
};
```

## 错误处理

### 常见错误码及处理

```javascript
/**
 * MySQL 错误码处理函数
 * @param {Error} err - MySQL 错误对象
 * @returns {string} 用户友好的错误信息
 */
const handleDatabaseError = (err) => {
  const errorMap = {
    // 认证相关错误
    'ER_ACCESS_DENIED_ERROR': '数据库访问被拒绝，请检查用户名和密码',
    'ER_DBACCESS_DENIED_ERROR': '数据库访问权限不足',
    
    // 连接相关错误
    'ECONNREFUSED': '无法连接到数据库服务器，请检查服务器状态',
    'ETIMEDOUT': '数据库连接超时',
    'PROTOCOL_CONNECTION_LOST': '数据库连接丢失，正在尝试重连',
    
    // 数据库结构错误
    'ER_BAD_DB_ERROR': '指定的数据库不存在',
    'ER_NO_SUCH_TABLE': '数据表不存在',
    'ER_BAD_FIELD_ERROR': '字段不存在',
    
    // 数据完整性错误
    'ER_DUP_ENTRY': '数据重复，违反唯一性约束',
    'ER_NO_REFERENCED_ROW': '外键约束失败，引用的记录不存在',
    'ER_ROW_IS_REFERENCED': '无法删除，该记录被其他数据引用',
    
    // SQL 语法错误
    'ER_PARSE_ERROR': 'SQL 语法错误',
    'ER_SYNTAX_ERROR': 'SQL 语法错误',
    
    // 数据类型错误
    'ER_TRUNCATED_WRONG_VALUE': '数据类型转换错误',
    'ER_DATA_TOO_LONG': '数据长度超出字段限制',
    'ER_BAD_NULL_ERROR': '字段不能为空'
  };

  const message = errorMap[err.code] || `数据库操作失败: ${err.message}`;
  
  // 记录详细错误信息（用于调试）
  console.error(`Database Error [${err.code}]:`, err.message);
  
  return message;
};

// 使用示例
try {
  await db.query('SELECT * FROM users WHERE id = ?', [userId]);
} catch (error) {
  const userMessage = handleDatabaseError(error);
  res.status(500).json({ error: userMessage });
}
```

## 主应用文件 (app.js)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
```

## 快速命令参考

### 🚀 快速开始

```bash
# 1. 创建新项目
mkdir my-mysql-app && cd my-mysql-app
npm init -y

# 2. 安装依赖
npm install mysql2 express dotenv

# 3. 创建基本文件结构
mkdir config models routes
touch .env app.js config/database.js
```

### 📦 包管理命令

```bash
# MySQL 驱动
npm install mysql2                    # Promise 支持的 MySQL 驱动
npm install mysql                     # 传统 MySQL 驱动

# Web 框架
npm install express                   # Express.js 框架
npm install cors                      # 跨域支持

# 工具库
npm install dotenv                    # 环境变量管理
npm install bcrypt                    # 密码加密
npm install joi                       # 数据验证
npm install winston                   # 日志记录

# ORM 框架
npm install sequelize mysql2         # Sequelize ORM
npm install -D sequelize-cli          # Sequelize CLI 工具
```

### 🗄️ MySQL 常用命令

```sql
-- 数据库操作
SHOW DATABASES;                       -- 查看所有数据库
CREATE DATABASE db_name;              -- 创建数据库
USE db_name;                          -- 切换数据库
DROP DATABASE db_name;                -- 删除数据库

-- 表操作
SHOW TABLES;                          -- 查看所有表
DESC table_name;                      -- 查看表结构
SHOW CREATE TABLE table_name;         -- 查看建表语句

-- 用户管理
CREATE USER 'user'@'host' IDENTIFIED BY 'password';  -- 创建用户
GRANT ALL ON db.* TO 'user'@'host';                  -- 授权
FLUSH PRIVILEGES;                                    -- 刷新权限
```

### 🔧 Sequelize CLI 命令

```bash
# 项目初始化
npx sequelize-cli init

# 模型生成
npx sequelize-cli model:generate --name User --attributes name:string,email:string

# 迁移管理
npx sequelize-cli db:migrate          # 运行迁移
npx sequelize-cli db:migrate:undo     # 撤销迁移

# 种子数据
npx sequelize-cli db:seed:all         # 运行种子
npx sequelize-cli db:seed:undo:all    # 撤销种子
```

### 💾 备份与恢复

```bash
# 备份数据库
mysqldump -u user -p database > backup.sql

# 恢复数据库
mysql -u user -p database < backup.sql

# 压缩备份
mysqldump -u user -p database | gzip > backup.sql.gz

# 恢复压缩备份
gunzip < backup.sql.gz | mysql -u user -p database
```

### 🔍 调试命令

```sql
-- 性能分析
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- 查看连接
SHOW PROCESSLIST;

-- 查看状态
SHOW STATUS LIKE 'Threads_connected';
SHOW VARIABLES LIKE 'max_connections';

-- 慢查询
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';
```

### 📱 Node.js 快速代码片段

**基本连接：**
```javascript
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb'
});
```

**连接池：**
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb',
  connectionLimit: 10
});
```

**async/await 查询：**
```javascript
const mysql = require('mysql2/promise');
const pool = mysql.createPool(config);

// 查询示例
const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
```

---

## 参考资料

- [MySQL2 官方文档](https://github.com/sidorares/node-mysql2)
- [Sequelize 官方文档](https://sequelize.org/)
- [Node.js MySQL 教程](https://www.w3schools.com/nodejs/nodejs_mysql.asp)
- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [Express.js 官方文档](https://expressjs.com/)

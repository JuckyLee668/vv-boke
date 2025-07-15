const express = require('express');
const User = require('../models/User');

const app = express();
const port = 3000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
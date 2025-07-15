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
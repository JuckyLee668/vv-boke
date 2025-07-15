//createUser.js
const User = require('./models/User');

const newUser = {
  name: '李四',
  email: 'lisi@example.com',
  age: 21
};

User.create(newUser, (error, results) => {
  if (error) {
    console.error('创建用户失败:', error);
    return;
  }
  console.log('创建成功，用户ID:', results.insertId);
});
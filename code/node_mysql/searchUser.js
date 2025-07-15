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
# Node.js 全栈开发完整指南

## 目录
1. [开发环境准备](#开发环境准备)
2. [项目初始化](#项目初始化)
3. [数据库设计与管理](#数据库设计与管理)
4. [API 接口开发](#API接口开发)
5. [用户认证与权限管理](#用户认证与权限管理)
6. [高级功能实现](#高级功能实现)
7. [错误处理与日志](#错误处理与日志)
8. [项目部署](#项目部署)
9. [最佳实践](#最佳实践)

---

## 开发环境准备

### 必需软件
- **Node.js** ([Node.js — 在任何地方运行 JavaScript](https://nodejs.org/zh-cn))
- **Docker** ([Docker: Accelerated Container Application Development](https://www.docker.com/))
- **MySQL Workbench** ([MySQL :: MySQL Workbench](https://www.mysql.com/products/workbench/))
- **Navicat** ([Navicat | Free Download Navicat Premium Lite](https://www.navicat.com/en/download/navicat-premium-lite))
- **Apifox** ([Apifox - API 文档、调试、Mock、测试一体化协作平台](https://apifox.com/))

### 开发工具推荐
- **VS Code** - 代码编辑器
- **Git** - 版本控制
- **Postman/Apifox** - API 测试
- **DBeaver** - 数据库管理（可选）

---

## 项目初始化

### 安装 Express 脚手架
```bash
npm i -g express-generator@4
```

### 创建项目
```bash
# 创建项目
express --no-view clwy-api 

# Windows PowerShell 执行策略问题解决
# 如果遇到错误：express : 无法加载文件 C:\Program Files\nodejs\express.ps1
# 用管理员身份打开 PowerShell，运行：
Set-ExecutionPolicy RemoteSigned

# 进入项目目录
cd clwy-api 

# 安装依赖
npm install
```

### 项目结构
```
clwy-api/
├── bin/
│   └── www              # 启动文件
├── public/              # 静态资源
├── routes/              # 路由文件
├── views/               # 视图文件（如果有）
├── app.js               # 应用主文件
├── package.json         # 项目配置文件
└── config/              # 配置文件目录
    ├── config.json      # Sequelize 配置
    └── database.js      # 数据库配置
```

### 安装开发依赖
```bash
# 开发时热重载
npm i nodemon

# ORM 工具
npm i -g sequelize-cli
npm i sequelize mysql2

# 身份验证
npm i jsonwebtoken bcryptjs

# 环境变量
npm i dotenv

# 跨域处理
npm i cors

# 错误处理
npm i http-errors

# 日志记录
npm i morgan winston winston-daily-rotate-file

# 数据验证
npm i joi express-validator

# 文件上传
npm i multer

# Redis 缓存
npm i redis

# 安全相关
npm i helmet express-rate-limit

# 工具类
npm i lodash moment

# API 文档生成
npm i swagger-jsdoc swagger-ui-express

# 测试相关（开发依赖）
npm i -D jest supertest nodemon

# 代码质量工具（开发依赖）
npm i -D eslint prettier husky lint-staged

# 性能监控
npm i response-time compression

# 进程管理
npm i -g pm2
```

### 修改 package.json 启动脚本
```json
{
  "scripts": {
    "start": "nodemon ./bin/www",
    "dev": "nodemon ./bin/www",
    "prod": "node ./bin/www"
  }
}
```

### Docker 配置
创建 `docker-compose.yml` 文件：
```yml
version: '3.8'
services:
  mysql:
    image: mysql:8.3.0
    command:
      --default-authentication-plugin=mysql_native_password
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
    environment:
      - MYSQL_ROOT_PASSWORD=clwy1234
      - MYSQL_LOWER_CASE_TABLE_NAMES=0
    ports:
      - "3306:3306"
    volumes:
      - ./data/mysql:/var/lib/mysql
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - ./data/redis:/data
    restart: unless-stopped
```

---

## 数据库设计与管理

### Sequelize ORM 初始化
```bash
# 初始化 Sequelize
sequelize init
```

这将创建以下目录结构：
- `config/` - 数据库配置文件
- `models/` - 数据模型文件
- `migrations/` - 数据库迁移文件
- `seeders/` - 数据种子文件

### 配置数据库连接
修改 `config/config.json`：
```json
{
  "development": {
    "username": "root",
    "password": "clwy1234",
    "database": "clwy_api_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00",
    "define": {
      "timestamps": true,
      "underscored": false,
      "charset": "utf8mb4",
      "collate": "utf8mb4_general_ci"
    }
  },
  "test": {
    "username": "root",
    "password": "clwy1234",
    "database": "clwy_api_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "clwy1234",
    "database": "clwy_api_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

### 创建数据库
```bash
sequelize db:create
```

### 数据模型设计
使用 https://dbdiagram.io/ 进行可视化建模

#### 核心模型创建
```bash
# 文章模型
sequelize model:generate --name Article --attributes title:string,content:text

# 分类模型
sequelize model:generate --name Category --attributes name:string,rank:integer

# 用户模型
sequelize model:generate --name User --attributes email:string,username:string,password:string,nickname:string,sex:tinyint,company:string,introduce:TEXT,role:tinyint

# 课程模型
sequelize model:generate --name Course --attributes categoryId:integer,userId:integer,name:string,image:string,recommended:boolean,introductory:boolean,content:text,likesCount:integer,chaptersCount:integer

# 章节模型
sequelize model:generate --name Chapter --attributes courseId:integer,title:string,content:text,video:string,rank:integer

# 点赞模型
sequelize model:generate --name Like --attributes courseId:integer,userId:integer

# 系统设置模型
sequelize model:generate --name Setting --attributes name:string,icp:string,copyright:string
```

#### 数据表关联关系

**User 模型关联配置**：
```javascript
// models/user.js
static associate(models) {
  // 一个用户可以有多个课程
  models.User.hasMany(models.Course, { 
    as: 'courses', 
    foreignKey: 'userId' 
  });
  
  // 一个用户可以有多个点赞
  models.User.hasMany(models.Like, { 
    as: 'likes', 
    foreignKey: 'userId' 
  });
}
```

**Course 模型关联配置**：
```javascript
// models/course.js
static associate(models) {
  // 课程属于某个分类
  models.Course.belongsTo(models.Category, {
    foreignKey: 'categoryId',
    as: 'category'
  });
  
  // 课程属于某个用户
  models.Course.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  // 一个课程可以有多个章节
  models.Course.hasMany(models.Chapter, {
    as: 'chapters',
    foreignKey: 'courseId'
  });
  
  // 一个课程可以被多个用户点赞
  models.Course.hasMany(models.Like, {
    as: 'likes',
    foreignKey: 'courseId'
  });
}
```

### 数据库迁移
```bash
# 执行迁移
sequelize db:migrate

# 回滚迁移
sequelize db:migrate:undo

# 回滚指定迁移
sequelize db:migrate:undo --name 20241229061856-create-setting.js
```

### 添加额外字段
```bash
# 创建迁移文件
sequelize migration:create --name add-avatar-to-user

# 执行迁移
sequelize db:migrate
```

### 数据种子文件
```bash
# 创建种子文件
sequelize seed:generate --name demo-users

# 运行种子文件
sequelize db:seed:all

# 运行指定种子文件
sequelize db:seed --seed 20241229120348-demo-users
```

#### 示例种子文件
```javascript
// seeders/xxx-demo-articles.js
module.exports = {
  async up(queryInterface, Sequelize) {
    const articles = [];
    const counts = 100;

    for (let i = 1; i <= counts; i++) {
      const article = {
        title: `文章的标题 ${i}`,
        content: `文章的内容 ${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      articles.push(article);
    }

    await queryInterface.bulkInsert('Articles', articles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Articles', null, {});
  }
};
```

---

## API 接口开发

### 统一响应处理
创建 `utils/response.js`：
```javascript
const logger = require('./logger');

/**
 * 成功响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 响应消息
 * @param {*} data - 响应数据
 * @param {number} status - HTTP状态码
 */
function success(res, message, data = null, status = 200) {
    const response = {
        status: true,
        message: message || '操作成功',
        data: data,
        timestamp: new Date().toISOString()
    };
    
    // 记录成功日志
    logger.info(`API Success: ${res.req.method} ${res.req.originalUrl}`, {
        statusCode: status,
        message: response.message
    });
    
    return res.status(status).json(response);
}

/**
 * 失败响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @param {Array|Error} errors - 错误详情
 * @param {number} status - HTTP状态码
 */
function failure(res, message, errors = [], status = 400) {
    // 处理不同类型的错误
    let errorArray = [];
    
    if (errors instanceof Error) {
        errorArray = [errors.message];
    } else if (Array.isArray(errors)) {
        errorArray = errors;
    } else if (typeof errors === 'string') {
        errorArray = [errors];
    } else if (errors && typeof errors === 'object') {
        errorArray = [JSON.stringify(errors)];
    }
    
    const response = {
        status: false,
        message: message || '操作失败',
        errors: errorArray,
        timestamp: new Date().toISOString()
    };
    
    // 记录错误日志
    logger.error(`API Error: ${res.req.method} ${res.req.originalUrl}`, {
        statusCode: status,
        message: response.message,
        errors: errorArray,
        userAgent: res.req.get('User-Agent'),
        ip: res.req.ip
    });
    
    return res.status(status).json(response);
}

/**
 * 分页响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 响应消息
 * @param {Array} items - 数据列表
 * @param {number} total - 总数
 * @param {number} currentPage - 当前页
 * @param {number} pageSize - 每页大小
 */
function paginated(res, message, items, total, currentPage, pageSize) {
    const totalPages = Math.ceil(total / pageSize);
    
    return success(res, message, {
        items,
        pagination: {
            total,
            currentPage,
            pageSize,
            totalPages,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1
        }
    });
}

module.exports = { success, failure, paginated };
```

### 基础 CRUD 接口

#### 文章接口示例
```javascript
// routes/admin/articles.js
const express = require('express');
const router = express.Router();
const { Article } = require('../../models');
const { success, failure, paginated } = require('../../utils/response');
const { Op } = require('sequelize');
const { body, param, query, validationResult } = require('express-validator');

// 输入验证规则
const validateArticleCreate = [
    body('title')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('标题长度必须在2-255个字符之间')
        .notEmpty()
        .withMessage('标题不能为空'),
    body('content')
        .trim()
        .isLength({ min: 10 })
        .withMessage('内容至少需要10个字符')
        .notEmpty()
        .withMessage('内容不能为空')
];

const validateArticleUpdate = [
    param('id').isInt({ min: 1 }).withMessage('文章ID必须是正整数'),
    ...validateArticleCreate
];

const validatePagination = [
    query('currentPage').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('每页大小必须在1-100之间'),
    query('title').optional().trim().isLength({ max: 100 }).withMessage('搜索标题不能超过100个字符')
];

// 处理验证错误的中间件
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return failure(res, '输入验证失败', errorMessages, 422);
    }
    next();
};

// 列表查询（支持分页和搜索）
router.get('/', validatePagination, handleValidationErrors, async (req, res) => {
    try {
        const title = req.query.title || '';
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 100); // 限制最大页面大小
        const offset = (currentPage - 1) * pageSize;
        
        const condition = {
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset,
            attributes: { exclude: ['createdAt', 'updatedAt'] } // 排除不必要的字段
        };
        
        if (title) {
            condition.where = {
                title: {
                    [Op.like]: `%${title}%`
                }
            };
        }
        
        const result = await Article.findAndCountAll(condition);
        
        return paginated(res, '数据查询成功', result.rows, result.count, currentPage, pageSize);
    } catch (error) {
        return failure(res, '数据查询失败', [error.message], 500);
    }
});

// 详情查询
router.get('/:id', 
    param('id').isInt({ min: 1 }).withMessage('文章ID必须是正整数'),
    handleValidationErrors,
    async (req, res) => {
        try {
            const article = await Article.findByPk(req.params.id, {
                attributes: { exclude: ['updatedAt'] }
            });
            
            if (!article) {
                return failure(res, '文章不存在', ['找不到指定的文章'], 404);
            }
            
            return success(res, '数据查询成功', article);
        } catch (error) {
            return failure(res, '数据查询失败', [error.message], 500);
        }
    }
);

// 创建文章
router.post('/', validateArticleCreate, handleValidationErrors, async (req, res) => {
    try {
        // 白名单过滤和数据清洗
        const body = filterAndSanitizeBody(req, ['title', 'content']);
        
        // 检查标题是否重复
        const existingArticle = await Article.findOne({
            where: { title: body.title }
        });
        
        if (existingArticle) {
            return failure(res, '创建失败', ['标题已存在'], 409);
        }
        
        const article = await Article.create(body);
        return success(res, '文章创建成功', article, 201);
    } catch (error) {
        // 处理 Sequelize 验证错误
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => err.message);
            return failure(res, '数据验证失败', validationErrors, 422);
        }
        
        return failure(res, '文章创建失败', [error.message], 500);
    }
});

// 更新文章
router.put('/:id', validateArticleUpdate, handleValidationErrors, async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        
        if (!article) {
            return failure(res, '文章不存在', ['找不到指定的文章'], 404);
        }
        
        const body = filterAndSanitizeBody(req, ['title', 'content']);
        
        // 检查标题重复（排除当前文章）
        if (body.title && body.title !== article.title) {
            const existingArticle = await Article.findOne({
                where: { 
                    title: body.title,
                    id: { [Op.ne]: req.params.id }
                }
            });
            
            if (existingArticle) {
                return failure(res, '更新失败', ['标题已存在'], 409);
            }
        }
        
        await article.update(body);
        return success(res, '文章更新成功', article);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => err.message);
            return failure(res, '数据验证失败', validationErrors, 422);
        }
        
        return failure(res, '文章更新失败', [error.message], 500);
    }
});

// 删除文章
router.delete('/:id', 
    param('id').isInt({ min: 1 }).withMessage('文章ID必须是正整数'),
    handleValidationErrors,
    async (req, res) => {
        try {
            const article = await Article.findByPk(req.params.id);
            
            if (!article) {
                return failure(res, '文章不存在', ['找不到指定的文章'], 404);
            }
            
            await article.destroy();
            return success(res, '文章删除成功');
        } catch (error) {
            return failure(res, '文章删除失败', [error.message], 500);
        }
    }
);

// 批量删除文章
router.delete('/', 
    body('ids').isArray({ min: 1 }).withMessage('必须提供文章ID数组'),
    body('ids.*').isInt({ min: 1 }).withMessage('所有ID必须是正整数'),
    handleValidationErrors,
    async (req, res) => {
        try {
            const { ids } = req.body;
            
            const deletedCount = await Article.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            
            return success(res, `成功删除${deletedCount}篇文章`, { deletedCount });
        } catch (error) {
            return failure(res, '批量删除失败', [error.message], 500);
        }
    }
);

/**
 * 白名单过滤和数据清洗函数
 * @param {Object} req - 请求对象
 * @param {Array} allowedFields - 允许的字段
 * @returns {Object} - 过滤后的数据
 */
function filterAndSanitizeBody(req, allowedFields) {
    const body = {};
    
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            let value = req.body[field];
            
            // 字符串类型的数据清洗
            if (typeof value === 'string') {
                value = value.trim();
                // 移除潜在的XSS字符
                value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            }
            
            body[field] = value;
        }
    });
    
    return body;
}

module.exports = router;
```

### 关联查询接口

#### 带关联的课程查询
```javascript
// routes/admin/courses.js
const { Course, Category, User } = require('../../models');

// 获取查询条件（包含关联）
const getCondition = () => {
    return {
        attributes: { exclude: ['CategoryId', 'UserId'] },
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'rank']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
            }
        ]
    };
};

router.get('/', async (req, res) => {
    try {
        const condition = getCondition();
        const courses = await Course.findAll(condition);
        success(res, '数据查询成功', courses);
    } catch (error) {
        failure(res, '数据查询失败', [error.message], 500);
    }
});
```

### 数据验证
使用 Sequelize 模型验证：
```javascript
// models/article.js
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '标题必须存在'
        },
        notEmpty: {
          msg: '标题不能为空'
        },
        len: {
          args: [2, 255],
          msg: '标题的长度必须在2到255个字符之间'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '内容必须存在'
        },
        notEmpty: {
          msg: '内容不能为空'
        }
      }
    }
  }, {});
  
  Article.associate = function(models) {
    // 关联关系定义
  };
  
  return Article;
};
```

---

## 用户认证与权限管理

### 密码加密
```javascript
// models/user.js
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: '请输入有效的邮箱地址'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 20],
          msg: '用户名长度必须在3-20个字符之间'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        if (value.length >= 8 && value.length <= 45) {
          this.setDataValue('password', bcrypt.hashSync(value, 10));
        } else {
          throw new Error('密码长度必须在8-45位之间');
        }
      }
    },
    role: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      comment: '0-普通用户, 99-管理员'
    }
  }, {});
  
  return User;
};
```

### JWT Token 生成
```javascript
// utils/jwt.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// 生成随机密钥
function generateSecret() {
    return crypto.randomBytes(32).toString('hex');
}

// 生成 Token
function generateToken(payload, expiresIn = '2h') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

// 验证 Token
function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token 无效');
    }
}

module.exports = {
    generateSecret,
    generateToken,
    verifyToken
};
```

### 用户登录接口
```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User } = require('../models');
const { success, failure } = require('../utils/response');
const { generateToken } = require('../utils/jwt');

router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        
        // 输入验证
        if (!login) {
            return failure(res, '请输入用户名或邮箱', [], 400);
        }
        if (!password) {
            return failure(res, '请输入密码', [], 400);
        }
        
        // 查找用户
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: login },
                    { email: login }
                ]
            }
        });
        
        if (!user) {
            return failure(res, '用户不存在', [], 404);
        }
        
        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return failure(res, '密码错误', [], 401);
        }
        
        // 生成 Token
        const token = generateToken({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });
        
        success(res, '登录成功', {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        failure(res, '登录失败', [error.message], 500);
    }
});

module.exports = router;
```

### 权限中间件
```javascript
// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { failure } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * 从请求中提取 Token
 * @param {Object} req - 请求对象
 * @returns {string|null} - Token 或 null
 */
const extractToken = (req) => {
    let token = null;
    
    // 从 Authorization header 中提取
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.slice(7);
    }
    // 从自定义 token header 中提取
    else if (req.headers.token) {
        token = req.headers.token;
    }
    // 从 cookie 中提取（如果使用）
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    
    return token;
};

/**
 * 验证登录中间件
 */
const authenticate = async (req, res, next) => {
    try {
        const token = extractToken(req);
        
        if (!token) {
            logger.warn('Authentication failed: No token provided', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                path: req.path
            });
            
            return failure(res, '认证失败', ['请提供认证令牌'], 401);
        }
        
        // 验证 Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 检查 Token 是否包含必要字段
        if (!decoded.id || !decoded.username || decoded.role === undefined) {
            logger.warn('Authentication failed: Invalid token payload', {
                tokenPayload: decoded,
                ip: req.ip
            });
            
            return failure(res, '认证失败', ['令牌格式无效'], 401);
        }
        
        // 可选：验证用户是否仍然存在且活跃
        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'username', 'email', 'role', 'status']
        });
        
        if (!user) {
            logger.warn('Authentication failed: User not found', {
                userId: decoded.id,
                ip: req.ip
            });
            
            return failure(res, '认证失败', ['用户不存在'], 401);
        }
        
        // 检查用户状态（如果有状态字段）
        if (user.status === 'inactive' || user.status === 'banned') {
            logger.warn('Authentication failed: User inactive', {
                userId: decoded.id,
                status: user.status,
                ip: req.ip
            });
            
            return failure(res, '认证失败', ['账户已被禁用'], 403);
        }
        
        // 将用户信息添加到请求对象
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        
        next();
    } catch (error) {
        let errorMessage = '认证令牌无效';
        
        if (error.name === 'TokenExpiredError') {
            errorMessage = '认证令牌已过期';
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = '认证令牌格式错误';
        }
        
        logger.warn('Authentication failed', {
            error: error.message,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            path: req.path
        });
        
        return failure(res, '认证失败', [errorMessage], 401);
    }
};

/**
 * 验证管理员权限中间件
 */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return failure(res, '权限验证失败', ['用户信息不存在'], 500);
    }
    
    if (req.user.role !== 99) {
        logger.warn('Admin access denied', {
            userId: req.user.id,
            username: req.user.username,
            userRole: req.user.role,
            path: req.path,
            ip: req.ip
        });
        
        return failure(res, '权限不足', ['需要管理员权限'], 403);
    }
    
    next();
};

/**
 * 验证特定角色权限
 * @param {Array} allowedRoles - 允许的角色数组
 */
const requireRoles = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return failure(res, '权限验证失败', ['用户信息不存在'], 500);
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            logger.warn('Role access denied', {
                userId: req.user.id,
                username: req.user.username,
                userRole: req.user.role,
                requiredRoles: allowedRoles,
                path: req.path,
                ip: req.ip
            });
            
            return failure(res, '权限不足', ['角色权限不足'], 403);
        }
        
        next();
    };
};

/**
 * 验证资源所有者权限
 * @param {string} resourceKey - 资源ID字段名
 * @param {string} location - ID位置 ('body', 'params', 'query')
 */
const requireOwnership = (resourceKey = 'userId', location = 'body') => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return failure(res, '权限验证失败', ['用户信息不存在'], 500);
            }
            
            // 管理员可以访问所有资源
            if (req.user.role === 99) {
                return next();
            }
            
            // 获取资源所有者ID
            let resourceOwnerId;
            switch (location) {
                case 'params':
                    resourceOwnerId = req.params[resourceKey];
                    break;
                case 'query':
                    resourceOwnerId = req.query[resourceKey];
                    break;
                case 'body':
                default:
                    resourceOwnerId = req.body[resourceKey];
                    break;
            }
            
            // 检查资源所有权
            if (resourceOwnerId && parseInt(resourceOwnerId) !== parseInt(req.user.id)) {
                logger.warn('Ownership access denied', {
                    userId: req.user.id,
                    username: req.user.username,
                    resourceOwnerId,
                    resourceKey,
                    path: req.path,
                    ip: req.ip
                });
                
                return failure(res, '权限不足', ['无权限访问此资源'], 403);
            }
            
            next();
        } catch (error) {
            logger.error('Ownership verification error', {
                error: error.message,
                userId: req.user?.id,
                path: req.path
            });
            
            return failure(res, '权限验证失败', ['权限验证过程中发生错误'], 500);
        }
    };
};

/**
 * 可选认证中间件（不强制要求登录）
 */
const optionalAuth = async (req, res, next) => {
    try {
        const token = extractToken(req);
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (decoded.id && decoded.username && decoded.role !== undefined) {
                const user = await User.findByPk(decoded.id, {
                    attributes: ['id', 'username', 'email', 'role']
                });
                
                if (user && user.status !== 'inactive' && user.status !== 'banned') {
                    req.user = {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    };
                }
            }
        }
        
        next();
    } catch (error) {
        // 可选认证失败时不阻止请求继续
        next();
    }
};

module.exports = {
    authenticate,
    requireAdmin,
    requireRoles,
    requireOwnership,
    optionalAuth,
    extractToken
};
```

### 在路由中使用中间件
```javascript
// app.js - 完整的应用配置示例
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const responseTime = require('response-time');

// 导入工具和中间件
const logger = require('./utils/logger');
const { errorHandler } = require('./utils/errors');
const { securityMiddleware, limiter } = require('./middlewares/security');
const authMiddleware = require('./middlewares/auth');

// 导入路由
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminUsersRouter = require('./routes/admin/users');
const adminSettingsRouter = require('./routes/admin/settings');
const statsRouter = require('./routes/stats');

const app = express();

// 信任代理（如果使用 Nginx 等反向代理）
app.set('trust proxy', 1);

// 基础中间件
app.use(helmet()); // 安全头
app.use(compression()); // 压缩响应
app.use(responseTime()); // 响应时间记录

// CORS 配置
const corsOptions = {
    origin: process.env.CORS_ORIGIN ? 
        process.env.CORS_ORIGIN.split(',') : 
        ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 请求解析中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 请求日志中间件
app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.logRequest(req, res, duration);
    });
    
    next();
});

// API 限流
app.use('/api', limiter);

// 路由配置
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/stats', statsRouter);

// 管理员路由（需要认证）
app.use('/admin', authMiddleware.authenticate);
app.use('/admin', authMiddleware.requireAdmin);
app.use('/admin/articles', adminArticlesRouter);
app.use('/admin/categories', adminCategoriesRouter);
app.use('/admin/users', adminUsersRouter);
app.use('/admin/settings', adminSettingsRouter);

// API 文档路由（开发环境）
if (process.env.NODE_ENV !== 'production') {
    const swaggerJsdoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');
    
    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'CLWY API',
                version: '1.0.0',
                description: 'CLWY 项目 API 文档'
            },
            servers: [
                {
                    url: `http://localhost:${process.env.PORT || 3000}`,
                    description: '开发服务器'
                }
            ]
        },
        apis: ['./routes/*.js', './routes/**/*.js']
    };
    
    const specs = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.APP_VERSION || '1.0.0'
    });
});

// 404 处理
app.use((req, res, next) => {
    const error = new Error(`未找到路由: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

// 全局错误处理中间件
app.use(errorHandler);

// 优雅关闭处理
process.on('SIGTERM', () => {
    logger.info('收到 SIGTERM 信号，正在关闭服务器...');
    // 这里可以添加清理逻辑，如关闭数据库连接等
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('收到 SIGINT 信号，正在关闭服务器...');
    process.exit(0);
});

// 未捕获异常处理
process.on('uncaughtException', (err) => {
    logger.error('未捕获的异常:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('未处理的 Promise 拒绝:', { reason, promise });
    process.exit(1);
});

module.exports = app;
```

### 路由中使用认证中间件示例
```javascript
// routes/admin/articles.js 中使用认证
const { authenticate, requireAdmin } = require('../../middlewares/auth');

// 应用到所有路由
router.use(authenticate);
router.use(requireAdmin);

// 或者应用到特定路由
router.get('/', authenticate, requireAdmin, async (req, res) => {
    // 路由处理逻辑
});
```

---

## 高级功能实现

### 数据统计接口
```javascript
// routes/stats.js
const express = require('express');
const router = express.Router();
const { User, Course, sequelize } = require('../models');
const { success, failure } = require('../utils/response');

// 用户性别统计
router.get('/gender', async (req, res) => {
    try {
        const stats = await User.findAll({
            attributes: [
                'sex',
                [sequelize.fn('COUNT', '*'), 'count']
            ],
            group: ['sex']
        });
        
        const data = stats.map(item => ({
            name: ['女', '男', '未知'][item.sex] || '未知',
            value: parseInt(item.dataValues.count)
        }));
        
        success(res, '数据查询成功', data);
    } catch (error) {
        failure(res, '数据查询失败', [error.message], 500);
    }
});

// 月度注册统计
router.get('/monthly-users', async (req, res) => {
    try {
        const data = await sequelize.query(
            `SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS value
             FROM Users
             WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
             GROUP BY month
             ORDER BY month ASC`,
            { type: sequelize.QueryTypes.SELECT }
        );
        
        success(res, '数据查询成功', data);
    } catch (error) {
        failure(res, '数据查询失败', [error.message], 500);
    }
});

module.exports = router;
```

### 文件上传处理
```javascript
// utils/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// 配置存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../public/uploads');
        ensureDir(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueName + ext);
    }
});

// 文件过滤
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('文件类型不支持'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

module.exports = upload;
```

### 缓存实现
```javascript
// utils/cache.js
const redis = require('redis');
const logger = require('./logger');

// 创建 Redis 客户端
const createRedisClient = () => {
    const client = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: process.env.REDIS_DB || 0,
        retry_strategy: (options) => {
            // 重连策略
            if (options.error && options.error.code === 'ECONNREFUSED') {
                logger.error('Redis服务器拒绝连接');
                return new Error('Redis服务器拒绝连接');
            }
            if (options.total_retry_time > 1000 * 60 * 60) {
                logger.error('Redis重连超时');
                return new Error('重连超时');
            }
            if (options.attempt > 10) {
                logger.error('Redis重连次数超限');
                return undefined;
            }
            // 重连间隔：min(attempt * 100, 3000)ms
            return Math.min(options.attempt * 100, 3000);
        }
    });

    client.on('connect', () => {
        logger.info('Redis客户端连接成功');
    });

    client.on('error', (err) => {
        logger.error('Redis连接错误:', err);
    });

    client.on('end', () => {
        logger.warn('Redis连接已断开');
    });

    return client;
};

const client = createRedisClient();

/**
 * 缓存中间件
 * @param {number} duration - 缓存时间（秒）
 * @param {string} keyPrefix - 缓存键前缀
 * @param {function} keyGenerator - 自定义键生成函数
 */
const cache = (duration = 300, keyPrefix = 'cache', keyGenerator = null) => {
    return async (req, res, next) => {
        // 只缓存 GET 请求
        if (req.method !== 'GET') {
            return next();
        }

        try {
            // 生成缓存键
            let cacheKey;
            if (keyGenerator && typeof keyGenerator === 'function') {
                cacheKey = keyGenerator(req);
            } else {
                // 默认键生成策略
                const queryString = Object.keys(req.query).length > 0 
                    ? `?${new URLSearchParams(req.query).toString()}` 
                    : '';
                cacheKey = `${keyPrefix}:${req.path}${queryString}`;
            }

            // 尝试从缓存获取数据
            const cachedData = await client.get(cacheKey);
            
            if (cachedData) {
                logger.info(`缓存命中: ${cacheKey}`);
                const parsedData = JSON.parse(cachedData);
                
                // 添加缓存标识头
                res.set('X-Cache', 'HIT');
                res.set('X-Cache-Key', cacheKey);
                
                return res.json(parsedData);
            }

            // 缓存未命中，继续处理请求
            logger.debug(`缓存未命中: ${cacheKey}`);
            res.set('X-Cache', 'MISS');
            
            // 重写 res.json 方法以存储响应到缓存
            const originalJson = res.json;
            res.json = function(body) {
                // 只缓存成功的响应
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    client.setex(cacheKey, duration, JSON.stringify(body))
                        .then(() => {
                            logger.debug(`数据已缓存: ${cacheKey}, 过期时间: ${duration}秒`);
                        })
                        .catch((err) => {
                            logger.error('缓存存储失败:', err);
                        });
                }
                
                // 调用原始的 json 方法
                return originalJson.call(this, body);
            };

            next();
        } catch (error) {
            logger.error('缓存中间件错误:', error);
            // 缓存错误不应该影响正常请求
            next();
        }
    };
};

/**
 * 清除指定模式的缓存
 * @param {string} pattern - 缓存键模式
 */
const clearCache = async (pattern) => {
    try {
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
            await client.del(...keys);
            logger.info(`已清除 ${keys.length} 个缓存项, 模式: ${pattern}`);
            return keys.length;
        }
        return 0;
    } catch (error) {
        logger.error('清除缓存失败:', error);
        throw error;
    }
};

/**
 * 设置缓存
 * @param {string} key - 缓存键
 * @param {*} value - 缓存值
 * @param {number} duration - 过期时间（秒）
 */
const setCache = async (key, value, duration = 300) => {
    try {
        const serializedValue = JSON.stringify(value);
        await client.setex(key, duration, serializedValue);
        logger.debug(`缓存已设置: ${key}, 过期时间: ${duration}秒`);
    } catch (error) {
        logger.error('设置缓存失败:', error);
        throw error;
    }
};

/**
 * 获取缓存
 * @param {string} key - 缓存键
 */
const getCache = async (key) => {
    try {
        const cachedData = await client.get(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        return null;
    } catch (error) {
        logger.error('获取缓存失败:', error);
        return null;
    }
};

/**
 * 删除缓存
 * @param {string} key - 缓存键
 */
const deleteCache = async (key) => {
    try {
        const result = await client.del(key);
        logger.debug(`缓存已删除: ${key}`);
        return result;
    } catch (error) {
        logger.error('删除缓存失败:', error);
        throw error;
    }
};

/**
 * 获取缓存统计信息
 */
const getCacheStats = async () => {
    try {
        const info = await client.info('memory');
        const keyspace = await client.info('keyspace');
        
        return {
            memory: info,
            keyspace: keyspace,
            connected: client.connected
        };
    } catch (error) {
        logger.error('获取缓存统计失败:', error);
        return null;
    }
};

// 优雅关闭
process.on('SIGINT', () => {
    client.quit(() => {
        logger.info('Redis连接已关闭');
        process.exit(0);
    });
});

module.exports = { 
    client, 
    cache, 
    clearCache, 
    setCache, 
    getCache, 
    deleteCache, 
    getCacheStats 
};
```

---

## 错误处理与日志

### HTTP 错误处理
```javascript
// utils/errors.js
const createError = require('http-errors');

// 自定义错误类
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    
    // Sequelize 验证错误
    if (err.name === 'SequelizeValidationError') {
        const message = err.errors.map(val => val.message).join(', ');
        error = new AppError(message, 400);
    }
    
    // Sequelize 唯一约束错误
    if (err.name === 'SequelizeUniqueConstraintError') {
        const message = '资源已存在';
        error = new AppError(message, 400);
    }
    
    // JWT 错误
    if (err.name === 'JsonWebTokenError') {
        const message = 'Token 无效';
        error = new AppError(message, 401);
    }
    
    res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || '服务器内部错误',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = { AppError, errorHandler };
```

### 日志系统
```javascript
// utils/logger.js
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// 确保日志目录存在
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// 自定义日志格式
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        const logEntry = {
            timestamp,
            level: level.toUpperCase(),
            message,
            ...(stack && { stack }),
            ...(Object.keys(meta).length && { meta })
        };
        return JSON.stringify(logEntry);
    })
);

// 开发环境格式
const devFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
        format: 'HH:mm:ss'
    }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level}] ${message}`;
        
        if (Object.keys(meta).length) {
            log += '\n' + JSON.stringify(meta, null, 2);
        }
        
        if (stack) {
            log += '\n' + stack;
        }
        
        return log;
    })
);

// 日志轮转配置
const rotateOptions = {
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    tailable: true,
    zippedArchive: true
};

// 创建 logger 实例
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { 
        service: process.env.APP_NAME || 'clwy-api',
        version: process.env.APP_VERSION || '1.0.0'
    },
    transports: [
        // 错误日志文件
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            ...rotateOptions
        }),
        
        // 警告日志文件
        new winston.transports.File({
            filename: path.join(logDir, 'warn.log'),
            level: 'warn',
            ...rotateOptions
        }),
        
        // 所有日志文件
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            ...rotateOptions
        }),
        
        // HTTP 访问日志
        new winston.transports.File({
            filename: path.join(logDir, 'access.log'),
            level: 'http',
            ...rotateOptions
        })
    ],
    
    // 异常处理
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'exceptions.log'),
            ...rotateOptions
        })
    ],
    
    // Promise rejection 处理
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'rejections.log'),
            ...rotateOptions
        })
    ]
});

// 开发环境添加控制台输出
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: devFormat
    }));
}

// 扩展 logger 功能
logger.logRequest = (req, res, duration) => {
    const logData = {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        contentLength: res.get('Content-Length'),
        userId: req.user?.id || 'anonymous'
    };
    
    if (res.statusCode >= 400) {
        logger.warn('HTTP Request Error', logData);
    } else {
        logger.http('HTTP Request', logData);
    }
};

logger.logApiCall = (endpoint, params, userId, duration) => {
    logger.info('API Call', {
        endpoint,
        params: JSON.stringify(params),
        userId,
        duration: `${duration}ms`
    });
};

logger.logDatabaseQuery = (query, duration, error = null) => {
    const logData = {
        query: query.substring(0, 200), // 截取前200个字符
        duration: `${duration}ms`
    };
    
    if (error) {
        logger.error('Database Query Error', { ...logData, error: error.message });
    } else if (duration > 1000) {
        logger.warn('Slow Database Query', logData);
    } else {
        logger.debug('Database Query', logData);
    }
};

logger.logSecurity = (event, details) => {
    logger.warn('Security Event', {
        event,
        ...details,
        timestamp: new Date().toISOString()
    });
};

// 性能监控
logger.performance = {
    start: (label) => {
        console.time(label);
    },
    
    end: (label, context = {}) => {
        console.timeEnd(label);
        logger.info(`Performance: ${label}`, context);
    }
};

// 清理旧日志文件（可选）
const cleanOldLogs = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    fs.readdir(logDir, (err, files) => {
        if (err) return;
        
        files.forEach(file => {
            const filePath = path.join(logDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;
                
                if (stats.mtime < thirtyDaysAgo) {
                    fs.unlink(filePath, (err) => {
                        if (!err) {
                            logger.info(`已删除旧日志文件: ${file}`);
                        }
                    });
                }
            });
        });
    });
};

// 每天清理一次旧日志
setInterval(cleanOldLogs, 24 * 60 * 60 * 1000);

// 优雅关闭
process.on('SIGTERM', () => {
    logger.info('收到 SIGTERM 信号，正在关闭日志系统...');
    logger.end();
});

module.exports = logger;
```

---

## 项目部署

### 环境配置
创建 `.env` 文件：
```env
NODE_ENV=production
PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=clwy_api_production
DB_USER=root
DB_PASSWORD=your_password

# JWT 配置
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=2h

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379

# 跨域配置
CORS_ORIGIN=https://yourdomain.com

# 文件上传配置
UPLOAD_PATH=/var/www/uploads
MAX_FILE_SIZE=10485760
```

### 生产环境数据库迁移
```bash
# 设置环境变量
export NODE_ENV=production

# 创建生产数据库
npx sequelize-cli db:create --env production

# 执行迁移
npx sequelize-cli db:migrate --env production

# 运行种子数据（可选）
npx sequelize-cli db:seed:all --env production
```

### PM2 部署配置
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'clwy-api',
    script: './bin/www',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### Nginx 配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # API 代理
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 静态文件
    location /uploads/ {
        alias /var/www/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker 部署
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

```yml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - mysql
      - redis
    restart: unless-stopped
    
  mysql:
    image: mysql:8.3.0
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: clwy_api_production
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped
    
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:
```

---

## 最佳实践

### 代码规范
```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always']
  }
};
```

### 安全配置
```javascript
// middlewares/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// 安全头设置
const securityMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    }
});

// 速率限制
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 分钟
    max: 100, // 最多 100 次请求
    message: {
        status: false,
        message: '请求过于频繁，请稍后再试'
    }
});

module.exports = { securityMiddleware, limiter };
```

### 数据库优化
```javascript
// 索引优化示例
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 添加复合索引
    await queryInterface.addIndex('Articles', ['userId', 'createdAt']);
    await queryInterface.addIndex('Courses', ['categoryId', 'recommended']);
    
    // 添加唯一索引
    await queryInterface.addIndex('Users', ['email'], {
      unique: true,
      name: 'users_email_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Articles', ['userId', 'createdAt']);
    await queryInterface.removeIndex('Courses', ['categoryId', 'recommended']);
    await queryInterface.removeIndex('Users', 'users_email_unique');
  }
};
```

### 测试配置
```javascript
// tests/setup.js
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

// tests/article.test.js
const request = require('supertest');
const app = require('../app');

describe('Article API', () => {
    test('应该能够获取文章列表', async () => {
        const response = await request(app)
            .get('/admin/articles')
            .expect(200);
            
        expect(response.body.status).toBe(true);
        expect(response.body.data).toBeDefined();
    });
});
```

### 性能监控
```javascript
// middlewares/monitor.js
const responseTime = require('response-time');
const logger = require('../utils/logger');

const performanceMonitor = responseTime((req, res, time) => {
    if (time > 1000) { // 响应时间超过 1 秒
        logger.warn('慢查询警告', {
            method: req.method,
            url: req.url,
            responseTime: time,
            userAgent: req.get('User-Agent')
        });
    }
});

module.exports = performanceMonitor;
```

---

## 常用 SQL 语句参考

### 基础操作
```sql
-- 多行插入
INSERT INTO `Articles` (`title`, `content`) VALUES 
('标题1', '内容1'),
('标题2', '内容2'),
('标题3', '内容3');

-- 条件更新
UPDATE `Articles` 
SET `title` = '新标题', `content` = '新内容' 
WHERE `id` = 1;

-- 条件删除
DELETE FROM `Articles` WHERE `id` = 5;

-- 基础查询
SELECT * FROM `Articles`;
SELECT `id`, `title` FROM `Articles`;
SELECT * FROM `Articles` WHERE `id` = 2;

-- 排序查询
SELECT * FROM `Articles` 
WHERE `id` > 2 
ORDER BY `id` DESC;

-- 模糊查询
SELECT * FROM `Articles` 
WHERE `title` LIKE '%关键词%';

-- 分页查询
SELECT * FROM `Articles` 
ORDER BY `id` DESC 
LIMIT 10 OFFSET 20;
```

### 高级查询
```sql
-- 联表查询
SELECT 
    c.id,
    c.name,
    cat.name as category_name,
    u.username as author
FROM Courses c
LEFT JOIN Categories cat ON c.categoryId = cat.id
LEFT JOIN Users u ON c.userId = u.id;

-- 统计查询
SELECT 
    categoryId,
    COUNT(*) as course_count,
    AVG(likesCount) as avg_likes
FROM Courses 
GROUP BY categoryId
HAVING course_count > 5;

-- 子查询
SELECT * FROM Users 
WHERE id IN (
    SELECT DISTINCT userId 
    FROM Courses 
    WHERE likesCount > 100
);
```

---

## 总结

本指南涵盖了 Node.js 全栈开发的完整流程，从项目初始化到生产部署。主要包括：

1. **环境搭建**：Node.js、Express、数据库配置
2. **数据库设计**：Sequelize ORM、模型关联、迁移管理
3. **API 开发**：RESTful 接口、CRUD 操作、数据验证
4. **身份认证**：JWT、密码加密、权限控制
5. **高级功能**：文件上传、缓存、数据统计
6. **错误处理**：统一错误处理、日志记录
7. **项目部署**：PM2、Nginx、Docker
8. **最佳实践**：代码规范、安全配置、性能优化

通过遵循本指南，您可以构建一个功能完整、安全可靠、易于维护的 Node.js 后端应用。

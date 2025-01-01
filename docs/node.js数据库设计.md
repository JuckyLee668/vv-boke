## 要求
- [MySQL :: MySQL Workbench](https://www.mysql.com/products/workbench/)

## 创建模型
```js
sequelize model:generate --name Article --attributes title:string,content:text

sequelize model:generate --name Category --attributes name:string,rank:integer

sequelize model:generate --name User --attributes email:string,username:string,password:string,nickname:string,sex:tinyint,company:string,introduce:TEXT,role:tinyint

sequelize model:generate --name Course --attributes categoryId:integer,userId:integer,name:string,image:string,recommended:boolean,introductory:boolean,content:text,likesCount:integer,chaptersCount:integer

sequelize model:generate --name Chapter --attributes courseId:integer,title:string,content:text,video:string,rank:integer

sequelize model:generate --name Like --attributes courseId:integer,userId:integer

sequelize model:generate --name Setting --attributes name:string,icp:string,copright:string
```

### 迁移模型
```
sequelize db:migrate
```

### 回滚模型

```
sequelize db:migrate:undo --name 20241229061856-create-setting.js
```

## 创建种子文件
```
sequelize seed:generate --name setting  
```
### 迁移种子
```
sequelize db:seed --seed 20241229120348-setting
```

## 创建表单字段
```
sequelize migration:create --name add-avatar-to-user
```

### 迁移
```
sequelize db:migrate
```
### 修改models



## 密码加密
### 安装包
```js
npm install bcryptjs
```

### models中修改
```js
const bcrypt = require('bcryptjs');

set(value) {
        if(value.length >= 8 && value.length <= 45)
        {
          this.setDataValue('password', bcrypt.hashSync(value, 10));
        }else{
          throw new Error('密码长度必须在8-45位之间');
        }
}
```

## 表单关联
### 子表单中使用
```js
//原来moudel中
 static associate(models) {
      // define association here
      models.Course.belongsTo(models.Category)
      models.Course.belongsTo(models.User)
}

//2 导入到router文件中
const { Course ,Category ,User} = require('../../models');


//作为查询条件
const getCondition = () => {
    return {
        attributes:{exclude:['CategoryId','UserId']},
        include:[
            {
                model:Category,
                as:'category',
                attributes:['id','name','rank']
            },
            {
                model:User,
                as:'user',
                attributes:['id','username','avatar']
            }
            
        ]
    }
}
```

### 主表单中使用
```js
//1 model 中配置
static associate(models) {
      // define association here
      models.User.hasMany(models.Course, { as: 'courses', foreignKey: 'userId' });
    }
//2 导入
const { success, failure } = require('../../utils/response');

//3 使用
const getCondition = () => {
    return {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
            {
                model: Course,
                as: 'courses',
                attributes: ['id', 'name', 'image', 'recommended', 'introductory', 'likesCount', 'chaptersCount']
            }
        ]
    }
}
```
### 分类下有数据禁止删除
```js
router.delete('/:id', async function (req, res, next) {
    try {
        const count = await Course.count({ where: { categoryId: req.params.id } });
        const category = await Category.findByPk(req.params.id);
        if (category && count == 0) {
            await category.destroy();
            success(res, '数据删除成功');
        } else if(!category){
            failure(res, '数据删除失败', ['数据不存在'], 404);
        } else if(count > 0){
            failure(res, '数据删除失败', ['分类下有课程，不允许删除']);
        }
    } catch (error) {
        failure(res, '数据删除失败', [error.message]);
    }
});

```

## 数据汇总（注册事件、性别比例）
```js
const express = require('express');
const router = express.Router();
const { User } = require('../models'); // 确保路径正确
const { success, failure } = require('../utils/response');
const { sequelize } = require('../models');

// 获取用户性别统计数据
router.get('/gender', async (req, res) => {
    try {
        const male = await User.count({
            where: {
                sex: 1
            }
        });
        const female = await User.count({
            where: {
                sex: 0
            }
        });
        const unknown = await User.count({
            where: {
                sex: 2
            }
        });
        const data = [
            { value: male, name: '男' },
            { value: female, name: '女' },
            { value: unknown, name: '未知' }
        ];
        success(res, '数据查询成功', data);
    } catch (err) {
        failure(res, '数据查询失败', [err.message]);
    }
});

// 获取每个月的注册用户数量
router.get('/monthly-users', async (req, res) => {
    try {
        const data = await sequelize.query(
            `SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS value
             FROM Users
             GROUP BY month
             ORDER BY month ASC`,
            { type: sequelize.QueryTypes.SELECT }
        );
        success(res, '数据查询成功', data);
    } catch (err) {
        failure(res, '数据查询失败', [err.message]);
    }
});

module.exports = router;

```


## 用户登录

### 身份、密码验证
```js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const {User} = require('../../models');

const bcrypt = require('bcryptjs');
router.post('/login', async(req, res) => {
    try {
        const { login, password } = req.body;
        if (!login) {
            throw new Error('请输入用户名或邮箱');
        } 
        if(!password){
            throw new Error('请输入密码');
        }
        const condition = {
            where: {
                [Op.or] : [
                    {
                        username: login
                    },
                    {
                        email: login
                    }
                ]
            }
        };

        const user = await User.findOne(condition);
        if(!user)
        {
            throw new Error('用户不存在');
        }
        if(user.role !== 99)
        {
            throw new Error('无权限登录');
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if(!isPasswordValid)
        {
            throw new Error('密码错误');
        }

        res.json({
            status: true,
            message: '登录成功',
            data: {
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '登录失败',
            errors: [error.message]
        });
    }
});

module.exports = router;

```

### token生成
```js
//安装包
npm i jsonwebtoken

//引用包
const jwt = require('jsonwebtoken');

const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: '2h'
});

```

### .env环境变量
```js
//1 安装包
npm i dotenv
//2  根目录下创建.env
JWT_SECRET='Hello'
//3 app.js中引入
require('dotenv').config();
//4 重启npm
```

### 密钥生成crypto
```js
const crypto = require('crypto');

console.log(crypto.randomBytes(32).toString('hex'));
```
### 前置验证

```js
const jwt = require('jsonwebtoken');
const {User} = require('../models');
const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key



module.exports = async (req, res, next) => {
    try{
        const { token } = req.headers;
        if(!token){
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const decoded = jwt.verify(token, secretKey);
        if(decoded.role !== 99){
            return res.status(403).json({ message: 'Access denied. Not an admin.' });
        }
        req.user = decoded;
        next();
    }catch(error){
        res.status(400).json({ message: 'Invalid token.' });
    }
}

```
#### 导入并使用
```js
const adminAuth = require('./middlewares/admin-auth');


app.use('/admin/articles', adminAuth,adminArticlesRouter);
app.use('/admin/categories',adminAuth, adminCategoriesRouter);
app.use('/admin/settings', adminAuth,adminSettingRouter);
```

### 提取用户ID
```js
const body = {};
        const fields = ['categoryId', 'userId', 'name', 'image', 'recommended', 'introductory', 'content', 'likesCount', 'chaptersCount'];
        fields.forEach(field => {
            if (req.body[field]) body[field] = req.body[field];
            if(field ==='userId') body[field] = req.user.id;//改为当前登录用户的id
        });
        
```
## 跨域解决
```js
//1 安装包
npm i cors
//2 导入
const cors = require('cors');

```
### 允许所有源
```js
//app.js中使用cors
app.use(cors());
```
### 允许特定源
```js
//可设置特定域名，需配置环境变量
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200
}
app.use(cors());
```


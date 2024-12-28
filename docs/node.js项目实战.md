# node.js项目实战
## 需求
- node.js([Node.js — 在任何地方运行 JavaScript](https://nodejs.org/zh-cn))
- docker([Docker: Accelerated Container Application Development](https://www.docker.com/))
- Navicat( [Navicat | Free Download Navicat Premium Lite](https://www.navicat.com/en/download/navicat-premium-lite))
- apifox([Apifox - API 文档、调试、Mock、测试一体化协作平台](https://apifox.com/))


## 创建 Express 项目
### 安装express
```
npm i -g express-generator@4
```

### 创建项目
```
# 创建项目
express --no-view clwy-api 

# 注意：Windows有可能碰到提示：express : 无法加载文件 C:\Program Files\nodejs\express.ps1，因为在此系统上禁止运行脚本。
# 如果碰到这个错误，需要用`管理员身份`打开PowerShell，然后运行：
Set-ExecutionPolicy RemoteSigned

# 进入项目之中
cd clwy-api 

```

###  nodemon 监听修改
```
# 安装
npm i nodemon

```

```
# 然后打开项目根目录下的`package.json`，将`start`这里修改为

`"scripts": {   "start": "nodemon ./bin/www" },`
```
## docker-compose.yml
```yml
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
```

## SQL 常用语句
### 多行插入
```sql

INSERT INTO 表名 (列1, ...) VALUES (值1, ...),(值1, ...)...;


INSERT INTO `Articles` (`title`, `content`) VALUES ('将进酒', '天生我材必有用，千金散尽还复来。'), ('宣州谢朓楼饯别校书叔云', '抽刀断水水更流，举杯消愁愁更愁。'), ('梦游天姥吟留别', '安能摧眉折腰事权贵，使我不得开心颜！'), ('春夜宴从弟桃花园序', '天地者，万物之逆旅也；光阴者，百代之过客也。'), ('宣州谢朓楼饯别校书叔云', '弃我去者，昨日之日不可留；乱我心者，今日之日多烦忧。'), ('庐山谣寄卢侍御虚舟', '我本楚狂人，凤歌笑孔丘。手持绿玉杖，朝别黄鹤楼。'), ('行路难', '长风破浪会有时，直挂云帆济沧海'), ('将进酒', '人生得意须尽欢，莫使金樽空对月。天生我材必有用，千金散尽还复来。'), ('望庐山瀑布', '飞流直下三千尺，疑是银河落九天。'), ('访戴天山道士不遇', '树深时见鹿，溪午不闻钟。'), ('清平调', '云想衣裳花想容，春风拂槛露华浓。'), ('春夜洛城闻笛', '谁家玉笛暗飞声，散入春风满洛城。');


```

### 更新
```sql
UPDATE `Articles` SET `title`='黄鹤楼送孟浩然之广陵', `content`='故人西辞黄鹤楼，烟花三月下扬州。' WHERE `id`=687;

```

### 删除
```sql
DELETE FROM `ARTICLES` WHERE `id`=5;
```

### 查询

```sql

SELECT * FROM `Articles`;

SELECT `id`, `title` FROM `Articles`; //只查询id和title


SELECT * FROM `Articles` WHERE `id`=2; //条件查询


```

### 排序
```sql
-- 查询id大于2的文章，按 id 从大到小排序，即降序
SELECT * FROM `Articles` WHERE `id`>2 ORDER BY `id` DESC;

-- 查询id大于2的文章，按 id 从小到大排列，即升序
SELECT * FROM `Articles` WHERE `id`>2 ORDER BY `id` ASC;

```

### 查询
```sql
SELECT * FROM Websites	WHERE url LIKE 'https%';
```
##  Sequelize ORM 的使用

### 安装
先安装`sequelize`的命令行工具，需要全局安装，这样更方便使用

`npm i -g sequelize-cli`

接着确保命令行是在当前项目的命令行里，还要安装当前项目所依赖的`sequelize`包和对数据库支持依赖的`mysql2`

`npm i sequelize mysql2`

### 初始化项目

`sequelize init`

初始化sequelize项目，该命令将创建如下目录：

- config：包含配置文件，它告诉CLI如何连接数据库
- models：包含您的项目的所有模型
- migrations：包含所有迁移文件 （**数据表结构**） 执行迁移命令后，数据库就有了相关表
- seeders：包含所有种子文件 （**具体数据**）
### 配置config文件

第一个要改的就是`密码`，修改成`docker`配置里，我们设定的密码。接着要改的是数据库的名字，改为`clwy_api_development`。

最下面，还要加上时区的配置，因为我们中国是在`+8区`。这样在查询的时候，时间才不会出错。

### 创建database

```
sequelize db:create
```

### 创建模型

```
sequelize model:generate --name Article --attributes title:string,content:text

```

### 迁移模型
```
sequelize db:migrate

```

### 种子文件
创建
```
sequelize seed:generate --name article
```
修改 `seeders/xx-article文件`
```js
async up (queryInterface, Sequelize) {
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

```
运行种子
```
sequelize db:seed --seed xxx-article
```
## 接口

### 1.roters下文件编写
```js
const express = require('express');
const router = express.Router();
const { Article } = require('../../models');

/* GET home page. */
router.get('/', async function (req, res, next) {
	//try catch 避免问题无法查找
    try{
         const conditon = {
        order: [
            ['id', 'DESC']
        ]
    };
    const article = await Article.findAll(conditon);
    res.json({
        status: true,
        message: '数据查询成功',
        data: article
    });
    }catch(error){
        res.status(500).json({
            status: false,
            message: '数据查询失败',
            errors: [error.message]
        });
    }
   
});

module.exports = router;

```

### 2.app.js修改
```js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

//引用后台路由
const adminArticlesRouter = require('./routes/admin/articles');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//使用后台路由
app.use('/admin/articles', adminArticlesRouter);


module.exports = app;
```

### 3.不同查询条件
##### 列表查询
```js
/*
GET /admin/article
*/
router.get('/', async function (req, res, next) {
    try{
         const conditon = {
        order: [
            ['id', 'DESC']
        ]
    };
    const article = await Article.findAll(conditon);
    res.json({
        status: true,
        message: '数据查询成功',
        data: article
    });
    }catch(error){
        res.status(500).json({
            status: false,
            message: '数据查询失败',
            errors: [error.message]
        });
    }
   
});
```
#### id查询（params）
```js
/*
GET /admin/article/{id}
*/
router.get('/:id', async function (req, res, next) {
    try {

        const article = await Article.findByPk(req.params.id);
        if (article) {
            res.json({
                status: true,
                message: '数据查询成功',
                data: article
            });
        } else {
            res.status(404).json({
                status: false,
                message: '数据查询失败',
                errors: ['数据不存在']
            });
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            message: '数据查询失败',
            errors: [error.message]
        });
    }

})
```
#### 创建文章
```js
/*
POST /admin/article
*/
router.post('/', async function (req, res, next) {
    try {
        const article = await Article.create(req.body);
        res.status(201).json({
            status: true,
            message: '数据创建成功',
            data: article
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '数据创建失败',
            errors: [error.message]
        });
    }
})
```
#### 删除文章（params）
```js
/*
DELETE /admin/article/{id}
*/
router.delete('/:id', async function (req, res, next) {
    try {
        const article = await Article.findByPk(req.params.id);
        if (article) {
            await article.destroy();
            res.json({
                status: true,
                message: '数据删除成功'
            });
        } else {
            res.status(404).json({
                status: false,
                message: '数据删除失败',
                errors: ['数据不存在']
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '数据删除失败',
            errors: [error.message]
        });
    }
})
```
#### 更新文章（params）
```js
/*
PUT /admin/article/{id}
*/
router.put('/:id', async function (req, res, next) {
    try {
        const article = await Article.findByPk(req.params.id);
        if (article) {
            await article.update(req.body);
            res.json({
                status: true,
                message: '数据更新成功',
                data: article
            });
        } else {
            res.status(404).json({
                status: false,
                message: '数据更新失败',
                errors: ['数据不存在']
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '数据更新失败',
            errors: [error.message]
        });
    }
})
```
#### 文章查询+分页（query）

```js
//引入Op
const {Op} = require('sequelize');


router.get('/', async function (req, res, next) {
    try {
	    //查询标题关键词
        const title = req.query.title ? req.query.title : '';
        //现在所在页数
        const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) : 1;
        //单页文章数目
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        //起始页
        const offset = (currentPage - 1) * pageSize;
        const condition = {
            order: [
                ['id', 'DESC']
            ],
            limit: pageSize,
            offset: offset
        };
        if (title) {
            condition.where = {
                title: {
                    [Op.like]: `%${title}%`
                }
            }
        }
        const article = await Article.findAndCountAll(condition)
        res.json({
            status: true,
            message: '数据查询成功',
            data: article
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '数据查询失败',
            errors: [error.message]
        });
    }

})

```

### 3.白名单过滤
直接函数内过滤
```js
const body = {
            title: req.body.title,
            content: req.body.content
        }
```

函数过滤
```js
const body = fliterBody(req);


function fliterBody(req) {
    return body = {
            title:req.body.title,
            content:req.body.content
        }
}
```

### 4.验证表单数据

修改`models`下的article.js
```js
 title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '标题必须存在'
        },
        notEmpty: {
          msg: '标题不能为空'
        }
      },
      len: {
        args: [2, 255],
        msg: '标题的长度必须在2到255个字符之间'
      }
    },
```
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
```
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


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

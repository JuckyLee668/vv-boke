# jQuery教程
# 简介
jQuery 是一个 JavaScript 函数库。

jQuery 是一个轻量级的"写的少，做的多"的 JavaScript 库。

jQuery 库包含以下功能：

- HTML 元素选取
- HTML 元素操作
- CSS 操作
- HTML 事件函数
- JavaScript 特效和动画
- HTML DOM 遍历和修改
- AJAX
- Utilities
# 安装
从[Download jQuery | jQuery](https://jquery.com/download/)
有两个版本
- Production version - 用于实际的网站中，已被精简和压缩。
- Development version - 用于测试和开发（未压缩，是可读的代码）
存于GitHub vv

https://github.com/JuckyLee668/vv/blob/main/ajax/jquery/jquery-3.7.1.js
https://github.com/JuckyLee668/vv/blob/main/ajax/jquery/jquery-3.7.1.min.js

# 语法
## 入口函数
```js
$(document).ready(function(){
    // 执行代码
});
或者
$(function(){
    // 执行代码
});
```

## 基础语法： **$(_selector_)._action_()**

- 美元符号定义 jQuery
- 选择符（selector）"查询"和"查找" HTML 元素
- jQuery 的 action() 执行对元素的操作
## 元素选择器

实例:
```js
$(this).hide() //隐藏当前元素

$("p").hide() //隐藏所有 <p> 元素

$("p.test").hide() // 隐藏所有 class="test" 的 <p> 元素

$("#test").hide() // 隐藏 id="test" 的元素

$('ul>span').css('background', 'red'); //选择ul下的所有span子元素

$('ul span').css('background', 'red'); //选择ul下的所有span元素


...
```

## 事件
- 在元素上移动鼠标。
- 选取单选按钮
- 点击元素
|鼠标事件|键盘事件|表单事件|文档/窗口事件|
|---|---|---|---|
|[click](https://www.runoob.com/jquery/event-click.html)|[keypress](https://www.runoob.com/jquery/event-keypress.html)|[submit](https://www.runoob.com/jquery/event-submit.html)|[load](https://www.runoob.com/jquery/event-load.html)|
|[dblclick](https://www.runoob.com/jquery/event-dblclick.html)|[keydown](https://www.runoob.com/jquery/event-keydown.html)|[change](https://www.runoob.com/jquery/event-change.html)|[resize](https://www.runoob.com/jquery/event-resize.html)|
|[mouseenter](https://www.runoob.com/jquery/event-mouseenter.html)|[keyup](https://www.runoob.com/jquery/event-keyup.html)|[focus](https://www.runoob.com/jquery/event-focus.html)|[scroll](https://www.runoob.com/jquery/event-scroll.html)|
|[mouseleave](https://www.runoob.com/jquery/event-mouseleave.html)||[blur](https://www.runoob.com/jquery/event-blur.html)|[unload](https://www.runoob.com/jquery/event-unload.html)|
|[hover](https://www.runoob.com/jquery/event-hover.html)||||

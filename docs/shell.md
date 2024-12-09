# shell命令

一般结构
```bash
#!/bin/bash 声明使用BASH类型

# 2023/11/18 Xihan 注释（仅#！为声明）

echo "hello world!"

```

### read
```bash
#! /bin/bash
read -p "请输入name" name
```

### 判断
```bash
#! /bin/bash
read -p "please enter a" a
read -p "please enter b" b
test $a == $b && echo "a=b" || echo "a!=b" 

test -e main.c && echo "main.c 存在"
test -f main.c && echo "main.c 存在且为文件"
test -d ubuntu && echo "ubuntu 存在且为目录"

test -r mian.c && echo "main.c 存在且可读"
-w "可写"
-x "可执行"

test file1 nt file2  1比2新吗？
test -z string  判断字符串是否为0空字符串也为0

# [_a_==_b_] 需注意 _ 为空格
[ "$a" == "$b" ] && echo "a=b" || echo "a!=b" 


```



### 默认变量
- $0 filename
- $1 ~ $n 变量1-n
- $#  最后一个
- $@ 全部参数

```bash
 #! /bin/bash
 echo "file name $0 "
 echo "fist str $1"
 echo "second str $2"
 echo $@

```

### 判断
#### if else
```bash
#!/bin/bash
read -p "继续此操作（Y/N）" value

if [ "$value" == "Y" ] ||[ "$value" == "y" ];then

    echo "continue"
elif [ "$value" == "N" ] ||[ "$value" == "n" ];then
	echo "break"
else 
	echo "退出"

fi
```

#### case
```bash
#!/bin/bash

case $1 in
	"a")
		echo "string is a"
		;;
	"b")
		echo "string is b"
		;;
	*)  #若此处为"*"则为字符 无引号则为通配符
		echo "other"
		;;
esac
```

### 函数
```bash
#! /bin/bash
function help(){
    echo "this is help"
}
function print(){
	echo "您输入的是 $1 "
}

case $1 in
	 "-h")
		help
		 ;;
	 *)
		print 2
		;;
esac
```

### 循环
```bash
for name in z1 z2 f3
do
	echo "$name"
done
```

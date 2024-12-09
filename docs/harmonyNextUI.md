### borderRadius（圆角）

### layout (权重，自适应伸缩)
除去定宽后按比例分配
`.layoutWeight(1)`

### Checkbox

```js
Checkbox()
.width(20)
Text() {
	span('京东隐私协议') .frontColor('#3274f6')

}
.fontSize(12)
.fontColor('#666')
```

正交方向
`alignItems()`


## 填充组件
`Blank()

Flex() 弹性容器组件
```js
Flex({}) { 
//1. direction:Row column  主轴方向
//2. justfyContent:  主轴对齐方式
//3. alignItems:  交叉轴布局方式
//4. wrap: wrap noWrap布局换行多行/单行
	
}
```
### 绝对定位（层叠效果）
```js
.position({
x: 22,
y: 22
})
//定位后不占用原来位置，后面的层级更高
zIndex() //调整层级
```

```js
.border({width: 22,color: #231} )
.textAlign()  //文字居中，居右
```


## 层叠布局
```js
Stack({alignContent : }) { //层叠位置
	Item1()
	Item2()
	Item3()
}
```

Scroll 滚动组件
```js
Scroll(){
//只支持一个子组件
	Column(){
	Array.from({length:6})
	
	}
}

.scrollable(scrollDirection.h) //横向或纵向
.scrollBar(BarState.On) //滚动条显示开关  
.scrollBarColor(Color.Blue) .scrollBarWidth(5) //滚动条宽度  
.edgeEffect(EdgeEffect.Spring)//边缘滑动效果
```
---
```js

@Builder  
function navItem(icon:ResourceStr,txt:string){  
  Column(){  
    Image(icon)  
      .width(50)  
      .margin(5)  
    Text(txt)  
      .fontSize(12)  
      .fontColor('#fff')  
  }  
  .width(60)  
  .height(60)  
  .padding(5)  
}


//1 创建对象
myScroll:Scroller = new Scroller()  
yScroll:number = 0  
  build() {  
    Column(){  
      Scroll(this.myScroll){ //绑定Scroll组件  
        Column(){  
          ForEach(Array.from({length:6}),()=>{  
            Row(){  
  
            }              .width('100%')  
              .height(200)  
              .border({width:2})  
              .backgroundColor(Color.Pink)  
          })  
        }  
      }      .width('100%')  
      .height('60%')  
      .backgroundColor(Color.Blue)  
      //.scrollable(ScrollDirection.Horizontal)  
      .scrollBar(BarState.On) //滚动条显示开关  
      .scrollBarColor(Color.Blue)  
      .scrollBarWidth(5) //滚动条宽度  
      .edgeEffect(EdgeEffect.Spring)//边缘滑动效果  
      .onScroll(()=>{  
        this.yScroll = this.myScroll.currentOffset().yOffset  
      })  
      Button('回到顶部')  
        .onClick(()=>{  
        this.myScroll.scrollEdge(Edge.Top)  
      })  
      Button('显示y轴')  
        .onClick(()=>{  
          const y = this.myScroll.currentOffset().yOffset  
          AlertDialog.show({  
            message : `y是 ${y}`  
          })  
        })  
  
    }
```


对象数组
```js
for(let  item of Arr) {
 console.log('每一项'，JSON.stringify(item))
}
```

ForEach 渲染控制
```js
ForEach(this.title,(item:string,index:number)=>{
Text('${index+1}${item}')
.fontSize(24)
})
```

```js
interface Article {
 title:string
 createtime:string
}
@state articles : Article[] = [
{title : 'adasdqw',createtime : '2024-10-28'}，
{title :'asdasd',createtime : '2027-09-19'}
]
ForEach(this.articles,(item:Article,index:number)=>{
Text(item.title)
})
}
```

Badge 角标组件

```js
Badge({
	count :1,//角标数值
	position :BadgePosition.RightTop,
	style:{
		fontSize:12,
		badgeSize:16, //圆形大小
		badgeColor : '#FA2A2D' //圆形底色
	}
}){
	Image($r('app.media.bg_01'))
}
```

Grid  布局
```js
Grid(){  
  ForEach([1,2,3,4,5,6,7,8,9,10,11,12],()=>{  
    GridItem() {  
      Column() {  
  
      }      .width('100%')  
      .height('100%')  
      .backgroundColor(Color.Pink)  
      .border({width:1})  
  
    }  
  })  
  
}  
.columnsTemplate('1fr 1fr 1fr')  
.rowsTemplate('1fr 6fr 1fr 1fr')  
.rowsGap(5)  
.columnsGap(10)  
.width('100%')  
.height(400)  
.backgroundColor(Color.Blue)
```

图片遮罩 scale state

```

```

swiper 轮播组件
```js
swiper(){
	Text('1')
	Text('2')
	Text('3')
}
.width('100%)
.height('100%')
.loop() //开启循环 true
.autoplay() //自动播放 true
.interval()//自动播放间隔
.vertical()//纵向 true
	.indicatoe(
	  Indicator.dot()
		  .itemWidth()
		  .itemHeight()
		  .color()
		  .selectedItemWith()
	  
	)
```
```js
Column(){  
  Swiper(){  
    Text('1')  
    Text('2')  
    Text('3')  
  }  
  .backgroundColor(Color.Black)  
  .width('100%')  
  .aspectRatio(2.4) //宽高比  
  .height(200)  
  .indicator(  
    Indicator.dot().itemWidth(20).color('#fff').selectedItemWidth(40)  
  )}
```

@Extend
```js
@Extend(Text)  //
function textExtend (msg:string){
	.fontSize(16)
}
```

@Styles 抽取通用属性定义
```TS
//全局定义  不可传参
@Styles function comminStyles (){
	.width()
	.height()
}
//局内定义  可以访问内部参数 this.
@Styles commonStyles(){
	.onClick(()=>{
		.backgrondColor(this.colors)
	})
}
```

@Builder 自定义构建函数
```js
//全局定义，局部定义时可以去掉function 并可以调用this.
@Builder  
function navItem(icon:ResourceStr,txt:string){  
  Column(){  
    Image(icon)  
      .width(50)  
      .margin(5)  
    Text(txt)  
      .fontSize(12)  
      .fontColor('#fff')  
  }  
  .width(60)  
  .height(60)  
  .padding(5)  
}

//使用方法
navItem()
```

Tabs()  容器
```js
Tabs(barPosition:BarPosition.End){  //调整导航条位置
  TabContent(){  
    Column(){  
  
    }  }.tabBar('首页')  
  TabContent(){  
    Text('首页内容')  
  }.tabBar('推荐')  
  TabContent(){  
    Text('首页内容')  
  }.tabBar('发现')  
}
.vertical(true)  //垂直导航
.scrollable() //是否允许滑动
.animationDuration(0) //动画时间
.barMode(BarMode.Scrollable)//设置为可滚动
```

## 构造函数
```js
class Food{  
	//实例属性
  name:string  
  price:number  
  //构造函数
  constructor(name:string,price:number) {  
    this.name = name  
    this.price = price  
  }  
}  
  
let p1:Food = new Food('拉条子',16)  
console.log(p1.name,p1.price)
```
---
```js
class Hello{  
  name:string  
  age:number  
  
  constructor(name:string,age:number) {  
    this.name = name  
    this.age = age  
  }
  //方法  
  sayHi(yourname:string){  
    console.log(`你好${yourname},我是${this.name}`)  
  }  
}  
  
let p1:Hello = new Hello('奥特曼',20)  
p1.sayHi('大怪兽')
```

```js
//静态属性 静态方法  
class Robot{  
  static version:number = 1.0  
  static getRadomN():number{  
    return Math.random()  
}  
}
```


继承
```js
class Hello{  
  name:string  
  age:number  
  
  constructor(name:string,age:number) {  
    this.name = name  
    this.age = age  
  }  
  sayHi(yourname:string){  
    console.log(`你好${yourname},我是${this.name}`)  
  }  
}  
  
class Hi extends Hello{  
  fav:string  
  
  constructor(name:string,age:number,fav:string) {  
    //访问父类函数  
    super(name, age)  
    this.fav = fav  
  }  
    sayHi(yourname:string):void{  
    super.name  
     super.sayHi(yourname)  
  
  
    }  
}  
let p1:Hello = new Hello('奥特曼',20)  
p1.sayHi('大怪兽')  
let  p2:Hi = new Hi('小白',19,'大白龙')  
p2.sayHi('零零')  
  
console.log(`你好,我喜欢`,p2.fav)
```
readonly
```js
class cat{
	readonly legs:number = 4  //不允许修改
	private name :string = '诺兰' // 只能在该类访问
	protected version :number = 1.2 //可在此类和子类中访问
}
```

...剩余参数和展开运算符
```js
function sum(num1:number,num2:number, ...Arr:number[]):number{  //合并为数组
  let sumMary:number = num1+ num2  
  for (let item of Arr){  
    sumMary+=item  
  }  
  return sumMary  
}  
  
console.log(sum(1,2,3,4,5,1).toString())  
let n1:number[]= [1,2,3]  
let n2 : number[] = [3,4,5]  
let n3 : number[] = [...n1,...n2]  //展开数组
console.log(n3.toString())
```


# 泛型函数
```js
interface Ilength{  //类型约束
	length : number
}
function afu<T extends Ilength>(varable:T):T{
	return varb
}
afu<string>('dd')
```
---

```js
interface Nu<T>{
	st:T
	ab:(value:T)=>T[]
}
class Nb:Nu<number> = {
	st:number
	ab:(value:number) => [1,2,3,4]
}
```




----
# 自定义构建函数
file1
```js
import {SonCom} from '../farmwork/moudle1'  
  
@Entry  
@Component  
struct Index{  
  build() {  
    Column(){  
      SonCom({ltitle:'返回',rtitle:'更多'}){Button('搜素')}  
    }  }}
```
../farmwork/moudle1
```js
  
@Component  
export struct  SonCom {  
  ltitle:string = '我的订单'  
  rtitle:string = '更多订单 >'  @BuilderParam  ContentBuilder:() => void = this.defaultBuilder  
  @Builder  
  defaultBuilder(){  
    Text('这是内容')  
      .fontSize(20)  
      .backgroundColor('#ccc')  
  }  
  build() {  
    Column() {  
      Row(){  
        Text(this.ltitle)  
          .fontSize(16)  
        Text(this.rtitle)  
          .fontSize(16)  
          .onClick(()=>{  
            console.log('get more')  
          })  
      }  
      .width('100%')  
      .height(60)  
      .justifyContent(FlexAlign.SpaceBetween)  
      .padding({left:20,right:20})  
      .backgroundColor('#ffe0caca')  
      .borderRadius({topRight:10,topLeft:10})  
  
      Column(){  
        this.ContentBuilder()  
      }  
  
    }    .width('100%')  
    .height(200)  
    .borderRadius(10)  
    .backgroundColor('#ff0')  
  }  
}
```

file1
```js
import {Som} from '../farmwork/moudle2'  
@Entry  
@Component  
struct Index{  
  @Builder  
    fTitleBuilder(){  
      Text('新的标题')  
        .fontColor('#fff60000')  
}  
  @Builder  
    fContentBuilder(){  
      Text('船新内容')  
  }  
  build() {  
    Column(){  
      Som({tBuilder:this.fTitleBuilder,  
        cBuilder : this.fContentBuilder})  
    }  
    .width('100%')  
    .height('100%')  
    .backgroundColor(Color.Grey)  
  }  
}
```
file2
```js
@Component  
export struct Som {  
  @BuilderParam tBuilder : () =>void = this.defaultTitleBuilder  
  @BuilderParam cBuilder:()=>void = this.defaultContentBuilder  
    @Builder  
    defaultTitleBuilder(){  
      Text('默认标题')  
        .fontColor('#fff60000')  
    }  
    @Builder  
    defaultContentBuilder(){  
      Text('默认内容')  
    }  
  build() {  
    Column(){  
      Row(){  
        this.tBuilder()  
      }  
      .width('100%')  
      .height(60)  
      .justifyContent(FlexAlign.SpaceBetween)  
      .padding({left:20,right:20})  
      .backgroundColor('#ffe0caca')  
      .borderRadius({topRight:10,topLeft:10})  
  
  
      Column(){  
        this.cBuilder()  
      }  
      .width('100%')  
      .height(200)  
      .borderRadius(10)  
      .backgroundColor('#ff0')  
    }  
  
  }}
```
![[Pasted image 20241101231402.png]]
![[Pasted image 20241101234620.png]]

---
## iconfont 使用  注册自定义字体
```js
//1.导入包
import font from '@ohos.font'  
@Entry  
@Component  
struct Index{  
//2.在开始时候注册字体，名称及位置
  aboutToAppear(): void {  
    font.registerFont({  
      familyName:'myFont',  
      familySrc:'/fonts/iconfont.ttf'  
    })  
  }  
 
  build() {  
    Column(){   
      Row(){  
      //3.加入fontfamily后如字体一般使用
        Text('\ue600')  
          .fontFamily('myFont')  
          .fontSize(20)  
          .fontColor('#000')  
      }  
  
  
    }    
    .width('100%')  
    .height('100%')  
    .backgroundColor(Color.Grey)  
  }  
}
```


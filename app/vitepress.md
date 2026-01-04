# VitePress 使用教程


## 介绍
VitePress 是一个由 Vite 驱动的静态网站生成器，专为文档网站设计。

## 安装
使用 npm 安装 VitePress：
```bash
npm install vitepress --save-dev
```
## 项目初始化
使用vitePress提供的命令启动向导，并按照提示操作。
```bash
npx vitepress init
```
## 项目结构
创建一个基本的项目结构：
```
note
├── .vitepress
│   ├── config.mts
│   └── dist
├── data
├── docs
├── tools
├── favicon.svg
├── paclage.json
└── index.md

```

## 配置
### config配置
在 `docs/.vitepress/config.mts` 中配置你的 VitePress 站点：
```ts:line-numbers {1}
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  //base: '/note/',
  base: '/./', 
  title: "学而时习之|有朋自远方来",
  description: "欢迎来到淅寒的博客",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.svg',
    nav: [
      { text: '主页', link: '/' },
      { text: '文档', link: '/docs/docs' },
      { text: '工具', link: '/tools/tools' }
    ],

    sidebar: {

      // 当用户位于根目录时，会显示此侧边栏
      

      // 当用户位于 `docs` 目录时，会显示此侧边栏
      '/docs/': [
        {
          text: 'Docs',
          items: [
            { text: 'Index', link: '/docs/' },
            { text: 'One', link: '/docs/one' },
            { text: 'Two', link: '/docs/two' }
          ]
        }
      ],

      // 当用户位于 `tools` 目录时，会显示此侧边栏
      '/tools/': [
        {
          text: 'Tools',
          items: [
            { text: 'Index', link: '/tools/' },
            { text: 'Three', link: '/tools/three' },
            { text: 'Four', link: '/tools/four' }
          ]
        }
      ]
    },
  
    socialLinks: [
      { icon: 'github', link: 'https://github.xi-han.top/JuckyLee668' }
     ]
    //,
    // footer: {
    //   message: 'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
    //   copyright: 'Copyright © 2019-present <a href="https://github.com/yyx990803">Evan You</a>'
    // }
  }
})

```
### index 编辑

```js
interface Hero {
  // `text` 上方的字符，带有品牌颜色
  // 预计简短，例如产品名称
  name?: string

  // hero 部分的主要文字，
  // 被定义为 `h1` 标签
  text: string

  // `text` 下方的标语
  tagline?: string

  // text 和 tagline 区域旁的图片
  image?: ThemeableImage

  // 主页 hero 部分的操作按钮
  actions?: HeroAction[]
}

type ThemeableImage =
  | string
  | { src: string; alt?: string }
  | { light: string; dark: string; alt?: string }

interface HeroAction {
  // 按钮的颜色主题，默认为 `brand`
  theme?: 'brand' | 'alt'

  // 按钮的标签
  text: string

  // 按钮的目标链接
  link: string

  // 链接的 target 属性
  target?: string

  // 链接的 rel 属性
  rel?: string
}
```
## 启动开发服务器
在项目根目录下运行以下命令启动开发服务器：
```bash
npx run docs:dev
```

## 构建静态文件
运行以下命令构建静态文件：
```bash
npx run docs:build
```

## 部署
构建完成后，生成的静态文件位于 `docs/.vitepress/dist` 目录下，可以将其部署到任何静态文件服务器。

## 结论
现在你已经了解了如何使用 VitePress 创建和部署一个文档网站。享受你的文档编写之旅吧！

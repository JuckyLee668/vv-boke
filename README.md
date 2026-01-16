本文档为介绍如何在本地构建 VitePress 并在 GitHub Actions 自动化发布到个人页面
# [什么是VitePress](https://vitepress.dev/)
VitePress 是一个静态站点生成器 (SSG)，专为构建快速、以内容为中心的站点而设计。简而言之，VitePress 获取用 Markdown 编写的内容，对其应用主题，并生成可以轻松部署到任何地方的静态 HTML 页面。

# 本地安装

## 前提条件
1. [Node.js](https://nodejs.org) 18 及以上版本。
### vitepress安装
- `npm install vitepress --save-dev`
- `npx vitepress init`

### 配置文件
在`.vitepress/config.mts`中添加如下配置
```ts
import { defineConfig } from 'vitepress'
// .vitepress/config.js
import fs from 'fs'
import path from 'path'

function generateSidebarFromFS() {
  const docsDir = path.resolve(__dirname, '..');
  const items = [];

  const dirs = fs.readdirSync(docsDir).filter(f =>
    fs.statSync(path.join(docsDir, f)).isDirectory() &&
    !f.startsWith('.') &&
    f !== '.vitepress'
  ).sort();

  for (const dir of dirs) {
    const files = fs.readdirSync(path.join(docsDir, dir))
      .filter(f => f.endsWith('.md') && f !== 'index.md')
      .map(f => f.replace(/\.md$/, ''))
      .sort();

    if (files.length > 0) {
      items.push({
        text: dir,
        link: `/${dir}/`,
        items: files.map(f => ({ text: f, link: `/${dir}/${f}` }))
      });
    }
  }

  return items;
}
// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/./', 
  title: "学，行之，上也",
  description: "欢迎来到淅寒的博客",
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.svg',
    search: {
      provider: 'local'
    },
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: '文档', link: '/docs/index.md' }
    ],

    sidebar: generateSidebarFromFS(),
    socialLinks: [
      { icon: 'github', link: 'https://github.xi-han.top/JuckyLee668' }
    ]
  }
})

```



## github配置
1. 确保你已经在 GitHub 仓库的 `Secrets` 中添加了名为 `PUSH_KEY` 的密钥，其值为你的 GitHub 个人访问令牌，并且该令牌具有推送权限。
2. 确保你的个人访问令牌具有以下权限：
   - `repo`（访问公共和私有仓库的全部控制权限）
   - `workflow`（更新 GitHub Actions 工作流）

### 配置workflows文件
`.github/workflows/deploy.yml`

```yaml
run-name: build & deploy boke.xi-han.top
on:
    # 在针对 `main` 分支的推送上运行。如果你
    # 使用 `master` 分支作为默认分支，请将其更改为 `master`
    push:
      branches: [main]
  
    # 允许你从 Actions 选项卡手动运行此工作流程
    workflow_dispatch:
  
  # 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
    contents: read
    pages: write
    id-token: write
  
  # 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
  # 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
    group: pages
    cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      # - uses: pnpm/action-setup@v2 # 如果使用 pnpm，请取消注释
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Install dependencies
        run: npm ci # 或 pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: |
          npm run docs:build # 打包前端代码到生产环境（目标路径为：./.vitepress/dist）
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./.vitepress/dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
        
```

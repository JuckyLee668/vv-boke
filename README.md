# vv-boke

个人知识库与项目记录站点，基于 [VitePress](https://vitepress.dev/) 构建。

## 内容结构

- `app/`：前端与开发相关笔记
- `linux/`：Linux、Nginx、MySQL、Shell 等实操记录
- `EDB/`：嵌入式与物联网方向资料
- `tools/`：常用工具与软件下载整理
- `others/`：其他个人记录
- `projects/`：项目展示（含 watering 与更多项目）

## 本地运行

```bash
npm install
npm run docs:dev
```

## 构建与预览

```bash
npm run docs:build
npm run docs:preview
```

## 部署说明

仓库已包含 GitHub Actions 工作流（`.github/workflows/deploy.yml`），可用于自动部署到 GitHub Pages。

推荐检查以下项：

- 仓库 Pages 配置是否已启用
- `main` 分支是否为发布分支
- 构建命令是否为 `npm run docs:build`

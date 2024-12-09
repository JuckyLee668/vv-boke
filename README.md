本文档为介绍如何使用 GitHub Actions 自动化构建 VitePress 文档并将其推送到另一个 GitHub 仓库的 `note` 目录下。
# [什么是VitePress](https://vitepress.dev/)
VitePress 是一个静态站点生成器 (SSG)，专为构建快速、以内容为中心的站点而设计。简而言之，VitePress 获取用 Markdown 编写的内容，对其应用主题，并生成可以轻松部署到任何地方的静态 HTML 页面。

# 使用 GitHub Actions 自动化构建和推送 VitePress 文档

## 前提条件

1. 确保你已经在 GitHub 仓库的 `Secrets` 中添加了名为 `PUSH_KEY` 的密钥，其值为你的 GitHub 个人访问令牌，并且该令牌具有推送权限。
2. 确保你的个人访问令牌具有以下权限：
   - `repo`（访问公共和私有仓库的全部控制权限）
   - `workflow`（更新 GitHub Actions 工作流）

## GitHub Actions 配置文件

在你的仓库中创建一个 GitHub Actions 配置文件（例如 `.github/workflows/deploy.yml`），并添加以下内容：

```yaml
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - name: Setup node
        uses: actions/setup-node@v4
        with:
          node-version: 20 # 指定node版本
      - name: Install dependencies
        run: npm install
      - name: Install vitepress
        run: npm add -D vitepress # 安装依赖
      - name: Build
        run: npm run docs:build # 使用vitepress构建文档
      - name: Push
        env: # PUSH 权限要求
          GITHUB_TOKEN: ${{ secrets.PUSH_KEY }}
        run: |
          git config --global user.email "2794920709@qq.com"
          git config --global user.name "JuckyLee668"
          git clone https://JuckyLee668:${{ secrets.PUSH_KEY }}@github.com/JuckyLee668/vv.git
          cd vv
          mkdir -p note
          cp -r ../.vitepress/dist/* note/
          git add note
          git commit -m "github action auto push"
          git push origin main
        
```

## 说明

1. **设置节点环境**：使用 `actions/setup-node@v3` 设置 Node.js 环境，指定 Node.js 版本为 20。
2. **安装依赖**：运行 `npm install` 安装项目依赖。
3. **安装 VitePress**：运行 `npm add -D vitepress` 安装 VitePress 作为开发依赖。
4. **构建文档**：运行 `npm run docs:build` 构建 VitePress 文档。
5. **推送构建结果**：
   - 配置 Git 用户名和邮箱。
   - 克隆目标仓库 `vv`。
   - 将构建后的文件复制到目标仓库的 `note` 目录下。
   - 提交并推送更改到目标仓库的 `main` 分支。

通过以上配置，GitHub Actions 将在每次推送代码时自动构建 VitePress 文档并将其推送到目标仓库的 `note` 目录下。

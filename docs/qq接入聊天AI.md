# 使用 AstrBot 与 NapcatQQ 将 QQ 接入 AI（快速指南）

链接与参考

- AstrBot 官方文档: https://docs.astrbot.app/
- NapcatQQ 项目页: https://napneko.github.io/

概述

- 本文档说明如何快速在 Linux/WSL/Docker 环境中安装并配置 AstrBot 与 NapcatQQ，以便把 QQ 接入到 AI（例如本地或远程的 LLM 服务）。包含安装命令、常见配置、启动方式及故障排查要点。

注意与前提条件

- 推荐在 Linux 服务器或 WSL2 下操作。
- 需要有可用的 QQ 账号或 bot（根据 Napcat 的支持方式），以及目标 AI 服务的访问方式（HTTP webhook、socket 或本地进程）。

## NapcatQQ

### 安装 NapcatQQ

NapcatQQ 是一个支持多种 QQ 协议适配器的机器人宿主项目，通常用于接入 QQ 并将消息转发给下游 AI 服务。

在线安装脚本（Linux / WSL）

```
curl -o napcat.sh https://nclatest.znin.net/NapNeko/NapCat-Installer/main/script/install.sh && bash napcat.sh --tui
```

### 配置 NapcatQQ

- 后台运行（使用 screen，无需 sudo）
```bash
screen -dmS napcat bash -c "xvfb-run -a /root/Napcat/opt/QQ/qq --no-sandbox"
```
- 访问  Napcat WebUI
  打开浏览器，访问 `http://<your-host>:6099/webui/`，使用 在 /root/Napcat/opt/QQ/resources/app/app_launcher/napcat/config/webui.json 中的 Token 登录。

- 配置 WebSocket 客户端
登陆后左侧网络配置中添加 ws 客户端，填写 AstrBot 的 URL（例如 `ws://<your-host>:6199/ws`）和 Token。

Napcat 相关信息

- 插件位置: /root/Napcat/opt/QQ/resources/app/app_launcher/napcat
- WebUI Token: 在 /root/Napcat/opt/QQ/resources/app/app_launcher/napcat/config/webui.json 中查看

常用 Screen 命令
```bash
- 带账号启动
screen -dmS napcat bash -c "xvfb-run -a /root/Napcat/opt/QQ/qq --no-sandbox -q QQ号码"
- 附加到会话
screen -r napcat
- 停止会话
screen -S napcat -X quit
```

## AstrBot

### 安装

AstrBot 是一个可以对接多种 AI 后端并提供聊天、指令处理的中间服务。官方安装与配置请以官方文档为准，下面是快速安装示例：

Linux / WSL（一键脚本）

```
bash <(curl -sSL https://raw.githubusercontent.com/zhende1113/Antlia/refs/heads/main/Script/AstrBot/Antlia.sh)
```

### AstrBot 配置

- 运行 astrbot

```bash
./astrbot.sh
```

- 访问 WebUI
  打开浏览器，访问 `http://<your-host>:6199/webui/`，使用初始账号 astrbot 和密码 astrbot 登录。

- 配置机器人
  在机器人中添加平台类别（onebot），配置好 NapcatQQ 中设置的 WebSocket 地址（例如 `ws://<your-host>:6099/ws`）和 Token。

- 配置模型
    根据你的 AI 服务类型（如本地 LLM、远程 API 等），在 AstrBot 中添加相应的模型配置。

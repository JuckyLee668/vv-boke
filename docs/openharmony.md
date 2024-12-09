# OpenHarmony SDK编译手册 

```
openharmony 设备开发文档
https://docs.openharmony.cn/pages/v4.1/zh-cn/device-dev/device-dev-guide.md
```
```
#OpenHarmony 版本概述 
https://gitee.com/openharmony/docs/blob/master/zh-cn/release-notes/OpenHarmony-v5.0.0-release.md
```
```
#github 文档集合
https://github.com/fenwii/OpenHarmony/tree/master
```
##  源码获取
### 通过rope获取
```
mkdir -p OpenHarmony-v4.0-Release && cd OpenHarmony-v4.0-Release
repo init -u https://gitee.com/openharmony/manifest -b refs/tags/OpenHarmony-v4.0-Release --no-repo-verify
repo sync -c
repo forall -c 'git lfs pull'
```
### 通过华为镜像站获取
```
https://mirrors.huaweicloud.com/harmonyos/os/5.0.0-Release/
```
## 环境搭建
系统：ubuntu 

### 安装docker
```
sudo apt install docker.io
```

### 镜像下载
```
sudo docker pull swr.cn-south-1.myhuaweicloud.com/openharmony-docker/openharmony-docker:1.0.0
```

## SDK编译
### 创建容器
```
sudo docker run -it -v /work/OpenHamrony-v4.0-Release:/home/openharmony swr.cn-south-1.myhuaweicloud.com/openharmony-docker/openharmony-docker:1.0.0
```
其中
 -  命令中`/work/OpenHamrony-v4.0-Release`表示OH源代码在PC Linux中的实际路径
 -  命令中`/home/openharmony`表示OpenHarmony源代码在容器中的虚拟目录

### 安装编译工具
```
# 移动到容器内OpenHarmony主目录
cd /home/openharmony
# 下载编译工具
./build/prebuilts_download.sh
```
安装hb编译工具，在命令行终端中，执行如下命令：

```
# 跳转到容器内OpenHarmony源代码主目录
cd /home/openharmony
# 安装hb等工具
pip3 install build/hb
# 如果上述pip3 install build/hb无效，则运行如下命令（同样是安装hb工具）
python3 -m pip install --user build/lite
```
### 选择编译分支
```
# 移动到容器内OpenHarmony主目录
cd /home/openharmony
# 设置OpenHarmony主目录
hb set -root .
```

### 开始编译
```
在docker命令行终端中，强制编译OpenHamrony源码，执行如下命令
hb build -f
```
```
或者可以选择性编译（即已编译过，不再编译），执行如下命令：
hb build
```

### docker常用命令
```
# 列出所有的容器
docker container ls --all
```
```
# 根据列出的容器，选择对应的containerID
docker container start [containerID]
```
```
# 接入到容器中
docker container attach [containerID]
```
```
# 删除容器
docker rm [containerID]
```
## 常见问题
### Code: 4000
可能原因：因为Linux-5.10内核中开启了 CONFIG_DEBUG_INFO_BTF=y 调试项，这个项会在编译过程调用pahole工具去分析整个内核，这个过程需要大量内存，内存耗内导致编译失败。

解决方法：在目录`//kernel/linux/config/linux-5.10/rk3568/arch/arm64_defconfig`下找到arm64_defconfig文件，找到CONFIG_DEBUG_INFO_BTF=y这一行，前面加上#注释掉即可





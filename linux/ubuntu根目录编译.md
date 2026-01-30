## 问题
### 根目录空间不足（2.3G）
  1. 重新编译 resize2fs :
      ```
      git clone https://git.code.sf.net/p/e2fsprogs/code e2fsprogs
      cd e2fsprogs
      ./configure --host=aarch64-linux-gnu --prefix=/usr/aarch64-linux-gnu
      make -j$(nproc)
      ```
   2. 将编译好的 `/e2fsprogs/resize/resize2fs` 替换ubuntu根文件中 `/usr/sbin/resize2fs`
   3. `/etc/init.d/resize2fs.sh`下增加
      ```bash
      #!/bin/bash
      ### BEGIN INIT INFO
      # Provides:          rongpin
      # Required-Start:    
      # Required-Stop:     
      # Should-Stop:       
      # Default-Start:     
      # X-Start-Before:    
      # Default-Stop:      
      # Short-Description: Rongpin platform scripts
      ### END INIT INFO
      
      # resize filesystem 
      mt_blk=$(lsblk |grep "/$" | sed 's/ .*$//g' | sed 's/^.*[^a-z0-9]//g')
      
      if [ ! "${mt_blk}" == "" ]; then
      	resize2fs /dev/$mt_blk
      else
      	mt_blk=$(lsblk |grep "/var/tmp$" | sed 's/ .*$//g' | sed 's/^.*[^a-z0-9]//g')
      	resize2fs /dev/$mt_blk
      fi
      ```
### 出现开机等待网络情况出现

  1.可以在根文件系统下配置`sudo nano /etc/netplan/00-installer-config.yaml`
  
    ```yaml
    network:
    version: 2
    ethernets:
      # 有线网卡可留空或配置
    wifis:
      wlo1:  # 无线接口名，可通过 `ip a` 或 `iwconfig` 查看（常见如 wlo1, wlan0, wlxc83a35c2e0b7）
        dhcp4: true
        access-points:
          "你的WiFi名称":
            password: "你的密码"
    ```
  2.应用配置
  
    ```bash
    sudo netplan try  # 测试配置
    sudo netplan apply # 或直接应用
    ```
    
### 没有curl 
安装常用软件
```bash
apt install curl openssh-server
```
### 没有蓝牙
### 中文乱码
  
### sudo报错
  根文件系统安装 `apt install sudo`


day2
- [FAILED] Failed to mount FUSE Control File System.
- [FAILED] Failed to mount Kernel Configuration File System.
- [FAILED] Failed to mount POSIX Message Queue File System.
- dev-mqueue.mount: Failed with result 'exit-code'.
- lee无root 权限
- no wifi

sed -i 

## 常用命令
df 
cat /proc/partitions
df -h
lsblk

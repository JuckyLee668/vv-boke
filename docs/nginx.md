# nginx 配置

## ssl配置
### certbot 安装
```bash
sudo apt install -y certbot
sudo apt install python3-certbot-nginx //安装依赖
#证书申请
certbot certonly --nginx -d xihan.us.kg -d www.xihan.us.kg
```


### nginx配置
```
vi /etc/nginx/sites-available/test

listen 9010 ssl;
ssl_certificate /etc/letsencrypt/live/xihan.us.kg/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/xihan.us.kg/privkey.pem;
ssl_trusted_certificate  /etc/letsencrypt/live/xihan.us.kg/chain.pem;

```


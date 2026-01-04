# nginx 配置

## ssl配置
### certbot 安装
```bash
sudo apt update && sudo apt install certbot python3-certbot-nginx
#证书申请
sudo certbot --nginx -d rack.xi-han.top --non-interactive --agree-tos -m a@xi-han.top
```


### nginx配置
```
vi /etc/nginx/sites-available/default

# 强制 HTTP 跳转到 HTTPS（可选：单独 server 块）
server {
    listen 80;
    listen [::]:80;
    server_name rack.xi-han.top;

    # 推荐：ACME 挑战路径（用于 Certbot 自动续期）
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/html;
        allow all;
    }

    # 其他请求全部跳转 HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# 主 HTTPS 服务
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name rack.xi-han.top;

    # === SSL 证书路径 ===
    ssl_certificate /etc/letsencrypt/live/rack.xi-han.top/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/rack.xi-han.top/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    # HSTS（强制浏览器未来请求都走 HTTPS）
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # 其他安全头（可选）
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options "SAMEORIGIN";
    add_header Referrer-Policy "no-referrer-when-downgrade";

    # === 网站根目录 ===
    root /var/www/html;
    index index.html index.htm;

    # === 反向代理示例（如你的 Bot API）===
    location /bot-api/ {
        proxy_pass http://127.0.0.1:9081/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # === 静态文件服务（如你的 TG 文件）===
    location /bot-api-files/ {
        alias /media/TGbot/;
        autoindex off;
        # 可选：限制 IP
        # allow 1.2.3.4;
        # deny all;
    }

    # === 错误页面 ===
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}

```


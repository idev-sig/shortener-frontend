# Shortener Frontend

一个超简单的短网址管理平台（前端）。

[**配置后端 API：shortener**](https://git.jetsung.com/idev/shortener)

预览: ![Shortener](screenshot.png)

## 开发与构建

### 安装依赖

```bash
npm install
```

### 本地开发

1. 更新 OpenAPI
   - 修改 `config/openapi.json`
2. 生成 OpenAPI API

```bash
npm run openapi
```

### 本地运行

```bash
# Mock 模式
npm run start

# Proxy 模式
npm run dev
```

### 构建

```bash
npm run build
```

## 部署

### Docker

```yaml
---
# https://github.com/idevsig/shortener

services:
  shortener:
    image: ghcr.io/idevsig/shortener:dev-amd64
    container_name: shortener
    restart: unless-stopped
    ports:
      - ${BACKEND_PORT:-8080}:8080
    volumes:
      - ./data:/app/data
      - ./config.toml:/app/config.toml
    depends_on:
      - valkey

  valkey:
    image: valkey/valkey:latest
    restart: unless-stopped
    environment:
      - TZ=Asia/Shanghai

  frontend:
    image: ghcr.io/idevsig/shortener-frontend:dev-amd64
    restart: unless-stopped
    ports:
      - ${FRONTEND_PORT:-8081}:80
```

### Nginx 反向代理

```nginx
# 前端配置
location / {
    proxy_pass   http://127.0.0.1:8080;

    client_max_body_size  1024m;
    proxy_set_header Host $host:$server_port;

    proxy_set_header X-Real-Ip $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;  # 透传 HTTPS 协议标识
    proxy_set_header X-Forwarded-Ssl on;         # 明确 SSL 启用状态

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_connect_timeout 99999;
}

# 对接 API
location /api/ {
    proxy_pass   http://127.0.0.1:8081/api/v1/;

    client_max_body_size  1024m;
    proxy_set_header Host $host:$server_port;

    proxy_set_header X-Real-Ip $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;  # 透传 HTTPS 协议标识
    proxy_set_header X-Forwarded-Ssl on;         # 明确 SSL 启用状态

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_connect_timeout 99999;
}
```

## 仓库镜像

- https://git.jetsung.com/idev/shortener-frontend
- https://framagit.org/idev/shortener-frontend
- https://gitcode.com/idev/shortener-frontend
- https://github.com/idevsig/shortener-frontend

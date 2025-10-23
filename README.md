# Shortener Frontend

一个超简单的短网址管理平台（前端）。

[**配置后端 API：shortener-frontend**](https://git.jetsung.com/idev/shortener-frontend)

## [Docker](./deploy/docker/README.md)

> **版本：** `latest`, `dev`, <`TAG`>

| Registry | Image |
| --- | --- |
| [**Docker Hub**](https://hub.docker.com/r/idevsig/shortener-frontend/) | `idevsig/shortener-frontend` |
| [**GitHub Container Registry**](https://github.com/idev-sig/shortener-frontend/pkgs/container/shortener-frontend) | `ghcr.io/idev-sig/shortener-frontend` |
| **Tencent Cloud Container Registry（SG）** | `sgccr.ccs.tencentyun.com/idevsig/shortener-frontend` |
| **Aliyun Container Registry（GZ）** | `registry.cn-guangzhou.aliyuncs.com/idevsig/shortener-frontend` |

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

部署教程查看 [**shortener-frontend**](https://git.jetsung.com/idev/shortener-frontend#文档) 项目。

## 仓库镜像

- [MyCode](https://git.jetsung.com/idev/shortener-frontend)
- [Framagit](https://framagit.org/idev/shortener-frontend)
- [GitCode](https://gitcode.com/idev/shortener-frontend)
- [GitHub](https://github.com/idev-sig/shortener-frontend)

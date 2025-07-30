FROM node:22 AS builder

WORKDIR /build
COPY . .

RUN <<EOF
# 若已存在 dist 目录，则跳过构建
if [ ! -d dist ]; then
    npm install
    npm run build
fi
EOF

FROM joseluisq/static-web-server:2

WORKDIR /app

COPY --from=builder /build/dist ./dist

CMD ["--root", "./dist"]

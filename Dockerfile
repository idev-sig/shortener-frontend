FROM node:22 AS builder

WORKDIR /build
COPY . .

RUN <<EOF
if [[ ! -d /build/dist ]]; then
    npm install
    npm run build
fi
EOF

FROM joseluisq/static-web-server:2

WORKDIR /app

COPY --from=builder /build/dist ./dist

CMD ["--root", "./dist"]

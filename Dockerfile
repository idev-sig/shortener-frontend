FROM node:22 AS builder

WORKDIR /build
COPY . .

RUN <<EOF
npm install
npm run build
EOF

FROM joseluisq/static-web-server:2

WORKDIR /app

COPY --from=builder /build/dist ./dist

CMD ["--root", "./dist"]

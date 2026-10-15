FROM docker.io/hugomods/hugo:ci-0.154.5 AS builder

WORKDIR /src

ENV HUGO_CACHEDIR=/tmp/hugo_cache

# 1. Salin dependensi Node.js
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install

# 2. Salin konfigurasi dan folder themes/ terlebih dahulu
# (Agar Hugo mengenali modul/tema lokal tanpa harus meng-copy seluruh konten Markdown)
COPY hugo.toml go.mod ./
COPY themes/ ./themes/

# 3. Jalankan hugo mod get dengan aman karena folder themes dan konfigurasi sudah lengkap
RUN --mount=type=cache,target=/tmp/hugo_cache \
    hugo mod get

# 4. Baru salin sisa source code lainnya (termasuk folder content/, static/, dll)
COPY . .

# 5. Build website
RUN npm run build

FROM nginx:alpine3.21-slim AS static
COPY --from=builder /src/public /usr/share/nginx/html

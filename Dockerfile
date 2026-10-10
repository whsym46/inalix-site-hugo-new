FROM docker.io/hugomods/hugo:exts-0.126.3 AS builder

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm install

COPY . .
RUN sed --in-place "s/tmp.inalix.co.id/${SITE_DOMAIN}/" hugo.toml
RUN npm run build

FROM nginx:alpine3.21-slim AS static
COPY --from=builder /src/public /usr/share/nginx/html


# ================== Build de la API (NestJS) ==================
FROM node:22-alpine AS build-api
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm ci
COPY apps/api/ .
RUN npm run build && npm prune --omit=dev

# ================== Build del frontend (React 19) ==================
FROM node:22-alpine AS build-web
WORKDIR /app
COPY apps/web/package*.json apps/web/.npmrc ./
RUN npm ci
COPY apps/web/ .
RUN npm run build

# ================== Imagen final: Apache + Node (solo builds) ==================
FROM node:22-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive TZ=America/Chihuahua
RUN apt-get update && apt-get install -y --no-install-recommends \
        apache2 supervisor libcap2-bin tzdata \
 && a2enmod proxy proxy_http headers rewrite \
 && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
 && rm -rf /var/lib/apt/lists/*

# Variables por defecto; docker-compose / Kubernetes las sobreescriben.
ENV NODE_ENV=production \
    PORT=3000 \
    API_PREFIX=prueba/api/v1 \
    FRONT_URL=/prueba/ \
    SAML_CERT_DIR=/var/www/prueba/cert \
    PUBLIC_CONTENT_PATH=/var/www/prueba/public_content \
    PRIVATE_CONTENT_PATH=/var/www/private_content

# Estructura igual a la plantilla: /var/www/<proyecto>/{web,api,public_content}
# y private_content fuera del directorio publicado.
COPY --from=build-web /app/dist            /var/www/prueba/web
COPY --from=build-api /app/dist            /var/www/prueba/api/dist
COPY --from=build-api /app/node_modules    /var/www/prueba/api/node_modules
COPY --from=build-api /app/package.json    /var/www/prueba/api/package.json

COPY docker/apache/000-default.conf        /etc/apache2/sites-available/000-default.conf
COPY docker/supervisord/supervisord.conf   /etc/supervisor/conf.d/supervisord.conf

# --- Sin root, en puerto 80 (igual que la plantilla) ---
RUN mkdir -p /var/www/prueba/public_content /var/www/private_content \
             /var/log/apache2 /var/run/apache2 /var/lock/apache2 \
 && setcap 'cap_net_bind_service=+ep' /usr/sbin/apache2 \
 && chown -R www-data:www-data /var/www/prueba /var/www/private_content \
             /var/log/apache2 /var/run/apache2 /var/lock/apache2 \
 && chmod -R 770 /var/www/prueba/public_content /var/www/private_content

USER www-data
WORKDIR /var/www/prueba
EXPOSE 80
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

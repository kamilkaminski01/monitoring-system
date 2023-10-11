# 1st Stage
# Build React App static files
FROM node:13.12.0-alpine AS builder
WORKDIR /frontend
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm install
COPY ./frontend/ ./
RUN npm run build

# 2nd Stage
# Use nginx to server static files
FROM nginx:alpine
COPY --from=builder /frontend/build /usr/share/nginx/html
COPY ./frontend/deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 1st Stage
# Build React App static files
FROM node:20.3.1-alpine AS builder
WORKDIR /frontend
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm install
COPY ./frontend/ ./
RUN npm run build

# 2nd Stage
# Use nginx to serve static files
FROM nginx:alpine
COPY --from=builder /frontend/dist /usr/share/nginx/html
COPY ./frontend/deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf

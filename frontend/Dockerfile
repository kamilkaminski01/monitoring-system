# 1st Stage
# Build React App static files
FROM node:20.3.1-alpine AS builder
RUN mkdir -p /app
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build

# 2nd Stage
# Use nginx to serve static files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf

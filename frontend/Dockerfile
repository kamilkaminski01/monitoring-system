# 1st Stage
# Build React App static files
FROM node:13.12.0-alpine AS builder
RUN mkdir -p /app
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build

# 2nd Stage
# Use nginx to server static files
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
COPY ./deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

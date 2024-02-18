FROM node:20.3.1-alpine

ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 3000

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

COPY . ./

CMD ["npm", "run", "dev"]

# Use the official Node.js image.
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -f

COPY . .

EXPOSE 80

CMD ["npm", "run", "start"]
# Build Stage
FROM node:20-alpine as builder
# as builder

# Install required packages
RUN apk add --no-cache git openssh-client

WORKDIR /app

# Clone the repository recursively to include submodules
COPY . .

# Install dependencies and build the application
RUN npm install -f
RUN npm run build

# Production Stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
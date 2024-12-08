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

COPY --from=builder /app/dist /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

COPY docker-entry.sh /docker-entry.sh
RUN chmod +x /docker-entry.sh

EXPOSE 80

ENTRYPOINT ["/docker-entry.sh"]

CMD ["nginx", "-g", "daemon off;"]
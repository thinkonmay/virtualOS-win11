# Build Stage
FROM node:20-alpine as builder

# Install required packages
RUN apk add --no-cache git openssh-client

WORKDIR /app

# Copy only necessary files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install -f

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Use the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
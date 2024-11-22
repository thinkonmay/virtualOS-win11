# Build stage
FROM node:20-alpine AS build

# Install required packages
RUN apk add --no-cache git openssh-client

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Git-related files
COPY .gitmodules ./
COPY .git ./


# Git init submodule
RUN git submodule update --init --recursive

# Install dependencies
RUN npm install -f

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
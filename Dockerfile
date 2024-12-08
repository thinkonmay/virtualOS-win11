# Build Stage
FROM node:20-alpine as builder
# as builder

# Install required packages
RUN apk add --no-cache git openssh-client apk sed

WORKDIR /app

# Clone the repository recursively to include submodules
COPY . .

ARG GOOGLE_ANALYTIC_CODE 
ENV GOOGLE_ANALYTIC_CODE=${GOOGLE_ANALYTIC_CODE}

# Install dependencies and build the application
RUN npm install -f
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
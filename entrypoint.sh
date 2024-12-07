#!/bin/sh

# Generate a dynamic environment.js file for client-side environment variables
echo "window.ENV = {
  VITE_SUPABASE_LOCAL_KEY: '${VITE_SUPABASE_LOCAL_KEY}',
  VITE_SUPABASE_GLOBAL_URL: '${VITE_SUPABASE_GLOBAL_URL}',
  VITE_SUPABASE_GLOBAL_KEY: '${VITE_SUPABASE_GLOBAL_KEY}',
  VITE_ANALYTICS_CODE: '${VITE_ANALYTICS_CODE}'
}" > /usr/share/nginx/html/env.js

# Modify index.html to include the env.js script
sed -i '/<head>/a <script src="/env.js"></script>' /usr/share/nginx/html/index.html

# Start nginx
nginx -g "daemon off;"
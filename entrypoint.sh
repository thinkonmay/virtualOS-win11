#!/bin/sh

# Check if the environment variable is set
if [ -z "$GOOGLE_ANALYTIC_CODE" ]; then
  echo "Environment variable GOOGLE_ANALYTIC_CODE is not set."
else
  echo "Replacing ANALYTIC_CODE with $GOOGLE_ANALYTIC_CODE in index.html..."
  sed -i "s/ANALYTIC_CODE/$GOOGLE_ANALYTIC_CODE/g" /usr/share/nginx/html/index.html
fi

# Start Nginx
nginx -g "daemon off;"
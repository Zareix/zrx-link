#!/bin/sh

# Replace "<API_URL>" with the actual API URL in /var/www/html/env.js
echo "Replacing env with '${PUBLIC_URL}'"
sed -i "s|<API_URL>|${PUBLIC_URL}|" /var/www/html/env.js

# Start nginx in the background
echo "Starting nginx..."
nginx -g "daemon off;" &

# Wait for db to start
echo "Waiting a bit for db to start..."
sleep 5

# Run backend
echo "Starting backend..."
cd ./backend || exit
bun run start

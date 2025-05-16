
#!/bin/bash

# Exit on error
set -e

echo "Building frontend..."
npm run build

echo "Setting up backend..."
cd src/backend
npm install

echo "Starting backend with PM2..."
# Install PM2 if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Stop any running instances
pm2 stop server || true

# Start the server with PM2
pm2 start server.js

echo "Done! Your application is now deployed."
echo "Frontend available at: http://YOUR_EC2_IP:3001"
echo "Backend API endpoint at: http://YOUR_EC2_IP:3001/api/create-answer"

# Save PM2 config to restart on reboot
pm2 save
pm2 startup

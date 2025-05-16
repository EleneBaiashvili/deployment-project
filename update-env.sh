
#!/bin/bash

# Script to update the .env file with the EC2 public IP

if [ -z "$1" ]; then
  echo "Usage: ./update-env.sh YOUR_EC2_PUBLIC_IP"
  exit 1
fi

EC2_IP=$1

echo "Updating .env file with EC2 IP: $EC2_IP"
echo "VITE_API_URL=http://$EC2_IP:3001" > .env

echo "Environment updated successfully!"

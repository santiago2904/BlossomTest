#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Run database migrations
echo "Running database migrations..."
npm run migration:run

# Start the application
echo "Starting the application..."
npm run dev 
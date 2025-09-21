#!/bin/bash

# StyleMine App Startup Script (Fixed for macOS file limit issue)
echo "🚀 Starting StyleMine App..."

# Fix macOS file watcher limit issue
ulimit -n 65536
echo "📁 File limit set to: $(ulimit -n)"

# Set Node.js path for macOS Ventura compatibility
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

# Check Node.js and npm versions
echo "📋 Checking Node.js setup..."
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Navigate to project directory
cd "$(dirname "$0")"

# Start the Expo development server with reduced file watching
echo "🎯 Starting Expo development server..."
echo "This will open your default browser automatically."
echo "If it doesn't open, go to: http://localhost:19006"
echo ""
echo "Available options once started:"
echo "- Press 'w' to open in web browser"
echo "- Press 'i' to open iOS simulator"
echo "- Press 'a' to open Android emulator"
echo "- Press 'q' to quit"
echo ""

# Start the app with polling instead of file watching to avoid EMFILE error
EXPO_USE_FAST_REFRESH=false npm start --web
#!/bin/bash

# Kill any running Metro bundlers or Expo processes
echo "Killing any running Metro and Expo processes..."
pkill -f "expo start"
pkill -f "node.*metro"

# Wait a moment for processes to terminate
sleep 1

# Clear the Metro bundler cache
echo "Clearing Metro bundler cache..."
rm -rf $TMPDIR/metro-*
rm -rf node_modules/.cache
rm -rf ~/.expo/cache

# Clear Watchman watches if Watchman is installed
if command -v watchman >/dev/null 2>&1; then
  echo "Resetting Watchman..."
  watchman watch-del-all
fi

echo "Cache cleared. You can now start your app with:"
echo "npm run ios -- --reset-cache" 
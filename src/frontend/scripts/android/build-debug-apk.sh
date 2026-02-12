#!/bin/bash

# Build script for Android debug APK
# This script builds the React app, syncs with Capacitor, and builds the Android APK

set -e  # Exit on error

echo "🔨 Building Expense Saver Android APK..."
echo ""

# Navigate to frontend directory if not already there
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$FRONTEND_DIR"

# Step 1: Build React app
echo "📦 Step 1/3: Building React web app..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ React build failed"
    exit 1
fi
echo "✅ React build complete"
echo ""

# Step 2: Sync Capacitor
echo "🔄 Step 2/3: Syncing Capacitor..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "❌ Capacitor sync failed"
    exit 1
fi
echo "✅ Capacitor sync complete"
echo ""

# Step 3: Build Android APK
echo "🤖 Step 3/3: Building Android APK..."
cd android

# Make gradlew executable if not already
chmod +x gradlew

# Clean and build
./gradlew clean assembleDebug
if [ $? -ne 0 ]; then
    echo "❌ Android build failed"
    exit 1
fi

cd ..
echo "✅ Android APK build complete"
echo ""

# Show output location
APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 Success! APK built successfully"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📍 Location: $APK_PATH"
    echo "📦 Size: $APK_SIZE"
    echo ""
    echo "To install on a connected device:"
    echo "  adb install -r $APK_PATH"
    echo ""
else
    echo "⚠️  APK file not found at expected location"
    exit 1
fi

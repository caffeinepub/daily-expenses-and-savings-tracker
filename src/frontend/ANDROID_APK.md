# Building Android APK for Expense Saver

This guide explains how to build a debug APK of the Expense Saver app that can be installed on Android devices.

## Prerequisites

Before building the APK, ensure you have the following installed:

### 1. Java Development Kit (JDK)
- **Required Version**: JDK 11 or higher
- **Download**: [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/)
- **Verify Installation**:
  ```bash
  java -version
  ```

### 2. Android Studio & Android SDK
- **Download**: [Android Studio](https://developer.android.com/studio)
- **Required Components**:
  - Android SDK Platform 33 (Android 13)
  - Android SDK Build-Tools 33.0.0 or higher
  - Android SDK Command-line Tools
  - Android SDK Platform-Tools

- **Set Environment Variables** (add to your `.bashrc`, `.zshrc`, or system environment):
  ```bash
  export ANDROID_HOME=$HOME/Android/Sdk  # or your SDK location
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  export PATH=$PATH:$ANDROID_HOME/tools
  export PATH=$PATH:$ANDROID_HOME/tools/bin
  ```

- **Verify Installation**:
  ```bash
  echo $ANDROID_HOME
  adb --version
  ```

### 3. Node.js & npm
- Already installed for the React frontend
- Verify with: `node -v` and `npm -v`

### 4. Capacitor CLI
Install Capacitor globally:

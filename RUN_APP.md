# How to Run Voilà App

## Quick Start (3 Steps)

### Step 1: Open Terminal and Navigate to Project

```bash
cd /Users/siyaarora/Desktop/Voilà
```

### Step 2: Set Node.js Path (Required for macOS Ventura)

```bash
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
```

### Step 3: Start the App

```bash
npm start
```

## What Happens Next

1. **Expo Dev Server Starts**: You'll see a QR code and menu options
2. **Choose Platform**:
   - Press `w` for web browser (easiest to test)
   - Press `i` for iOS simulator (if you have Xcode)
   - Press `a` for Android emulator (if you have Android Studio)
   - Scan QR code with Expo Go app on your phone

## Alternative Commands

### Run on Web Browser (Recommended for Testing)

```bash
npm run web
```

### Run on iOS Simulator

```bash
npm run ios
```

### Run on Android Emulator

```bash
npm run android
```

## Troubleshooting

### If you get "command not found: npm"

```bash
# Make sure Node.js path is set
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
node --version  # Should show v20.19.3
npm --version   # Should show 10.8.2
```

### If you get dependency errors

```bash
# Reinstall dependencies
npm install
```

### If Expo doesn't start

```bash
# Install Expo CLI globally
npm install -g @expo/cli
```

## Expected App Features

Once running, you'll see:

- **Bottom Tab Navigation**: Closet, Outfits, Planner
- **Closet Tab**: Virtual wardrobe (will be empty initially)
- **Camera Button**: Floating action button for Smart Upload
- **Outfits Tab**: AI outfit suggestions
- **Planner Tab**: Calendar for outfit scheduling

## Note About Firebase

The app will show empty screens initially because:

1. Firebase configuration needs your API keys
2. No user authentication is set up yet
3. No clothing items have been uploaded

For a full demo, you would need to:

1. Set up Firebase project
2. Add your API keys to `.env` file
3. Enable authentication
4. Upload some clothing items

## Just Want to See the Code?

The main screens are in:

- `src/screens/ClosetScreen.tsx`
- `src/screens/SmartUploadScreen.tsx`
- `src/screens/OutfitSuggestScreen.tsx`
- `src/screens/PlannerScreen.tsx`

The AI processing code is in:

- `functions/decomposeOutfit.py`
- `functions/generateOutfits.ts`

# Voilà - AI Outfit Evaluation App

*Your look. Elevated. Voilà.*

A clean, elegant React Native/Expo application that provides AI-powered outfit evaluation and style feedback.

## Features

### 🎯 Two Main Modes

1. **Standard Analysis** - Comprehensive outfit evaluation with:

   - Overall style score (1-10)
   - Detailed style analysis
   - What works well in your outfit
   - Style enhancement suggestions
   - Current trending elements

2. **Custom Request** - Personalized feedback where you can:
   - Upload your outfit photo
   - Specify exactly what you want evaluated
   - Get targeted AI feedback based on your specific needs

## Quick Start

### Prerequisites

- Node.js and npm installed
- OpenAI API key with GPT-4 Vision access

### Setup

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

   Add your OpenAI API key to `.env`:

   ```
   EXPO_PUBLIC_OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

3. **Start the application:**

   ```bash
   npm start
   ```

   Press `w` to open in web browser or use Expo Go app on mobile.

## How It Works

### Standard Analysis

- Upload a full-body outfit photo
- Get comprehensive AI analysis including score, feedback, and trending suggestions
- Perfect for general style improvement

### Custom Request

- Upload your outfit photo
- Tell the AI exactly what you want feedback on:
  - "Suggest matching jewelry"
  - "What looks off about this outfit?"
  - "How can I make this more formal?"
  - "What accessories would complete this look?"
- Get targeted, specific advice

## Project Structure

```
Voilà/
├── App.tsx                 # Main application with integrated functionality
├── src/
│   └── services/
│       └── openai.ts      # OpenAI API integration
├── assets/                # App icons and images
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

## Key Technologies

- **React Native/Expo** - Cross-platform mobile development
- **OpenAI GPT-4 Vision** - AI-powered image analysis and fashion advice
- **TypeScript** - Type-safe development

## Usage Tips

### For Best Results:

- Use good lighting when taking photos
- Include full outfit (shoes, accessories)
- Take clear, unobstructed photos
- Try different angles for comprehensive feedback

### API Usage:

- Each evaluation costs ~$0.01-0.03
- Monitor usage in OpenAI dashboard
- Requires active internet connection

## Development

The app uses a clean, minimal architecture:

- Single main component (`App.tsx`) with tab navigation
- Centralized OpenAI service for all AI interactions
- Elegant, professional UI matching modern design standards

## Support

For setup issues, see `OUTFIT_EVALUATION_SETUP.md` for detailed troubleshooting.

---

**Voilà** - Your look. Elevated. Voilà. ✨

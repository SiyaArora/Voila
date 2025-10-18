# AI Outfit Evaluation Feature Setup

This guide will help you set up the AI outfit evaluation feature in your Voilà app.

## Prerequisites

1. **Node.js and npm/yarn**: Make sure you have Node.js installed on your system
2. **OpenAI API Key**: You'll need an OpenAI API key with access to GPT-4 Vision

## Installation Steps

### 1. Install Dependencies

Run one of the following commands in your project directory:

```bash
npm install openai
# or
yarn add openai
```

### 2. Environment Configuration

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Add your OpenAI API key to the `.env` file:

   ```
   EXPO_PUBLIC_OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

   **Important**: Make sure to use your actual OpenAI API key that has access to GPT-4 Vision.

### 3. Start the Application

```bash
npm start
# or
yarn start
```

Then press `w` to open in web browser, or use the Expo Go app on your mobile device.

## Features

### AI Outfit Evaluation

- **Upload outfit photos** and get AI-powered style analysis
- **Personalized feedback** based on current fashion trends
- **Style scoring** from 1-10 with detailed breakdown
- **Improvement suggestions** with specific recommendations

### What the AI Analyzes

1. **Current Trends Alignment**: How well your outfit matches 2024-2025 fashion trends
2. **Color Coordination**: Color palette and harmony analysis
3. **Fit and Proportions**: How well the clothing fits and flatters
4. **Styling Techniques**: Layering, accessorizing, and overall composition
5. **Seasonal Appropriateness**: Whether the outfit suits the current season

### Feedback Categories

- ✅ **What You Did Right**: Positive aspects of your outfit
- 💡 **Style Improvements**: Specific suggestions to enhance your look
- 🔥 **Trending Elements**: Current fashion trends you can incorporate

## Usage

1. **Navigate to AI Style Tab**: Tap the "🤖 AI Style" tab in the bottom navigation
2. **Upload Photo**: Tap "📷 Upload Outfit Photo" and select an image
3. **Get Evaluation**: Tap "🤖 Evaluate My Outfit" to receive AI analysis
4. **Review Results**: Read through the detailed feedback and suggestions

## Tips for Best Results

- **Good Lighting**: Take photos in natural light or well-lit areas
- **Full Outfit**: Include shoes, accessories, and the complete look
- **Clear Image**: Ensure the photo is clear and shows the outfit details
- **Different Angles**: Try multiple photos for comprehensive feedback

## Troubleshooting

### Common Issues

1. **"Cannot find module 'openai'" Error**

   - Make sure you've installed the OpenAI package: `npm install openai`

2. **API Key Issues**

   - Verify your OpenAI API key is correct in the `.env` file
   - Ensure your API key has access to GPT-4 Vision
   - Check that you have sufficient API credits

3. **Image Upload Not Working**

   - On mobile: Make sure camera permissions are granted
   - On web: Ensure your browser supports file uploads

4. **Evaluation Takes Too Long**
   - This is normal - AI analysis can take 10-30 seconds
   - Check your internet connection
   - Verify your OpenAI API key is working

### Error Messages

- **"No response from OpenAI"**: Check your API key and internet connection
- **"Failed to evaluate outfit"**: Try uploading a different image or check API credits

## API Usage and Costs

- Each outfit evaluation uses OpenAI's GPT-4 Vision API
- Typical cost: ~$0.01-0.03 per evaluation
- Monitor your usage in the OpenAI dashboard

## Security Notes

- API keys are stored in environment variables
- Never commit your actual API key to version control
- The app uses client-side API calls (suitable for personal use)
- For production apps, consider using a backend service for API calls

## Current Trends Database

The AI is trained on current fashion trends including:

- Y2K revival styles
- Oversized and structured pieces
- Color blocking techniques
- Sustainable fashion choices
- Seasonal trend updates

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all setup steps were completed
3. Check the browser/app console for error messages
4. Ensure your OpenAI API key has the necessary permissions

---

**Note**: This feature requires an active internet connection and valid OpenAI API credentials to function properly.

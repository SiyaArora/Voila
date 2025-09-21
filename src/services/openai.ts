import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true, // Required for client-side usage in React Native/Web
});

export interface OutfitEvaluation {
  whatYouDidRight: string[];
  improvements: string[];
  overallScore: number;
  styleAnalysis: string;
  trendingElements: string[];
}

export const evaluateOutfit = async (
  imageBase64: string
): Promise<OutfitEvaluation> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a professional fashion stylist and trend expert. Think of yourself as someone who knows everything about current fashion trends. Think like Coco Chanel, Karl Lagerfield, Yves Saint Laurent. Carefully analyze this specific outfit image and provide detailed, personalized feedback based on current 2024-2025 fashion trends.

IMPORTANT: Look at the actual clothing items, colors, fit, and styling in this specific image. Do not give generic advice.

Analyze what you see in the image:
- What specific clothing items are worn?
- What colors and patterns do you observe?
- How do the pieces fit on the person?
- What accessories (if any) are visible?
- What is the overall styling approach?

Based on your analysis of this specific outfit, respond in this exact JSON format:
{
  "whatYouDidRight": ["List 3-5 specific elements that work well in this outfit based on what you see in the image and current trends"],
  "improvements": ["List 3-5 specific, actionable improvement suggestions based on the actual outfit shown, with current trend recommendations. For each suggestion, be as detailed as possible and include specific tweaks, such as changes to colors, styles, or combinations. Suggest specific color changes or combinations that would improve the outfit, referencing the actual colors present in the image."],
  "overallScore": [Score from 1-10 based on the actual outfit],
  "styleAnalysis": "Detailed analysis of this specific outfit and how it fits current trends, including commentary on color choices and how they could be improved.",
  "trendingElements": ["List current trending elements that would specifically enhance THIS outfit"]
}

Focus on current 2024-2025 trends:
- Y2K revival, coquette aesthetic, clean girl makeup
- Oversized blazers, wide-leg pants, cropped tops
- Layering, color blocking, monochromatic looks
- Statement accessories, chunky jewelry, mini bags
- Sustainable fashion, vintage pieces
- Bold colors, pastels, earth tones

Be specific about what you actually see in the image and give personalized advice for this exact outfit. Prioritize actionable, detailed feedback, especially regarding color choices and how to improve them.`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_tokens: 1200,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Clean the response - remove markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // Parse the JSON response
    const evaluation = JSON.parse(cleanContent) as OutfitEvaluation;
    return evaluation;
  } catch (error) {
    console.error("Error evaluating outfit:", error);

    // Provide a helpful error message but still try to give some feedback
    return {
      whatYouDidRight: [
        "Unable to analyze image - please check your API key and internet connection",
      ],
      improvements: [
        "Make sure your OpenAI API key is valid and has sufficient credits",
        "Check that the image uploaded successfully",
        "Try uploading a different image format (JPG, PNG)",
      ],
      overallScore: 0,
      styleAnalysis: `Error analyzing outfit: ${
        error instanceof Error ? error.message : "Unknown error"
      }. Please check your OpenAI API key configuration.`,
      trendingElements: [
        "Fix API configuration to get personalized recommendations",
      ],
    };
  }
};

export const getTrendingStyles = async (): Promise<string[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `List the top 10 most trending fashion styles and elements for 2024-2025. Focus on:
          - Current runway trends
          - Street style trends
          - Social media fashion trends
          - Seasonal trends
          
          Return as a JSON array of strings, each describing a specific trend.`,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    return JSON.parse(content) as string[];
  } catch (error) {
    console.error("Error fetching trending styles:", error);

    // Return fallback trending styles
    return [
      "Oversized blazers and structured shoulders",
      "Y2K revival: low-rise jeans and crop tops",
      "Chunky gold jewelry and statement earrings",
      "Platform shoes and chunky sneakers",
      "Color blocking with bold, contrasting colors",
      "Sheer and mesh layering pieces",
      "Wide-leg trousers and palazzo pants",
      "Vintage band tees and graphic prints",
      "Leather and faux leather everything",
      "Minimalist accessories with clean lines",
    ];
  }
};

export const customEvaluateOutfit = async (
  imageBase64: string,
  userPrompt: string
): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a professional fashion stylist and trend expert. The user has uploaded an outfit image and has a specific request: "${userPrompt}". Carefully analyze the outfit in the image and provide a detailed, personalized response that addresses the user's request. Be specific and actionable, referencing the actual clothing, colors, and styling you see in the image. Do not give generic advice.`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.5,
    });
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }
    return content.trim();
  } catch (error) {
    console.error("Error in custom outfit evaluation:", error);
    return (
      error instanceof Error
        ? error.message
        : "Unknown error during custom evaluation."
    );
  }
};

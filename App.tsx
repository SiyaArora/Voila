import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  evaluateOutfit,
  getTrendingStyles,
  OutfitEvaluation,
  customEvaluateOutfit,
} from "./src/services/openai";

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState<
    "standard" | "custom"
  >("standard");
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = React.useState(false);
  const [evaluation, setEvaluation] = React.useState<OutfitEvaluation | null>(
    null
  );
  const [trendingStyles, setTrendingStyles] = React.useState<string[]>([]);

  // Custom evaluation state
  const [customPrompt, setCustomPrompt] = React.useState("");
  const [customEvaluation, setCustomEvaluation] = React.useState<string | null>(
    null
  );
  const [isCustomEvaluating, setIsCustomEvaluating] = React.useState(false);

  const handleImageUpload = async () => {
    if (Platform.OS === "web") {
      // For web, use HTML file input
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            setUploadedImage(e.target.result);
            setEvaluation(null); // Clear previous evaluation
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      Alert.alert(
        "Mobile Upload",
        "Mobile camera functionality will be available once expo-image-picker installs!"
      );
    }
  };

  const handleEvaluateOutfit = async () => {
    if (!uploadedImage) {
      Alert.alert("No Image", "Please upload an outfit image first.");
      return;
    }

    console.log("Starting outfit evaluation...");
    setIsEvaluating(true);
    try {
      console.log("Calling evaluateOutfit with image...");
      const result = await evaluateOutfit(uploadedImage);
      console.log("Evaluation result:", result);
      setEvaluation(result);
    } catch (error) {
      console.error("Evaluation error:", error);
      Alert.alert(
        "Error",
        "Failed to evaluate outfit. Please check your OpenAI API key and try again."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const loadTrendingStyles = async () => {
    try {
      const styles = await getTrendingStyles();
      setTrendingStyles(styles);
    } catch (error) {
      console.error("Error loading trending styles:", error);
    }
  };

  const handleCustomEvaluate = async () => {
    if (!uploadedImage) {
      Alert.alert("No Image", "Please upload an outfit image first.");
      return;
    }
    if (!customPrompt.trim()) {
      Alert.alert(
        "No Request",
        "Please enter what you want to be evaluated on."
      );
      return;
    }
    setIsCustomEvaluating(true);
    try {
      const result = await customEvaluateOutfit(uploadedImage, customPrompt);
      setCustomEvaluation(result);
    } catch (error) {
      Alert.alert("Error", "Failed to evaluate outfit. Please try again.");
      setCustomEvaluation(null);
    } finally {
      setIsCustomEvaluating(false);
    }
  };

  React.useEffect(() => {
    loadTrendingStyles();
  }, []);

  const renderScoreBar = (score: number) => {
    const percentage = (score / 10) * 100;
    const color = score >= 8 ? "#D4AF37" : score >= 6 ? "#C9A96E" : "#B8860B";

    return (
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Style Score</Text>
        <View style={styles.scoreBarContainer}>
          <View
            style={[
              styles.scoreBar,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={[styles.scoreText, { color }]}>{score}/10</Text>
      </View>
    );
  };

  const renderEvaluationSection = (
    title: string,
    items: string[],
    icon: string
  ) => (
    <View style={styles.evaluationSection}>
      <Text style={styles.sectionTitle}>
        {icon} {title}
      </Text>
      {items.map((item, index) => (
        <View key={index} style={styles.evaluationItem}>
          <View style={styles.bulletPoint} />
          <Text style={styles.evaluationText}>{item}</Text>
        </View>
      ))}
    </View>
  );

  if (currentScreen === "custom") {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        
        {/* Top Navigation Tabs */}
        <View style={styles.topTabContainer}>
          <TouchableOpacity
            style={[
              styles.topTab,
              currentScreen === "standard" && styles.activeTopTab,
            ]}
            onPress={() => setCurrentScreen("standard")}
          >
            <Text
              style={[
                styles.topTabText,
                currentScreen === "standard" && styles.activeTopTabText,
              ]}
            >
              Standard Analysis
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.topTab,
              currentScreen === "custom" && styles.activeTopTab,
            ]}
            onPress={() => setCurrentScreen("custom")}
          >
            <Text
              style={[
                styles.topTabText,
                currentScreen === "custom" && styles.activeTopTabText,
              ]}
            >
              Custom Request
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerSubtitle}>Your look. Elevated.</Text>
            <Text style={styles.headerTitle}>Voilà</Text>
            <View style={styles.goldLine} />
            <View style={styles.customPageInfo}>
              <Text style={styles.customPageTitle}>Custom AI Evaluation</Text>
              <Text style={styles.customPageSubtitle}>
                Upload your outfit and tell us what you want feedback on!
              </Text>
            </View>
          </View>

          <View style={styles.uploadSection}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImageUpload}
              activeOpacity={0.8}
            >
              <Text style={styles.uploadButtonText}>
                {uploadedImage ? "Change Photo" : "Upload Outfit Photo"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.customSectionWrapper}>
            <Text style={styles.customSectionLabel}>
              What do you want to be evaluated on?
            </Text>
            <View style={styles.customContentSection}>
              <View style={styles.customImageContainer}>
                {uploadedImage ? (
                  <View style={styles.customImageFrame}>
                    <Image
                      source={{ uri: uploadedImage }}
                      style={styles.customUploadedImage}
                    />
                  </View>
                ) : (
                  <View style={styles.customImagePlaceholder}>
                    <Text style={styles.customImagePlaceholderText}>
                      Upload an image to get started
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.customPromptContainer}>
                <TextInput
                  style={styles.customPromptInput}
                  placeholder="e.g. Suggest matching jewelry, what looks off, how to make it more formal, etc."
                  placeholderTextColor="#B8B8B8"
                  value={customPrompt}
                  onChangeText={setCustomPrompt}
                  multiline
                />
              </View>
            </View>
          </View>

          <View style={styles.customButtonSection}>
            <TouchableOpacity
              style={[
                styles.customEvaluateButton,
                isCustomEvaluating && styles.evaluateButtonDisabled,
              ]}
              onPress={handleCustomEvaluate}
              disabled={isCustomEvaluating}
              activeOpacity={0.8}
            >
              {isCustomEvaluating ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#D4AF37" size="small" />
                  <Text style={styles.loadingText}>Analyzing...</Text>
                </View>
              ) : (
                <Text style={styles.customEvaluateButtonText}>
                  Get Custom Feedback
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {customEvaluation && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>AI Feedback</Text>
              <Text style={styles.evaluationText}>{customEvaluation}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Navigation Tabs */}
      <View style={styles.topTabContainer}>
        <TouchableOpacity
          style={[
            styles.topTab,
            currentScreen === "standard" && styles.activeTopTab,
          ]}
          onPress={() => setCurrentScreen("standard")}
        >
          <Text
            style={[
              styles.topTabText,
              currentScreen === "standard" && styles.activeTopTabText,
            ]}
          >
            Standard Analysis
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.topTab,
            currentScreen === "custom" && styles.activeTopTab,
          ]}
          onPress={() => setCurrentScreen("custom")}
        >
          <Text
            style={[
              styles.topTabText,
              currentScreen === "custom" && styles.activeTopTabText,
            ]}
          >
            Custom Request
          </Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Your look. Elevated.</Text>
        <Text style={styles.headerTitle}>Voilà</Text>
        <View style={styles.goldLine} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImageUpload}
            activeOpacity={0.8}
          >
            <Text style={styles.uploadButtonText}>
              {uploadedImage ? "Change Photo" : "Upload Outfit Photo"}
            </Text>
          </TouchableOpacity>

          {uploadedImage && (
            <View style={styles.imageContainer}>
              <View style={styles.imageFrame}>
                <Image
                  source={{ uri: uploadedImage }}
                  style={styles.uploadedImage}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.evaluateButton,
                  isEvaluating && styles.evaluateButtonDisabled,
                ]}
                onPress={handleEvaluateOutfit}
                disabled={isEvaluating}
                activeOpacity={0.8}
              >
                {isEvaluating ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#D4AF37" size="small" />
                    <Text style={styles.loadingText}>Analyzing...</Text>
                  </View>
                ) : (
                  <Text style={styles.evaluateButtonText}>Evaluate Style</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Evaluation Results */}
        {evaluation && (
          <View style={styles.resultsContainer}>
            {/* Gold Divider */}
            <View style={styles.goldDivider} />

            <Text style={styles.resultsTitle}>Style Analysis</Text>

            {renderScoreBar(evaluation.overallScore)}

            <View style={styles.analysisContainer}>
              <Text style={styles.analysisText}>
                {evaluation.styleAnalysis}
              </Text>
            </View>

            {renderEvaluationSection(
              "What Works Well",
              evaluation.whatYouDidRight,
              "✓"
            )}

            {renderEvaluationSection(
              "Style Enhancements",
              evaluation.improvements,
              "→"
            )}

            {renderEvaluationSection(
              "Trending Now",
              evaluation.trendingElements,
              "★"
            )}
          </View>
        )}

        {/* Trending Styles Section */}
        {trendingStyles.length > 0 && !evaluation && (
          <View style={styles.trendingSection}>
            <Text style={styles.trendingTitle}>Current Trends</Text>
            <Text style={styles.trendingSubtitle}>
              Fashion inspiration for the modern wardrobe
            </Text>
            {trendingStyles.slice(0, 6).map((trend, index) => (
              <View key={index} style={styles.trendItem}>
                <View style={styles.trendNumber}>
                  <Text style={styles.trendNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.trendText}>{trend}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Instructions */}
        {!uploadedImage && (
          <View style={styles.instructionsSection}>
            <Text style={styles.instructionsTitle}>How It Works</Text>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>1</Text>
              </View>
              <Text style={styles.instructionText}>
                Upload a clear, full-body photo of your outfit
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Receive personalized style analysis from our AI
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Discover trending elements to elevate your look
              </Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by AI • Inspired by Fashion
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFCF8",
  },
  header: {
    backgroundColor: "#FEFCF8",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F1EB",
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "300",
    color: "#1A1A1A",
    letterSpacing: 3,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontStyle: "italic",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B6B6B",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontWeight: "300",
    marginBottom: 12,
  },
  goldLine: {
    width: 60,
    height: 1,
    backgroundColor: "#D4AF37",
    marginTop: 20,
  },
  content: {
    flex: 1,
  },
  uploadSection: {
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  uploadButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D4AF37",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 0,
    marginBottom: 30,
  },
  uploadButtonText: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  imageContainer: {
    alignItems: "center",
    width: "100%",
  },
  imageFrame: {
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 30,
  },
  uploadedImage: {
    width: 280,
    height: 380,
    borderRadius: 2,
  },
  evaluateButton: {
    backgroundColor: "#1A1A1A",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 0,
    minWidth: 200,
    alignItems: "center",
  },
  evaluateButtonDisabled: {
    backgroundColor: "#8A8A8A",
  },
  evaluateButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 10,
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  resultsContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 40,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  goldDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#D4AF37",
    marginBottom: 30,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: "300",
    color: "#1A1A1A",
    marginBottom: 30,
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: "300",
    color: "#6B6B6B",
    marginBottom: 12,
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  scoreBarContainer: {
    width: "80%",
    height: 2,
    backgroundColor: "#F5F1EB",
    marginBottom: 12,
  },
  scoreBar: {
    height: "100%",
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "300",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  analysisContainer: {
    backgroundColor: "#FEFCF8",
    padding: 25,
    borderRadius: 4,
    marginBottom: 35,
    borderLeftWidth: 3,
    borderLeftColor: "#D4AF37",
  },
  analysisText: {
    fontSize: 16,
    color: "#4A4A4A",
    lineHeight: 26,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontWeight: "300",
  },
  evaluationSection: {
    marginBottom: 35,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "400",
    color: "#1A1A1A",
    marginBottom: 20,
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  evaluationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  bulletPoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D4AF37",
    marginRight: 16,
    marginTop: 10,
  },
  evaluationText: {
    flex: 1,
    fontSize: 15,
    color: "#4A4A4A",
    lineHeight: 24,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontWeight: "300",
  },
  trendingSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 35,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  trendingTitle: {
    fontSize: 24,
    fontWeight: "300",
    color: "#1A1A1A",
    marginBottom: 8,
    letterSpacing: 2,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  trendingSubtitle: {
    fontSize: 14,
    color: "#6B6B6B",
    marginBottom: 30,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontWeight: "300",
  },
  trendItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F1EB",
  },
  trendNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  trendNumberText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  trendText: {
    flex: 1,
    fontSize: 15,
    color: "#4A4A4A",
    lineHeight: 22,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontWeight: "300",
  },
  instructionsSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 35,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  instructionsTitle: {
    fontSize: 24,
    fontWeight: "300",
    color: "#1A1A1A",
    marginBottom: 30,
    letterSpacing: 2,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F5F1EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  instructionNumberText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#1A1A1A",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: "#4A4A4A",
    lineHeight: 22,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontWeight: "300",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  footerText: {
    fontSize: 12,
    color: "#8A8A8A",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontWeight: "300",
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 20,
    backgroundColor: "#F5F1EB",
    borderRadius: 4,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 2,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    color: "#6B6B6B",
    fontWeight: "400",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  activeTabText: {
    color: "#1A1A1A",
    fontWeight: "500",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backText: {
    fontSize: 16,
    color: "#1A1A1A",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontWeight: "400",
  },
  promptSection: {
    marginHorizontal: 30,
    marginBottom: 20,
  },
  promptLabel: {
    fontSize: 16,
    color: "#1A1A1A",
    marginBottom: 8,
    fontWeight: "400",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  promptInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D4AF37",
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    fontSize: 15,
    minHeight: 60,
    textAlignVertical: "top",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  customSectionWrapper: {
    paddingHorizontal: 40,
    paddingVertical: 30,
    alignItems: "center",
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  customSectionLabel: {
    fontSize: 18,
    color: "#1A1A1A",
    marginBottom: 20,
    fontWeight: "400",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    textAlign: "center",
  },
  customContentSection: {
    flexDirection: "row",
    gap: 30,
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
  },
  customImageContainer: {
    alignItems: "center",
    width: 320,
  },
  customImageFrame: {
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    width: 320,
    height: 420,
  },
  customUploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 2,
  },
  customImagePlaceholder: {
    backgroundColor: "#F5F1EB",
    borderRadius: 4,
    width: 320,
    height: 420,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E8E0D6",
    borderStyle: "dashed",
  },
  customImagePlaceholderText: {
    fontSize: 14,
    color: "#8A8A8A",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontWeight: "300",
    letterSpacing: 0.5,
  },
  customPromptContainer: {
    width: 320,
    alignItems: "flex-start",
  },
  customPromptLabel: {
    fontSize: 16,
    color: "#1A1A1A",
    marginBottom: 12,
    fontWeight: "400",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    alignSelf: "flex-start",
  },
  customPromptInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D4AF37",
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    fontSize: 15,
    height: 420,
    width: 320,
    textAlignVertical: "top",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontWeight: "300",
    lineHeight: 22,
    color: "#1A1A1A",
  },
  customButtonSection: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  customEvaluateButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D4AF37",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 4,
    alignItems: "center",
  },
  customEvaluateButtonText: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  customMiddleSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  customUploadButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D4AF37",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginTop: 20,
  },
  customUploadButtonText: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    textAlign: "center",
  },
  customPageInfo: {
    alignItems: "center",
    marginTop: 20,
  },
  customPageTitle: {
    fontSize: 20,
    fontWeight: "400",
    color: "#1A1A1A",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    marginBottom: 8,
  },
  customPageSubtitle: {
    fontSize: 14,
    color: "#6B6B6B",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontWeight: "300",
    textAlign: "center",
  },
  topTabContainer: {
    flexDirection: "row",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#FEFCF8",
  },
  topTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTopTab: {
    borderBottomColor: "#D4AF37",
  },
  topTabText: {
    fontSize: 14,
    color: "#6B6B6B",
    fontWeight: "400",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  activeTopTabText: {
    color: "#1A1A1A",
    fontWeight: "500",
  },
});

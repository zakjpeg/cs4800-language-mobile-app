import { Gamemodes } from "@/utils/gamemodes";
import { LanguageData } from "@/utils/languages";
import { useColors } from "@/utils/theme";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// ── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  points?: number;
}
//a

type Mood = "happy" | "confused" | "angry";

// ── Mood helpers ──────────────────────────────────────────────────────────────

const MOOD_LADDER: Mood[] = ["angry", "confused", "happy"];

function stepMoodUp(current: Mood): Mood {
  const i = MOOD_LADDER.indexOf(current);
  return MOOD_LADDER[Math.min(i + 1, MOOD_LADDER.length - 1)];
}

function stepMoodDown(current: Mood): Mood {
  const i = MOOD_LADDER.indexOf(current);
  return MOOD_LADDER[Math.max(i - 1, 0)];
}

// ── API Call ──────────────────────────────────────────────────────────────────

async function getChatResponse(
  userMessage: string,
  language: string,
  gamemodeTopic: string,
  conversationHistory: ChatMessage[]
): Promise<string> {
  const languageData = LanguageData[language as keyof typeof LanguageData];
  if (!languageData) throw new Error("Invalid language");

  // Try to get API key from environment
  const apiKey = (process.env.EXPO_PUBLIC_GROQ_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.API_KEY) as string;

  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error(
      "API key not configured. Please set EXPO_PUBLIC_GROQ_API_KEY in .env.local and restart the dev server."
    );
  }

  const systemPrompt = `You are a friendly NPC having a casual conversation in ${language}.
Respond ONLY in ${language}, no English whatsoever.
Keep responses brief (1-2 sentences).
The conversation topic is: ${gamemodeTopic}.
Be natural and engaging, like you're chatting with someone.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role,
        content: m.text,
      })),
    { role: "user", content: userMessage },
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 150,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "API request failed");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ── Subcomponents ─────────────────────────────────────────────────────────────

function NPCBubble({
  name,
  avatarUri,
  speech,
  styles,
}: {
  name: string;
  avatarUri?: string;
  speech: string;
  styles: ReturnType<typeof StyleSheet.create>;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(-10);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, [speech, fadeAnim, slideAnim]);

  const avatarScaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(avatarScaleAnim, {
        toValue: 1.18,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(avatarScaleAnim, {
        toValue: 1,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [avatarUri, avatarScaleAnim]);

  return (
    <View style={styles.npcRow}>
      <View style={styles.avatarWrapper}>
        <Animated.View
          style={[
            styles.avatarRing,
            { transform: [{ scale: avatarScaleAnim }] },
          ]}
        >
          {avatarUri ? (
            <Image source={avatarUri} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>{name[0]}</Text>
            </View>
          )}
        </Animated.View>
        <Text style={styles.npcName}>{name}</Text>
      </View>

      <Animated.View
        style={[
          styles.speechBubble,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.bubbleTail} />
        <Text style={styles.speechText}>{speech}</Text>
      </Animated.View>
    </View>
  );
}

function ChatBubble({
  message,
  isUser,
  styles,
  points,
}: {
  message: string;
  isUser: boolean;
  styles: ReturnType<typeof StyleSheet.create>;
  points?: number;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 70,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        isUser ? styles.userBubbleContainer : styles.aiBubbleContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={isUser ? styles.userBubble : styles.aiBubble}>
        <Text style={isUser ? styles.userBubbleText : styles.aiBubbleText}>
          {message}
        </Text>
        {points && (
          <Text style={styles.pointsBadge}>+{points} pts</Text>
        )}
      </View>
    </Animated.View>
  );
}

function WinScreen({
  totalScore,
  onRetry,
  onHome,
  styles,
}: {
  totalScore: number;
  onRetry: () => void;
  onHome: () => void;
  styles: ReturnType<typeof StyleSheet.create>;
}) {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.winContainer,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Text style={styles.winEmoji}>🎉</Text>
      <Text style={styles.winTitle}>You Win!</Text>
      <Text style={styles.winScore}>{totalScore} Points</Text>
      <Text style={styles.winSubtitle}>Great job practicing!</Text>

      <View style={styles.winButtons}>
        <TouchableOpacity style={styles.playButton} onPress={onRetry}>
          <Text style={styles.playButtonText}>Play Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={onHome}>
          <Text style={styles.playButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function showLeaveAlert() {
  Alert.alert("End Game", "Are you sure you want to leave?", [
    { text: "Stay", style: "cancel" },
    {
      text: "Leave",
      onPress: () => {
        router.dismiss();
        router.replace("/");
      },
    },
  ]);
}

// ── Main Screen ───────────────────────────────────────────────────────────────

const TARGET_SCORE = 15;

export default function GameplayScreen() {
  const { gamemodeKey, language } = useLocalSearchParams();
  const gamemode = Gamemodes[gamemodeKey as string];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [mood, setMood] = useState<Mood>("happy");
  const [hasWon, setHasWon] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const topicString = gamemode?.topics?.join(", ") || "general conversation";

  const handleLeaveGame = useCallback(() => {
    router.replace("/");
  }, []);

  // Initial greeting from NPC
  useEffect(() => {
    const sendInitialGreeting = async () => {
      try {
        const greeting = `Hola! Como estás?`; // Will be replaced with actual greeting
        const initialMsg: ChatMessage = {
          id: "0",
          role: "assistant",
          text: greeting,
        };
        setMessages([initialMsg]);
      } catch (err) {
        setErrorMsg("Failed to initialize conversation");
      }
    };

    sendInitialGreeting();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await getChatResponse(
        userMsg.text,
        language as string,
        topicString,
        messages
      );
      
////////
      //
      //
      //TO BE REPLACE WITH ACTUAL SCORING LOGIC BASED ON RESPONSE QUALITY
      //
      //
////////
      const points = Math.floor(Math.random() * 5) + 1;
      const newScore = totalScore + points;

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: response,
        points,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setTotalScore(newScore);

      if (newScore >= TARGET_SCORE) {
        setHasWon(true);
      } else {
        setMood((m) => stepMoodUp(m));
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg =
        err instanceof Error ? err.message : "Failed to get response";
      setErrorMsg(errorMsg);
      setMood((m) => stepMoodDown(m));
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, totalScore, messages, language, topicString]);

  const handleRetry = () => {
    setMessages([
      {
        id: "0",
        role: "assistant",
        text: `Hola! Como estás?`,
      },
    ]);
    setInputText("");
    setTotalScore(0);
    setMood("happy");
    setHasWon(false);
    setErrorMsg("");
  };

  const handleHome = () => {
    router.dismiss();
    router.replace("/");
  };

  const colors = useColors();

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.surface },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
    },

    // ── Header
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      paddingHorizontal: 8,
    },
    title: {
      fontFamily: "Artz",
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
    },
    scoreDisplay: {
      backgroundColor: colors.accent,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      minWidth: 100,
    },
    scoreText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
      textAlign: "center",
    },
    scoreLabel: {
      color: "#fff",
      fontSize: 11,
      textAlign: "center",
      marginTop: 2,
    },

    // ── NPC Area
    npcContainer: {
      paddingHorizontal: 8,
      marginBottom: 16,
      marginTop: 8,
    },
    npcRow: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
    avatarWrapper: { alignItems: "center", gap: 6, paddingTop: 4 },
    avatarRing: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 2.5,
      borderColor: colors.accent,
      padding: 2,
      overflow: "hidden",
    },
    avatarImage: { width: "100%", height: "100%", borderRadius: 26 },
    avatarFallback: {
      flex: 1,
      backgroundColor: colors.accent,
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarInitial: { color: "#fff", fontSize: 20, fontWeight: "700" },
    npcName: {
      color: colors.primary,
      fontSize: 10,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      fontWeight: "600",
      fontFamily: "Artz",
    },
    speechBubble: {
      flex: 1,
      backgroundColor: "white",
      borderRadius: 16,
      borderTopLeftRadius: 4,
      padding: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    bubbleTail: {
      position: "absolute",
      left: -8,
      top: 12,
      width: 0,
      height: 0,
      borderTopWidth: 8,
      borderBottomWidth: 8,
      borderRightWidth: 10,
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
      borderRightColor: "white",
    },
    speechText: {
      fontSize: 15,
      lineHeight: 22,
      color: "#1A1A2E",
    },

    // ── Chat Messages
    messagesContainer: {
      flex: 1,
      gap: 8,
      paddingHorizontal: 8,
      marginBottom: 12,
    },
    userBubbleContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 8,
      marginVertical: 4,
    },
    aiBubbleContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingHorizontal: 8,
      marginVertical: 4,
    },
    userBubble: {
      backgroundColor: colors.accent,
      borderRadius: 16,
      borderBottomRightRadius: 4,
      paddingVertical: 10,
      paddingHorizontal: 14,
      maxWidth: "75%",
    },
    aiBubble: {
      backgroundColor: CARD_BG,
      borderRadius: 16,
      borderBottomLeftRadius: 4,
      paddingVertical: 10,
      paddingHorizontal: 14,
      maxWidth: "75%",
    },
    userBubbleText: {
      color: "#fff",
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "500",
    },
    aiBubbleText: {
      color: SAND,
      fontSize: 15,
      lineHeight: 20,
    },
    pointsBadge: {
      color: "#FFD700",
      fontSize: 12,
      fontWeight: "700",
      marginTop: 4,
    },

    // ── Error
    errorBanner: {
      backgroundColor: WRONG_COLOR,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      marginHorizontal: 8,
      marginBottom: 8,
    },
    errorText: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "500",
    },

    // ── Input Area
    inputContainer: {
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: 8,
      paddingVertical: 8,
      backgroundColor: colors.surfaceAlt,
      borderRadius: 12,
    },
    input: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: MUTED,
    },
    sendButton: {
      width: 42,
      height: 42,
      borderRadius: 8,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    sendButtonText: {
      fontSize: 18,
      color: "#fff",
    },

    // ── Win Screen
    winContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      gap: 12,
    },
    winEmoji: { fontSize: 72, marginBottom: 8 },
    winTitle: {
      fontFamily: "Artz",
      fontSize: 36,
      fontWeight: "700",
      color: colors.text,
    },
    winScore: {
      fontSize: 48,
      fontWeight: "800",
      color: colors.accent,
      letterSpacing: 2,
    },
    winSubtitle: {
      fontSize: 16,
      color: MUTED,
      marginBottom: 12,
    },
    winButtons: {
      flexDirection: "column",
      gap: 8,
      marginTop: 24,
      width: "100%",
    },
    playButton: {
      borderRadius: 500,
      backgroundColor: colors.tint,
      paddingVertical: 12,
    },
    backButton: {
      borderRadius: 500,
      backgroundColor: "#f3f3e3",
      paddingVertical: 12,
    },
    playButtonText: {
      fontFamily: "Artz",
      fontSize: 24,
      textAlign: "center",
      color: colors.text,
    },
    leaveButton: {
      paddingVertical: 8,
      marginTop: 12,
    },
    leaveButtonText: {
      color: MUTED,
      textAlign: "center",
      fontSize: 14,
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: gamemode?.title ?? "Game" }} />
      <View style={styles.safe}>
        {hasWon ? (
          <View style={styles.container}>
            <WinScreen
              totalScore={totalScore}
              onRetry={handleRetry}
              onHome={handleHome}
              styles={styles}
            />
          </View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            {/* Header with Score */}
            <View style={styles.header}>
              <Text style={styles.title}>{gamemode?.title}</Text>
              <View style={styles.scoreDisplay}>
                <Text style={styles.scoreText}>{totalScore}/15</Text>
                <Text style={styles.scoreLabel}>points</Text>
              </View>
            </View>

            {/* NPC Greeting */}
            {messages.length > 0 && messages[0].role === "assistant" && (
              <View style={styles.npcContainer}>
                <NPCBubble
                  name={gamemode?.npcName || "NPC"}
                  avatarUri={gamemode?.avatars?.[mood]}
                  speech={messages[0].text}
                  styles={styles}
                />
              </View>
            )}

            {/* Chat Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              {messages.slice(1).map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg.text}
                  isUser={msg.role === "user"}
                  points={msg.points}
                  styles={styles}
                />
              ))}
              {isLoading && (
                <View style={styles.aiBubbleContainer}>
                  <View style={styles.aiBubble}>
                    <ActivityIndicator color={SAND} size="small" />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Error Message */}
            {errorMsg && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your response..."
                placeholderTextColor={MUTED}
                value={inputText}
                onChangeText={setInputText}
                editable={!isLoading}
                multiline
                maxLength={200}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                activeOpacity={0.7}
              >
                <Text style={styles.sendButtonText}>
                  {isLoading ? "..." : "→"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Leave Button */}
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={handleLeaveGame}
            >
              <Text style={styles.leaveButtonText}>Leave Game</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        )}
      </View>
    </>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SAND = "#F5ECD7";
const CARD_BG = "#242438";
const MUTED = "#6B6B8A";
const WRONG_COLOR = "#C62828";

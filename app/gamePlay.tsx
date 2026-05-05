import { useRealTime } from "@/hooks/useRealTime";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ── Constants ─────────────────────────────────────────────────────────────────

const TEAL = "#1D9E75";
const SAND = "#F5ECD7";
const DARK_CARD = "#1A1A2E";
const MUTED = "#6B6B8A";
const BORDER = "#2A2A40";
const AMBER = "#EF9F27";

const { width } = Dimensions.get("window");

// ── Types ─────────────────────────────────────────────────────────────────────

type Mood = "happy" | "listening" | "thinking" | "excited";

interface TranscriptLine {
  id: string;
  role: "user" | "assistant";
  text: string;
}

// ── Orb Component ─────────────────────────────────────────────────────────────

function VoiceOrb({
  connected,
  loading,
  mood,
}: {
  connected: boolean;
  loading: boolean;
  mood: Mood;
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (connected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
      ).start();

      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      pulseAnim.stopAnimation();
      rotateAnim.stopAnimation();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [connected]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const orbColor = loading
    ? AMBER
    : connected
      ? mood === "excited"
        ? "#FF6B6B"
        : mood === "thinking"
          ? "#A78BFA"
          : TEAL
      : DARK_CARD;

  return (
    <View style={orbStyles.wrapper}>
      {/* Glow ring */}
      <Animated.View
        style={[
          orbStyles.glowRing,
          {
            opacity: glowAnim,
            transform: [{ scale: pulseAnim }, { rotate: spin }],
            borderColor: orbColor,
          },
        ]}
      />
      {/* Main orb */}
      <Animated.View
        style={[
          orbStyles.orb,
          { transform: [{ scale: pulseAnim }], backgroundColor: orbColor },
        ]}
      >
        {loading ? (
          <Text style={orbStyles.orbEmoji}>⏳</Text>
        ) : connected ? (
          <Text style={orbStyles.orbEmoji}>
            {mood === "excited" ? "🎉" : mood === "thinking" ? "🤔" : "🎙️"}
          </Text>
        ) : (
          <Text style={orbStyles.orbEmoji}>💬</Text>
        )}
      </Animated.View>
    </View>
  );
}

const orbStyles = StyleSheet.create({
  wrapper: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  glowRing: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  orb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  orbEmoji: {
    fontSize: 36,
  },
});

// ── Transcript Bubble ─────────────────────────────────────────────────────────

function TranscriptBubble({ line }: { line: TranscriptLine }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isUser = line.role === "user";

  return (
    <Animated.View
      style={[
        bubbleStyles.container,
        isUser ? bubbleStyles.userContainer : bubbleStyles.assistantContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View
        style={[
          bubbleStyles.bubble,
          isUser ? bubbleStyles.userBubble : bubbleStyles.assistantBubble,
        ]}
      >
        <Text
          style={[
            bubbleStyles.label,
            isUser ? bubbleStyles.userLabel : bubbleStyles.assistantLabel,
          ]}
        >
          {isUser ? "YOU" : "NPC"}
        </Text>
        <Text
          style={[
            bubbleStyles.text,
            isUser ? bubbleStyles.userText : bubbleStyles.assistantText,
          ]}
        >
          {line.text}
        </Text>
      </View>
    </Animated.View>
  );
}

const bubbleStyles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginVertical: 4 },
  userContainer: { alignItems: "flex-end" },
  assistantContainer: { alignItems: "flex-start" },
  bubble: {
    maxWidth: "78%",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 3,
  },
  userBubble: {
    backgroundColor: TEAL,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: DARK_CARD,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },
  label: { fontSize: 9, fontWeight: "700", letterSpacing: 1.2 },
  userLabel: { color: "rgba(255,255,255,0.6)" },
  assistantLabel: { color: MUTED },
  text: { fontSize: 14, lineHeight: 20 },
  userText: { color: "#fff", fontWeight: "500" },
  assistantText: { color: SAND },
});

// ── Score Badge ───────────────────────────────────────────────────────────────

function ScoreBadge({ score, target }: { score: number; target: number }) {
  const progress = Math.min(score / target, 1);
  return (
    <View style={scoreStyles.wrapper}>
      <View style={scoreStyles.bar}>
        <View
          style={[scoreStyles.fill, { width: `${progress * 100}%` as any }]}
        />
      </View>
      <Text style={scoreStyles.label}>
        {score} / {target} pts
      </Text>
    </View>
  );
}

const scoreStyles = StyleSheet.create({
  wrapper: { alignItems: "center", gap: 4, width: "100%" },
  bar: {
    width: "60%",
    height: 4,
    backgroundColor: DARK_CARD,
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: TEAL,
    borderRadius: 2,
  },
  label: { fontSize: 11, color: MUTED, letterSpacing: 0.5 },
});

// ── Win Screen ────────────────────────────────────────────────────────────────

function WinScreen({ score, onRetry }: { score: number; onRetry: () => void }) {
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
  }, []);

  return (
    <Animated.View
      style={[
        winStyles.container,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Text style={winStyles.emoji}>🎉</Text>
      <Text style={winStyles.title}>You Win!</Text>
      <Text style={winStyles.score}>{score} pts</Text>
      <Text style={winStyles.subtitle}>Great conversation!</Text>
      <Pressable style={winStyles.button} onPress={onRetry}>
        <Text style={winStyles.buttonText}>Play Again</Text>
      </Pressable>
    </Animated.View>
  );
}

const winStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 32,
  },
  emoji: { fontSize: 72 },
  title: { fontSize: 36, fontWeight: "800", color: SAND, letterSpacing: 1 },
  score: { fontSize: 52, fontWeight: "800", color: TEAL, letterSpacing: 2 },
  subtitle: { fontSize: 15, color: MUTED, marginBottom: 8 },
  button: {
    marginTop: 16,
    backgroundColor: TEAL,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 999,
  },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});

// ── Main Screen ───────────────────────────────────────────────────────────────

const TARGET_SCORE = 15;

export default function VoiceGameScreen() {
  const { gamemodeKey, language } = useLocalSearchParams();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<Mood>("happy");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const { startSession, stopSession } = useRealTime({
    onTranscript: (text, role) => {
      const line: TranscriptLine = {
        id: Date.now().toString(),
        role,
        text,
      };
      setTranscript((prev) => [...prev, line]);

      if (role === "user") {
        setMood("thinking");
        // Award random points for now — replace with real scoring
        const pts = Math.floor(Math.random() * 4) + 1;
        setScore((prev) => {
          const next = prev + pts;
          if (next >= TARGET_SCORE) setHasWon(true);
          return next;
        });
      } else {
        setMood("excited");
        setTimeout(() => setMood("listening"), 1500);
      }
    },
    onConnected: () => setMood("listening"),
    onDisconnected: () => setMood("happy"),
  });

  const handlePress = async () => {
    if (connected) {
      stopSession();
      setConnected(false);
    } else {
      setLoading(true);
      try {
        await startSession({ gamemodeKey, language });
        setConnected(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRetry = () => {
    setScore(0);
    setHasWon(false);
    setTranscript([]);
    setMood("happy");
    stopSession();
    setConnected(false);
  };

  const statusText = loading
    ? "Connecting..."
    : connected
      ? mood === "thinking"
        ? "Processing..."
        : "Speak now"
      : "Tap to start";

  if (hasWon) {
    return (
      <View style={styles.safe}>
        <WinScreen score={score} onRetry={handleRetry} />
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Practice</Text>
        <ScoreBadge score={score} target={TARGET_SCORE} />
      </View>

      {/* Transcript */}
      <ScrollView
        ref={scrollRef}
        style={styles.transcript}
        contentContainerStyle={styles.transcriptContent}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {transcript.length === 0 && (
          <Text style={styles.emptyHint}>
            Connect and start speaking to begin your practice session.
          </Text>
        )}
        {transcript.map((line) => (
          <TranscriptBubble key={line.id} line={line} />
        ))}
      </ScrollView>

      {/* Orb + Controls */}
      <View style={styles.controls}>
        <Text style={styles.statusText}>{statusText}</Text>

        <VoiceOrb connected={connected} loading={loading} mood={mood} />

        <Pressable
          onPress={handlePress}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            connected && styles.buttonActive,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>
            {loading ? "Connecting..." : connected ? "Disconnect" : "Connect"}
          </Text>
        </Pressable>

        {connected && (
          <Text style={styles.hint}>
            The NPC is listening — speak naturally
          </Text>
        )}
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0F0F1A",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: MUTED,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  transcript: {
    flex: 1,
  },
  transcriptContent: {
    paddingVertical: 16,
    gap: 4,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  emptyHint: {
    color: MUTED,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  controls: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 24,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  statusText: {
    fontSize: 13,
    color: MUTED,
    letterSpacing: 0.5,
    height: 18,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: DARK_CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },
  buttonActive: {
    backgroundColor: "#3D0000",
    borderColor: "#C62828",
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: SAND,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: 12,
    color: MUTED,
    textAlign: "center",
  },
});

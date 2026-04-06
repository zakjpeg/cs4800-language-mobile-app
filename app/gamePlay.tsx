import { useColors } from "@/utils/theme";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// ── Types ────────────────────────────────────────────────────────────────────

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface GameplayScreenProps {
  npcName?: string;
  npcAvatarUri?: string;
  npcSpeech?: string;
  choices?: Choice[];
  questionNumber?: number;
  totalQuestions?: number;
  onChoiceSelected?: (choice: Choice) => void;
}

// ── Mock data (swap with your real props) ────────────────────────────────────

const MOCK_CHOICES: Choice[] = [
  { id: "a", text: "Bonjour, comment ça va?", isCorrect: true },
  { id: "b", text: "Gracias, mucho gusto.", isCorrect: false },
  { id: "c", text: "Ciao, come stai?", isCorrect: false },
];

// ── Subcomponents ─────────────────────────────────────────────────────────────

function ProgressBar({
  current,
  total,
  styles,
}: {
  current: number;
  total: number;
  styles: any;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: current / total,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [current]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, { width }]} />
    </View>
  );
}

function NPCBubble({
  name,
  avatarUri,
  speech,
  styles,
}: {
  name: string;
  avatarUri?: string;
  speech: string;
  styles: any;
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
  }, [speech]);

  return (
    <View style={styles.npcRow}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarRing}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>{name[0]}</Text>
            </View>
          )}
        </View>
        <Text style={styles.npcName}>{name}</Text>
      </View>

      {/* Speech bubble */}
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

function ChoiceCard({
  choice,
  index,
  onPress,
  selectedId,
  styles,
}: {
  choice: Choice;
  index: number;
  onPress: (choice: Choice) => void;
  selectedId: string | null;
  styles: any;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 70,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 200,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
    onPress(choice);
  };

  const isSelected = selectedId === choice.id;
  const isOther = selectedId !== null && !isSelected;

  const labels = ["A", "B", "C"];

  return (
    <Animated.View
      style={[
        styles.choiceCardWrapper,
        {
          opacity: isOther
            ? fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.4],
              })
            : fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        disabled={selectedId !== null}
        style={[styles.choiceCard, isSelected && styles.choiceCardSelected]}
      >
        <View
          style={[styles.choiceLabel, isSelected && styles.choiceLabelSelected]}
        >
          <Text
            style={[
              styles.choiceLabelText,
              isSelected && styles.choiceLabelTextSelected,
            ]}
          >
            {labels[index]}
          </Text>
        </View>
        <Text
          style={[styles.choiceText, isSelected && styles.choiceTextSelected]}
        >
          {choice.text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function GameplayScreen({
  npcName = "Sophie",
  npcAvatarUri,
  npcSpeech = "Salut! Comment réponds-tu à cette salutation en français?",
  choices = MOCK_CHOICES,
  questionNumber = 3,
  totalQuestions = 10,
  onChoiceSelected,
}: GameplayScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleChoice = (choice: Choice) => {
    if (selectedId) return;
    setSelectedId(choice.id);
    onChoiceSelected?.(choice);
  };

  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: useColors().surface,
    },
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 24,
    },

    // ── Header
    header: {
      marginBottom: 8,
    },
    questionCounter: {
      fontFamily: "Artz",
      fontSize: 28,
      fontWeight: "700",
      color: useColors().text,
      marginBottom: 10,
    },
    questionCounterMuted: {
      color: useColors().text,
      fontWeight: "400",
      fontSize: 22,
    },
    progressTrack: {
      height: 4,
      backgroundColor: useColors().surfaceAlt,
      borderRadius: 2,
      overflow: "hidden",
    },
    progressFill: {
      height: 4,
      backgroundColor: useColors().accent,
      borderRadius: 2,
    },

    // ── NPC Area
    npcArea: {
      flex: 3,
      justifyContent: "center",
      paddingTop: 8,
    },
    npcRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 14,
    },
    avatarWrapper: {
      alignItems: "center",
      gap: 6,
      paddingTop: 4,
    },
    avatarRing: {
      width: 62,
      height: 62,
      borderRadius: 31,
      borderWidth: 2.5,
      borderColor: useColors().accent,
      padding: 2,
      overflow: "hidden",
    },
    avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: 28,
    },
    avatarFallback: {
      flex: 1,
      backgroundColor: useColors().accent,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarInitial: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "700",
    },
    npcName: {
      color: useColors().primary,
      fontSize: 11,
      letterSpacing: 1,
      textTransform: "uppercase",
      fontWeight: "600",
      fontFamily: "Artz",
    },
    speechBubble: {
      flex: 1,
      backgroundColor: "white",
      borderRadius: 18,
      borderTopLeftRadius: 4,
      padding: 18,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 6,
      position: "relative",
    },
    bubbleTail: {
      position: "absolute",
      left: -9,
      top: 14,
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
      fontSize: 17,
      lineHeight: 26,
      color: "#1A1A2E",
      fontStyle: "italic",
    },

    // ── Divider
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: "#2E2E48",
    },
    dividerLabel: {
      color: "#6b6b8a",
      fontSize: 11,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      fontWeight: "600",
    },

    // ── Choices
    choicesArea: {
      flex: 5,
      justifyContent: "center",
      gap: 12,
    },
    choiceCardWrapper: {
      borderRadius: 16,
    },
    choiceCard: {
      backgroundColor: useColors().icon,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    choiceCardSelected: {
      backgroundColor: useColors().accent,
    },
    choiceLabel: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: useColors().text,
      alignItems: "center",
      justifyContent: "center",
    },
    choiceLabelSelected: {
      backgroundColor: useColors().text,
    },
    choiceLabelText: {
      color: MUTED,
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    choiceLabelTextSelected: {
      color: useColors().background,
    },
    choiceText: {
      flex: 1,
      color: SAND,
      fontSize: 16,
      lineHeight: 22,
    },
    choiceTextSelected: {
      color: "#fff",
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.questionCounter}>
            {questionNumber}{" "}
            <Text style={styles.questionCounterMuted}>/ {totalQuestions}</Text>
          </Text>
          <ProgressBar
            current={questionNumber}
            total={totalQuestions}
            styles={styles}
          />
        </View>

        {/* NPC Area — top ~30% */}
        <View style={styles.npcArea}>
          <NPCBubble
            name={npcName}
            avatarUri={npcAvatarUri}
            speech={npcSpeech}
            styles={styles}
          />
        </View>

        {/* Divider label */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>Your response</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Choices — bottom ~55% */}
        <View style={styles.choicesArea}>
          {choices.map((choice, i) => (
            <ChoiceCard
              key={choice.id}
              choice={choice}
              index={i}
              onPress={handleChoice}
              selectedId={selectedId}
              styles={styles}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const SAND = "#F5ECD7";
const CHARCOAL = "#1A1A2E";
const ACCENT = "#E8632A";
const CARD_BG = "#242438";
const MUTED = "#6B6B8A";
const BUBBLE_BG = "#FFFFFF";

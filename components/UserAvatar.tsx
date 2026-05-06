import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

// ── Types ─────────────────────────────────────────────────────────────────────

type GamemodeKey = "cop" | "taxi" | "airport" | "date";

interface UserAvatarProps {
  volume: number;       // 0–1 amplitude from audio stream
  isSpeaking: boolean;
}

// ── Frame image map ───────────────────────────────────────────────────────────
// Requires images at e.g. assets/images/cop-0.png … cop-3.png

const FRAMES = {
  cop:     [
    require("@/assets/images/cop-0.png"),
    require("@/assets/images/cop-1.png"),
    require("@/assets/images/cop-2.png"),
    require("@/assets/images/cop-3.png"),
  ],
  taxi:    [
    require("@/assets/images/taxi-0.png"),
    require("@/assets/images/taxi-1.png"),
    require("@/assets/images/taxi-2.png"),
    require("@/assets/images/taxi-3.png"),
  ],
  airport: [
    require("@/assets/images/airport-0.png"),
    require("@/assets/images/airport-1.png"),
    require("@/assets/images/airport-2.png"),
    require("@/assets/images/airport-3.png"),
  ],
  date:    [
    require("@/assets/images/date-0.png"),
    require("@/assets/images/date-1.png"),
    require("@/assets/images/date-2.png"),
    require("@/assets/images/date-3.png"),
  ],
  user:    [
    require("@/assets/images/user-0.png"),
    require("@/assets/images/user-1.png"),
    require("@/assets/images/user-2.png"),
    require("@/assets/images/user-3.png"),
  ],
};

// ── Volume → frame index ──────────────────────────────────────────────────────
// 0         → frame 0 (mouth closed)
// 0.01–0.33 → frame 1 (slightly open)
// 0.33–0.66 → frame 2 (medium open)
// 0.66–1.0  → frame 3 (wide open)

function volumeToFrame(volume: number, isSpeaking: boolean): 0 | 1 | 2 | 3 {
  if (!isSpeaking || volume < 0.05) return 0;
  if (volume < 0.15) return 1;
  if (volume < 0.25) return 2;
  return 3;
}

// ── Component ─────────────────────────────────────────────────────────────────

const TEAL = "#1D9E75";

export function UserAvatar({ volume, isSpeaking }: UserAvatarProps) {
  const [frame, setFrame] = useState<0 | 1 | 2 | 3>(0);
  const bounceY = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef<Animated.CompositeAnimation | null>(null);

  // ── Update frame from volume ───────────────────────────────────────────────
  useEffect(() => {
    setFrame(volumeToFrame(volume, isSpeaking));
  }, [volume, isSpeaking]);

  // ── Subtle head bob while speaking ────────────────────────────────────────
  useEffect(() => {
    if (isSpeaking) {
      bounceAnim.current = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceY, { toValue: -4, duration: 250, useNativeDriver: true }),
          Animated.timing(bounceY, { toValue: 0,  duration: 250, useNativeDriver: true }),
        ])
      );
      bounceAnim.current.start();
    } else {
      bounceAnim.current?.stop();
      Animated.timing(bounceY, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [isSpeaking]);

  const frames = FRAMES["user"];

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ translateY: bounceY }] }]}>
      <Image source={frames[frame]} style={styles.image} resizeMode="contain" />
      <Text style={{ color: "#ffff00", fontSize: 24 }}>{Number(volume).toFixed(3)}</Text>
    </Animated.View>
  );
}


// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 6,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 999,
  },

});

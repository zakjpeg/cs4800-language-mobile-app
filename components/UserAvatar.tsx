import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

// ── Types ─────────────────────────────────────────────────────────────────────

interface UserAvatarProps {
  volume: number;       // 0–1 amplitude from audio stream
  isSpeaking: boolean;
}

// ── Frame image map ───────────────────────────────────────────────────────────

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

function volumeToFrame(volume: number, isSpeaking: boolean): 0 | 1 | 2 | 3 {
  if (!isSpeaking || volume < 0.05) return 0;
  if (volume < 0.15) return 1;
  if (volume < 0.25) return 2;
  return 3;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function UserAvatar({ volume, isSpeaking }: UserAvatarProps) {
  const [frame, setFrame] = useState<0 | 1 | 2 | 3>(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bounceY = useRef(new Animated.Value(0)).current;

  // ── Debounced frame update — prevents flicker from rapid volume changes ────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFrame(volumeToFrame(volume, isSpeaking));
    }, 32); // ~2 frames at 60 fps
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [volume, isSpeaking]);

  const frames = FRAMES["user"];

  return (
    // Fixed-size wrapper so absolutely-positioned frames have a container
    <Animated.View style={[styles.wrapper, { transform: [{ translateY: bounceY }] }]}>
      {frames.map((src, i) => (
        <Image
          key={i}
          source={src}
          style={[
            styles.image,
            styles.stacked,
            // Show only the active frame — no source swap, no reload, no flash
            { opacity: frame === i ? 1 : 0 },
          ]}
          resizeMode="contain"
        />
      ))}
    </Animated.View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    width: 120,
    height: 120,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 999,
  },
  stacked: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
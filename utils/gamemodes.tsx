import { Link } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Images } from "./images";
import { useColors } from "./theme";

export type GamemodeKey = "taxi" | "airport" | "date" | "cop";
export type Difficulty = "Expert" | "Hard" | "Normal" | "Easy" | "Beginner";

// Note: we use "gamemodeKey" instead of "key", because "key" is a keyword in javascript
export interface Gamemode {
  gamemodeKey: GamemodeKey;
  title: string;
  tagline: string;
  description: string;
  difficulty: Difficulty;
  emoji: string;
  img?: number;
  topics: string[]; // conversation topics the AI will stick to
}

export const Gamemodes: Record<GamemodeKey, Gamemode> = {
  taxi: {
    gamemodeKey: "taxi",
    title: "Taxi Driver",
    tagline: "He likes to talk about random things!",
    description:
      "You've just hopped in a cab. The driver is chatty — brace yourself.",
    difficulty: "Expert",
    emoji: "🚕",
    topics: ["weather", "local area", "football", "family", "work"],
    img: Images.gamemode_taxi,
  },
  cop: {
    gamemodeKey: "cop",
    title: "Traffic Stop",
    tagline: "Just act natural. Whatever that means.",
    description:
      "You've been pulled over and the officer is already suspicious. Answer the questions, keep your story straight, and whatever you do — don't let the tail slip out.",
    difficulty: "Hard",
    emoji: "🚔",
    topics: [
      "licence and registration",
      "where you're headed",
      "explaining yourself",
      "staying calm",
    ],
    img: Images.gamemode_cop,
  },
  airport: {
    gamemodeKey: "airport",
    title: "Airport Check-in",
    tagline: "Your flight leaves in 40 minutes!",
    description:
      "Navigate check-in, security questions, and gate changes under pressure.",
    difficulty: "Normal",
    emoji: "✈️",
    topics: ["check-in", "luggage", "security", "delays", "boarding"],
    img: Images.gamemode_airport,
  },
  date: {
    gamemodeKey: "date",
    title: "Date Night",
    tagline: "Don't blow your cover (or the vibe)",
    description:
      "You're on a date and it's going surprisingly well. Keep the conversation charming, dodge the suspicious questions, and whatever you do — don't let the tail slip out.",
    difficulty: "Normal",
    emoji: "🌹",
    topics: [
      "compliments",
      "favourite foods",
      "travel stories",
      "hobbies",
      "awkward silences",
    ],
    img: Images.gamemode_date,
  },
};

// GAMEMODE ITEM - This is how we render different gamemodes on the homepage

interface GamemodeItemProps {
  key: string;
  title: string;
  tagline: string;
  img?: number;
}

export const GamemodeItem = ({ gamemode }: { gamemode: Gamemode }) => {
  console.log("key: ", gamemode.gamemodeKey);
  const styles = StyleSheet.create({
    topRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 10,
    },
    container: {
      display: "flex",
      position: "relative",
      width: "100%",
      backgroundColor: useColors().border,
      borderRadius: 18,
      height: 200,
      zIndex: -5,
      overflow: "hidden",
      outline: "1px",
      outlineColor: useColors().text,
    },
    title: {
      fontSize: 24,
      fontFamily: "Artz",
      fontWeight: "700",
      color: useColors().background,
    },
    tagline: {
      fontSize: 14,
      color: useColors().surfaceAlt,
    },
    img: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      position: "absolute",
      top: 12,
      left: 0,
      zIndex: -4,
    },
    info: {
      padding: 12,
      backgroundColor: useColors().icon,
    },
  });

  return (
    <Link href={`/modal?gamemodeKey=${gamemode.gamemodeKey}`} asChild>
      <TouchableOpacity style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.title}>{gamemode.title}</Text>
          <Text style={styles.tagline}>{gamemode.tagline}</Text>
        </View>
        {gamemode.img && (
          <ImageBackground source={gamemode.img} style={styles.img} />
        )}
      </TouchableOpacity>
    </Link>
  );
};

export interface GamemodeModalProps {
  gamemode: Gamemode;
}

export function GamemodeModal({ gamemode }: { gamemode: Gamemode }) {
  const styles = StyleSheet.create({
    wrapper: {
      position: "relative",
      width: "100%",
      height: "100%",
      backgroundColor: useColors().tint,
    },
    container: {
      position: "absolute",
      bottom: 0,
      paddingVertical: 60,
      paddingHorizontal: 20,
      backgroundColor: useColors().background,
      zIndex: 1,
    },
    title: {
      fontFamily: "Artz",
      fontSize: 36,
      color: useColors().text,
    },
    tagline: {
      color: useColors().text,
      fontSize: 20,
      fontWeight: 700,
      marginBottom: 10,
    },
    description: {
      color: useColors().text,
      fontSize: 18,
      marginBottom: 10,
    },
    playButton: {
      borderRadius: 500,
      color: useColors().text,
      backgroundColor: useColors().tint,
      paddingVertical: 12,
      marginVertical: 20,
    },
    playButtonText: {
      fontFamily: "Artz",
      fontSize: 28,
      textAlign: "center",
    },
    backButton: {
      borderRadius: 500,
      color: useColors().text,
      backgroundColor: "#f3f3e3",
      paddingVertical: 12,
    },
    img: {
      width: "100%",
      height: "75%",
      overflow: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 0,
    },
  });

  return (
    <View style={styles.wrapper}>
      <ImageBackground source={gamemode.img} style={styles.img} />
      <View style={styles.container}>
        <Text style={styles.title}>{gamemode.title}</Text>
        <Text style={styles.tagline}>{gamemode.tagline}</Text>
        <Text style={styles.description}>{gamemode.description}</Text>
        <TouchableOpacity style={styles.playButton}>
          <Text style={styles.playButtonText}>PLAY</Text>
        </TouchableOpacity>
        <Link href="/" dismissTo asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.playButtonText}>BACK</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

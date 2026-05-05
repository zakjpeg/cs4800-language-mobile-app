import { Link } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Images } from "./images";
import { Language } from "./languages";
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
  npcName?: string | null;
  avatars?: object | null;
  prompt?: string | null;
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
    npcName: "Taxi Driver",
    avatars: {
      happy: Images.avatar_taxi_happy,
      confused: Images.avatar_taxi_confused,
      angry: Images.avatar_taxi_angry,
    },
    prompt: `Let's roleplay. You are a wacky taxi driver and I am a passenger in your cab.
    Your topics of conversation may include: The weather, modern American politics,
    favorite meals, favorite cities, inquiries about my life.
    Be slightly controversial, but don't be inappropriate.
    Your role is to be funny and test my understanding of specific concepts in the language.`,
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
    npcName: "Cop",
    avatars: {
      happy: Images.avatar_cop_happy,
      confused: Images.avatar_cop_confused,
      angry: Images.avatar_cop_angry,
    },
    prompt: `Let's roleplay. You are a furiously angry police officer.
    I am a driver that you pulled over, and now we're engaged in a traffic stop.
    Your topics of conversation may include: Specific questions about my personal details
    such as age, height, and more.
    Be very inquisitive and give a stern attitude.
    Your role is to test my general understanding of the language at a surface level.`,
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
    npcName: "Flight Attendant",
    avatars: {
      happy: Images.avatar_airport_happy,
      confused: Images.avatar_airport_confused,
      angry: Images.avatar_airport_angry,
    },
    prompt: `Let's roleplay. You are an airport check-in desk worker.
    I am an airline passenger who needs assistance.
    Your topics of conversation may include: Where I'm flying today, travel destinations, and other appropriate topics.
    Be very attentive, helpful, and inquisitive.
    Your role is to test my general understanding of the language at a surface level by using basic navigation concepts.`,
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
    npcName: "Date",
    avatars: {
      happy: Images.avatar_date_happy,
      confused: Images.avatar_date_confused,
      angry: Images.avatar_date_angry,
    },
    prompt: `Let's roleplay. You are a woman on a date with me.
    I'm your date for the night, and we are out together at a fancy restaurant.
    Your topics of conversation may include: Favorite foods specific to this language's culture, questions about my life and job, and .
    Every time I respond, you will give me a brief compliment before continuing with your response.
    Be very interested, inquisitive, and flattered.
    Your role is to test my general understanding of the language at a surface level by using basic everyday concepts.`,
  },
};

// GAMEMODE ITEM - This is how we render different gamemodes on the homepage

interface GamemodeItemProps {
  key: string;
  title: string;
  tagline: string;
  img?: number;
}

export const GamemodeItem = ({
  gamemode,
  language,
}: {
  gamemode: Gamemode;
  language: Language;
}) => {
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
    <Link
      href={`/gamemodeModal?gamemodeKey=${gamemode.gamemodeKey}&language=${language}`}
      asChild
    >
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

export function GamemodeModal({ gamemode }: { gamemode: Gamemode }) {}

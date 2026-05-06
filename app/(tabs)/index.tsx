import { Image } from "expo-image";
import {
  FlatList,
  StyleSheet,
  Text
} from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { GamemodeItem, Gamemodes } from "@/utils/gamemodes";
import { Images } from "@/utils/images";
import { useLanguage } from "@/utils/LanguageContext";
import { LanguageData } from "@/utils/languages";
import { useProfile } from "@/utils/ProfileContext";
import { useColors } from "@/utils/theme";

export default function HomeScreen() {
  const { language, setLanguage } = useLanguage();
  const { userName } = useProfile();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: useColors().accent,
        dark: useColors().primary,
      }}
      headerImage={<Image source={Images.hero} style={styles.hero} />}
    >
      <ThemedView style={styles.titleContainer}>
        <Text
          style={{ fontFamily: "Artz", fontSize: 48, color: useColors().text }}
        >
          {LanguageData[language].greeting}, {userName}!
        </Text>
        <HelloWave />
      </ThemedView>
      <ThemedText style={{ fontSize: 18, fontWeight: 600 }}>
        Ready to practice your {language}?
      </ThemedText>

      <ThemedView style={styles.stepContainer}>
        {/* Gamemode List */}
        <FlatList
          data={Object.entries(Gamemodes)}
          renderItem={({ item }) => (
            <GamemodeItem gamemode={item[1]} language={language} />
          )}
          style={styles.gamemodeList}
          contentContainerStyle={{ gap: 10 }}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    marginTop: 20,
  },
  hero: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  gamemodeList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
});

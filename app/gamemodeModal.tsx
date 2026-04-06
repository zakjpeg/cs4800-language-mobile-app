import { Gamemodes } from "@/utils/gamemodes";
import { useColors } from "@/utils/theme";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ModalScreen() {
  const { gamemodeKey } = useLocalSearchParams();
  const gamemode = Gamemodes[gamemodeKey];

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
    <>
      <Stack.Screen
        options={{
          title: gamemode.title,
        }}
      />
      <View style={styles.wrapper}>
        <ImageBackground source={gamemode.img} style={styles.img} />
        <View style={styles.container}>
          <Text style={styles.title}>{gamemode.title}</Text>
          <Text style={styles.tagline}>{gamemode.tagline}</Text>
          <Text style={styles.description}>{gamemode.description}</Text>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              router.dismiss();
              router.replace(`/gamePlay?gamemodeKey=${gamemodeKey}`);
            }}
          >
            <Text style={styles.playButtonText}>PLAY</Text>
          </TouchableOpacity>
          <Link href="/" dismissTo asChild>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.playButtonText}>BACK</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </>
  );
}

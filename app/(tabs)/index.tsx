import { Image } from 'expo-image';
import { FlatList, Platform, StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Language, LanguageData } from '@/utils/languages';
import CountryFlag from "react-native-country-flag";
import { GamemodeItem, Gamemodes } from '@/utils/gamemodes';
import { useColors } from '@/utils/theme';
import { Images } from '@/utils/images';


export default function HomeScreen() {

  const [language, setLanguage] = useState<Language>("Italian")

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: useColors().accent, dark: useColors().primary }}
      headerImage={
        <Image
          source={Images.hero}
          style={styles.hero}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <Text style={{fontFamily: "Artz", fontSize: 48, color: useColors().text}}>{LanguageData[language].greeting}, Zak!</Text>
        <HelloWave />
      </ThemedView>
      <ThemedText style={{fontSize: 18, fontWeight: 600}}>Ready to practice your {language}?</ThemedText>
      <View className='flex flex-row'>
        {
          Object.entries(LanguageData).map(([key, value]) => (
            <TouchableOpacity key={key} 
            onPress={() => {
              setLanguage(key);
            }}
            >
              <CountryFlag isoCode={value.countryCode} size={30}/>
            </TouchableOpacity>
          ))
        }
      </View>

      <ThemedView style={styles.stepContainer}>
        {/* Gamemode List */}
        <FlatList
        data={Object.entries(Gamemodes)}
        renderItem={({item}) => (
          <GamemodeItem
          emoji={item[1].emoji}
          title={item[1].title}
          tagline={item[1].tagline}
          img={item[1].img ?? ""}
          />
        )}
        style={styles.gamemodeList}
        contentContainerStyle={{gap: 10}}
        />

      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  hero: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  gamemodeList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  }
});

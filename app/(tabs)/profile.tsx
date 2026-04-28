import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLanguage } from "@/utils/LanguageContext";
import { useProfile } from "@/utils/ProfileContext";
import { LanguageData } from "@/utils/languages";
import { Text, TouchableOpacity, View } from 'react-native';
import CountryFlag from "react-native-country-flag";


//const [language, setLanguage] = useState<Language>("Italian");

export default function Profile() {
  const { language, setLanguage } = useLanguage();
  const { userName, setUserName } = useProfile();
  const [inputValue, setInputValue] = useState(userName);
  const textColor = useThemeColor({}, 'text');

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hey, {userName}</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedText style={{ fontSize: 18, fontWeight: 600 }}>
        Ready to practice your {language}?
      </ThemedText>
      <ThemedView style={styles.stepContainer}>
        <TouchableOpacity onPress={() => setLanguage("French")}>
      <Text>Current: {language} — tap to change</Text>
    </TouchableOpacity>
      <View className="flex flex-row">
        {Object.entries(LanguageData).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            onPress={() => {
              setLanguage(key);
            }}
          >
            <CountryFlag isoCode={value.countryCode} size={30} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.usernameInput, { color: textColor }]}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Enter your name"
        />
        <TouchableOpacity
          style={styles.changeButton}
          onPress={() => setUserName(inputValue)}
        >
          <Text style={styles.changeButtonText}>Change</Text>
        </TouchableOpacity>
      </View>

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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
  },
  usernameInput: {
    maxWidth: 220,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  changeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

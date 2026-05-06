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
import { Images } from "@/utils/images";
import { LanguageData } from "@/utils/languages";
import { useColors } from "@/utils/theme";
import { Text, TouchableOpacity, View } from 'react-native';
import CountryFlag from "react-native-country-flag";

export default function Profile() {
  const { language, setLanguage } = useLanguage();
  const { userName, setUserName } = useProfile();
  const [inputValue, setInputValue] = useState(userName);
  const textColor = useThemeColor({}, 'text');
  const colors = useColors();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: colors.accent, dark: colors.primary }}
      headerImage={<Image source={Images.hero} style={styles.hero} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hey, {userName}!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>Learning Language</ThemedText>
        <ThemedView style={styles.languageCard}>
          <View style={styles.languageFlagContainer}>
            {LanguageData[language].countryCode && (
              <CountryFlag isoCode={LanguageData[language].countryCode} size={48} />
            )}
          </View>
          <View style={styles.languageInfoContainer}>
            <ThemedText style={styles.languageName}>{language}</ThemedText>
            <Text style={styles.languageSubtext}>Current Language</Text>
          </View>
        </ThemedView>
        <ThemedText style={styles.changeLanguageLabel}>Change Language:</ThemedText>
        <View style={styles.flagRow}>
          {Object.entries(LanguageData).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setLanguage(key)}
              style={[styles.flagButton, language === key && styles.flagButtonActive]}
            >
              <CountryFlag isoCode={value.countryCode} size={40} />
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>Profile Settings</ThemedText>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <ThemedText style={styles.inputLabel}>Username</ThemedText>
            <TextInput
              style={[styles.usernameInput, { color: textColor, borderColor: colors.text }]}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Enter your name"
              placeholderTextColor={colors.text + '80'}
            />
          </View>
          <TouchableOpacity
            style={[styles.changeButton, { backgroundColor: colors.tint }]}
            onPress={() => setUserName(inputValue)}
          >
            <Text style={styles.changeButtonText}>Save</Text>
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
    marginBottom: 20,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  hero: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  sectionContainer: {
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  languageFlagContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  languageInfoContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 20,
    fontWeight: '600',
  },
  languageSubtext: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  changeLanguageLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  flagRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  flagButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  flagButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  inputContainer: {
    gap: 12,
    marginTop: 8,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  usernameInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  changeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

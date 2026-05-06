export type Language = "French" | "Italian" | "Spanish" | "English" | "Mandarin";

interface LanguageDataEntry {
  greeting: string;
  countryCode: string;
}

export const LanguageData: Record<Language, LanguageDataEntry> = {
  French: {
    greeting: "Bonjour",
    countryCode: "fr",
  },
  Italian: {
    greeting: "Ciao",
    countryCode: "it",
  },
  Spanish: {
    greeting: "Hola",
    countryCode: "es",
  },
  English: {
    greeting: "Hello",
    countryCode: "us",
  },
  Mandarin: {
    greeting: "Ni Hao",
    countryCode: "cn",
  },
};

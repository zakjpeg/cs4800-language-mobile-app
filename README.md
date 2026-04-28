# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Add .env.local API Key
   Create file /.env.local
   add line:
      EXPO_PUBLIC_GROQ_API_KEY = (real apikey)


3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Prompting on-brand images

To create photos that are on-brand and follow the color scheme, prompt this to claude, and feed the output to Gemini.

CLAUDE PROMPT:

I'm building a mobile language learning app. The concept is that the player is a group of cats stacked in a trench coat, disguised as a human, trying to win foreign language conversations without blowing their cover.
I need an image generation prompt for a marketing illustration. Please write it in the same style as the following example:
"A 16:9 illustration in a minimalist 2D cel-shaded style. A group of mischievous cartoon cats stacked in a trench coat..."
Follow these rules exactly:

16:9 aspect ratio
Minimalist 2D cel-shaded foreground — bold flat fills, thick dark outlines on all characters and objects
Soft, faint, muted pastel background — almost washed out, barely suggested, minimal detail
All important characters and action anchored in the bottom half of the frame. The top half must be sparse and treated as negative space suitable for a title text overlay. Safe to crop at the midpoint with zero loss of narrative
No text, signs, readable words, speech bubbles or typography anywhere in the scene
Flat graphic style — absolutely no gradients, no textures, no lens flare, no drop shadows, no glow effects
Style reference: Duolingo character art meets a European children's picture book illustration
Cats are rendered in deep navy (#1A2540) and cobalt (#3B4F8A) with glowing lime green (#A3E635) eyes
The trench coat is navy deep (#1A2540) with lime green (#84CC16) buttons and trim
Background tones drawn from: blush pink (#FDE8ED), cream (#FEF3C7), lime whisper (#F0FBD8) and parchment (#FFFBEB) — pick whichever suits the mood of the scene
Foreground accent colors drawn from: honey yellow (#FCD34D), butter (#FDE68A), blush pink (#F9C6D0), rose petal (#F7A8B8), wisteria (#C4B5FD) and raspberry (#E8607A) — use 2 or 3 maximum, don't use all of them
Supporting human characters wear midnight (#111827) or indigo dusk (#253260) with slate blue (#6B84C4) accent details
One dominant warm light source in the scene — butter yellow (#FDE68A) or honey (#FCD34D) — to anchor the composition

The scene I want is: [DESCRIBE YOUR SCENE HERE]

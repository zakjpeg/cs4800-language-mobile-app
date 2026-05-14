# Find our project documents

Please navigate to the /PROJECT_DOCUMENTS folder to access our project docs
To access the repo for our backend, click [here](https://github.com/zakjpeg/cs4800-language-backend)

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

## Note:

Gameplay only works on desktop devices in the web browser. Mobile is not supported by our RTC framework.

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

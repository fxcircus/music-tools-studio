# Tiles — Tools for Creative Flow

A set of tools to help musicians stay creative and focused.

## Live Version

Try [live version](https://fxcircus.github.io/music-tools-studio) on GitHub pages, or follow the [Local Installation](#local-installation) instructions.

![Tiles](public/tiles_app_screenshot_dark_2025.png)

## Features

- **🍅 Flow Timer:** A Pomodoro-style timer to help you stay focused while writing, practicing, or producing.

- **🎲 Inspiration Generator:** Randomize scales, BPM, and sounds. Lock in what you like and shuffle the rest.

- **🎶 Metronome:** Follows the BPM from the Inspiration Generator, with manual adjustment in 1-step increments.

- **📝 Notes:** Write down lyrics, chord progressions, FX pedal settings, etc'...

- **🔗 Share Your Work:** Copy a URL with your current settings — perfect for saving or sharing.
  (Export/import via JSON is still in the code, just commented out.)

- **🌓 Dark / Light Modes:** Yes.

## Technologies Used

- **⚛️ React + TypeScript**
- **🎵 Tone.js** for metronome audio engine
- **🔀 Framer Motion** for fluid animations 
- **🔊 Web Audio API**
- **📦 Node.js**
- **🎨 React Icons** with Font Awesome, Game Icons and more icon collections

## Local Installation

```
git clone https://github.com/fxcircus/music-tools-studio.git
cd music-tools-studio
npm install
npm start
```

The app will run in development mode at [http://localhost:3000](http://localhost:3000).

## Debug Mode 🐞

The application includes a debug mode that can be enabled for development and troubleshooting:

1. Open `src/config.ts`
2. Set `DEBUG_MODE: true`
3. Reload the application

When debug mode is enabled, a debug button will appear in the Metronome component, allowing you to view detailed logs about the metronome's operation.
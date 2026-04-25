# MTG Life Counter

A modern, highly responsive Magic: The Gathering Life Counter web application. Built with Vite and React, it is designed from the ground up for performance and a seamless path to mobile (iOS/Android) via React Native.

## Features
- **Clean Architecture:** Fully modularized components, custom hooks (`useGameEngine`), and Context-based state management.
- **Scryfall Integration:** Real-time Commander searching with built-in API caching for maximum responsiveness.
- **Optimized for Mobile Porting:** Component structure and localized `const styles` objects emulate React Native's `StyleSheet` behavior for effortless future porting.

## Prerequisites
You will need Node.js installed to run this project locally.
- [Node.js Download](https://nodejs.org/)

## Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/rapoport1/MTG_Counter.git
   cd MTG_Counter
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open the provided localhost URL (typically `http://localhost:5173`) in your web browser.

## Building for Production
To generate a minified production build:
```bash
npm run build
```
The compiled files will be output to the `dist` folder.

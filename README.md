# YouTube Spotlight Extension

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/1mehdifaraji/youtube-spotlight-extension/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/1mehdifaraji/youtube-spotlight-extension?style=social)](https://github.com/1mehdifaraji/youtube-spotlight-extension/stargazers)

<p align="center">
  <img src="https://github.com/1mehdifaraji/youtube-spotlight-extension/blob/main/assets/demo.gif" alt="Demo gif" width="300"/>
  <br/>
  <em>Spotlight what matters. Dim the rest.</em>
</p>

A lightweight **Chrome extension** built with **React** + **WXT** that helps you focus on YouTube content by:

- Spotlighting specific text (dim everything else)
- Highlighting channel names & handles
- Removing ads with one click

Perfect for power users who want less noise and faster scanning.

## ✨ Features

- **Text Spotlight** — Type any keyword → everything not containing it fades to near-invisible
- **Channel Spotlight** — Toggle to highlight only channel names and @handles
- **One-Click Ad Removal** — Instantly removes most ads, banners, sponsored videos, etc.
- **Dark / Light Mode** — Automatically matches YouTube's current theme
- **Draggable Control Bar** — Move it anywhere on desktop (centered & fixed on mobile)
- **No build step for users** — just unzip and load

## 🚀 Installation

1. Go to the **[Releases page](https://github.com/1mehdifaraji/youtube-spotlight-extension/releases)**
2. Download the latest `youtube-spotlight-*.zip`
3. Unzip it to a folder (e.g. `youtube-spotlight`)
4. Open Chrome → `chrome://extensions/`
5. Enable **Developer mode** (top right)
6. Click **Load unpacked** and select the unzipped folder
7. Open YouTube — the spotlight bar should appear!

No npm, no build tools — ready to use instantly.

## 📖 Usage

- **Spotlight text** → type in the input field
- **Clear spotlight** → click "Clear" or delete the text
- **Highlight channels** → click the channel icon (funnel-like)
- **Remove ads** → click the slashed-ad icon (one-time per page load)
- **Move the bar** → drag it on desktop (mobile version stays centered)

> **Note**: Works by modifying page DOM. YouTube UI changes may occasionally break some selectors.

## 🛠️ Development

```bash
# Clone the repo
git clone https://github.com/1mehdifaraji/youtube-spotlight-extension.git

# Enter directory
cd youtube-spotlight-extension

# Install dependencies
npm install

# Build the extension
npm run build

# Then load the .output/ folder in Chrome as an unpacked extension.
```

## Built With

WXT – modern Chrome extension framework
React + TypeScript
Shadow DOM UI injection

## 🤝 Contributing

Pull requests are welcome!
For bigger changes, please open an issue first to discuss what you'd like to change.

## 📄 License

Distributed under the MIT License. See LICENSE for more information.

## ⚠️ Disclaimer

This is an open-source tool for personal use.
Aggressive ad-blocking may violate YouTube's Terms of Service.
Use at your own risk.

**Not affiliated with YouTube, Google, or any related entities.**

Enjoy a cleaner, more focused YouTube experience!
Feedback and stars are very welcome ⭐

# Focus Flow

_still in development in free time 😋_

**Focus Flow** is a desktop app built with **Electron + React** that helps you stay aware of how you spend your time on your computer.  
It monitors active windows, tracks how long you focus on each app, and stores usage data locally for later insights.

---

## ✨ Features

- ⏱ Tracks active window sessions (start / end time).
- 📊 Records memory usage and window titles over time.
- 🗂 Logs all tabs/windows opened in the background.
- 💾 Uses **SQLite** for efficient local storage.
- ⚡ Provides a React-based frontend to visualize activity.
- 🔌 IPC integration between Electron main and React renderer.

---

## 🛠 Tech Stack

- **Electron** - desktop runtime
- **React + React Router** - frontend UI
- **TypeScript**
- **SQLite (better-sqlite3)** - local embedded database
- **IPC** - secure main-renderer communication
- **get-windows** package

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/Darosss/focus-flow.git
cd focus-flow

npm install

```

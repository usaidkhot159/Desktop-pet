# 🐱 Desktop Pet

A fully interactive pixel-art desktop pet built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no dependencies.

Open `index.html` in any modern browser and meet your new digital companion!

---

## 📁 Project Structure

```
Desktop-Pet/
├── index.html                  # Entry point
└── assets/
    ├── css/
    │   ├── main.css            # Base styles, world, pet, layout
    │   ├── animations.css      # All keyframe animations
    │   └── ui.css              # UI panel, buttons, stats, badges
    └── js/
        ├── constants.js        # All static data: personalities, rooms, speech, etc.
        ├── state.js            # Save / load / helpers (localStorage)
        ├── renderer.js         # Canvas pixel-art cat drawing engine
        ├── emotions.js         # Emotion evaluation from stats
        ├── personality.js      # Personality-driven movement & behaviour
        ├── weather.js          # Weather particles, room backgrounds, confetti
        ├── events.js           # Random events, visitor, UFO, birthday, daily reward
        ├── actions.js          # Player actions: feed, play, pet, toy, adventure, photo
        ├── voice.js            # Web Speech API voice commands
        ├── miniGames.js        # Mini-games: Simon Says, Memory, Catch the Ball
        └── main.js             # Game loop, movement, stat decay, UI, achievements
```

---

## 🐾 Features

### 🤖 Personality System
Each pet is assigned a random personality at creation:

| Personality | Behaviour |
|-------------|-----------|
| 😴 Lazy | Sleeps often, moves slowly |
| ⚡ Energetic | Runs everywhere, chases cursor far |
| 😈 Mischievous | Unpredictable cursor interaction |
| 🤓 Curious | Chases butterflies, inspects things |
| 😎 Cool | Does idle moonwalks and tricks |
| 🐱 Shy | Flees from the cursor |

### 🎭 Emotions
Pet sprite expression changes live based on stats:
- 😊 Happy · 😍 Excited · 😢 Sad · 😠 Angry · 😴 Sleepy · 🤤 Hungry · 😨 Scared

### 📊 Stats
Four stats decay over time and react to interactions:
- 🍖 **Hunger** — decreases every 5 s; pet slows and gets sad when low
- ⚡ **Energy** — decreases with movement; triggers sleep when empty
- ❤️ **Happiness** — rises with feeding/playing; falls when neglected
- 💊 **Health** — drains only when starving; recovers when fed

### 🍖 Feeding
Click **Feed** to toss a random food item. The pet sprints to it, eats, and reacts with a speech bubble.

### 🧸 Toys
7 toys with unique speech reactions: ⚽ Ball · 🪀 Yo-Yo · 🧸 Teddy · 🦋 Butterfly · 🪁 Kite · 🔴 Laser · 🫧 Bubbles

### 🗺️ Adventure Mode
Send the pet exploring — it returns after 12–20 seconds with coins, food, or a rare treasure!

### 🎮 Mini-Games
Three built-in mini-games (click **Play** to launch a random one):
1. **Simon Says** — repeat the button sequence
2. **Memory Match** — flip and pair emoji cards
3. **Catch the Ball** — click the balls before they vanish

### 🌦️ Weather System
- ☀️ Sunny · 🌧️ Rain (falling drops) · ❄️ Snow (drifting flakes) · 🌙 Night (twinkling stars)
- Night makes the pet sleepier; rain adds a blue tint

### 🏠 Rooms
5 environments with emoji décor:
🛏️ Bedroom · 🌿 Garden · 🍳 Kitchen · 🏖️ Beach · 🚀 Space

### 🎩 Hats & Accessories
9 hat options unlock-able and equip-able at any time.

### 🌱 Pet Growth
Pet visually scales up through four life stages based on days alive:
- 👶 Baby (0–2d) · 🧒 Teen (3–6d) · 🧑 Adult (7–29d) · 👴 Elder (30d+)

### 🎂 Birthday Mode
On the pet's creation anniversary: confetti, a birthday speech bubble, and a badge appear.

### 📸 Photo Mode
Captures the pet canvas and downloads it as a PNG — shareable anywhere!

### 🎤 Voice Commands
Uses the **Web Speech API** (Chrome/Edge). Click 🎤 and say:
`come` · `sit` · `sleep` · `jump` · `dance` · `feed` · `play`

### 🎁 Daily Reward
Click **Daily** once per day for coins, food, or a toy.

### 🏆 Achievements (11 total)
| Achievement | Condition |
|-------------|-----------|
| Fed 10 times | Feed count ≥ 10 |
| Played 20 times | Play count ≥ 20 |
| Happiness maxed | Happy ≥ 98 |
| 50 coins collected | Coins ≥ 50 |
| All rooms visited | Visit all 5 rooms |
| 7 days with pet | Total days ≥ 7 |
| Found treasure | Random event |
| Adventurer | 3+ adventures |
| Celebrated birthday | Birthday triggered |
| Got abducted by UFO | Ultra-rare event |
| Became golden | Ultra-rare event |

### 🌌 Rare Secret Events (1-in-1000)
- 👽 **UFO abduction** — pet disappears, returns wearing an alien hat
- ✨ **Golden transformation** — pet glows gold for 30 seconds

### ⏰ Real-Time Awareness
Greeting changes by time of day and day of week (weekends get a special message).

### 💾 Save System
All progress is saved to `localStorage` automatically every 5 seconds.

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/Desktop-Pet.git
cd Desktop-Pet

# Open in browser (no server needed)
open index.html
# or double-click index.html
```

For voice commands, serve over HTTP (Chrome requires it for microphone):
```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Markup | HTML5 |
| Styling | CSS3 + custom properties + keyframes |
| Logic | Vanilla ES6+ JavaScript |
| Drawing | HTML5 Canvas API |
| Animation | `requestAnimationFrame` |
| Storage | `localStorage` |
| Voice | Web Speech API |

---

## 🗺️ Roadmap

- [ ] Multiple pets that interact
- [ ] Skin creator (custom body color export/import)
- [ ] Sound effects & background music
- [ ] More mini-games (hide & seek, jump obstacles)
- [ ] Achievement gallery UI
- [ ] PWA / offline support

---

## 🤝 Contributing

Pull requests welcome! Please open an issue first to discuss what you'd like to change.

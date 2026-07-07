/**
 * state.js
 * Central game state — load, save, default values, helpers.
 */

const DEFAULT_STATE = {
  // Identity
  name: 'Pixel',
  personality: 'curious',
  hat: '',
  bodyColor: '#f4a832',
  createdAt: Date.now(),
  lastVisit: Date.now(),

  // Stats (0–100)
  hunger: 80,
  energy: 85,
  happy: 75,
  health: 90,

  // World
  room: 'bedroom',
  weather: 'sunny',

  // Economy
  coins: 0,

  // Progress
  feedCount: 0,
  playCount: 0,
  adventureCount: 0,
  totalDays: 1,
  achievements: [],
  roomsVisited: ['bedroom'],

  // Flags
  foundTreasure: false,
  birthdayCelebrated: false,
  ufoAbducted: false,
  goldenEvent: false,
  dailyClaimedAt: 0,
  isGolden: false,

  // Memory
  lastFood: '',
  lastPlayedToy: '',
};

let gameState = {};

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      gameState = Object.assign({}, DEFAULT_STATE, saved);
      return true; // returning user
    }
  } catch (e) {
    console.warn('Could not load save:', e);
  }
  gameState = Object.assign({}, DEFAULT_STATE);
  gameState.personality = PERSONALITY_KEYS[Math.floor(Math.random() * PERSONALITY_KEYS.length)];
  return false; // new user
}

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  } catch (e) {
    console.warn('Could not save:', e);
  }
}

function getPersonality() {
  return PERSONALITIES[gameState.personality] || PERSONALITIES.curious;
}

/** Returns pet age in days */
function getPetAgeDays() {
  return Math.floor((Date.now() - gameState.createdAt) / 86400000);
}

/** Returns age stage object */
function getAgeStage() {
  const days = getPetAgeDays();
  let stage = AGE_STAGES[0];
  for (const s of AGE_STAGES) {
    if (days >= s.minDays) stage = s;
  }
  return stage;
}

/** Today's date string "YYYY-MM-DD" */
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/** Created-at date string */
function birthdayStr() {
  return new Date(gameState.createdAt).toISOString().slice(5, 10); // MM-DD
}

/** Current birthday (is today?) */
function isBirthday() {
  const now = new Date().toISOString().slice(5, 10);
  return now === birthdayStr() && getPetAgeDays() > 0;
}

/** Mark a room as visited */
function visitRoom(room) {
  if (!gameState.roomsVisited) gameState.roomsVisited = [];
  if (!gameState.roomsVisited.includes(room)) {
    gameState.roomsVisited.push(room);
  }
}

/** Clamp helper */
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/** Random item from array */
function randFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/** Format number as whole */
function fmt(n) { return Math.round(n); }

/**
 * constants.js
 * All static config: personalities, emotions, rooms, toys, speech lines, events.
 */

const SAVE_KEY = 'desktop_pet_v2';

/* ── Personalities ──────────────────────────────────────────────── */
const PERSONALITIES = {
  lazy:       { label: '😴 Lazy',        speedMult: 0.55, sleepThreshold: 50, chaseRange: 0 },
  energetic:  { label: '⚡ Energetic',   speedMult: 1.8,  sleepThreshold: 10, chaseRange: 200 },
  mischievous:{ label: '😈 Mischievous', speedMult: 1.3,  sleepThreshold: 25, chaseRange: 180 },
  curious:    { label: '🤓 Curious',     speedMult: 1.0,  sleepThreshold: 20, chaseRange: 120 },
  cool:       { label: '😎 Cool',        speedMult: 0.9,  sleepThreshold: 18, chaseRange: 80 },
  shy:        { label: '🐱 Shy',         speedMult: 1.2,  sleepThreshold: 22, fleeRange: 130 },
};

const PERSONALITY_KEYS = Object.keys(PERSONALITIES);

/* ── Emotions ───────────────────────────────────────────────────── */
const EMOTIONS = {
  happy:   { icon: '😊', priority: 1 },
  excited: { icon: '😍', priority: 2 },
  sad:     { icon: '😢', priority: 3 },
  angry:   { icon: '😠', priority: 4 },
  sleepy:  { icon: '😴', priority: 5 },
  hungry:  { icon: '🤤', priority: 6 },
  scared:  { icon: '😨', priority: 7 },
};

/* ── Rooms ──────────────────────────────────────────────────────── */
const ROOMS = {
  bedroom: {
    bg: 'linear-gradient(180deg,#c9d6e3 55%,#c4a07a 55%)',
    decor: ['🛏️', '🪴', '🖼️', '📚'],
    decorPos: [[20,30],[70,40],[50,15],[85,35]],
  },
  garden: {
    bg: 'linear-gradient(180deg,#87ceeb 55%,#4ade80 55%)',
    decor: ['🌸', '🦋', '🌿', '🌻', '🍄'],
    decorPos: [[15,45],[60,30],[80,50],[35,20],[90,48]],
  },
  kitchen: {
    bg: 'linear-gradient(180deg,#fef9c3 55%,#d6b89a 55%)',
    decor: ['🍳', '🥘', '🍽️', '🧁'],
    decorPos: [[15,40],[50,35],[80,42],[65,18]],
  },
  beach: {
    bg: 'linear-gradient(180deg,#38bdf8 45%,#fde68a 45%)',
    decor: ['🌊', '🏄', '🐚', '🦀', '⛱️'],
    decorPos: [[10,40],[40,30],[70,50],[85,45],[55,15]],
  },
  space: {
    bg: 'linear-gradient(180deg,#0c0a1e 60%,#312e81 60%)',
    decor: ['⭐', '🌙', '🪐', '☄️', '🛸'],
    decorPos: [[10,15],[30,20],[65,10],[80,25],[50,8]],
  },
};

/* ── Toys ───────────────────────────────────────────────────────── */
const TOYS = [
  { icon: '⚽', name: 'Ball',          happyBoost: 20, energyCost: 12 },
  { icon: '🪀', name: 'Yo-Yo',         happyBoost: 15, energyCost: 8  },
  { icon: '🧸', name: 'Teddy',         happyBoost: 18, energyCost: 3  },
  { icon: '🦋', name: 'Butterfly',     happyBoost: 22, energyCost: 15 },
  { icon: '🪁', name: 'Kite',          happyBoost: 16, energyCost: 10 },
  { icon: '🔴', name: 'Laser',         happyBoost: 25, energyCost: 18 },
  { icon: '🫧', name: 'Soap Bubbles',  happyBoost: 12, energyCost: 5  },
];

/* ── Foods ──────────────────────────────────────────────────────── */
const FOODS = ['🍖', '🍎', '🍩', '🍕', '🌮', '🧁', '🐟', '🥩', '🍣'];

/* ── Pet age stages ─────────────────────────────────────────────── */
const AGE_STAGES = [
  { name: 'Baby',  minDays: 0,  scaleX: 0.7 },
  { name: 'Teen',  minDays: 3,  scaleX: 0.85 },
  { name: 'Adult', minDays: 7,  scaleX: 1.0 },
  { name: 'Elder', minDays: 30, scaleX: 1.05 },
];

/* ── Speech lines ───────────────────────────────────────────────── */
const SPEECH = {
  idle:      ['Meow...', 'La la la~', '...', 'Hmm.', '*stares at wall*', 'zZz?'],
  hungry:    ['Feed me! 🍖', "I'm starving!", 'Meooow!!', 'Food plz 🥺', 'My tummy...'],
  happy:     ['Purrrr~', 'I love you! 😻', 'Best day ever!', '🎉', 'Meow meow meow!'],
  sleepy:    ['Yawn...', 'So tired...', 'Zzzz...', '*eyes closing*'],
  sad:       ['Nobody loves me 😢', 'Please play with me...', '*sad meow*'],
  angry:     ['HISS!', "You ignored me!", 'I am very upset!', '😾'],
  greet: {
    morning:   ['Good morning! ☀️', 'Wake up time!', 'Meow good morning!'],
    afternoon: ["Let's play! 🎾", 'Hi there!', 'What are we doing today?'],
    evening:   ['Good evening 🌅', 'Cozy time~', 'Almost dinner?'],
    night:     ['Time to sleep 🌙', 'Yawn... so late.', 'Goodnight 💤'],
    weekend:   ["You're home today! 🎉", 'Weekend!! Yay!', 'Play all day!'],
  },
  return:    ['Welcome back! I missed you! 🥰', 'You came back!', "I waited for you 🥺", 'Finally! 😸'],
  feed:      ['Nom nom! 😋', 'So yummy!', 'Thank you! 🙏', 'My fav! ❤️'],
  play:      ['Yay! Play time! 🎾', 'This is fun!', 'Wheeee!', 'Again again!'],
  pet:       ['Purrrr... 😻', 'That tickles!', 'More please~', '*kneads paws*'],
  toy: {
    '⚽': ['Ball!! 😻', 'I got it!', 'Kick kick kick!'],
    '🪀': ['Yoyo! Dizzy...', 'Up and down~', 'Wheee!'],
    '🧸': ['My teddy! 🧸', 'Soft... cozy...', 'Hug time!'],
    '🦋': ['Butterfly!! 🦋', 'Come back!', 'So pretty!'],
    '🪁': ['Kite go up!', 'So high!', 'The wind!'],
    '🔴': ['The red dot!!', 'I WILL catch it!', 'WHAT IS IT?!'],
    '🫧': ['Bubbles! 🫧', 'Pop pop pop!', 'So many!'],
  },
  events: {
    treasure:  ['Found a coin! 🪙', "Ooh, shiny!", 'Lucky day!'],
    sneeze:    ['Achoo! 🤧', 'Excuse me...', '*sneeze*'],
    dizzy:     ['Dizzy...', '*spins*', 'Whoa, the room...'],
    scared:    ["What was that?! 😱", 'I saw something!', '...hello?'],
    dance:     ['Dance time! 💃', 'Music in my head!', 'Boogie woogie~'],
    butterfly: ['Butterfly!! 🦋', 'Come back!', 'Chasing dreams~'],
    moonwalk:  ['*moonwalk*', 'Hehe... did you see that?', '😎'],
    trip:      ['Oops! 😅', 'Did you see that? I meant to do that.', '*trips*'],
  },
  weather: {
    sunny: ['Yay sunshine! ☀️', 'Warm fur~', 'Beautiful day!'],
    rain:  ['Meow! Puddles! 🌧️', 'My paws are wet!', 'Rainy day nap?'],
    snow:  ['Cold paws! ❄️', 'Snow ball fight!', 'So fluffy!'],
    night: ['Getting sleepy... 🌙', 'The stars are pretty', 'Goodnight~'],
  },
  room: {
    bedroom: ['Home sweet home! 🛏️', 'Nap time?', 'Cozy!'],
    garden:  ['Flowers! 🌸', 'I love outside!', 'So many smells!'],
    kitchen: ['Something smells yummy! 🍳', 'Feed me! 🥺', 'What are you cooking?'],
    beach:   ['Sand in my paws! 🏖️', 'The ocean! 🌊', 'So warm!'],
    space:   ['Zero gravity! 🚀', 'Are we floating?', 'Where are the stars?'],
  },
  memory: [
    'Yesterday you fed me {food}!',
    'Remember when we played? Fun!',
    "You ignored me yesterday 😢",
    'I dreamed about {food} last night!',
  ],
  visitor: [
    '...a visitor!', 'Hello friend!', 'Play with us!',
  ],
  adventure: {
    found:    ['I found {item}!', 'Look what I got!', 'Treasure! 🎁'],
    notFound: ['Nothing out there...', 'All I found was a rock.', 'Just walked around.'],
  },
  birthday: ['Happy birthday to me! 🎂🎉', 'I am {age} years old today!', 'Cake? 🎂 Cake!!'],
  dream: ['🐟', '🍕', '🌈', '⭐', '👻', '🎮', '🦋', '🍦'],
  ufo: ['I got abducted!! 👽', 'Aliens are friendly actually', 'I can see my house from here!'],
  golden: ['I feel... shiny! ✨', 'Golden power! 💛', 'Meow!!'],
  voice: {
    come:  ['Coming! 🏃', 'On my way!'],
    sit:   ['Sitting! 🐾', '*sits*'],
    sleep: ['Okay... night night 💤', 'Time to rest.'],
    jump:  ['Boing! 🐱', 'Wheee!'],
    dance: ['Dance time! 💃', 'Watch my moves!'],
  },
  daily: ['Yay! Daily reward! 🎁', 'You came back! Here:', 'A present for you!'],
};

/* ── Daily reward pool ──────────────────────────────────────────── */
const DAILY_REWARDS = [
  { type: 'coins', amount: 10, label: '+10 coins 🪙' },
  { type: 'coins', amount: 5,  label: '+5 coins 🪙' },
  { type: 'food',  label: '🍖 Food pack!' },
  { type: 'toy',   label: '🎾 Toy unlocked!' },
  { type: 'hat',   label: '🎩 New hat!' },
];

/* ── Achievement definitions ────────────────────────────────────── */
const ACHIEVEMENTS = [
  { id: 'feed10',   label: 'Fed 10 times',        check: s => s.feedCount >= 10 },
  { id: 'play20',   label: 'Played 20 times',      check: s => s.playCount >= 20 },
  { id: 'joy',      label: 'Happiness maxed',      check: s => s.happy >= 98 },
  { id: 'rich',     label: '50 coins collected',   check: s => s.coins >= 50 },
  { id: 'explorer', label: 'All rooms visited',    check: s => s.roomsVisited && s.roomsVisited.length >= 5 },
  { id: 'survivor', label: '7 days with pet',      check: s => s.totalDays >= 7 },
  { id: 'treasure', label: 'Found treasure',       check: s => s.foundTreasure },
  { id: 'adventurer','label': 'Went on adventure', check: s => s.adventureCount >= 3 },
  { id: 'birthday', label: 'Celebrated birthday',  check: s => s.birthdayCelebrated },
  { id: 'ufo',      label: 'Got abducted by UFO',  check: s => s.ufoAbducted },
  { id: 'golden',   label: 'Became golden!',       check: s => s.goldenEvent },
];

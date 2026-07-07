/**
 * voice.js
 * Voice command recognition via the Web Speech API.
 *
 * HOW IT WORKS:
 *   1. Click the 🎤 button to start listening (button turns red + pulses).
 *   2. Say a command clearly. Recognition auto-stops after hearing you.
 *   3. Supported: come, sit, sleep, wake, jump, dance, feed, play, toy,
 *      happy, spin, north/south/east/west (move), hello, name
 *
 * BROWSER SUPPORT:
 *   Chrome / Edge: full support.
 *   Firefox / Safari: not supported — button hidden automatically.
 *
 * TROUBLESHOOTING:
 *   - Must be served over HTTPS or localhost (not file://) for mic access.
 *   - Allow microphone permission when the browser asks.
 *   - Speak naturally after clicking the button; don't shout.
 */

window.voiceControl = (() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isListening  = false;
  let restartPending = false;
  let micAllowed   = false;

  /* ── Command map ───────────────────────────────────────────────── */
  // Each entry: phrase → handler. Phrases checked in order; first match wins.
  const COMMAND_MAP = [
    // Movement
    { words: ['come','here','come here','come to me'],
      fn: () => { petMain.moveToCenter(); petMain.say(pick(SPEECH.voice.come)); } },

    // Tricks
    { words: ['sit','stay','stop'],
      fn: () => { petMain.setAnim('sit', 3000); petMain.say(pick(SPEECH.voice.sit)); } },
    { words: ['sleep','go to sleep','nap','rest'],
      fn: () => { petMain.setAnim('sleep', 5000); petMain.say(pick(SPEECH.voice.sleep)); } },
    { words: ['wake','wake up','get up','rise'],
      fn: () => { petMain.setAnim('walk', 0);    petMain.say('I\'m awake! 😺'); } },
    { words: ['jump','boing','leap'],
      fn: () => { petMain.animateWrap('anim-jump'); petMain.say(pick(SPEECH.voice.jump)); } },
    { words: ['dance','boogie','groove','party'],
      fn: () => { petMain.setAnim('dance', 3500); petMain.say(pick(SPEECH.voice.dance)); } },
    { words: ['spin','twirl','rotate'],
      fn: () => { petMain.animateWrap('anim-spin'); petMain.say('Wheee! 🌀'); } },

    // Care
    { words: ['feed','eat','food','hungry','nom'],
      fn: () => petActions.feed() },
    { words: ['play','game','ball','toy'],
      fn: () => petActions.play() },
    { words: ['pet','stroke','pat','cuddle','hug'],
      fn: () => petActions.pet() },

    // Misc
    { words: ['hello','hi','hey','meow','greet'],
      fn: () => petMain.say('Meow! Hello! 😸') },
    { words: ['happy','cheer','smile','good boy','good girl'],
      fn: () => { gameState.happy = Math.min(100, gameState.happy + 15); petMain.updateUI(); petMain.say('Purrrr~ 😻'); } },
    { words: ['what\'s your name','your name','who are you','name'],
      fn: () => petMain.say(`I'm ${gameState.name}! 🐱`) },
  ];

  /* ── pick helper (avoids needing randFrom early) ─────────────────*/
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ── UI helpers ─────────────────────────────────────────────────── */
  function getBtn()   { return document.getElementById('voice-btn'); }
  function setUI(on)  {
    const btn = getBtn();
    if (!btn) return;
    btn.classList.toggle('listening', on);
    btn.title = on ? 'Listening… click to stop' : 'Voice commands';
  }

  /* ── Show a small overlay that lists commands ────────────────────── */
  function showHelp() {
    if (document.getElementById('voice-help')) return;
    const div = document.createElement('div');
    div.id = 'voice-help';
    div.style.cssText = `position:fixed;bottom:calc(var(--ui-height)+56px);right:14px;
      background:rgba(255,255,255,.97);border:1px solid #ddd;border-radius:12px;
      padding:12px 14px;font-size:11px;z-index:60;line-height:1.7;
      box-shadow:0 4px 20px rgba(0,0,0,.15);max-width:200px`;
    div.innerHTML = `<b style="font-size:12px">🎤 Voice Commands</b><br>
      come · sit · sleep · wake<br>
      jump · dance · spin<br>
      feed · play · pet<br>
      hello · happy · name<br>
      <span style="color:#aaa;font-size:10px">(Chrome/Edge only)</span>
      <br><a href="#" onclick="document.getElementById('voice-help').remove();return false"
        style="color:#888;font-size:10px">✕ close</a>`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 8000);
  }

  /* ── Main recogniser setup ──────────────────────────────────────── */
  function setup() {
    const btn = getBtn();

    if (!SpeechRecognition) {
      if (btn) {
        btn.title = 'Voice commands need Chrome or Edge';
        btn.style.opacity = '.35';
        btn.style.cursor = 'not-allowed';
        btn.onclick = () => petMain.say('Voice needs Chrome or Edge 🎤');
      }
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous    = false;   // one shot per click
    recognition.interimResults = false;
    recognition.lang          = 'en-US';
    recognition.maxAlternatives = 3;     // consider top-3 alternatives

    recognition.onstart = () => {
      isListening = true;
      setUI(true);
    };

    recognition.onresult = (e) => {
      // Collect all alternatives from all results
      const transcripts = [];
      for (let i = 0; i < e.results.length; i++) {
        for (let j = 0; j < e.results[i].length; j++) {
          transcripts.push(e.results[i][j].transcript.toLowerCase().trim());
        }
      }

      let matched = false;
      outer: for (const text of transcripts) {
        for (const cmd of COMMAND_MAP) {
          for (const word of cmd.words) {
            if (text.includes(word)) {
              cmd.fn();
              matched = true;
              break outer;
            }
          }
        }
      }

      if (!matched) {
        const best = transcripts[0] || '???';
        petMain.say(`I heard "${best}" — try: come, sit, dance, feed, play 🤔`);
      }
    };

    recognition.onerror = (e) => {
      switch (e.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          micAllowed = false;
          petMain.say('Microphone blocked 😿 — allow mic in browser settings');
          if (btn) { btn.style.opacity = '.35'; btn.style.cursor = 'not-allowed'; }
          break;
        case 'no-speech':
          petMain.say("I didn't hear anything… try again 🎤");
          break;
        case 'network':
          petMain.say('Voice needs an internet connection 🌐');
          break;
        default:
          petMain.say('Voice error: ' + e.error);
      }
      stopListening();
    };

    recognition.onend = () => {
      stopListening();
    };

    // Right-click / long-press on mic button shows help
    if (btn) {
      btn.addEventListener('contextmenu', (e) => { e.preventDefault(); showHelp(); });
    }
  }

  /* ── Start ─────────────────────────────────────────────────────── */
  function startListening() {
    if (!recognition) {
      petMain.say('Voice commands need Chrome or Edge 🎤');
      return;
    }
    if (isListening) return;

    // Must be served via http/https for mic API
    if (location.protocol === 'file:') {
      petMain.say('Voice needs a local server (not file://). Run: npx serve . 🎤');
      showHelp();
      return;
    }

    try {
      recognition.start();
      petMain.say('Listening… say a command! 🎤');
    } catch (err) {
      // If already started, abort and retry
      try { recognition.abort(); } catch(_) {}
      setTimeout(() => {
        try { recognition.start(); petMain.say('Listening… 🎤'); } catch(_) {}
      }, 250);
    }
  }

  /* ── Stop ──────────────────────────────────────────────────────── */
  function stopListening() {
    isListening = false;
    setUI(false);
    try { recognition.abort(); } catch(_) {}
  }

  /* ── Toggle (button click) ─────────────────────────────────────── */
  function toggle() {
    if (isListening) stopListening();
    else startListening();
  }

  /* ── Public API ─────────────────────────────────────────────────── */
  // Run setup after DOM is ready (called by main.js indirectly via script order)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

  return { toggle, startListening, stopListening, showHelp };
})();

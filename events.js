/**
 * events.js
 * Random events, rare events (UFO/golden), visitor pet, birthday, daily rewards.
 */

const EventSystem = (() => {
  // ── Visitor ──────────────────────────────────────────────────────
  let visitorActive = false;
  let visitorX = 80, visitorY = 80;
  let visitorFrame = 0;
  const VISITOR_ICONS = ['🐶','🐰','🦊','🐸','🐼','🐧'];

  function spawnVisitor(worldW, worldH) {
    if (visitorActive) return;
    visitorActive = true;
    visitorX = Math.random() * (worldW - 100) + 20;
    visitorY = Math.random() * (worldH - 100) + 20;

    const wrap = document.getElementById('visitor-wrap');
    wrap.style.display = 'block';
    wrap.style.left = visitorX + 'px';
    wrap.style.top  = visitorY + 'px';

    const icon = randFrom(VISITOR_ICONS);
    const canvas = document.getElementById('visitor-canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '36px serif';
    ctx.fillText(icon, 4, 38);

    const vb = document.getElementById('visitor-bubble');
    vb.textContent = randFrom(SPEECH.visitor);
    vb.style.opacity = '1';

    setTimeout(() => dismissVisitor(), 8000);
  }

  function dismissVisitor() {
    visitorActive = false;
    document.getElementById('visitor-wrap').style.display = 'none';
    const vb = document.getElementById('visitor-bubble');
    vb.style.opacity = '0';
  }

  // ── UFO abduction ─────────────────────────────────────────────────
  function triggerUFO(petWrap, onComplete) {
    const ufo = document.getElementById('ufo');
    ufo.style.display = 'block';
    const petRect = petWrap.getBoundingClientRect();
    ufo.style.left  = petRect.left + 'px';
    ufo.style.top   = '-60px';

    setTimeout(() => {
      ufo.style.top = petRect.top - 20 + 'px';
    }, 100);

    setTimeout(() => {
      petWrap.style.opacity = '0';
      setTimeout(() => {
        ufo.style.top = '-80px';
        setTimeout(() => {
          ufo.style.display = 'none';
          petWrap.style.opacity = '1';
          gameState.hat = '👽';
          gameState.ufoAbducted = true;
          onComplete();
        }, 1500);
      }, 800);
    }, 1500);
  }

  // ── Golden event ──────────────────────────────────────────────────
  function triggerGolden(onComplete) {
    gameState.isGolden = true;
    gameState.goldenEvent = true;
    WeatherSystem.confetti(60);
    onComplete();
    setTimeout(() => { gameState.isGolden = false; }, 30000);
  }

  // ── Dream bubble ──────────────────────────────────────────────────
  function showDream() {
    const d = document.getElementById('dream-bubble');
    d.style.display = 'block';
    d.textContent = '💭 ' + randFrom(SPEECH.dream);
    setTimeout(() => { d.style.display = 'none'; }, 4000);
  }

  // ── Common random events ──────────────────────────────────────────
  let eventTimer = 0;
  const EVENT_INTERVAL_MIN = 15000;
  const EVENT_INTERVAL_MAX = 30000;
  let nextEvent = EVENT_INTERVAL_MIN + Math.random() * (EVENT_INTERVAL_MAX - EVENT_INTERVAL_MIN);

  function tick(dt, s, say, worldW, worldH, petWrap) {
    eventTimer += dt;
    if (eventTimer < nextEvent) return;
    eventTimer = 0;
    nextEvent = EVENT_INTERVAL_MIN + Math.random() * (EVENT_INTERVAL_MAX - EVENT_INTERVAL_MIN);

    // 1-in-1000 ultra rare events
    if (Math.random() < 0.001) {
      if (Math.random() < 0.5) {
        say(randFrom(SPEECH.ufo));
        triggerUFO(petWrap, () => { say('I\'m back! And I have a hat! 👽'); });
      } else {
        say(randFrom(SPEECH.golden));
        triggerGolden(() => say(randFrom(SPEECH.golden)));
      }
      return;
    }

    // Visitor (every ~5 events)
    if (Math.random() < 0.18 && !visitorActive) {
      spawnVisitor(worldW, worldH);
      say(randFrom(SPEECH.visitor));
      return;
    }

    const events = [
      () => { s.coins++; s.foundTreasure = true; say(randFrom(SPEECH.events.treasure)); },
      () => { say(randFrom(SPEECH.events.sneeze)); return 'shake'; },
      () => { say(randFrom(SPEECH.events.dizzy));  return 'spin'; },
      () => { say(randFrom(SPEECH.events.scared)); return 'shake'; },
      () => { say(randFrom(SPEECH.events.dance));  return 'dance'; },
      () => { say(randFrom(SPEECH.events.butterfly)); },
      () => { say(randFrom(SPEECH.events.moonwalk)); return 'dance'; },
      () => { say(randFrom(SPEECH.events.trip));   return 'shake'; },
    ];

    return events[Math.floor(Math.random() * events.length)]();
  }

  // ── Birthday check ─────────────────────────────────────────────────
  function checkBirthday(say) {
    if (isBirthday() && !gameState.birthdayCelebrated) {
      const age = getPetAgeDays();
      say(randFrom(SPEECH.birthday).replace('{age}', age));
      WeatherSystem.confetti(80);
      gameState.birthdayCelebrated = true;
      document.getElementById('birthday-badge').style.display = '';
      setTimeout(() => { document.getElementById('birthday-badge').style.display = 'none'; }, 10000);
    }
  }

  // ── Daily reward ──────────────────────────────────────────────────
  function claimDaily(say, updateUI) {
    const today = todayStr();
    const lastClaim = new Date(gameState.dailyClaimedAt).toISOString().slice(0, 10);
    if (lastClaim === today) {
      say('Already got today\'s reward! Come back tomorrow 😊');
      return;
    }
    const reward = randFrom(DAILY_REWARDS);
    gameState.dailyClaimedAt = Date.now();
    if (reward.type === 'coins') gameState.coins += reward.amount || 5;
    if (reward.type === 'food')  { gameState.hunger = clamp(gameState.hunger + 25, 0, 100); }
    say(randFrom(SPEECH.daily) + ' ' + reward.label);
    WeatherSystem.confetti(25);
    updateUI();
    saveState();
  }

  // ── Time-aware greeting ────────────────────────────────────────────
  function timeGreeting() {
    const h = new Date().getHours();
    const isWE = [0, 6].includes(new Date().getDay());
    if (isWE) return randFrom(SPEECH.greet.weekend);
    if (h < 6)  return randFrom(SPEECH.greet.night);
    if (h < 12) return randFrom(SPEECH.greet.morning);
    if (h < 18) return randFrom(SPEECH.greet.afternoon);
    if (h < 21) return randFrom(SPEECH.greet.evening);
    return randFrom(SPEECH.greet.night);
  }

  function getTimeLabel() {
    const h = new Date().getHours();
    if (h < 6)  return '🌙 Night';
    if (h < 12) return '☀️ Morning';
    if (h < 18) return '🌤️ Afternoon';
    if (h < 21) return '🌅 Evening';
    return '🌙 Night';
  }

  return {
    tick, checkBirthday, claimDaily,
    timeGreeting, getTimeLabel,
    triggerUFO, triggerGolden, showDream,
  };
})();

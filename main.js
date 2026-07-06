/**
 * main.js
 * Game loop, movement, stat decay, UI updates, achievement checking.
 * Exposes window.petMain and window.worldControls.
 */

(() => {
  // ── DOM refs ────────────────────────────────────────────────────
  const petCanvas  = document.getElementById('pet-canvas');
  const petCtx     = petCanvas.getContext('2d');
  const petWrap    = document.getElementById('pet-wrap');
  const bubble     = document.getElementById('speech-bubble');
  const toast      = document.getElementById('achievement-toast');

  // ── Runtime movement state ──────────────────────────────────────
  let petX = 120, petY = 120;
  let targetX = 200, targetY = 200;
  let facing = 1;
  let currentAnim = 'walk';
  let animOverrideUntil = 0;
  let animFrame = 0;
  let frameTimer = 0;
  let cursorX = 200, cursorY = 200;
  let bubbleTimer = 0;
  let statTimer = 0;
  let lastLoopTime = 0;

  // ── World size ──────────────────────────────────────────────────
  function worldW() { return document.getElementById('world').offsetWidth; }
  function worldH() { return document.getElementById('world').offsetHeight; }

  // ── Initialization ──────────────────────────────────────────────
  function init() {
    const isReturning = loadState();

    // Apply world settings
    WeatherSystem.applyRoom(gameState.room);
    WeatherSystem.applyWeather(gameState.weather);
    updateRoomButtons();
    updateWeatherButtons();

    // Initial position
    petX = Math.random() * Math.max(worldW() - 80, 100) + 20;
    petY = Math.random() * Math.max(worldH() - 80, 60)  + 20;
    pickNewTarget();

    updateUI();
    updateHatPicker();

    // Greeting
    if (isReturning) {
      const lastMs = Date.now() - gameState.lastVisit;
      // If away > 6h, slightly lower stats
      if (lastMs > 21600000) {
        gameState.hunger = clamp(gameState.hunger - 20, 0, 100);
        gameState.happy  = clamp(gameState.happy  - 10, 0, 100);
      }
      say(randFrom(SPEECH.return));
    } else {
      say(EventSystem.timeGreeting());
    }
    gameState.lastVisit = Date.now();

    // Check birthday
    EventSystem.checkBirthday(say);

    // Total days tracking
    const daysSinceCreated = getPetAgeDays();
    gameState.totalDays = Math.max(gameState.totalDays, daysSinceCreated + 1);

    saveState();
    requestAnimationFrame(loop);
  }

  // ── Game loop ───────────────────────────────────────────────────
  function loop(ts) {
    const dt = Math.min(ts - lastLoopTime, 100);
    lastLoopTime = ts;

    update(dt);
    draw();

    requestAnimationFrame(loop);
  }

  function update(dt) {
    // Stat decay
    statTimer += dt;
    if (statTimer >= 5000) {
      statTimer = 0;
      decayStats();
    }

    // Bubble fade
    if (bubbleTimer > 0) {
      bubbleTimer -= dt;
      if (bubbleTimer <= 0) { bubble.classList.remove('visible'); }
    }

    // Emotion tick → idle speech
    if (EmotionSystem.tick(gameState, dt)) {
      const emotion = EmotionSystem.get();
      const speechKey = emotion === 'happy' ? 'idle' : emotion;
      const lines = SPEECH[speechKey] || SPEECH.idle;
      say(randFrom(lines));
    }

    // Random events
    const eventAnim = EventSystem.tick(dt, gameState, say, worldW(), worldH(), petWrap);
    if (eventAnim) animateWrap('anim-' + eventAnim);

    // Personality idle tricks
    const trick = PersonalitySystem.idleTrick(gameState.personality, animFrame);
    if (trick) {
      const tLines = SPEECH.events[trick] || SPEECH.idle;
      say(randFrom(tLines));
      if (trick === 'dance') setAnim('dance', 2500);
      else animateWrap('anim-shake');
    }

    // Determine animation state
    const now = Date.now();
    if (now > animOverrideUntil) {
      if (PersonalitySystem.shouldSleep(gameState.personality, gameState.energy, gameState.weather)) {
        if (currentAnim !== 'sleep') {
          say(randFrom(SPEECH.sleepy));
          EventSystem.showDream();
        }
        currentAnim = 'sleep';
      } else {
        if (currentAnim === 'sleep') {
          say('Stretch! Good nap! 😸');
          gameState.energy = clamp(gameState.energy + 25, 0, 100);
          updateUI();
        }
        currentAnim = 'walk';
      }
    }

    // Movement
    moveLoop(dt);

    // Frame counter
    frameTimer += dt;
    if (frameTimer >= 80) { frameTimer = 0; animFrame++; }

    // Achievements
    checkAchievements();
  }

  function moveLoop(dt) {
    if (currentAnim === 'sleep') return;

    // Item chase takes priority
    const item = window.petActions.getItemTarget();
    if (item) {
      moveTo(item.x, item.y, 1.8);
      if (Math.hypot(petX - item.x, petY - item.y) < 28) {
        window.petActions.itemReached();
      }
      return;
    }

    // Personality cursor interaction
    const result = PersonalitySystem.cursorTarget(
      cursorX, cursorY, petX, petY,
      gameState.personality, worldW(), worldH()
    );

    if (result.tx !== null) {
      moveTo(result.tx, result.ty, PersonalitySystem.getSpeed(gameState.personality, gameState.hunger, gameState.energy) * 1.1);
    } else {
      // Wander
      if (Math.hypot(petX - targetX, petY - targetY) < 12) pickNewTarget();
      moveTo(targetX, targetY, PersonalitySystem.getSpeed(gameState.personality, gameState.hunger, gameState.energy));
    }
  }

  function moveTo(tx, ty, speed) {
    const dx = tx - petX, dy = ty - petY;
    const dist = Math.hypot(dx, dy);
    if (dist < 3) return;
    facing = dx > 0 ? 1 : -1;
    petX += (dx / dist) * speed;
    petY += (dy / dist) * speed;
    petX = clamp(petX, 4, worldW() - 68);
    petY = clamp(petY, 4, worldH() - 68);
    petWrap.style.left = Math.round(petX) + 'px';
    petWrap.style.top  = Math.round(petY) + 'px';
    bubble.style.left  = Math.round(petX - 48) + 'px';
    bubble.style.top   = Math.round(petY - 68) + 'px';
  }

  function pickNewTarget() {
    targetX = Math.random() * Math.max(worldW() - 80, 60) + 20;
    targetY = Math.random() * Math.max(worldH() - 80, 40) + 20;
  }

  // ── Draw ────────────────────────────────────────────────────────
  function draw() {
    Renderer.drawCat(petCtx, {
      anim:      currentAnim,
      frame:     animFrame,
      facing,
      hunger:    gameState.hunger,
      energy:    gameState.energy,
      happy:     gameState.happy,
      health:    gameState.health,
      bodyColor: gameState.bodyColor || '#f4a832',
      isGolden:  gameState.isGolden,
      ageName:   getAgeStage().name,
      emotion:   EmotionSystem.get(),
    });
  }

  // ── Stat decay ──────────────────────────────────────────────────
  function decayStats() {
    const weatherMult = gameState.weather === 'night' ? 0.5 : 1;
    const moveMult    = currentAnim === 'walk' ? 1 : 0.4;

    gameState.hunger = clamp(gameState.hunger - 0.9 * weatherMult, 0, 100);
    gameState.energy = clamp(gameState.energy - 0.5 * moveMult * weatherMult, 0, 100);

    // Happy changes based on other stats
    if (gameState.hunger < 15) gameState.happy = clamp(gameState.happy - 1.5, 0, 100);
    if (gameState.hunger > 60 && gameState.energy > 40) gameState.happy = clamp(gameState.happy + 0.3, 0, 100);

    // Health only degrades when starving
    if (gameState.hunger === 0) gameState.health = clamp(gameState.health - 0.6, 0, 100);
    if (gameState.health < 100 && gameState.hunger > 50) gameState.health = clamp(gameState.health + 0.2, 0, 100);

    EmotionSystem.set(EmotionSystem.evaluate(gameState));
    updateUI();
    saveState();
  }

  // ── UI update ────────────────────────────────────────────────────
  function updateUI() {
    const el = v => document.getElementById(v);
    el('hunger-fill').style.width = fmt(gameState.hunger) + '%';
    el('energy-fill').style.width = fmt(gameState.energy) + '%';
    el('happy-fill').style.width  = fmt(gameState.happy)  + '%';
    el('health-fill').style.width = fmt(gameState.health) + '%';
    el('hunger-val').textContent  = fmt(gameState.hunger);
    el('energy-val').textContent  = fmt(gameState.energy);
    el('happy-val').textContent   = fmt(gameState.happy);
    el('health-val').textContent  = fmt(gameState.health);
    el('pet-name-el').textContent = '🐱 ' + gameState.name;
    el('hat-layer').textContent   = gameState.hat;
    el('coins-el').textContent    = '🪙 ' + gameState.coins;
    el('emotion-el').textContent  = EmotionSystem.getIcon();
    el('time-greeting').textContent = EventSystem.getTimeLabel();

    const p = PERSONALITIES[gameState.personality] || PERSONALITIES.curious;
    el('personality-badge').textContent = p.label;

    const stage = getAgeStage();
    el('age-badge').textContent = '📅 ' + stage.name + ' (' + getPetAgeDays() + 'd)';
  }

  function updateHatPicker() {
    document.querySelectorAll('.hat-opt').forEach(e => {
      e.classList.toggle('sel', e.dataset.hat === gameState.hat);
    });
  }

  // ── Speech ───────────────────────────────────────────────────────
  function say(msg, dur = 3200) {
    bubble.textContent = msg;
    bubble.classList.add('visible');
    bubbleTimer = dur;
    document.getElementById('log').textContent = msg;
  }

  // ── Animation helpers ─────────────────────────────────────────────
  function setAnim(anim, duration = 2000) {
    currentAnim = anim;
    animOverrideUntil = Date.now() + duration;
    setTimeout(() => { if (Date.now() >= animOverrideUntil - 50) currentAnim = 'walk'; }, duration);
  }

  function animateWrap(cls) {
    petWrap.classList.remove(cls);
    void petWrap.offsetWidth;
    petWrap.classList.add(cls);
    petWrap.addEventListener('animationend', () => petWrap.classList.remove(cls), { once: true });
  }

  function moveToCenter() {
    targetX = worldW() / 2 - 32;
    targetY = worldH() / 2 - 32;
  }

  // ── Achievements ─────────────────────────────────────────────────
  function checkAchievements() {
    for (const ach of ACHIEVEMENTS) {
      if (!gameState.achievements.includes(ach.id) && ach.check(gameState)) {
        gameState.achievements.push(ach.id);
        gameState.coins += 5;
        showToast('🏆 ' + ach.label + ' (+5 coins!)');
        updateUI();
        saveState();
      }
    }
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  // ── Room / weather button state ───────────────────────────────────
  function updateRoomButtons() {
    document.querySelectorAll('.room-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.r === gameState.room);
    });
  }

  function updateWeatherButtons() {
    document.querySelectorAll('.weather-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.w === gameState.weather);
    });
  }

  // ── Mouse tracking ─────────────────────────────────────────────
  document.getElementById('world').addEventListener('mousemove', e => {
    const r = document.getElementById('world').getBoundingClientRect();
    cursorX = e.clientX - r.left;
    cursorY = e.clientY - r.top;
  });

  // Click on pet
  petWrap.addEventListener('click', () => {
    if (currentAnim === 'sleep') { say('Zzz... 💤'); return; }
    window.petActions.pet();
  });

  // Resize handler - re-render SVG room and pick new wander target
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      WeatherSystem.applyRoom(gameState.room);
      pickNewTarget();
    }, 150);
  });

  // ── worldControls (exposed globally) ─────────────────────────────
  window.worldControls = {
    setWeather(w) {
      gameState.weather = w;
      WeatherSystem.applyWeather(w);
      say(randFrom(SPEECH.weather[w] || SPEECH.idle));
    },
    setRoom(r) {
      gameState.room = r;
      WeatherSystem.applyRoom(r);
      visitRoom(r);
      updateRoomButtons();
      say(randFrom(SPEECH.room[r] || SPEECH.idle));
      saveState();
    },
  };

  // ── petMain (exposed globally for other modules) ──────────────────
  window.petMain = {
    say, setAnim, animateWrap, updateUI, moveToCenter, pickNewTarget,
    showToast,
    getState: () => gameState,
  };

  // ── Start ────────────────────────────────────────────────────────
  init();
})();

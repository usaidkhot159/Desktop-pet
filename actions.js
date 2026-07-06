/**
 * actions.js
 * All player-triggered actions: feed, play, pet, toy, adventure, photo, rename, hat, daily.
 */

window.petActions = (() => {
  let itemActive = false;
  let itemX = 0, itemY = 0;
  let onItemReached = null;

  /** Place a floating item for the pet to chase */
  function placeItem(icon, worldW, worldH, onReach) {
    const el = document.getElementById('item-el');
    itemX = Math.random() * (worldW - 80) + 20;
    itemY = Math.random() * (worldH - 80) + 20;
    el.textContent = icon;
    el.style.left = itemX + 'px';
    el.style.top  = itemY + 'px';
    el.style.display = 'block';
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'itemPop .35s cubic-bezier(.34,1.56,.64,1)';
    itemActive = true;
    onItemReached = onReach;
  }

  function clearItem() {
    document.getElementById('item-el').style.display = 'none';
    itemActive = false;
    onItemReached = null;
  }

  function getItemTarget() { return itemActive ? { x: itemX, y: itemY } : null; }

  function itemReached() {
    if (onItemReached) onItemReached();
    clearItem();
  }

  // ── Feed ────────────────────────────────────────────────────────
  function feed() {
    const food = randFrom(FOODS);
    gameState.lastFood = food;
    const world = document.getElementById('world');
    placeItem(food, world.offsetWidth, world.offsetHeight - 220, () => {
      gameState.hunger = clamp(gameState.hunger + 28, 0, 100);
      gameState.happy  = clamp(gameState.happy  + 8,  0, 100);
      gameState.feedCount++;
      window.petMain.say(randFrom(SPEECH.feed));
      window.petMain.setAnim('eat', 1800);
      window.petMain.updateUI();
      saveState();
    });
    window.petMain.say(food + ' Food! Coming! 😍');
  }

  // ── Play ────────────────────────────────────────────────────────
  function play() {
    if (gameState.energy < 12) { window.petMain.say('Too sleepy to play... 😴'); return; }
    gameState.happy   = clamp(gameState.happy   + 18, 0, 100);
    gameState.energy  = clamp(gameState.energy  - 14, 0, 100);
    gameState.playCount++;
    window.petMain.say(randFrom(SPEECH.play));
    window.petMain.setAnim('dance', 2800);
    window.petMain.updateUI();
    saveState();
  }

  // ── Pet ─────────────────────────────────────────────────────────
  function pet() {
    gameState.happy = clamp(gameState.happy + 8, 0, 100);
    window.petMain.say(randFrom(SPEECH.pet));
    window.petMain.animateWrap('anim-jump');
    window.petMain.updateUI();
  }

  // ── Give toy ────────────────────────────────────────────────────
  function giveToy() {
    const toy = randFrom(TOYS);
    if (gameState.energy < toy.energyCost * 0.5) {
      window.petMain.say('Too tired for toys... 😴');
      return;
    }
    gameState.lastPlayedToy = toy.name;
    const world = document.getElementById('world');
    placeItem(toy.icon, world.offsetWidth, world.offsetHeight - 220, () => {
      gameState.happy  = clamp(gameState.happy  + toy.happyBoost, 0, 100);
      gameState.energy = clamp(gameState.energy - toy.energyCost, 0, 100);
      const lines = SPEECH.toy[toy.icon] || SPEECH.play;
      window.petMain.say(randFrom(lines));
      window.petMain.setAnim('dance', 2000);
      window.petMain.updateUI();
      saveState();
    });
    window.petMain.say(toy.icon + ' ' + toy.name + '! 😻');
  }

  // ── Adventure ───────────────────────────────────────────────────
  function adventure() {
    if (window._adventuring) { window.petMain.say('Still exploring... 🗺️'); return; }
    window._adventuring = true;
    window.petMain.say('See you soon! 🗺️');
    document.getElementById('pet-wrap').style.opacity = '.2';

    const dur = 12000 + Math.random() * 8000;
    setTimeout(() => {
      document.getElementById('pet-wrap').style.opacity = '1';
      window._adventuring = false;
      gameState.adventureCount++;

      const roll = Math.random();
      if (roll < 0.3) {
        const reward = randFrom(['🪙', '🍖', TOYS[Math.floor(Math.random()*TOYS.length)].icon]);
        if (reward === '🪙') { gameState.coins += 3; }
        if (reward === '🍖') { gameState.hunger = clamp(gameState.hunger + 20, 0, 100); }
        const line = randFrom(SPEECH.adventure.found).replace('{item}', reward);
        window.petMain.say(line);
      } else if (roll < 0.05) {
        gameState.coins += 20;
        window.petMain.say('Found rare treasure!! 💎 +20 coins!');
      } else {
        window.petMain.say(randFrom(SPEECH.adventure.notFound));
      }
      window.petMain.updateUI();
      saveState();
    }, dur);
  }

  // ── Photo mode ──────────────────────────────────────────────────
  function photo() {
    const flash = document.getElementById('photo-flash');
    flash.classList.add('flash');
    setTimeout(() => flash.classList.remove('flash'), 200);

    // Capture world + pet as PNG
    const world = document.getElementById('world');
    const petCanvas = document.getElementById('pet-canvas');
    const out = document.createElement('canvas');
    out.width = world.offsetWidth;
    out.height = world.offsetHeight;
    const octx = out.getContext('2d');

    // Fill background with room gradient (approximate)
    octx.fillStyle = '#87ceeb';
    octx.fillRect(0, 0, out.width, out.height);

    // Draw pet canvas
    const pw = document.getElementById('pet-wrap');
    const rect = pw.getBoundingClientRect();
    const wRect = world.getBoundingClientRect();
    octx.drawImage(petCanvas, rect.left - wRect.left, rect.top - wRect.top, 64, 64);

    // Add caption
    octx.fillStyle = '#333';
    octx.font = '14px system-ui';
    octx.fillText(`🐱 ${gameState.name} | ❤️ ${fmt(gameState.happy)}% happy`, 12, out.height - 14);

    // Download
    const a = document.createElement('a');
    a.download = `${gameState.name}-pet-photo.png`;
    a.href = out.toDataURL('image/png');
    a.click();
    window.petMain.say('📷 Cheese! 😸');
  }

  // ── Rename ──────────────────────────────────────────────────────
  function rename() {
    const n = prompt('Name your pet:', gameState.name);
    if (n && n.trim()) {
      gameState.name = n.trim().slice(0, 18);
      window.petMain.say(`Meow! Call me ${gameState.name}! 😸`);
      window.petMain.updateUI();
    }
  }

  // ── Hat picker ──────────────────────────────────────────────────
  function pickHat(el, hat) {
    document.querySelectorAll('.hat-opt').forEach(e => e.classList.remove('sel'));
    el.classList.add('sel');
    gameState.hat = hat;
    window.petMain.updateUI();
  }

  // ── Daily reward ─────────────────────────────────────────────────
  function claimDaily() {
    EventSystem.claimDaily(window.petMain.say, window.petMain.updateUI);
  }

  return {
    feed, play, pet, giveToy, adventure, photo, rename, pickHat, claimDaily,
    getItemTarget, itemReached,
    isItemActive: () => itemActive,
    clearItem,
  };
})();

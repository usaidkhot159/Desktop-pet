/**
 * personality.js
 * Personality-driven behaviours: cursor interaction, idle tricks, special moves.
 */

const PersonalitySystem = (() => {
  /**
   * Given cursor position and pet position, determine desired target.
   * Returns {tx, ty, isFleeing, isChasing}
   */
  function cursorTarget(cursorX, cursorY, petX, petY, personality, worldW, worldH) {
    const px = petX + 32, py = petY + 32;
    const dx = cursorX - px, dy = cursorY - py;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const p = PERSONALITIES[personality] || PERSONALITIES.curious;

    // Shy: flee from cursor
    if (personality === 'shy' && p.fleeRange && dist < p.fleeRange) {
      return {
        tx: clamp(petX - dx * 2, 10, worldW - 74),
        ty: clamp(petY - dy * 2, 10, worldH - 74),
        isFleeing: true, isChasing: false,
      };
    }

    // Mischievous: sometimes reverse-chase
    if (personality === 'mischievous' && dist < 200) {
      const tick = Math.floor(Date.now() / 3000) % 3;
      if (tick === 0) {
        return { tx: cursorX - 32, ty: cursorY - 32, isChasing: true, isFleeing: false };
      }
    }

    // Energetic & others: chase
    const range = p.chaseRange || 0;
    if (range > 0 && dist < range && dist > 40) {
      return { tx: cursorX - 32, ty: cursorY - 32, isChasing: true, isFleeing: false };
    }

    return { tx: null, ty: null, isChasing: false, isFleeing: false };
  }

  /**
   * Personality-specific idle tricks.
   * Returns a speech key or null.
   */
  function idleTrick(personality, frame) {
    switch (personality) {
      case 'cool':
        if (frame % 400 === 0) return 'moonwalk';
        break;
      case 'energetic':
        if (frame % 300 === 0) return 'dance';
        break;
      case 'mischievous':
        if (frame % 350 === 0) return 'trip';
        break;
      case 'curious':
        if (frame % 450 === 0) return 'butterfly';
        break;
    }
    return null;
  }

  /** Speed multiplier based on personality and stats */
  function getSpeed(personality, hunger, energy) {
    const p = PERSONALITIES[personality] || PERSONALITIES.curious;
    let speed = 1.4 * p.speedMult;
    if (hunger < 20) speed *= 0.6;
    if (energy < 20) speed *= 0.4;
    return speed;
  }

  /** Should the pet sleep right now? */
  function shouldSleep(personality, energy, weather) {
    const p = PERSONALITIES[personality] || PERSONALITIES.curious;
    const threshold = weather === 'night' ? p.sleepThreshold + 25 : p.sleepThreshold;
    return energy < threshold;
  }

  return { cursorTarget, idleTrick, getSpeed, shouldSleep };
})();

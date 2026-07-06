/**
 * emotions.js
 * Derives the current emotion from game state and drives speech lines.
 */

const EmotionSystem = (() => {
  let currentEmotion = 'happy';
  let lastEmotionTick = 0;

  /** Determine emotion from stats */
  function evaluate(s) {
    if (s.energy < 15)   return 'sleepy';
    if (s.hunger < 15)   return 'hungry';
    if (s.health < 25)   return 'sad';
    if (s.happy < 25)    return 'angry';
    if (s.happy < 40)    return 'sad';
    if (s.happy >= 85 && s.energy >= 60) return 'excited';
    if (s.happy >= 60)   return 'happy';
    return 'happy';
  }

  /** Get random speech line for given emotion */
  function getSpeechLine(emotion, extras = {}) {
    const lines = SPEECH[emotion] || SPEECH.idle;
    let line = randFrom(lines);
    // Template substitution
    for (const [k, v] of Object.entries(extras)) {
      line = line.replace('{' + k + '}', v);
    }
    return line;
  }

  /** Called every game tick */
  function tick(s, dt) {
    lastEmotionTick += dt;
    const newEmotion = evaluate(s);
    if (newEmotion !== currentEmotion) {
      currentEmotion = newEmotion;
    }
    // Occasionally speak idle/emotion lines
    if (lastEmotionTick > 12000) {
      lastEmotionTick = 0;
      return true; // signal to speak
    }
    return false;
  }

  function get()    { return currentEmotion; }
  function set(e)   { currentEmotion = e; }
  function getIcon(){ return (EMOTIONS[currentEmotion] || EMOTIONS.happy).icon; }

  return { evaluate, tick, get, set, getIcon, getSpeechLine };
})();

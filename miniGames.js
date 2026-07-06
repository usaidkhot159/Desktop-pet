/**
 * miniGames.js
 * Mini-games: Catch the Ball, Memory, Simon Says.
 * Rewards happy/coins on win.
 */

window.miniGames = (() => {
  // ── Inject overlay HTML ─────────────────────────────────────────
  function injectOverlay() {
    if (document.getElementById('minigame-overlay')) return;
    const div = document.createElement('div');
    div.id = 'minigame-overlay';
    div.innerHTML = `<div id="minigame-box">
      <h2 id="mg-title"></h2>
      <p  id="mg-desc"></p>
      <div id="mg-content"></div>
      <button class="mg-btn" onclick="window.miniGames.close()">✕ Close</button>
    </div>`;
    document.body.appendChild(div);
  }

  function open(title, desc, contentHTML) {
    injectOverlay();
    document.getElementById('mg-title').textContent = title;
    document.getElementById('mg-desc').textContent  = desc;
    document.getElementById('mg-content').innerHTML = contentHTML;
    document.getElementById('minigame-overlay').classList.add('active');
  }

  function close() {
    const ov = document.getElementById('minigame-overlay');
    if (ov) ov.classList.remove('active');
  }

  function reward(coins, happy, msg) {
    gameState.coins += coins;
    gameState.happy = clamp(gameState.happy + happy, 0, 100);
    window.petMain.say(msg);
    window.petMain.updateUI();
    saveState();
    setTimeout(close, 1200);
  }

  // ── Simon Says ──────────────────────────────────────────────────
  function simonSays() {
    const moves = ['⬆️','⬇️','⬅️','➡️'];
    const seq = Array.from({length: 4}, () => randFrom(moves));
    let idx = 0;

    const btns = moves.map(m =>
      `<button class="mg-btn" style="font-size:20px;padding:10px 14px" onclick="window.miniGames._simonInput('${m}')">${m}</button>`
    ).join('');

    open('Simon Says 🎮', `Repeat: ${seq.join(' ')}`,
      `<div style="margin-bottom:12px">${btns}</div>
       <div id="sg-feedback" style="font-size:13px;color:#666;min-height:18px"></div>`
    );

    window.miniGames._simonInput = (input) => {
      if (input === seq[idx]) {
        idx++;
        document.getElementById('sg-feedback').textContent = `✅ ${idx}/${seq.length}`;
        if (idx === seq.length) {
          document.getElementById('sg-feedback').textContent = '🎉 You win!';
          reward(3, 15, 'I love Simon Says! 🎮');
        }
      } else {
        document.getElementById('sg-feedback').textContent = `❌ Wrong! Expected ${seq[idx]}`;
        setTimeout(close, 1000);
      }
    };
  }

  // ── Memory match ────────────────────────────────────────────────
  function memoryGame() {
    const icons = ['🐟','🍕','⭐','🌈','🎾','🧸'];
    const cards = [...icons, ...icons].sort(() => Math.random() - .5);
    let flipped = [], matched = 0, locked = false;

    const grid = cards.map((c, i) =>
      `<button class="mg-btn" id="mc-${i}" style="width:44px;height:44px;font-size:20px;padding:2px"
        onclick="window.miniGames._memFlip(${i})">❓</button>`
    ).join('');

    open('Memory Match 🧠', 'Match all pairs!',
      `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px">${grid}</div>
       <div id="mm-score" style="font-size:12px;color:#666">Pairs: 0/${icons.length}</div>`
    );

    const state = { cards, flipped: [], matched: 0 };

    window.miniGames._memFlip = (i) => {
      if (locked || state.flipped.includes(i)) return;
      const btn = document.getElementById('mc-' + i);
      if (!btn || btn.dataset.matched) return;
      btn.textContent = state.cards[i];
      state.flipped.push(i);
      if (state.flipped.length === 2) {
        locked = true;
        const [a, b] = state.flipped;
        if (state.cards[a] === state.cards[b]) {
          document.getElementById('mc-'+a).dataset.matched = '1';
          document.getElementById('mc-'+b).dataset.matched = '1';
          state.matched++;
          document.getElementById('mm-score').textContent = `Pairs: ${state.matched}/${icons.length}`;
          state.flipped = [];
          locked = false;
          if (state.matched === icons.length) reward(5, 20, 'Memory master! 🧠');
        } else {
          setTimeout(() => {
            document.getElementById('mc-'+a).textContent = '❓';
            document.getElementById('mc-'+b).textContent = '❓';
            state.flipped = [];
            locked = false;
          }, 900);
        }
      }
    };
  }

  // ── Catch the ball ──────────────────────────────────────────────
  function catchBall() {
    let score = 0, misses = 0;
    open('Catch the Ball! ⚽', 'Click the balls before they disappear!',
      `<div id="cb-area" style="position:relative;width:240px;height:180px;border:1px solid #ddd;border-radius:8px;margin:0 auto 12px;overflow:hidden;background:#f0f7ff"></div>
       <div id="cb-score" style="font-size:13px">Score: 0 | Misses: 0</div>`
    );

    function spawnBall() {
      const area = document.getElementById('cb-area');
      if (!area) return;
      const ball = document.createElement('div');
      ball.textContent = '⚽';
      ball.style.cssText = `position:absolute;font-size:22px;cursor:pointer;
        left:${Math.random()*200}px;top:${Math.random()*150}px;
        animation:none;transition:opacity .3s`;
      ball.onclick = () => {
        score++;
        document.getElementById('cb-score').textContent = `Score: ${score} | Misses: ${misses}`;
        ball.remove();
        if (score >= 8) { reward(4, 18, 'Ball master! ⚽'); return; }
      };
      area.appendChild(ball);
      setTimeout(() => {
        if (ball.parentNode) { ball.remove(); misses++; }
        const sc = document.getElementById('cb-score');
        if (sc) sc.textContent = `Score: ${score} | Misses: ${misses}`;
        if (misses >= 3) { window.petMain.say('Dropped too many... 😿'); close(); return; }
        if (document.getElementById('cb-area')) spawnBall();
      }, 1800);
    }
    spawnBall();
    spawnBall();
  }

  // ── Launcher ────────────────────────────────────────────────────
  function launch() {
    const games = [simonSays, memoryGame, catchBall];
    randFrom(games)();
  }

  return { launch, simonSays, memoryGame, catchBall, close };
})();

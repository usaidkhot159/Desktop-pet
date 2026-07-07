/**
 * renderer.js
 * All canvas drawing for the pet (and visitor).
 * Draws a pixel-art style cat with expressions, animation states, age scaling.
 */

const Renderer = (() => {
  /**
   * Draw the cat.
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} opts
   *   anim       – 'walk'|'eat'|'sleep'|'dance'|'happy'|'scared'|'angry'
   *   frame      – animation tick counter
   *   facing     – 1 (right) | -1 (left)
   *   hunger     – 0-100
   *   energy     – 0-100
   *   happy      – 0-100
   *   health     – 0-100
   *   bodyColor  – hex string
   *   isGolden   – bool
   *   ageName    – 'Baby'|'Teen'|'Adult'|'Elder'
   *   emotion    – emotion key string
   */
  function drawCat(ctx, opts = {}) {
    const {
      anim = 'walk', frame = 0, facing = 1,
      hunger = 80, energy = 80, happy = 75, health = 90,
      bodyColor = '#f4a832', isGolden = false,
      ageName = 'Adult', emotion = 'happy',
    } = opts;

    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;
    const isSleeping = anim === 'sleep';
    const isEating   = anim === 'eat';
    const isDancing  = anim === 'dance';
    const isScared   = emotion === 'scared';
    const isAngry    = emotion === 'angry';
    const isSad      = emotion === 'sad';
    const isExcited  = emotion === 'excited';

    // Scale by age
    const ageScale = ageName === 'Baby' ? 0.7 : ageName === 'Teen' ? 0.85 : ageName === 'Elder' ? 1.05 : 1.0;
    const main = isGolden ? '#f5c518' : bodyColor;
    const belly = isGolden ? '#ffe566' : '#fde8a0';
    const innerEar = isGolden ? '#f0a500' : '#f8c0c0';

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(facing < 0 ? -ageScale : ageScale, ageScale);
    ctx.translate(-cx, -cy);

    // Dance bob
    if (isDancing) {
      const bob = Math.sin(frame * 0.5) * 4;
      ctx.translate(0, bob);
    }
    // Scared shrink
    if (isScared) {
      const shrink = 1 - Math.abs(Math.sin(frame * 0.4)) * 0.1;
      ctx.translate(cx, cy);
      ctx.scale(shrink, shrink);
      ctx.translate(-cx, -cy);
    }

    // ── Body ──────────────────────────────────────────────────────
    ctx.fillStyle = main;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, 16, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = belly;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 13, 9, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Head ──────────────────────────────────────────────────────
    const headY = cy - 8;
    ctx.fillStyle = main;
    ctx.beginPath();
    ctx.ellipse(cx, headY, 14, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Ears ──────────────────────────────────────────────────────
    ctx.fillStyle = main;
    ctx.beginPath(); ctx.moveTo(cx - 12, headY - 6); ctx.lineTo(cx - 18, headY - 16); ctx.lineTo(cx - 5, headY - 12); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 12, headY - 6); ctx.lineTo(cx + 18, headY - 16); ctx.lineTo(cx + 5, headY - 12); ctx.fill();
    ctx.fillStyle = innerEar;
    ctx.beginPath(); ctx.moveTo(cx - 11, headY - 7); ctx.lineTo(cx - 15, headY - 13); ctx.lineTo(cx - 6, headY - 11); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 11, headY - 7); ctx.lineTo(cx + 15, headY - 13); ctx.lineTo(cx + 6, headY - 11); ctx.fill();

    // ── Eyes ──────────────────────────────────────────────────────
    const eyeY = headY - 1;
    const eyeL = cx - 5, eyeR = cx + 5;
    const blink = frame % 60 === 0 || frame % 60 === 1;

    if (isSleeping) {
      ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(eyeL, eyeY, 4, Math.PI, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(eyeR, eyeY, 4, Math.PI, Math.PI * 2); ctx.stroke();
    } else if (blink) {
      ctx.fillStyle = '#333';
      ctx.fillRect(eyeL - 4, eyeY, 8, 1.5);
      ctx.fillRect(eyeR - 4, eyeY, 8, 1.5);
    } else {
      const eyeSize = isExcited ? 5 : isScared ? 5.5 : 4;
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath(); ctx.ellipse(eyeL, eyeY, eyeSize, eyeSize, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(eyeR, eyeY, eyeSize, eyeSize, 0, 0, Math.PI * 2); ctx.fill();
      // Shine
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(eyeL + 1.5, eyeY - 1.5, 1.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(eyeR + 1.5, eyeY - 1.5, 1.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
      // Iris color by emotion
      const irisColor = isAngry ? '#e74c3c' : isSad ? '#7b9fcb' : isExcited ? '#f59e0b' : '#2d8a4e';
      ctx.fillStyle = irisColor;
      ctx.beginPath(); ctx.ellipse(eyeL, eyeY, 2, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(eyeR, eyeY, 2, 2, 0, 0, Math.PI * 2); ctx.fill();
    }

    // ── Nose & mouth ──────────────────────────────────────────────
    const noseY = headY + 6;
    ctx.fillStyle = '#ff9999';
    ctx.beginPath(); ctx.arc(cx, noseY, 2.2, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = '#555'; ctx.lineWidth = 1.2;
    if (isAngry) {
      ctx.beginPath(); ctx.moveTo(cx - 4, noseY + 4); ctx.quadraticCurveTo(cx, noseY + 1, cx + 4, noseY + 4); ctx.stroke();
    } else if (isSad) {
      ctx.beginPath(); ctx.moveTo(cx - 4, noseY + 5); ctx.quadraticCurveTo(cx, noseY + 1, cx + 4, noseY + 5); ctx.stroke();
    } else if (isEating || isExcited) {
      ctx.beginPath(); ctx.moveTo(cx - 4, noseY + 2); ctx.quadraticCurveTo(cx, noseY + 7, cx + 4, noseY + 2); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(cx - 3, noseY + 3); ctx.quadraticCurveTo(cx, noseY + 6, cx + 3, noseY + 3); ctx.stroke();
    }

    // ── Whiskers ──────────────────────────────────────────────────
    ctx.strokeStyle = '#aaa'; ctx.lineWidth = 0.8;
    [[cx - 3, noseY, cx - 20, noseY - 3], [cx - 3, noseY, cx - 20, noseY + 3],
     [cx + 3, noseY, cx + 20, noseY - 3], [cx + 3, noseY, cx + 20, noseY + 3]].forEach(([x1,y1,x2,y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });

    // ── Angry eyebrows ─────────────────────────────────────────────
    if (isAngry) {
      ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(eyeL - 5, eyeY - 7); ctx.lineTo(eyeL + 3, eyeY - 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(eyeR + 5, eyeY - 7); ctx.lineTo(eyeR - 3, eyeY - 4); ctx.stroke();
    }

    // ── Legs (walk animation) ──────────────────────────────────────
    const walkOff = anim === 'walk' ? Math.sin(frame * 0.35) * 5 : 0;
    ctx.fillStyle = main;
    [[cx - 9, cy + 22 + walkOff], [cx + 9, cy + 22 - walkOff],
     [cx - 9, cy + 22 - walkOff], [cx + 9, cy + 22 + walkOff]].forEach(([lx, ly]) => {
      ctx.beginPath(); ctx.ellipse(lx, ly, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
    });

    // ── Tail ──────────────────────────────────────────────────────
    const wagAmt = isDancing || anim === 'happy' ? Math.sin(frame * 0.4) * 18 : Math.sin(frame * 0.15) * 8;
    const tailX = cx + 16, tailY = cy + 14;
    ctx.strokeStyle = main; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.quadraticCurveTo(tailX + 12 + wagAmt * 0.4, tailY - 12, tailX + 8, tailY - 20 + wagAmt * 0.3);
    ctx.stroke();

    // ── Sleep Zs ──────────────────────────────────────────────────
    if (isSleeping) {
      const zOff = (frame * 0.5) % 22;
      ctx.fillStyle = '#5b8de0';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('z', cx + 16, cy - 14 - zOff);
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('z', cx + 20, cy - 20 - zOff);
    }

    // ── Hunger warning ─────────────────────────────────────────────
    if (hunger < 20 && !isSleeping) {
      ctx.fillStyle = '#e67e22';
      ctx.font = '8px sans-serif';
      ctx.fillText('hungry!', cx - 18, cy - 28);
    }

    // ── Golden shimmer ─────────────────────────────────────────────
    if (isGolden) {
      const starT = Math.sin(frame * 0.3) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255,215,0,${starT * 0.4})`;
      ctx.beginPath(); ctx.arc(cx, cy, 24, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
  }

  return { drawCat };
})();

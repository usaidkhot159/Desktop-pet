/**
 * weather.js
 * SVG-drawn room environments + weather particles + confetti.
 * Each room uses inline SVG for real furniture / scenery.
 */

const WeatherSystem = (() => {

  // ── Room SVG renderers ─────────────────────────────────────────────

  const ROOM_RENDERERS = {

    bedroom(w, h) {
      const floor = h * 0.58;
      return `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0">
        <defs>
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#d6e4f0"/>
            <stop offset="100%" stop-color="#c5d8ea"/>
          </linearGradient>
          <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#c8a882"/>
            <stop offset="100%" stop-color="#a87c52"/>
          </linearGradient>
          <linearGradient id="bedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e8d5c4"/>
            <stop offset="100%" stop-color="#d4b896"/>
          </linearGradient>
        </defs>

        <!-- Wall -->
        <rect width="${w}" height="${floor}" fill="url(#wallGrad)"/>
        <!-- Wallpaper stripe pattern -->
        ${Array.from({length:Math.ceil(w/60)},(_,i)=>`<rect x="${i*60}" y="0" width="2" height="${floor}" fill="rgba(180,200,220,.2)"/>`).join('')}

        <!-- Floor -->
        <rect y="${floor}" width="${w}" height="${h-floor}" fill="url(#floorGrad)"/>
        <!-- Floor planks -->
        ${Array.from({length:Math.ceil(w/80)},(_,i)=>`<line x1="${i*80}" y1="${floor}" x2="${i*80}" y2="${h}" stroke="#8a6040" stroke-width="1" opacity=".4"/>`).join('')}

        <!-- Wall picture frame -->
        <rect x="${w*0.62}" y="${h*0.06}" width="90" height="70" rx="3" fill="#8B6914" stroke="#6b4f10" stroke-width="3"/>
        <rect x="${w*0.62+6}" y="${h*0.06+6}" width="78" height="58" rx="1" fill="#7bb3d4"/>
        <!-- Mountain inside frame -->
        <polygon points="${w*0.62+10},${h*0.06+58} ${w*0.62+39},${h*0.06+18} ${w*0.62+68},${h*0.06+58}" fill="#4a8a6a" opacity=".8"/>
        <polygon points="${w*0.62+30},${h*0.06+58} ${w*0.62+54},${h*0.06+28} ${w*0.62+78},${h*0.06+58}" fill="#5a9a7a" opacity=".7"/>

        <!-- Window -->
        <rect x="${w*0.04}" y="${h*0.04}" width="110" height="130" rx="4" fill="#a8cce0" stroke="#8b7355" stroke-width="5"/>
        <rect x="${w*0.04}" y="${h*0.04+63}" width="110" height="4" fill="#8b7355"/>
        <rect x="${w*0.04+53}" y="${h*0.04}" width="4" height="130" fill="#8b7355"/>
        <!-- Window light glow -->
        <rect x="${w*0.04+2}" y="${h*0.04+2}" width="50" height="55" fill="rgba(255,255,200,.3)"/>
        <!-- Curtains -->
        <path d="M${w*0.04-8},${h*0.04-5} Q${w*0.04+10},${h*0.04+40} ${w*0.04-2},${h*0.04+135}" fill="#e8c4a0" stroke="#d4a870" stroke-width="2"/>
        <path d="M${w*0.04+118},${h*0.04-5} Q${w*0.04+108},${h*0.04+40} ${w*0.04+114},${h*0.04+135}" fill="#e8c4a0" stroke="#d4a870" stroke-width="2"/>

        <!-- Bed (right side) -->
        <!-- Bed frame -->
        <rect x="${w*0.68}" y="${floor-80}" width="${w*0.3}" height="80" rx="4" fill="#7a5230" stroke="#5c3a18" stroke-width="2"/>
        <!-- Mattress -->
        <rect x="${w*0.68+4}" y="${floor-70}" width="${w*0.3-8}" height="60" rx="3" fill="url(#bedGrad)" stroke="#c4a882" stroke-width="1"/>
        <!-- Pillow -->
        <rect x="${w*0.68+8}" y="${floor-68}" width="${w*0.3*0.38}" height="28" rx="6" fill="#f5f0e8" stroke="#ddd" stroke-width="1"/>
        <!-- Blanket -->
        <rect x="${w*0.68+4}" y="${floor-40}" width="${w*0.3-8}" height="32" rx="3" fill="#8fa8d0" stroke="#6d88b0" stroke-width="1"/>
        <!-- Blanket folds -->
        <path d="M${w*0.68+10},${floor-35} Q${w*0.68+50},${floor-28} ${w*0.68+w*0.3-14},${floor-33}" stroke="#7090be" stroke-width="1.5" fill="none"/>
        <!-- Headboard -->
        <rect x="${w*0.68-2}" y="${floor-110}" width="${w*0.3+4}" height="34" rx="4" fill="#8b5e30" stroke="#5c3a18" stroke-width="2"/>

        <!-- Nightstand -->
        <rect x="${w*0.64}" y="${floor-55}" width="42" height="50" rx="3" fill="#9b6f3e" stroke="#7a5230" stroke-width="2"/>
        <!-- Lamp on nightstand -->
        <rect x="${w*0.64+16}" y="${floor-90}" width="8" height="35" fill="#c8a870"/>
        <polygon points="${w*0.64+2},${floor-90} ${w*0.64+38},${floor-90} ${w*0.64+28},${floor-115} ${w*0.64+12},${floor-115}" fill="#f5e8d0" stroke="#d4b870" stroke-width="1.5"/>
        <!-- Lamp light glow -->
        <ellipse cx="${w*0.64+20}" cy="${floor-88}" rx="22" ry="12" fill="rgba(255,240,180,.25)"/>

        <!-- Bookshelf (left wall) -->
        <rect x="${w*0.03}" y="${floor-160}" width="55" height="140" rx="2" fill="#8b6030" stroke="#6a4520" stroke-width="2"/>
        <!-- Shelf planks -->
        <rect x="${w*0.03}" y="${floor-120}" width="55" height="5" fill="#6a4520"/>
        <rect x="${w*0.03}" y="${floor-80}" width="55" height="5" fill="#6a4520"/>
        <!-- Books row 1 -->
        ${[['#e74c3c','12'],['#3498db','9'],['#f39c12','14'],['#2ecc71','10'],['#9b59b6','8']].map(([c,bw],i)=>{
          const bx = w*0.03+4+i*10+i*0.5;
          return `<rect x="${bx}" y="${floor-155}" width="${bw}" height="30" rx="1" fill="${c}" opacity=".85"/>`;
        }).join('')}
        <!-- Books row 2 -->
        ${[['#e67e22','11'],['#1abc9c','13'],['#e91e63','9'],['#607d8b','12']].map(([c,bw],i)=>{
          const bx = w*0.03+3+i*13;
          return `<rect x="${bx}" y="${floor-115}" width="${bw}" height="30" rx="1" fill="${c}" opacity=".85"/>`;
        }).join('')}

        <!-- Potted plant (corner) -->
        <rect x="${w*0.5-10}" y="${floor-55}" width="28" height="20" rx="3" fill="#8b6030" stroke="#6a4520" stroke-width="1.5"/>
        <ellipse cx="${w*0.5+4}" cy="${floor-55}" rx="18" ry="8" fill="#7a5020"/>
        <path d="M${w*0.5+4},${floor-55} Q${w*0.5-15},${floor-95} ${w*0.5-8},${floor-110}" stroke="#2d7a2d" stroke-width="3" fill="none"/>
        <ellipse cx="${w*0.5-8}" cy="${floor-112}" rx="14" ry="10" fill="#3a9a3a"/>
        <path d="M${w*0.5+4},${floor-70} Q${w*0.5+20},${floor-100} ${w*0.5+15},${floor-115}" stroke="#2d7a2d" stroke-width="3" fill="none"/>
        <ellipse cx="${w*0.5+15}" cy="${floor-117}" rx="12" ry="9" fill="#3a9a3a"/>
        <path d="M${w*0.5+4},${floor-60} Q${w*0.5+28},${floor-85} ${w*0.5+32},${floor-105}" stroke="#228b22" stroke-width="2.5" fill="none"/>
        <ellipse cx="${w*0.5+33}" cy="${floor-107}" rx="10" ry="8" fill="#2ea82e"/>

        <!-- Rug on floor -->
        <ellipse cx="${w*0.45}" cy="${floor+30}" rx="${w*0.2}" ry="22" fill="#c4785a" opacity=".6"/>
        <ellipse cx="${w*0.45}" cy="${floor+30}" rx="${w*0.14}" ry="14" fill="#d4886a" opacity=".5" stroke="#b8604a" stroke-width="1"/>
      </svg>`;
    },

    garden(w, h) {
      const ground = h * 0.58;
      const sky = ground;
      return `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#87ceeb"/>
            <stop offset="100%" stop-color="#b8e4f5"/>
          </linearGradient>
          <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5dc85d"/>
            <stop offset="100%" stop-color="#3a8a3a"/>
          </linearGradient>
          <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#d4c4a0"/>
            <stop offset="100%" stop-color="#b8a880"/>
          </linearGradient>
        </defs>

        <!-- Sky -->
        <rect width="${w}" height="${sky}" fill="url(#skyGrad)"/>

        <!-- Clouds -->
        <g opacity=".85">
          <ellipse cx="${w*0.15}" cy="${h*0.1}" rx="45" ry="22" fill="white"/>
          <ellipse cx="${w*0.15-25}" cy="${h*0.12}" rx="28" ry="16" fill="white"/>
          <ellipse cx="${w*0.15+28}" cy="${h*0.12}" rx="30" ry="15" fill="white"/>
        </g>
        <g opacity=".75">
          <ellipse cx="${w*0.7}" cy="${h*0.07}" rx="55" ry="20" fill="white"/>
          <ellipse cx="${w*0.7-30}" cy="${h*0.09}" rx="32" ry="15" fill="white"/>
          <ellipse cx="${w*0.7+32}" cy="${h*0.09}" rx="35" ry="14" fill="white"/>
        </g>

        <!-- Sun -->
        <circle cx="${w*0.88}" cy="${h*0.1}" r="32" fill="#FFD700" opacity=".9"/>
        ${Array.from({length:12},(_,i)=>{
          const angle = i*30*Math.PI/180;
          const x1 = w*0.88 + Math.cos(angle)*36;
          const y1 = h*0.1 + Math.sin(angle)*36;
          const x2 = w*0.88 + Math.cos(angle)*48;
          const y2 = h*0.1 + Math.sin(angle)*48;
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#FFD700" stroke-width="3" stroke-linecap="round"/>`;
        }).join('')}

        <!-- Ground / grass -->
        <rect y="${ground}" width="${w}" height="${h-ground}" fill="url(#grassGrad)"/>

        <!-- Grass tufts along horizon -->
        ${Array.from({length:Math.ceil(w/18)},(_,i)=>`
          <path d="M${i*18+2},${ground} Q${i*18+5},${ground-12} ${i*18+9},${ground-16} Q${i*18+13},${ground-12} ${i*18+16},${ground}" fill="#4ab84a" opacity=".8"/>
        `).join('')}

        <!-- Stone path down the middle -->
        <path d="M${w*0.4},${ground} L${w*0.35},${h} L${w*0.65},${h} L${w*0.6},${ground}" fill="url(#pathGrad)" opacity=".7"/>
        ${Array.from({length:6},(_,i)=>{
          const y = ground + i*(h-ground)/6 + 10;
          return `<ellipse cx="${w*0.5}" cy="${y}" rx="18" ry="8" fill="#c4b490" opacity=".5" stroke="#b0a070" stroke-width="1"/>`;
        }).join('')}

        <!-- BIG tree left -->
        <rect x="${w*0.06}" y="${ground-120}" width="22" height="120" fill="#7a5230" stroke="#5c3a18" stroke-width="2"/>
        <ellipse cx="${w*0.06+11}" cy="${ground-130}" rx="58" ry="70" fill="#2d8b2d"/>
        <ellipse cx="${w*0.06+11-15}" cy="${ground-120}" rx="40" ry="50" fill="#38a038"/>
        <ellipse cx="${w*0.06+11+20}" cy="${ground-115}" rx="38" ry="48" fill="#32963a"/>
        <!-- Apples on tree -->
        <circle cx="${w*0.06+20}" cy="${ground-125}" r="6" fill="#e53935"/>
        <circle cx="${w*0.06}" cy="${ground-140}" r="5" fill="#e53935"/>
        <circle cx="${w*0.06+35}" cy="${ground-130}" r="5" fill="#e53935"/>

        <!-- BIG tree right -->
        <rect x="${w*0.82}" y="${ground-100}" width="20" height="100" fill="#7a5230" stroke="#5c3a18" stroke-width="2"/>
        <ellipse cx="${w*0.82+10}" cy="${ground-110}" rx="50" ry="60" fill="#228b22"/>
        <ellipse cx="${w*0.82+10-18}" cy="${ground-100}" rx="35" ry="44" fill="#2da02d"/>

        <!-- Flower bed left -->
        ${[
          {x:w*0.16, color:'#FF4081', cx:'#c2185b', petals:6},
          {x:w*0.22, color:'#FF9800', cx:'#f57c00', petals:5},
          {x:w*0.28, color:'#E91E63', cx:'#880e4f', petals:6},
          {x:w*0.10, color:'#9C27B0', cx:'#6a1b9a', petals:5},
        ].map(f=>{
          const fy = ground-2;
          const stem = `<line x1="${f.x}" y1="${fy}" x2="${f.x}" y2="${fy-38}" stroke="#4CAF50" stroke-width="2.5"/>
            <path d="M${f.x},${fy-22} Q${f.x-14},${fy-30} ${f.x-18},${fy-18}" stroke="#4CAF50" stroke-width="2" fill="none"/>`;
          const petals = Array.from({length:f.petals},(_,i)=>{
            const a = i*(360/f.petals)*Math.PI/180;
            const px = f.x+Math.cos(a)*10, py = fy-38+Math.sin(a)*10;
            return `<ellipse cx="${px}" cy="${py}" rx="7" ry="5" fill="${f.color}" transform="rotate(${i*(360/f.petals)},${px},${py})" opacity=".9"/>`;
          }).join('');
          return stem + petals + `<circle cx="${f.x}" cy="${fy-38}" r="6" fill="${f.cx}"/>`;
        }).join('')}

        <!-- Flower bed right -->
        ${[
          {x:w*0.72, color:'#F06292', cx:'#e91e63', petals:6},
          {x:w*0.78, color:'#FFF176', cx:'#f9a825', petals:6},
          {x:w*0.84, color:'#80DEEA', cx:'#00838f', petals:5},
        ].map(f=>{
          const fy = ground-2;
          const stem = `<line x1="${f.x}" y1="${fy}" x2="${f.x}" y2="${fy-34}" stroke="#4CAF50" stroke-width="2.5"/>`;
          const petals = Array.from({length:f.petals},(_,i)=>{
            const a = i*(360/f.petals)*Math.PI/180;
            const px = f.x+Math.cos(a)*9, py = fy-34+Math.sin(a)*9;
            return `<ellipse cx="${px}" cy="${py}" rx="6" ry="5" fill="${f.color}" opacity=".9"/>`;
          }).join('');
          return stem + petals + `<circle cx="${f.x}" cy="${fy-34}" r="5" fill="${f.cx}"/>`;
        }).join('')}

        <!-- Mushrooms -->
        <rect x="${w*0.35-3}" y="${ground-18}" width="6" height="18" fill="#d4c4b0"/>
        <ellipse cx="${w*0.35}" cy="${ground-18}" rx="14" ry="9" fill="#e74c3c"/>
        <ellipse cx="${w*0.35-4}" cy="${ground-20}" rx="3" ry="2" fill="white" opacity=".8"/>
        <ellipse cx="${w*0.35+5}" cy="${ground-21}" rx="2.5" ry="1.8" fill="white" opacity=".8"/>

        <!-- Garden bench -->
        <rect x="${w*0.46}" y="${ground-48}" width="68" height="10" rx="2" fill="#8b6030" stroke="#6a4520" stroke-width="1.5"/>
        <rect x="${w*0.46+4}" y="${ground-48}" width="60" height="6" rx="1" fill="#a07040"/>
        <rect x="${w*0.46+5}" y="${ground-48}" width="8" height="48" rx="2" fill="#7a5020"/>
        <rect x="${w*0.46+55}" y="${ground-48}" width="8" height="48" rx="2" fill="#7a5020"/>
        <rect x="${w*0.46}" y="${ground-75}" width="68" height="8" rx="2" fill="#8b6030" stroke="#6a4520" stroke-width="1.5"/>

        <!-- Butterfly -->
        <g transform="translate(${w*0.55},${h*0.25})">
          <ellipse cx="-8" cy="0" rx="12" ry="8" fill="#FF9800" opacity=".8" transform="rotate(-20)"/>
          <ellipse cx="8" cy="0" rx="12" ry="8" fill="#FF9800" opacity=".8" transform="rotate(20)"/>
          <ellipse cx="-5" cy="5" rx="7" ry="5" fill="#F57C00" opacity=".7" transform="rotate(20)"/>
          <ellipse cx="5" cy="5" rx="7" ry="5" fill="#F57C00" opacity=".7" transform="rotate(-20)"/>
          <line x1="0" y1="-8" x2="0" y2="10" stroke="#333" stroke-width="1.5"/>
          <path d="M0,-8 Q-5,-14 -8,-12" stroke="#333" stroke-width="1" fill="none"/>
          <path d="M0,-8 Q5,-14 8,-12" stroke="#333" stroke-width="1" fill="none"/>
        </g>

        <!-- Bird -->
        <g transform="translate(${w*0.3},${h*0.18})">
          <path d="M0,0 Q10,-8 20,0" stroke="#555" stroke-width="2" fill="none"/>
          <path d="M20,0 Q30,-8 40,0" stroke="#555" stroke-width="2" fill="none"/>
        </g>
      </svg>`;
    },

    kitchen(w, h) {
      const floor = h * 0.58;
      return `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0">
        <defs>
          <linearGradient id="kitchenWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fef9e7"/>
            <stop offset="100%" stop-color="#fef0c0"/>
          </linearGradient>
          <linearGradient id="tileFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e8e0d0"/>
            <stop offset="100%" stop-color="#d0c8b8"/>
          </linearGradient>
        </defs>

        <!-- Wall -->
        <rect width="${w}" height="${floor}" fill="url(#kitchenWall)"/>

        <!-- Tile backsplash -->
        ${Array.from({length:Math.ceil(w/30)},(_,i)=>
          Array.from({length:5},(_,j)=>
            `<rect x="${i*30+1}" y="${floor-165+j*30+1}" width="28" height="28" rx="1" fill="rgba(200,210,220,.4)" stroke="rgba(180,190,200,.6)" stroke-width="0.5"/>`
          ).join('')
        ).join('')}

        <!-- Floor tiles -->
        <rect y="${floor}" width="${w}" height="${h-floor}" fill="url(#tileFloor)"/>
        ${Array.from({length:Math.ceil(w/50)},(_,i)=>
          Array.from({length:3},(_,j)=>
            `<rect x="${i*50}" y="${floor+j*50}" width="50" height="50" fill="none" stroke="rgba(160,150,130,.4)" stroke-width="1"/>`
          ).join('')
        ).join('')}

        <!-- Kitchen counter (left) -->
        <rect x="0" y="${floor-140}" width="${w*0.38}" height="140" fill="#8d6e47" stroke="#6d4e27" stroke-width="2"/>
        <!-- Counter top -->
        <rect x="0" y="${floor-145}" width="${w*0.38+4}" height="12" rx="2" fill="#ccc" stroke="#bbb" stroke-width="1"/>
        <!-- Cabinet doors on counter -->
        ${Array.from({length:2},(_,i)=>
          `<rect x="${8+i*w*0.18}" y="${floor-130}" width="${w*0.16}" height="80" rx="3" fill="#9d7e57" stroke="#7d5e37" stroke-width="1.5"/>
           <circle cx="${8+i*w*0.18+w*0.16/2}" cy="${floor-90}" r="5" fill="#c0a060"/>`
        ).join('')}

        <!-- Stove on counter left -->
        <rect x="${w*0.04}" y="${floor-160}" width="80" height="18" rx="3" fill="#555" stroke="#333" stroke-width="1.5"/>
        <!-- Burner rings -->
        <circle cx="${w*0.04+22}" cy="${floor-158}" r="10" fill="#333" stroke="#666" stroke-width="2"/>
        <circle cx="${w*0.04+22}" cy="${floor-158}" r="6" fill="#222"/>
        <circle cx="${w*0.04+58}" cy="${floor-158}" r="10" fill="#333" stroke="#666" stroke-width="2"/>
        <circle cx="${w*0.04+58}" cy="${floor-158}" r="6" fill="#222"/>
        <!-- Pot on stove -->
        <rect x="${w*0.04+12}" y="${floor-180}" width="36" height="24" rx="3" fill="#666" stroke="#444" stroke-width="1.5"/>
        <rect x="${w*0.04+8}" y="${floor-182}" width="44" height="6" rx="2" fill="#777" stroke="#555"/>
        <rect x="${w*0.04+4}" y="${floor-175}" width="6" height="10" rx="1" fill="#555"/>
        <rect x="${w*0.04+54}" y="${floor-175}" width="6" height="10" rx="1" fill="#555"/>
        <!-- Steam -->
        <path d="M${w*0.04+20},${floor-185} Q${w*0.04+16},${floor-198} ${w*0.04+20},${floor-210}" stroke="rgba(200,200,200,.6)" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M${w*0.04+30},${floor-185} Q${w*0.04+34},${floor-200} ${w*0.04+30},${floor-215}" stroke="rgba(200,200,200,.6)" stroke-width="2" fill="none" stroke-linecap="round"/>

        <!-- Kitchen counter (right) -->
        <rect x="${w*0.76}" y="${floor-140}" width="${w*0.24}" height="140" fill="#8d6e47" stroke="#6d4e27" stroke-width="2"/>
        <rect x="${w*0.76-2}" y="${floor-145}" width="${w*0.24+4}" height="12" rx="2" fill="#ccc" stroke="#bbb" stroke-width="1"/>
        <!-- Sink -->
        <rect x="${w*0.78}" y="${floor-158}" width="70" height="25" rx="4" fill="#aaa" stroke="#888" stroke-width="2"/>
        <rect x="${w*0.78+5}" y="${floor-155}" width="60" height="18" rx="3" fill="#90d0f0" stroke="#888" stroke-width="1"/>
        <!-- Faucet -->
        <rect x="${w*0.78+31}" y="${floor-178}" width="8" height="22" rx="3" fill="#aaa" stroke="#888" stroke-width="1.5"/>
        <rect x="${w*0.78+22}" y="${floor-182}" width="26" height="6" rx="3" fill="#bbb" stroke="#888" stroke-width="1"/>
        <!-- Cabinet above sink -->
        <rect x="${w*0.76}" y="${floor-260}" width="${w*0.24}" height="100" rx="3" fill="#9d7e57" stroke="#7d5e37" stroke-width="2"/>
        <rect x="${w*0.76+5}" y="${floor-255}" width="${w*0.24*0.42}" height="90" rx="2" fill="#ad8e67" stroke="#7d5e37"/>
        <rect x="${w*0.76+w*0.24*0.52}" y="${floor-255}" width="${w*0.24*0.42}" height="90" rx="2" fill="#ad8e67" stroke="#7d5e37"/>

        <!-- DINING TABLE center -->
        <!-- Table top -->
        <ellipse cx="${w*0.5}" cy="${floor-20}" rx="${w*0.22}" ry="28" fill="#a07840" stroke="#7a5820" stroke-width="2.5"/>
        <ellipse cx="${w*0.5}" cy="${floor-22}" rx="${w*0.22-4}" ry="26" fill="#b08850" stroke="none"/>
        <!-- Table leg center -->
        <rect x="${w*0.5-8}" y="${floor-8}" width="16" height="40" rx="4" fill="#8a6030" stroke="#6a4010"/>
        <rect x="${w*0.5-24}" y="${floor+28}" width="48" height="10" rx="3" fill="#8a6030" stroke="#6a4010"/>

        <!-- CHAIRS around table -->
        <!-- Chair left -->
        <rect x="${w*0.5-w*0.24-32}" y="${floor-60}" width="34" height="30" rx="3" fill="#c09860" stroke="#8a6830"/>
        <rect x="${w*0.5-w*0.24-32}" y="${floor-85}" width="34" height="28" rx="3" fill="#d0a870" stroke="#8a6830" stroke-width="1.5"/>
        <rect x="${w*0.5-w*0.24-30}" y="${floor-30}" width="8" height="30" rx="2" fill="#a07840"/>
        <rect x="${w*0.5-w*0.24-14}" y="${floor-30}" width="8" height="30" rx="2" fill="#a07840"/>

        <!-- Chair right -->
        <rect x="${w*0.5+w*0.24}" y="${floor-60}" width="34" height="30" rx="3" fill="#c09860" stroke="#8a6830"/>
        <rect x="${w*0.5+w*0.24}" y="${floor-85}" width="34" height="28" rx="3" fill="#d0a870" stroke="#8a6830" stroke-width="1.5"/>
        <rect x="${w*0.5+w*0.24+2}" y="${floor-30}" width="8" height="30" rx="2" fill="#a07840"/>
        <rect x="${w*0.5+w*0.24+18}" y="${floor-30}" width="8" height="30" rx="2" fill="#a07840"/>

        <!-- Table items: plate, cup, fruit bowl -->
        <ellipse cx="${w*0.5}" cy="${floor-25}" rx="16" ry="10" fill="#f0f0f0" stroke="#ccc" stroke-width="1.5"/>
        <ellipse cx="${w*0.5}" cy="${floor-26}" rx="12" ry="8" fill="#e8e8e8"/>
        <!-- Cup -->
        <rect x="${w*0.5+22}" y="${floor-40}" width="14" height="16" rx="3" fill="#e8f4fc" stroke="#aad4ee" stroke-width="1.5"/>
        <path d="M${w*0.5+36},${floor-33} Q${w*0.5+44},${floor-33} ${w*0.5+44},${floor-28} Q${w*0.5+44},${floor-24} ${w*0.5+36},${floor-24}" stroke="#aad4ee" stroke-width="1.5" fill="none"/>
        <!-- Fruit bowl -->
        <ellipse cx="${w*0.5-28}" cy="${floor-30}" rx="18" ry="8" fill="#c8a060" stroke="#a07840" stroke-width="1.5"/>
        <circle cx="${w*0.5-32}" cy="${floor-35}" r="6" fill="#e53935"/>
        <circle cx="${w*0.5-22}" cy="${floor-36}" r="5" fill="#ff9800"/>
        <circle cx="${w*0.5-28}" cy="${floor-40}" r="5" fill="#ffeb3b"/>

        <!-- Window above counter right -->
        <rect x="${w*0.56}" y="${h*0.04}" width="80" height="90" rx="4" fill="#b8ddf0" stroke="#8b7355" stroke-width="4"/>
        <rect x="${w*0.56+38}" y="${h*0.04}" width="4" height="90" fill="#8b7355"/>
        <rect x="${w*0.56}" y="${h*0.04+43}" width="80" height="4" fill="#8b7355"/>
        <!-- Plant on windowsill -->
        <rect x="${w*0.56+24}" y="${h*0.04+90}" width="20" height="14" rx="3" fill="#a07040"/>
        <ellipse cx="${w*0.56+34}" cy="${h*0.04+88}" rx="16" ry="7" fill="#7a5020"/>
        <path d="M${w*0.56+34},${h*0.04+88} Q${w*0.56+20},${h*0.04+68} ${w*0.56+24},${h*0.04+55}" stroke="#4CAF50" stroke-width="2.5" fill="none"/>
        <ellipse cx="${w*0.56+23}" cy="${h*0.04+53}" rx="10" ry="8" fill="#66bb6a"/>

        <!-- Clock on wall -->
        <circle cx="${w*0.3}" cy="${h*0.15}" r="26" fill="white" stroke="#8b7355" stroke-width="4"/>
        <circle cx="${w*0.3}" cy="${h*0.15}" r="2" fill="#333"/>
        <line x1="${w*0.3}" y1="${h*0.15}" x2="${w*0.3}" y2="${h*0.15-16}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="${w*0.3}" y1="${h*0.15}" x2="${w*0.3+12}" y2="${h*0.15}" stroke="#333" stroke-width="2" stroke-linecap="round"/>
        ${Array.from({length:12},(_,i)=>{
          const a = i*30*Math.PI/180 - Math.PI/2;
          const x = w*0.3 + Math.cos(a)*20, y = h*0.15 + Math.sin(a)*20;
          return `<circle cx="${x}" cy="${y}" r="1.5" fill="#666"/>`;
        }).join('')}

        <!-- Refrigerator -->
        <rect x="${w*0.44}" y="${floor-240}" width="62" height="235" rx="5" fill="#e8e8e8" stroke="#ccc" stroke-width="2"/>
        <rect x="${w*0.44+4}" y="${floor-238}" width="54" height="108" rx="3" fill="#ddd" stroke="#ccc" stroke-width="1"/>
        <rect x="${w*0.44+4}" y="${floor-124}" width="54" height="116" rx="3" fill="#d0d0d0" stroke="#ccc" stroke-width="1"/>
        <circle cx="${w*0.44+55}" cy="${floor-185}" r="4" fill="#aaa"/>
        <circle cx="${w*0.44+55}" cy="${floor-65}" r="4" fill="#aaa"/>
        <rect x="${w*0.44+24}" y="${floor-145}" width="14" height="2" fill="#bbb"/>
      </svg>`;
    },

    beach(w, h) {
      const waterLine = h * 0.45;
      const sandLine  = h * 0.5;
      return `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0">
        <defs>
          <linearGradient id="skyBeach" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1e90ff"/>
            <stop offset="60%" stop-color="#87ceeb"/>
            <stop offset="100%" stop-color="#b8e4f5"/>
          </linearGradient>
          <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1a78c2"/>
            <stop offset="100%" stop-color="#0d5a9a"/>
          </linearGradient>
          <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f5dfa0"/>
            <stop offset="100%" stop-color="#e0c070"/>
          </linearGradient>
        </defs>

        <!-- Sky -->
        <rect width="${w}" height="${waterLine}" fill="url(#skyBeach)"/>

        <!-- Sun -->
        <circle cx="${w*0.82}" cy="${h*0.1}" r="36" fill="#FFD700"/>
        ${Array.from({length:10},(_,i)=>{
          const a = i*36*Math.PI/180;
          return `<line x1="${w*0.82+Math.cos(a)*40}" y1="${h*0.1+Math.sin(a)*40}" x2="${w*0.82+Math.cos(a)*54}" y2="${h*0.1+Math.sin(a)*54}" stroke="#FFD700" stroke-width="3.5" stroke-linecap="round"/>`;
        }).join('')}

        <!-- Clouds -->
        <g opacity=".8">
          <ellipse cx="${w*0.2}" cy="${h*0.1}" rx="50" ry="22" fill="white"/>
          <ellipse cx="${w*0.2-28}" cy="${h*0.12}" rx="30" ry="16" fill="white"/>
          <ellipse cx="${w*0.2+30}" cy="${h*0.12}" rx="32" ry="14" fill="white"/>
        </g>

        <!-- Ocean -->
        <rect y="${waterLine}" width="${w}" height="${sandLine-waterLine+5}" fill="url(#oceanGrad)"/>
        <!-- Waves -->
        ${Array.from({length:4},(_,i)=>{
          const y = waterLine + 10 + i*12;
          return `<path d="M0,${y} ${Array.from({length:Math.ceil(w/60)+1},(_,j)=>`Q${j*60+15},${y-10} ${j*60+30},${y} Q${j*60+45},${y+10} ${j*60+60},${y}`).join(' ')}" stroke="rgba(255,255,255,.5)" stroke-width="2" fill="none"/>`;
        }).join('')}
        <!-- Sparkles on water -->
        ${Array.from({length:8},(_,i)=>`<line x1="${w*0.05+i*w*0.12}" y1="${waterLine+8}" x2="${w*0.07+i*w*0.12}" y2="${waterLine+4}" stroke="rgba(255,255,255,.6)" stroke-width="1.5"/>`).join('')}

        <!-- Sand -->
        <path d="M0,${sandLine-8} Q${w*0.25},${sandLine-18} ${w*0.5},${sandLine-6} Q${w*0.75},${sandLine+4} ${w},${sandLine-10} L${w},${h} L0,${h}Z" fill="url(#sandGrad)"/>

        <!-- Left Beach Umbrella (red/white) -->
        <line x1="${w*0.14}" y1="${sandLine-5}" x2="${w*0.14}" y2="${sandLine-120}" stroke="#8B6914" stroke-width="5"/>
        <path d="M${w*0.14-70},${sandLine-118} Q${w*0.14},${sandLine-145} ${w*0.14+70},${sandLine-118}" fill="#e53935"/>
        <path d="M${w*0.14-70},${sandLine-118} Q${w*0.14-20},${sandLine-108} ${w*0.14},${sandLine-115} Q${w*0.14+20},${sandLine-108} ${w*0.14+70},${sandLine-118}" fill="white" opacity=".7"/>
        <path d="M${w*0.14-35},${sandLine-132} Q${w*0.14},${sandLine-148} ${w*0.14+35},${sandLine-132}" fill="#e53935"/>
        <!-- Fringe on umbrella -->
        ${Array.from({length:8},(_,i)=>{
          const a = -0.9 + i*0.26;
          return `<line x1="${w*0.14+Math.cos(a)*68}" y1="${sandLine-118+Math.sin(a)*8}" x2="${w*0.14+Math.cos(a)*72}" y2="${sandLine-112+Math.sin(a)*5}" stroke="#e53935" stroke-width="2"/>`;
        }).join('')}

        <!-- Beach chair left -->
        <rect x="${w*0.06}" y="${sandLine-55}" width="60" height="14" rx="4" fill="#F5DEB3" stroke="#d4b070" stroke-width="1.5"/>
        <rect x="${w*0.06}" y="${sandLine-90}" width="60" height="38" rx="4" fill="#f0d060" stroke="#d4b070" stroke-width="1.5" transform="rotate(-15,${w*0.06+30},${sandLine-72})"/>
        <rect x="${w*0.07}" y="${sandLine-45}" width="8" height="45" rx="3" fill="#c8a060"/>
        <rect x="${w*0.07+44}" y="${sandLine-45}" width="8" height="45" rx="3" fill="#c8a060"/>
        <!-- Towel on chair -->
        <rect x="${w*0.06+3}" y="${sandLine-88}" width="54" height="36" rx="3" fill="#ff8a65" opacity=".7" transform="rotate(-15,${w*0.06+30},${sandLine-72})"/>
        ${Array.from({length:4},(_,i)=>`<line x1="${w*0.06+5+i*14}" y1="${sandLine-88}" x2="${w*0.06+5+i*14}" y2="${sandLine-52}" stroke="white" stroke-width="1.5" opacity=".6" transform="rotate(-15,${w*0.06+30},${sandLine-72})"/>`).join('')}

        <!-- Right umbrella (blue/yellow) -->
        <line x1="${w*0.72}" y1="${sandLine-5}" x2="${w*0.72}" y2="${sandLine-115}" stroke="#8B6914" stroke-width="5"/>
        <path d="M${w*0.72-65},${sandLine-113} Q${w*0.72},${sandLine-140} ${w*0.72+65},${sandLine-113}" fill="#1565c0"/>
        <path d="M${w*0.72-65},${sandLine-113} Q${w*0.72-18},${sandLine-104} ${w*0.72},${sandLine-110} Q${w*0.72+18},${sandLine-104} ${w*0.72+65},${sandLine-113}" fill="#FFD700" opacity=".8"/>

        <!-- Right beach chair -->
        <rect x="${w*0.64}" y="${sandLine-55}" width="58" height="14" rx="4" fill="#F5DEB3" stroke="#d4b070" stroke-width="1.5"/>
        <rect x="${w*0.64}" y="${sandLine-88}" width="58" height="36" rx="4" fill="#66bb6a" stroke="#388e3c" stroke-width="1.5" transform="rotate(-12,${w*0.64+29},${sandLine-70})"/>
        <rect x="${w*0.65}" y="${sandLine-44}" width="7" height="44" rx="3" fill="#c8a060"/>
        <rect x="${w*0.65+43}" y="${sandLine-44}" width="7" height="44" rx="3" fill="#c8a060"/>

        <!-- Sand Castle -->
        <rect x="${w*0.44}" y="${sandLine-52}" width="50" height="52" rx="2" fill="#e8c870" stroke="#c8a840" stroke-width="1.5"/>
        <rect x="${w*0.44+8}" y="${sandLine-72}" width="34" height="24" rx="2" fill="#e8c870" stroke="#c8a840" stroke-width="1.5"/>
        <rect x="${w*0.44+14}" y="${sandLine-90}" width="22" height="22" rx="2" fill="#f0d080" stroke="#c8a840" stroke-width="1.5"/>
        <!-- Battlements -->
        ${Array.from({length:4},(_,i)=>`<rect x="${w*0.44+2+i*12}" y="${sandLine-60}" width="8" height="10" rx="1" fill="#f0d080"/>`).join('')}
        ${Array.from({length:3},(_,i)=>`<rect x="${w*0.44+10+i*12}" y="${sandLine-80}" width="8" height="10" rx="1" fill="#f0d080"/>`).join('')}
        <!-- Flag on castle -->
        <line x1="${w*0.44+25}" y1="${sandLine-90}" x2="${w*0.44+25}" y2="${sandLine-115}" stroke="#c8a840" stroke-width="2"/>
        <polygon points="${w*0.44+25},${sandLine-115} ${w*0.44+42},${sandLine-108} ${w*0.44+25},${sandLine-100}" fill="#e53935"/>

        <!-- Beach ball -->
        <circle cx="${w*0.35}" cy="${sandLine+12}" r="22" fill="#FF5722"/>
        <path d="M${w*0.35-22},${sandLine+12} Q${w*0.35},${sandLine-8} ${w*0.35+22},${sandLine+12}" fill="white"/>
        <path d="M${w*0.35},${sandLine-10} Q${w*0.35+8},${sandLine+12} ${w*0.35},${sandLine+34}" fill="#2196F3" opacity=".8"/>
        <circle cx="${w*0.35}" cy="${sandLine+12}" r="22" fill="none" stroke="rgba(0,0,0,.1)" stroke-width="1"/>

        <!-- Bucket and spade -->
        <!-- Bucket -->
        <path d="M${w*0.52},${sandLine+5} L${w*0.52+6},${sandLine+30} L${w*0.52+26},${sandLine+30} L${w*0.52+32},${sandLine+5}Z" fill="#f44336" stroke="#d32f2f" stroke-width="1.5"/>
        <rect x="${w*0.52}" y="${sandLine+3}" width="32" height="5" rx="2" fill="#d32f2f"/>
        <path d="M${w*0.52+4},${sandLine+3} Q${w*0.52+16},${sandLine-8} ${w*0.52+28},${sandLine+3}" stroke="#bbb" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- Sand in bucket top -->
        <ellipse cx="${w*0.52+16}" cy="${sandLine+8}" rx="14" ry="4" fill="#e8c870" opacity=".6"/>
        <!-- Spade -->
        <rect x="${w*0.52+36}" y="${sandLine-15}" width="7" height="48" rx="2" fill="#8B6914"/>
        <ellipse cx="${w*0.52+39}" cy="${sandLine-18}" rx="10" ry="8" fill="#a0a0a0" stroke="#888" stroke-width="1.5"/>
        <!-- Shovel blade -->
        <path d="M${w*0.52+29},${sandLine-20} L${w*0.52+49},${sandLine-20} L${w*0.52+45},${sandLine-10} L${w*0.52+33},${sandLine-10}Z" fill="#9e9e9e" stroke="#757575"/>

        <!-- Second spade -->
        <rect x="${w*0.85}" y="${sandLine-10}" width="6" height="38" rx="2" fill="#5d4037"/>
        <path d="M${w*0.85-8},${sandLine-22} L${w*0.85+14},${sandLine-22} L${w*0.85+10},${sandLine-10} L${w*0.85-4},${sandLine-10}Z" fill="#78909c" stroke="#546e7a"/>

        <!-- Starfish -->
        ${Array.from({length:5},(_,i)=>{
          const a = i*72*Math.PI/180 - Math.PI/2;
          const sx = w*0.78+Math.cos(a)*12, sy = sandLine+20+Math.sin(a)*12;
          return `<line x1="${w*0.78}" y1="${sandLine+20}" x2="${sx}" y2="${sy}" stroke="#FF8A65" stroke-width="6" stroke-linecap="round"/>`;
        }).join('')}

        <!-- Seashell -->
        <path d="M${w*0.25},${sandLine+22} Q${w*0.25-16},${sandLine+8} ${w*0.25},${sandLine+4} Q${w*0.25+16},${sandLine+8} ${w*0.25},${sandLine+22}Z" fill="#ffcc80" stroke="#ffa726" stroke-width="1"/>
        <path d="M${w*0.25},${sandLine+22} L${w*0.25},${sandLine+4}" stroke="#ffa726" stroke-width="1" opacity=".6"/>

        <!-- Seagull -->
        <path d="M${w*0.4},${h*0.16} Q${w*0.4+12},${h*0.12} ${w*0.4+22},${h*0.16}" stroke="#555" stroke-width="2" fill="none"/>
        <path d="M${w*0.55},${h*0.2} Q${w*0.55+10},${h*0.17} ${w*0.55+18},${h*0.2}" stroke="#555" stroke-width="2" fill="none"/>
      </svg>`;
    },

    space(w, h) {
      const ground = h * 0.62;
      return `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0">
        <defs>
          <radialGradient id="spaceGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#1a0533"/>
            <stop offset="60%" stop-color="#0a0020"/>
            <stop offset="100%" stop-color="#000010"/>
          </radialGradient>
          <radialGradient id="moonSurf" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#c8c8c8"/>
            <stop offset="100%" stop-color="#888"/>
          </radialGradient>
          <radialGradient id="planetRed" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#ff7043"/>
            <stop offset="100%" stop-color="#bf360c"/>
          </radialGradient>
          <radialGradient id="planetBlue" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#42a5f5"/>
            <stop offset="100%" stop-color="#1565c0"/>
          </radialGradient>
          <radialGradient id="planetPurp" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#ab47bc"/>
            <stop offset="100%" stop-color="#6a1b9a"/>
          </radialGradient>
        </defs>

        <!-- Deep space background -->
        <rect width="${w}" height="${h}" fill="url(#spaceGrad)"/>

        <!-- Stars - many sizes -->
        ${Array.from({length:120},(_,i)=>{
          const x=Math.random()*w, y=Math.random()*ground*1.1;
          const r=Math.random()<0.08?2.2:Math.random()<0.2?1.4:0.8;
          const op=0.4+Math.random()*0.6;
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="white" opacity="${op.toFixed(2)}"/>`;
        }).join('')}

        <!-- Nebula glow patches -->
        <ellipse cx="${w*0.2}" cy="${h*0.2}" rx="120" ry="60" fill="rgba(100,50,180,.12)"/>
        <ellipse cx="${w*0.8}" cy="${h*0.3}" rx="100" ry="50" fill="rgba(50,100,200,.1)"/>
        <ellipse cx="${w*0.5}" cy="${h*0.1}" rx="150" ry="40" fill="rgba(180,50,100,.08)"/>

        <!-- Milky way band -->
        <rect x="0" y="${h*0.1}" width="${w}" height="60" fill="rgba(200,180,255,.04)" transform="rotate(-15,${w/2},${h/2})"/>

        <!-- BIG PLANET - Saturn style (left) -->
        <ellipse cx="${w*0.15}" cy="${h*0.18}" rx="65" ry="65" fill="url(#planetRed)"/>
        <!-- Planet surface bands -->
        <path d="M${w*0.15-62},${h*0.16} Q${w*0.15},${h*0.13} ${w*0.15+62},${h*0.16}" stroke="rgba(180,80,30,.5)" stroke-width="5" fill="none"/>
        <path d="M${w*0.15-58},${h*0.21} Q${w*0.15},${h*0.19} ${w*0.15+58},${h*0.21}" stroke="rgba(200,100,50,.4)" stroke-width="4" fill="none"/>
        <!-- Saturn ring -->
        <ellipse cx="${w*0.15}" cy="${h*0.18}" rx="100" ry="18" fill="rgba(220,160,80,.5)" stroke="rgba(200,140,60,.6)" stroke-width="2"/>
        <ellipse cx="${w*0.15}" cy="${h*0.18}" rx="65" ry="65" fill="url(#planetRed)" opacity=".5"/><!-- ring behind planet clip -->
        <ellipse cx="${w*0.15}" cy="${h*0.18}" rx="100" ry="18" fill="none" stroke="rgba(255,200,100,.3)" stroke-width="4"/>

        <!-- Blue planet (right) -->
        <ellipse cx="${w*0.82}" cy="${h*0.22}" rx="52" ry="52" fill="url(#planetBlue)"/>
        <!-- Ocean/land on blue planet -->
        <ellipse cx="${w*0.82-15}" cy="${h*0.18}" rx="18" ry="14" fill="rgba(100,200,100,.45)"/>
        <ellipse cx="${w*0.82+12}" cy="${h*0.26}" rx="14" ry="10" fill="rgba(100,200,100,.4)"/>
        <!-- Atmosphere glow -->
        <circle cx="${w*0.82}" cy="${h*0.22}" r="56" fill="none" stroke="rgba(100,180,255,.3)" stroke-width="6"/>

        <!-- Purple small planet (center top) -->
        <circle cx="${w*0.5}" cy="${h*0.1}" r="28" fill="url(#planetPurp)"/>
        <circle cx="${w*0.5}" cy="${h*0.1}" r="30" fill="none" stroke="rgba(200,100,255,.25)" stroke-width="4"/>

        <!-- Moon (ground body) -->
        <ellipse cx="${w*0.5}" cy="${ground}" rx="${w*0.7}" ry="70" fill="url(#moonSurf)" stroke="#aaa" stroke-width="2"/>
        <!-- Moon surface -->
        <rect y="${ground+10}" width="${w}" height="${h-ground}" fill="#aaa"/>
        <!-- Moon craters -->
        <ellipse cx="${w*0.15}" cy="${ground+25}" rx="28" ry="15" fill="#999" stroke="#888" stroke-width="1.5"/>
        <ellipse cx="${w*0.15}" cy="${ground+25}" rx="20" ry="10" fill="#949494"/>
        <ellipse cx="${w*0.7}" cy="${ground+35}" rx="22" ry="12" fill="#999" stroke="#888" stroke-width="1.5"/>
        <ellipse cx="${w*0.7}" cy="${ground+35}" rx="15" ry="8" fill="#949494"/>
        <ellipse cx="${w*0.45}" cy="${ground+18}" rx="14" ry="7" fill="#9a9a9a" stroke="#888" stroke-width="1"/>

        <!-- ROCKET SHIP (left of center) -->
        <g transform="translate(${w*0.22},${ground-175})">
          <!-- Body -->
          <path d="M0,160 L0,40 Q0,0 20,0 Q40,0 40,40 L40,160Z" fill="#e0e0e0" stroke="#bbb" stroke-width="2"/>
          <!-- Nose cone -->
          <path d="M0,40 Q0,0 20,0 Q40,0 40,40Z" fill="#ef5350"/>
          <!-- Window -->
          <circle cx="20" cy="70" r="14" fill="#90caf9" stroke="#bbb" stroke-width="2"/>
          <circle cx="20" cy="70" r="10" fill="#bbdefb"/>
          <!-- Stars on window -->
          <circle cx="17" cy="67" r="2" fill="white" opacity=".8"/>
          <!-- Side fins -->
          <path d="M0,120 L-22,155 L0,145Z" fill="#ef5350"/>
          <path d="M40,120 L62,155 L40,145Z" fill="#ef5350"/>
          <!-- Bottom fins -->
          <path d="M5,155 L-8,178 L12,160Z" fill="#bbb"/>
          <path d="M35,155 L48,178 L28,160Z" fill="#bbb"/>
          <!-- Engine glow -->
          <ellipse cx="20" cy="162" rx="16" ry="8" fill="#FF6F00" opacity=".8"/>
          <ellipse cx="20" cy="165" rx="10" ry="12" fill="#FFEB3B" opacity=".7"/>
          <ellipse cx="20" cy="170" rx="6" ry="8" fill="white" opacity=".5"/>
          <!-- USA flag stripe -->
          <rect x="28" y="88" width="10" height="7" fill="#e53935"/>
          <rect x="28" y="95" width="10" height="7" fill="white"/>
          <rect x="28" y="102" width="10" height="7" fill="#1565c0"/>
        </g>

        <!-- UFO (right side) -->
        <g transform="translate(${w*0.62},${ground-120})">
          <!-- Dome -->
          <ellipse cx="40" cy="20" rx="28" ry="22" fill="rgba(150,220,255,.7)" stroke="rgba(100,180,255,.8)" stroke-width="2"/>
          <ellipse cx="36" cy="14" rx="10" ry="8" fill="rgba(200,240,255,.5)"/>
          <!-- Saucer body -->
          <ellipse cx="40" cy="30" rx="55" ry="14" fill="#78909c" stroke="#546e7a" stroke-width="2"/>
          <ellipse cx="40" cy="30" rx="42" ry="9" fill="#90a4ae"/>
          <!-- Lights on saucer -->
          ${Array.from({length:7},(_,i)=>{
            const a = i*(Math.PI*2/7);
            return `<circle cx="${40+Math.cos(a)*38}" cy="${30+Math.sin(a)*8}" r="4" fill="${['#FFEB3B','#F44336','#4CAF50'][i%3]}" opacity=".9"/>`;
          }).join('')}
          <!-- Tractor beam -->
          <path d="M20,38 L0,90 L80,90 L60,38Z" fill="rgba(255,255,150,.12)" stroke="rgba(255,255,150,.2)" stroke-width="1"/>
        </g>

        <!-- Astronaut (small, near rocket) -->
        <g transform="translate(${w*0.38},${ground-58})">
          <!-- Suit body -->
          <ellipse cx="18" cy="32" rx="15" ry="18" fill="#e0e0e0" stroke="#bbb" stroke-width="1.5"/>
          <!-- Helmet -->
          <circle cx="18" cy="12" r="14" fill="#e0e0e0" stroke="#bbb" stroke-width="1.5"/>
          <!-- Visor -->
          <ellipse cx="18" cy="11" rx="9" ry="8" fill="#90caf9" stroke="#78b0d0" stroke-width="1"/>
          <ellipse cx="15" cy="8" rx="3" ry="2.5" fill="rgba(255,255,255,.5)"/>
          <!-- Arms -->
          <rect x="-2" y="22" width="8" height="20" rx="4" fill="#e0e0e0" stroke="#bbb" stroke-width="1"/>
          <rect x="28" y="22" width="8" height="20" rx="4" fill="#e0e0e0" stroke="#bbb" stroke-width="1"/>
          <!-- Legs -->
          <rect x="7" y="46" width="8" height="16" rx="4" fill="#e0e0e0" stroke="#bbb" stroke-width="1"/>
          <rect x="19" y="46" width="8" height="16" rx="4" fill="#e0e0e0" stroke="#bbb" stroke-width="1"/>
          <!-- Backpack -->
          <rect x="30" y="20" width="10" height="22" rx="3" fill="#bdbdbd" stroke="#aaa"/>
          <!-- Flag on pole held by astronaut -->
          <line x1="0" y1="25" x2="0" y2="-8" stroke="#aaa" stroke-width="1.5"/>
          <rect x="-14" y="-10" width="14" height="9" fill="#e53935"/>
          <rect x="-7" y="-10" width="7" height="9" fill="white"/>
        </g>

        <!-- Shooting star -->
        <line x1="${w*0.6}" y1="${h*0.15}" x2="${w*0.7}" y2="${h*0.08}" stroke="white" stroke-width="2" opacity=".7"/>
        <circle cx="${w*0.6}" cy="${h*0.15}" r="2.5" fill="white" opacity=".9"/>

        <!-- Constellation dots -->
        ${[[w*0.9,h*0.12],[w*0.92,h*0.06],[w*0.95,h*0.09],[w*0.88,h*0.08]].map(([cx,cy])=>
          `<circle cx="${cx}" cy="${cy}" r="1.8" fill="white" opacity=".8"/>`
        ).join('')}
        <line x1="${w*0.9}" y1="${h*0.12}" x2="${w*0.92}" y2="${h*0.06}" stroke="white" stroke-width=".6" opacity=".4"/>
        <line x1="${w*0.92}" y1="${h*0.06}" x2="${w*0.95}" y2="${h*0.09}" stroke="white" stroke-width=".6" opacity=".4"/>
        <line x1="${w*0.95}" y1="${h*0.09}" x2="${w*0.88}" y2="${h*0.08}" stroke="white" stroke-width=".6" opacity=".4"/>
      </svg>`;
    },
  };

  // ── Weather overlays ─────────────────────────────────────────────
  const WEATHER_OVERLAYS = {
    sunny: '',
    rain:  'rgba(70,110,170,.2)',
    snow:  'rgba(200,220,255,.22)',
    night: 'rgba(6,6,30,.55)',
  };

  function applyRoom(room) {
    const renderer = ROOM_RENDERERS[room];
    const world = document.getElementById('world');
    const decor = document.getElementById('room-decor');
    decor.innerHTML = '';

    if (renderer) {
      const W = world.offsetWidth || 600;
      const H = world.offsetHeight || 400;
      world.style.background = 'none';
      // Remove old SVG room
      const old = world.querySelector('.room-svg');
      if (old) old.remove();
      const wrap = document.createElement('div');
      wrap.className = 'room-svg';
      wrap.style.cssText = 'position:absolute;inset:0;pointer-events:none';
      wrap.innerHTML = renderer(W, H);
      world.insertBefore(wrap, world.firstChild);
    }
  }

  function applyWeather(weather) {
    const bgLayer = document.getElementById('bg-layer');
    bgLayer.style.background = WEATHER_OVERLAYS[weather] || '';

    const p = document.getElementById('weather-particles');
    p.querySelectorAll('style').forEach(s => s.remove());
    Array.from(p.children).forEach(c => { if (c.tagName !== 'STYLE') c.remove(); });

    if (weather === 'rain') {
      const style = document.createElement('style');
      style.textContent = `@keyframes rainFall{0%{top:-5%;opacity:.85}100%{top:108%;opacity:.2}}`;
      p.appendChild(style);
      for (let i = 0; i < 55; i++) {
        const d = document.createElement('div');
        const speed = 0.5 + Math.random() * 0.7;
        d.style.cssText = `position:absolute;left:${Math.random()*100}%;top:-10px;
          width:1.5px;height:${14+Math.random()*12}px;
          background:rgba(140,180,220,.75);
          animation:rainFall ${speed}s linear ${Math.random()*1.2}s infinite;
          pointer-events:none;transform:rotate(10deg)`;
        p.appendChild(d);
      }
    } else if (weather === 'snow') {
      const style = document.createElement('style');
      style.textContent = `@keyframes snowFall{0%{top:-5%;transform:translateX(0) rotate(0)}100%{top:108%;transform:translateX(40px) rotate(360deg)}}`;
      p.appendChild(style);
      for (let i = 0; i < 40; i++) {
        const d = document.createElement('div');
        const sz = 6 + Math.random() * 12;
        d.style.cssText = `position:absolute;left:${Math.random()*100}%;top:-10px;
          width:${sz}px;height:${sz}px;border-radius:50%;
          background:rgba(220,235,255,.85);
          animation:snowFall ${2.5+Math.random()*2.5}s linear ${Math.random()*3}s infinite;
          pointer-events:none`;
        p.appendChild(d);
      }
    } else if (weather === 'night') {
      for (let i = 0; i < 40; i++) {
        const d = document.createElement('div');
        const sz = 1.5 + Math.random() * 2.5;
        d.style.cssText = `position:absolute;left:${Math.random()*95}%;top:${Math.random()*65}%;
          width:${sz}px;height:${sz}px;border-radius:50%;background:white;
          animation:starTwinkle ${1.2+Math.random()*2}s ease-in-out ${Math.random()*2}s infinite;
          pointer-events:none;opacity:${0.5+Math.random()*0.5}`;
        p.appendChild(d);
      }
    }

    document.querySelectorAll('.weather-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.w === weather);
    });
  }

  function confetti(count = 40) {
    const p = document.getElementById('weather-particles');
    const colors = ['#f44336','#e91e63','#ff9800','#ffeb3b','#4caf50','#2196f3','#9c27b0','#00bcd4'];
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `@keyframes cfall{0%{top:-2%;opacity:1;transform:rotate(0) scale(1)}100%{top:112%;opacity:.1;transform:rotate(720deg) scale(.5)}}`;
    p.appendChild(style);
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      const w = 6 + Math.random() * 8, h = 8 + Math.random() * 6;
      d.style.cssText = `position:absolute;left:${Math.random()*100}%;top:-10px;
        width:${w}px;height:${h}px;border-radius:2px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        animation:cfall ${1.6+Math.random()*1.8}s ease-in ${Math.random()*.8}s forwards;
        pointer-events:none;z-index:5`;
      p.appendChild(d);
      setTimeout(() => d.remove(), 4200);
    }
    setTimeout(() => style.remove(), 5000);
  }

  return { applyRoom, applyWeather, confetti };
})();

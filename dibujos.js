// Dibujitos a mano para decorar. Trazo color tinta, rellenos suaves.
const T = '#4A3A28';
const linea = `stroke="${T}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;

/* Olivo en acuarela: hojas salvia transparentes, tallo finito rosado, bolitas amarillas */
const VERDES = ['#8FAE9A', '#A7BFAE', '#7C9C8A', '#B9CDBF', '#94B29E', '#6F8F7E'];
const BAYAS = ['#D8CB7E', '#E2D592', '#C9BB68'];
function azar(semilla) { let s = semilla; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
const HOJA = 'M0 0 C 7 -5.5, 24 -5.5, 34 0 C 24 5.5, 7 5.5, 0 0 Z';

function rama(r, x0, y0, ang, largo, conBayas = true) {
  const rad = (ang * Math.PI) / 180;
  const curva = (r() - 0.5) * 0.5;
  const x2 = x0 + Math.cos(rad) * largo, y2 = y0 + Math.sin(rad) * largo;
  const cx = x0 + Math.cos(rad + curva) * largo * 0.55, cy = y0 + Math.sin(rad + curva) * largo * 0.55;
  const punto = (t) => [
    (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t ** 2 * x2,
    (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t ** 2 * y2,
  ];
  let svg = `<path d="M${x0} ${y0} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="#C09A88" stroke-width="1.3" stroke-linecap="round" opacity="0.9"/>`;
  const n = Math.max(4, Math.round(largo / 22));
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 0.4);
    const [x, y] = punto(t);
    const tam = 0.75 + (1 - t) * 0.55 + r() * 0.2;
    const dir = ang + (i % 2 ? 1 : -1) * (30 + r() * 25);
    const color = VERDES[Math.floor(r() * VERDES.length)];
    const op = (0.55 + r() * 0.35).toFixed(2);
    svg += `<path d="${HOJA}" fill="${color}" opacity="${op}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${dir.toFixed(0)}) scale(${tam.toFixed(2)})"/>`;
    if (conBayas && r() < 0.28) {
      const lado = dir + (i % 2 ? 40 : -40);
      for (let b = 0; b < 3; b++) {
        const bx = x + Math.cos(((lado + b * 18) * Math.PI) / 180) * (7 + b * 3);
        const by = y + Math.sin(((lado + b * 18) * Math.PI) / 180) * (7 + b * 3);
        svg += `<ellipse cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" rx="3.2" ry="3.8" fill="${BAYAS[b % 3]}" opacity="0.85"/>`;
      }
    }
  }
  const tipDir = ang + (r() - 0.5) * 10;
  svg += `<path d="${HOJA}" fill="${VERDES[2]}" opacity="0.7" transform="translate(${x2.toFixed(1)} ${y2.toFixed(1)}) rotate(${tipDir.toFixed(0)}) scale(0.8)"/>`;
  return svg;
}

function esquina(semilla) {
  const r = azar(semilla);
  const ramas = [[8, 70], [22, 250], [40, 210], [58, 240], [76, 150], [88, 90]]
    .map(([a, l]) => rama(r, 0, 0, a + (r() - 0.5) * 6, l * (0.9 + r() * 0.2))).join('');
  return `<svg viewBox="-10 -10 280 280" aria-hidden="true">${ramas}</svg>`;
}

function ramita(semilla) {
  const r = azar(semilla);
  return `<svg viewBox="-6 -40 170 80" aria-hidden="true">${rama(r, 0, 10, -8, 150)}${rama(r, 60, 4, -40, 50, false)}</svg>`;
}

export const DIBUJOS = {
  esquina: esquina(7),
  esquina2: esquina(23),
  olivo: ramita(11),

  mate: `<svg viewBox="0 0 64 74" aria-hidden="true">
    <path d="M40 30 L50 4" stroke="#9A948A" stroke-width="3.2" stroke-linecap="round"/>
    <circle cx="50.5" cy="4" r="2.6" fill="#C9C3B6" stroke="${T}" stroke-width="1.4"/>
    <path d="M14 30 C 9 50, 19 68, 32 68 C 45 68, 55 50, 50 30 Z" fill="#C9A36B" ${linea}/>
    <path d="M20 46 C 24 56, 34 60, 42 54" fill="none" stroke="#A9834B" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="32" cy="30" rx="18" ry="4.6" fill="#6E8B3D" ${linea}/>
  </svg>`,

  imperial: `<svg viewBox="0 0 64 78" aria-hidden="true">
    <path d="M38 22 L48 2" stroke="#9A948A" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M16 26 C 14 46, 21 58, 32 58 C 43 58, 50 46, 48 26 Z" fill="#7A3424" ${linea}/>
    <path d="M20 36 l4 4 m6 -4 l4 4 m6 -4 l4 4" stroke="#5C2418" stroke-width="1.6" stroke-linecap="round"/>
    <rect x="13" y="20" width="38" height="8" rx="3" fill="#DDD7C9" ${linea}/>
    <path d="M28 58 L27 66 L37 66 L36 58" fill="#DDD7C9" ${linea}/>
    <ellipse cx="32" cy="69" rx="12" ry="4" fill="#DDD7C9" ${linea}/>
  </svg>`,

  termo: `<svg viewBox="0 0 44 84" aria-hidden="true">
    <rect x="11" y="4" width="20" height="12" rx="3" fill="#4E6328" ${linea}/>
    <rect x="8" y="15" width="26" height="64" rx="6" fill="#7A9A4F" ${linea}/>
    <path d="M34 26 C 42 28, 42 52, 34 54" fill="none" stroke="${T}" stroke-width="2.6" stroke-linecap="round"/>
    <rect x="13" y="38" width="16" height="10" rx="2" fill="#E9E2CF" stroke="${T}" stroke-width="1.4"/>
  </svg>`,

  palo: `<svg viewBox="0 0 76 84" aria-hidden="true">
    <path d="M54 4 L26 64" stroke="${T}" stroke-width="5" stroke-linecap="round"/>
    <path d="M51 10 L45 23" stroke="#B5533C" stroke-width="7" stroke-linecap="round"/>
    <path d="M26 64 C 21 76, 7 78, 5 69" fill="none" stroke="${T}" stroke-width="6.5" stroke-linecap="round"/>
    <circle cx="58" cy="72" r="7" fill="#FFFDF8" ${linea}/>
    <path d="M53 70 C 56 68, 60 68, 63 71" fill="none" stroke="#C9C3B6" stroke-width="1.4"/>
  </svg>`,

  escudo: `<svg viewBox="0 0 54 64" aria-hidden="true">
    <defs><clipPath id="clip-escudo"><path d="M27 4 L49 11 C 49 36, 40 51, 27 60 C 14 51, 5 36, 5 11 Z"/></clipPath></defs>
    <g clip-path="url(#clip-escudo)">
      <rect x="0" y="0" width="54" height="64" fill="#FFFDF8"/>
      <g transform="rotate(-35 27 32)">
        <rect x="-20" y="10" width="100" height="8" fill="#D2691E"/>
        <rect x="-20" y="22" width="100" height="8" fill="#2B2118"/>
        <rect x="-20" y="34" width="100" height="8" fill="#D2691E"/>
        <rect x="-20" y="46" width="100" height="8" fill="#2B2118"/>
      </g>
    </g>
    <path d="M27 4 L49 11 C 49 36, 40 51, 27 60 C 14 51, 5 36, 5 11 Z" fill="none" stroke="${T}" stroke-width="2.4" stroke-linejoin="round"/>
  </svg>`,

  corazon: `<svg viewBox="0 0 30 28" aria-hidden="true"><path d="M15 25 C 6 19, 2 13, 3 8 C 4 3, 11 2, 15 8 C 19 2, 26 3, 27 8 C 28 13, 24 19, 15 25 Z" fill="#E7A08A" stroke="${T}" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
};

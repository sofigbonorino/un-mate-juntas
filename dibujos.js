// Dibujitos estilo acuarela: sin contorno, degradés suaves y transparencias.
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

  mate: `<svg viewBox="0 0 70 80" aria-hidden="true">
    <defs>
      <radialGradient id="mate-calabaza" cx="0.38" cy="0.35" r="0.75">
        <stop offset="0" stop-color="#F3D27A"/><stop offset="0.55" stop-color="#E2A94B"/><stop offset="1" stop-color="#C98A2E"/>
      </radialGradient>
      <radialGradient id="mate-yerba" cx="0.5" cy="0.4" r="0.7">
        <stop offset="0" stop-color="#C8D69A"/><stop offset="1" stop-color="#8FA65C"/>
      </radialGradient>
    </defs>
    <path d="M42 30 C 46 18, 52 8, 64 4" fill="none" stroke="#B9BEC4" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M42 30 C 46 18, 52 8, 64 4" fill="none" stroke="#EEF1F3" stroke-width="1.2" stroke-linecap="round" opacity="0.9"/>
    <path d="M12 34 C 6 52, 16 74, 35 74 C 54 74, 64 52, 58 34 C 50 26, 20 26, 12 34 Z" fill="url(#mate-calabaza)"/>
    <path d="M14 40 C 12 52, 18 64, 28 70" fill="none" stroke="#B87A22" stroke-width="2" stroke-linecap="round" opacity="0.35"/>
    <ellipse cx="24" cy="44" rx="7" ry="4" fill="#FFF3CF" opacity="0.45"/>
    <ellipse cx="35" cy="32" rx="22" ry="6.5" fill="url(#mate-yerba)"/>
    <ellipse cx="29" cy="31" rx="7" ry="2.4" fill="#E4ECC6" opacity="0.7"/>
    <path d="M25 48 q 2 -2.6 4 0" fill="none" stroke="#7A4A14" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M40 48 q 2 -2.6 4 0" fill="none" stroke="#7A4A14" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M28 56 q 6 6 12 0" fill="none" stroke="#7A4A14" stroke-width="1.9" stroke-linecap="round"/>
    <ellipse cx="22" cy="54" rx="3.4" ry="2" fill="#E8836A" opacity="0.45"/>
    <ellipse cx="47" cy="54" rx="3.4" ry="2" fill="#E8836A" opacity="0.45"/>
  </svg>`,

  te: `<svg viewBox="0 0 80 74" aria-hidden="true">
    <defs>
      <linearGradient id="te-taza" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FBF6EC"/><stop offset="1" stop-color="#DCCFB8"/>
      </linearGradient>
    </defs>
    <path d="M30 4 C 26 10, 34 14, 30 20 M42 2 C 38 9, 46 13, 42 20" fill="none" stroke="#B9AFA0" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
    <ellipse cx="38" cy="64" rx="30" ry="7" fill="#C9D8CE" opacity="0.85"/>
    <ellipse cx="38" cy="63" rx="22" ry="4.2" fill="#E6EEE8" opacity="0.9"/>
    <path d="M60 34 C 74 32, 74 52, 58 50" fill="none" stroke="#A9C1B2" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M14 28 C 14 50, 24 62, 38 62 C 52 62, 62 50, 62 28 Z" fill="url(#te-taza)"/>
    <ellipse cx="38" cy="28" rx="24" ry="5.5" fill="#B9774A" opacity="0.85"/>
    <ellipse cx="33" cy="27" rx="9" ry="2" fill="#D9A27A" opacity="0.7"/>
    <path d="M18 40 C 22 44, 30 44, 34 40 C 38 44, 46 44, 50 40 C 54 44, 58 42, 59 40" fill="none" stroke="#9DB5A0" stroke-width="2.4" stroke-linecap="round" opacity="0.8"/>
    <path d="M26 50 l3 -3 l3 3 l-3 3 z M44 50 l3 -3 l3 3 l-3 3 z" fill="#E7A08A" opacity="0.7"/>
    <path d="M56 26 L58 40" stroke="#C9BFA9" stroke-width="1.2"/>
    <rect x="54" y="40" width="9" height="11" rx="1.5" fill="#E6C7A4" opacity="0.95"/>
  </svg>`,

  imperial: `<svg viewBox="0 0 64 78" aria-hidden="true">
    <defs>
      <radialGradient id="imp-cuero" cx="0.35" cy="0.35" r="0.8"><stop offset="0" stop-color="#B8674A"/><stop offset="0.6" stop-color="#8E4630"/><stop offset="1" stop-color="#6E3222"/></radialGradient>
      <linearGradient id="imp-plata" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C9CED3"/><stop offset="0.45" stop-color="#F2F4F5"/><stop offset="1" stop-color="#AEB4BA"/></linearGradient>
    </defs>
    <path d="M38 22 C 41 14, 44 7, 50 2" fill="none" stroke="#B9BEC4" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M16 26 C 14 46, 21 58, 32 58 C 43 58, 50 46, 48 26 Z" fill="url(#imp-cuero)"/>
    <ellipse cx="25" cy="38" rx="4" ry="7" fill="#E0A487" opacity="0.35"/>
    <path d="M20 44 q 4 3 8 0 q 4 3 8 0 q 4 3 8 0" fill="none" stroke="#5E2A1C" stroke-width="1.3" stroke-linecap="round" opacity="0.55"/>
    <rect x="13" y="20" width="38" height="8" rx="3.5" fill="url(#imp-plata)"/>
    <ellipse cx="32" cy="21" rx="17" ry="3" fill="#8FA65C" opacity="0.9"/>
    <path d="M28 58 L27 66 L37 66 L36 58 Z" fill="url(#imp-plata)"/>
    <ellipse cx="32" cy="69" rx="12" ry="4" fill="url(#imp-plata)"/>
  </svg>`,

  termo: `<svg viewBox="0 0 48 84" aria-hidden="true">
    <defs>
      <linearGradient id="termo-cuerpo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6F9067"/><stop offset="0.4" stop-color="#9DBA93"/><stop offset="1" stop-color="#5E7F58"/></linearGradient>
    </defs>
    <path d="M35 26 C 45 28, 45 52, 35 54" fill="none" stroke="#7E9C77" stroke-width="3.6" stroke-linecap="round" opacity="0.9"/>
    <rect x="12" y="4" width="20" height="12" rx="4" fill="#5E7F58" opacity="0.95"/>
    <rect x="9" y="15" width="26" height="64" rx="7" fill="url(#termo-cuerpo)"/>
    <rect x="13" y="20" width="5" height="50" rx="2.5" fill="#E8F0E4" opacity="0.35"/>
    <rect x="14" y="38" width="16" height="10" rx="2.5" fill="#F4EEDD" opacity="0.85"/>
  </svg>`,

  palo: `<svg viewBox="0 0 76 84" aria-hidden="true">
    <defs>
      <linearGradient id="palo-madera" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7C6A5A"/><stop offset="1" stop-color="#4F4136"/></linearGradient>
      <radialGradient id="palo-bocha" cx="0.35" cy="0.35" r="0.8"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4DCCB"/></radialGradient>
    </defs>
    <path d="M54 4 L26 64" stroke="url(#palo-madera)" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M51 10 L45 23" stroke="#E2A94B" stroke-width="7.5" stroke-linecap="round" opacity="0.95"/>
    <path d="M26 64 C 21 76, 7 78, 5 69" fill="none" stroke="#5E4E41" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="58" cy="73" rx="8" ry="2.4" fill="#C9D8CE" opacity="0.7"/>
    <circle cx="58" cy="68" r="7" fill="url(#palo-bocha)"/>
    <path d="M53 66 C 56 64, 60 64, 63 67" fill="none" stroke="#CFC6B4" stroke-width="1.2" opacity="0.8"/>
  </svg>`,

  escudo: `<svg viewBox="0 0 54 64" aria-hidden="true">
    <defs>
      <clipPath id="clip-escudo"><path d="M27 4 C 35 7, 42 9, 49 10 C 49 36, 40 51, 27 60 C 14 51, 5 36, 5 10 C 12 9, 19 7, 27 4 Z"/></clipPath>
      <linearGradient id="esc-luz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.35"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
    </defs>
    <g clip-path="url(#clip-escudo)">
      <g transform="rotate(32 27 32)">
        <rect x="-40" y="-40" width="58" height="144" fill="#2F2A26"/>
        <rect x="18" y="-40" width="18" height="144" fill="#E07A2E"/>
        <rect x="36" y="-40" width="58" height="144" fill="#2F2A26"/>
      </g>
      <rect x="0" y="0" width="54" height="64" fill="url(#esc-luz)"/>
    </g>
    <path d="M27 4 C 35 7, 42 9, 49 10 C 49 36, 40 51, 27 60 C 14 51, 5 36, 5 10 C 12 9, 19 7, 27 4 Z" fill="none" stroke="#3B332C" stroke-width="1.4" opacity="0.45"/>
  </svg>`,

  corazon: `<svg viewBox="0 0 30 28" aria-hidden="true">
    <defs><radialGradient id="cora" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#F6C2B0"/><stop offset="1" stop-color="#E08A70"/></radialGradient></defs>
    <path d="M15 25 C 6 19, 2 13, 3 8 C 4 3, 11 2, 15 8 C 19 2, 26 3, 27 8 C 28 13, 24 19, 15 25 Z" fill="url(#cora)" opacity="0.9"/>
  </svg>`,
};

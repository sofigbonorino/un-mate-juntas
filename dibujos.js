// Dibujitos a mano para decorar. Trazo color tinta, rellenos suaves.
const T = '#4A3A28';
const linea = `stroke="${T}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;

function hojas(puntos) {
  return puntos.map(([x, y, giro, lado]) =>
    `<ellipse cx="${x}" cy="${y}" rx="10" ry="3.6" transform="rotate(${giro} ${x} ${y}) translate(${lado * 7} 0)" fill="#A9B68C" stroke="#5E7A35" stroke-width="1.3"/>`
  ).join('');
}

export const DIBUJOS = {
  olivo: `<svg viewBox="0 0 140 70" aria-hidden="true">
    <path d="M6 62 C 40 52, 82 34, 134 8" fill="none" stroke="#5E7A35" stroke-width="2.2" stroke-linecap="round"/>
    ${hojas([[22, 56, -60, 1], [30, 52, 40, 1], [44, 47, -55, 1], [52, 43, 35, 1], [66, 37, -50, 1], [74, 33, 30, 1], [88, 27, -45, 1], [96, 23, 25, 1], [110, 17, -40, 1], [120, 13, 20, 1]])}
    <circle cx="48" cy="52" r="3.6" fill="#4E6328"/><circle cx="80" cy="40" r="3.6" fill="#4E6328"/><circle cx="104" cy="28" r="3.2" fill="#3F5220"/>
  </svg>`,

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

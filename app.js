import { CONFIG } from './config.js';
import { DIBUJOS as D } from './dibujos.js';

const SECCIONES = [
  { id: 'melancolia', nombre: 'Melancolía', bajada: 'Fotos y recuerdos de antes', giro: -1.5, dibujo: 'escudo' },
  { id: 'diario', nombre: 'Diario', bajada: 'Lo que nos pasa en el día a día', giro: 1, dibujo: 'mate' },
  { id: 'actualizaciones', nombre: 'Actualizaciones', bajada: 'Las novedades importantes', giro: -0.5, dibujo: 'palo' },
];
const MODO_PRUEBA = !CONFIG.firebase;
const MAX_VIDEO_MB = 100;
const MAX_FOTO_MB = 10;
const $app = document.getElementById('app');

/* ---------- Memoria del navegador ---------- */
const LS = 'un-mate-juntas';
function leer() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } }
function guardar(cambios) {
  yo = { ...yo, ...cambios };
  try { localStorage.setItem(LS, JSON.stringify(yo)); } catch {}
}
let yo = leer();
const vistaAnterior = yo.ultimaVisita || 0;
guardar({ ultimaVisita: Date.now() });

/* ---------- Utilidades ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const seccion = (id) => SECCIONES.find((s) => s.id === id);
const mismo = (a, b) => (a || '').trim().toLowerCase() === (b || '').trim().toLowerCase();
const normal = (s) => (s || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const soyDelfi = () => normal(yo.nombre).startsWith(normal(CONFIG.cumpleanera));
const puedoVer = (p) => !p.paraDelfi || soyDelfi() || mismo(p.autor, yo.nombre);
const CANDADO = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
const privado =(p) => (p.paraDelfi ? `<span class="privado-tag">${CANDADO} ${soyDelfi() ? 'Solo para vos' : 'Solo para ' + esc(CONFIG.cumpleanera)}</span>` : '');

function hace(t) {
  const min = (Date.now() - t) / 60000;
  if (min < 1) return 'Recién';
  if (min < 60) return `Hace ${Math.floor(min)} min`;
  const h = min / 60;
  if (h < 24) return `Hace ${Math.floor(h)} h`;
  const d = h / 24;
  if (d < 2) return 'Ayer';
  if (d < 30) return `Hace ${Math.floor(d)} días`;
  return new Date(t).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}
function mmss(s) {
  if (!isFinite(s)) return '--:--';
  s = Math.floor(s);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}
const TONOS = [['#F3DDD3', '#8E3B27'], ['#E2E8D2', '#4E6328'], ['#E9DFC9', '#6B5A44'], ['#E5DCEC', '#5A4673'], ['#D9E6E6', '#2F5E5E']];
function avatar(nombre) {
  let h = 0;
  for (const c of (nombre || '').toLowerCase()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const [bg, fg] = TONOS[h % TONOS.length];
  return `<div class="avatar" style="background:${bg};color:${fg}">${esc((nombre || '?').trim()[0]?.toUpperCase() || '?')}</div>`;
}
const ICONOS = {
  corazon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20s-7-4.4-9-9.2C1.6 7.3 3.8 4 7.2 4c2 0 3.5 1.1 4.8 2.8C13.3 5.1 14.8 4 16.8 4c3.4 0 5.6 3.3 4.2 6.8C19 15.6 12 20 12 20z"/></svg>',
  corazonLleno: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7-4.4-9-9.2C1.6 7.3 3.8 4 7.2 4c2 0 3.5 1.1 4.8 2.8C13.3 5.1 14.8 4 16.8 4c3.4 0 5.6 3.3 4.2 6.8C19 15.6 12 20 12 20z"/></svg>',
  play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
  pausa: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5" width="4" height="14" rx="1"/><rect x="13.5" y="5" width="4" height="14" rx="1"/></svg>',
  foto: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/></svg>',
  audio: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/></svg>',
  micro: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  video: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></svg>',
  flecha: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg>',
};
const MATE = `<svg width="96" height="96" viewBox="0 0 64 64" aria-hidden="true"><path d="M38 6l-4 22" stroke="#8A7558" stroke-width="3" stroke-linecap="round"/><path d="M16 26h32c0 16-6 30-16 30S16 42 16 26z" fill="#B5533C"/><path d="M16 26h32" stroke="#7A3424" stroke-width="3" stroke-linecap="round"/><ellipse cx="32" cy="26" rx="14" ry="3" fill="#6E8B3D"/></svg>`;

/* ---------- Dónde se guardan las cosas ---------- */
let store = null;
let posts = [];
let cargado = false;

function storePrueba(clave) {
  const KEY = 'un-mate-juntas-prueba';
  const ahora = Date.now();
  const leerTodo = () => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY));
      if (v) return v;
    } catch {}
    return [
      { id: 'e1', fecha: ahora - 2 * 864e5, autor: 'Sofi', seccion: 'melancolia', titulo: 'Esto es un ejemplo', texto: 'Así se vería un recuerdo. Acá iría una foto de antes y un audio contándote la historia.', media: [], corazones: [], respuestas: [] },
      { id: 'e2', fecha: ahora - 3 * 36e5, autor: 'Sofi', seccion: 'diario', titulo: '', texto: 'Otro ejemplo, para el diario: lo que nos pasó hoy.', media: [], corazones: [], respuestas: [{ autor: 'Delfi', texto: 'Jajaja, las extraño', fecha: ahora - 36e5 }] },
    ];
  };
  let lista = leerTodo();
  let oyente = null;
  const avisar = () => {
    try { localStorage.setItem(KEY, JSON.stringify(lista.map((p) => ({ ...p, media: p.media.filter((m) => !m.url.startsWith('blob:')) })))); } catch {}
    oyente?.([...lista].sort((a, b) => b.fecha - a.fecha));
  };
  const buscar = (id) => lista.find((p) => p.id === id);
  return {
    async probar() { return mismo(clave, 'mate'); },
    escuchar(cb) { oyente = cb; setTimeout(avisar, 150); },
    async publicar(p) { lista.push({ ...p, id: 'p' + Date.now() }); avisar(); },
    async responder(id, r) { buscar(id).respuestas.push(r); avisar(); },
    async corazon(id, nombre, on) {
      const p = buscar(id);
      p.corazones = on ? [...new Set([...p.corazones, nombre])] : p.corazones.filter((n) => n !== nombre);
      avisar();
    },
    async borrar(id) { lista = lista.filter((p) => p.id !== id); avisar(); },
  };
}

async function storeFirebase(clave) {
  const v = '10.12.2';
  const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${v}/firebase-app.js`);
  const fs = await import(`https://www.gstatic.com/firebasejs/${v}/firebase-firestore.js`);
  const db = fs.getFirestore(initializeApp(CONFIG.firebase));
  const col = fs.collection(db, 'grupos', clave, 'posts');
  const doc = (id) => fs.doc(col, id);
  return {
    async probar() {
      try { await fs.getDocs(fs.query(col, fs.limit(1))); return true; }
      catch (e) { if (e.code === 'permission-denied') return false; throw e; }
    },
    escuchar(cb) {
      fs.onSnapshot(fs.query(col, fs.orderBy('fecha', 'desc')),
        (s) => cb(s.docs.map((d) => ({ corazones: [], respuestas: [], media: [], ...d.data(), id: d.id }))),
        (e) => console.error(e));
    },
    publicar: (p) => fs.addDoc(col, p),
    responder: (id, r) => fs.updateDoc(doc(id), { respuestas: fs.arrayUnion(r) }),
    corazon: (id, nombre, on) => fs.updateDoc(doc(id), { corazones: on ? fs.arrayUnion(nombre) : fs.arrayRemove(nombre) }),
    borrar: (id) => fs.deleteDoc(doc(id)),
  };
}

const crearStore = (clave) => (MODO_PRUEBA ? storePrueba(clave) : storeFirebase(clave));

/* ---------- Fotos, audios y videos ---------- */
function tipoDe(file) {
  const t = file.type || '';
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (t.startsWith('image/') || ['heic', 'heif', 'jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'foto';
  if (t.startsWith('audio/') || ['opus', 'ogg', 'm4a', 'mp3', 'wav', 'aac', 'amr'].includes(ext)) return 'audio';
  if (t.startsWith('video/') || ['mov', 'mp4', 'webm', '3gp'].includes(ext)) return 'video';
  return null;
}

function subirArchivo(file, tipo, alAvanzar) {
  if (!CONFIG.cloudinary) {
    return new Promise((res) => {
      if (tipo === 'foto') {
        const r = new FileReader();
        r.onload = () => { alAvanzar(1); res({ tipo, url: r.result }); };
        r.readAsDataURL(file);
      } else { alAvanzar(1); res({ tipo, url: URL.createObjectURL(file) }); }
    });
  }
  return new Promise((res, rej) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CONFIG.cloudinary.preset);
    fd.append('folder', 'un-mate-juntas');
    const x = new XMLHttpRequest();
    x.open('POST', `https://api.cloudinary.com/v1_1/${CONFIG.cloudinary.cloud}/auto/upload`);
    x.upload.onprogress = (e) => e.lengthComputable && alAvanzar(e.loaded / e.total);
    x.onload = () => {
      let r = {};
      try { r = JSON.parse(x.responseText); } catch {}
      if (x.status >= 300) return rej(new Error(r.error?.message || 'No se pudo subir'));
      res({ tipo, id: r.public_id, url: r.secure_url, ancho: r.width || null, alto: r.height || null, dur: r.duration || null });
    };
    x.onerror = () => rej(new Error('Sin conexión'));
    x.send(fd);
  });
}

const CL = () => `https://res.cloudinary.com/${CONFIG.cloudinary.cloud}`;
const conCL = (m) => m.id && CONFIG.cloudinary;
const urlFoto = (m, w = 1200) => (conCL(m) ? `${CL()}/image/upload/f_auto,q_auto,c_limit,w_${w}/${m.id}` : m.url);
const fuentesAudio = (m) => (conCL(m) ? [`${CL()}/video/upload/${m.id}.mp3`, m.url] : [m.url]);
const fuentesVideo = (m) => (conCL(m) ? [`${CL()}/video/upload/q_auto,c_limit,w_1080/${m.id}.mp4`, m.url] : [m.url]);
const posterVideo = (m) => (conCL(m) ? `${CL()}/video/upload/so_1,c_limit,w_1080/${m.id}.jpg` : '');

/* ---------- Navegación ---------- */
function ir(ruta) { if (location.hash !== '#' + ruta) location.hash = ruta; else render(); }
const ruta = () => location.hash.replace(/^#\/?/, '') || '';

async function render() {
  window.scrollTo(0, 0);
  cerrarVisor();
  const r = ruta();
  if (r === 'bienvenida' || (!yo.vioBienvenida && !yo.clave)) return vistaBienvenida();
  if (!yo.clave || !yo.nombre) return vistaEntrar();
  if (!store) {
    $app.innerHTML = '<div class="cargando">Calentando el agua…</div>';
    let ok;
    try { ok = await conectar(yo.clave); }
    catch (e) {
      console.error(e);
      marco('<main class="pantalla"><div class="cargando">No hay conexión.<br>Probá de nuevo en un ratito.</div><div class="centro"><button class="boton claro" onclick="location.reload()">Reintentar</button></div></main>');
      return;
    }
    if (!ok) { guardar({ clave: null }); return vistaEntrar('Esa palabra secreta no funciona más.'); }
  }
  if (r.startsWith('s/') && seccion(r.slice(2))) return vistaSeccion(r.slice(2));
  if (r.startsWith('p/')) return vistaPost(r.slice(2));
  if (r.startsWith('h/')) return vistaHistoria(...r.slice(2).split('/'));
  if (r.startsWith('nuevo')) return vistaNuevo(r.split('/')[1]);
  return vistaInicio();
}
window.addEventListener('hashchange', render);

async function conectar(clave) {
  const s = await crearStore(clave);
  if (!(await s.probar())) return false;
  store = s;
  store.escuchar((lista) => { posts = lista.filter(puedoVer); cargado = true; alActualizar(); });
  return true;
}

function marco(html) {
  $app.innerHTML = (MODO_PRUEBA ? '<div class="aviso-prueba">Modo prueba: lo que subas queda solo en este celular</div>' : '')
    + `<div class="fondo-deco" aria-hidden="true"><span class="olivo-arriba">${D.esquina}</span><span class="olivo-abajo">${D.esquina2}</span></div>` + html;
}

/* ---------- Bienvenida ---------- */
function vistaBienvenida() {
  const foto = CONFIG.fotoBienvenida ? `<img src="${esc(CONFIG.fotoBienvenida)}" alt="">` : MATE;
  const d = (n) => `style="animation-delay:${n}s"`;
  marco(`
    <main class="pantalla bienvenida">
      <div class="polaroid aparece" ${d(0.1)}><div class="foto">${foto}</div><div class="pie">${esc(CONFIG.pieFotoBienvenida)}</div></div>
      <h1 class="mano aparece" ${d(0.6)}>¡Feliz cumple, ${esc(CONFIG.cumpleanera)}!</h1>
      <p class="aparece" ${d(1.2)}>Como no podemos tomarnos un mate todos los días, te armamos este lugar.</p>
      <p class="aparece" ${d(1.8)}>Acá te vamos a ir dejando historias, fotos y audios largos, de esos que se escuchan como un podcast. Entrá cuando quieras: siempre va a haber algo nuevo.</p>
      <p class="aparece" ${d(2.4)}>Hay tres rincones: <b>Melancolía</b> para los recuerdos, <b>Diario</b> para el día a día y <b>Actualizaciones</b> para las novedades. Y vos también podés contarnos cosas.</p>
      <div class="firma aparece" ${d(3)}>${esc(CONFIG.firma)}</div>
      <div class="deco-fila aparece" ${d(3.2)}>${D.mate}${D.corazon}${D.palo}</div>
      <button class="boton aparece" ${d(3.4)} id="seguir">Entrar</button>
    </main>`);
  document.getElementById('seguir').onclick = () => { guardar({ vioBienvenida: true }); ir(yo.clave ? '' : 'entrar'); };
}

/* ---------- Entrar ---------- */
function vistaEntrar(msg = '') {
  marco(`
    <main class="pantalla entrar">
      <h1 class="mano">Un mate juntas</h1>
      <p class="chico centro">Esto es solo para nosotras. Pedile la palabra secreta a las chicas.</p>
      <form id="f" novalidate>
        <div class="campo"><label for="nombre">¿Cómo te llamás?</label><input id="nombre" autocomplete="given-name" value="${esc(yo.nombre || '')}" placeholder="Delfi"></div>
        <div class="campo"><label for="clave">Palabra secreta</label><input id="clave" autocomplete="off" autocapitalize="none" spellcheck="false"></div>
        <p class="error" id="err" role="alert">${esc(msg)}</p>
        <button class="boton" id="btn">Entrar</button>
      </form>
      ${MODO_PRUEBA ? '<p class="chico">En modo prueba la palabra es "mate".</p>' : ''}
    </main>`);
  const f = document.getElementById('f'), err = document.getElementById('err'), btn = document.getElementById('btn');
  f.oninput = () => { err.textContent = ''; };
  f.onsubmit = async (e) => {
    e.preventDefault();
    const nombre = f.nombre.value.trim(), clave = f.clave.value.trim().toLowerCase();
    if (!nombre) { err.textContent = 'Poné tu nombre así sabemos quién cuenta cada cosa.'; return f.nombre.focus(); }
    if (!clave) { err.textContent = 'Falta la palabra secreta.'; return f.clave.focus(); }
    btn.disabled = true; btn.textContent = 'Entrando…';
    try {
      if (await conectar(clave)) { guardar({ nombre, clave, vioBienvenida: true }); return ir(''); }
      err.textContent = 'Esa no es la palabra secreta. Probá de nuevo.';
    } catch (e) {
      console.error(e);
      err.textContent = 'No hay conexión. Probá en un ratito.';
    }
    btn.disabled = false; btn.textContent = 'Entrar';
  };
}

/* ---------- Inicio ---------- */
const esNuevo = (p) => vistaAnterior && p.fecha > vistaAnterior && !mismo(p.autor, yo.nombre);

function vistaInicio() {
  const tarjetas = SECCIONES.map((s) => {
    const deEsta = posts.filter((p) => p.seccion === s.id);
    const nuevos = deEsta.filter(esNuevo).length;
    const cuantas = deEsta.length ? `${deEsta.length} ${deEsta.length === 1 ? 'historia' : 'historias'}` : 'Todavía vacía';
    return `<button class="polaroid tarjeta-seccion" style="transform:rotate(${s.giro}deg)" data-ir="s/${s.id}">
      ${nuevos ? `<span class="sello">${nuevos} ${nuevos === 1 ? 'nueva' : 'nuevas'}</span>` : ''}
      <span class="deco-tarjeta">${D[s.dibujo]}</span>
      <span class="mano">${s.nombre}</span>
      <span class="chico">${s.bajada} · ${cargado ? cuantas : '…'}</span>
    </button>`;
  }).join('');
  marco(`
    <main class="pantalla">
      <header class="cabecera"><div class="deco-fila deco-arriba">${D.imperial}${D.termo}</div><h1 class="mano">Un mate juntas</h1><div class="chico">Hola, ${esc(yo.nombre)}</div></header>
      <div class="secciones">${tarjetas}</div>
      <div class="contar"><button class="boton punteado" data-ir="nuevo">+ Contar algo</button></div>
      <div class="pie-pagina"><div class="deco-olivo">${D.olivo}</div><button class="link" data-ir="bienvenida">Ver la bienvenida otra vez</button></div>
    </main>`);
}

/* ---------- Sección ---------- */
let seccionActual = null;
let postActual = null;
const BOTON_SUBIR = { melancolia: '+ Sumar recuerdo', diario: '+ Subir historia', actualizaciones: '+ Contar novedad' };
const VACIO = {
  melancolia: ['Todavía no hay recuerdos', 'Subí la primera foto de antes.'],
  diario: ['Todavía no hay historias', 'Contá algo de tu día.'],
  actualizaciones: ['Todavía no hay novedades', 'Contá la primera.'],
};
const deSeccion = (id) => posts.filter((p) => p.seccion === id);
const vacio = (id) => `<div class="vacio"><div class="deco-fila">${D.imperial}${D.termo}</div><div class="mano" style="font-size:26px">${VACIO[id][0]}</div><p style="margin:0">${VACIO[id][1]}</p><button class="boton" data-ir="nuevo/${id}">${BOTON_SUBIR[id].slice(2)}</button></div>`;

function vistaSeccion(id) {
  seccionActual = id;
  postActual = null;
  const s = seccion(id);
  marco(`
    <main class="pantalla">
      <button class="link volver" data-ir="">${ICONOS.flecha} Volver</button>
      <div class="titulo-seccion"><h2 class="mano con-dibujo"><span class="dibujo-titulo">${D[s.dibujo]}</span>${s.nombre}</h2><button class="boton claro chico-boton" data-ir="nuevo/${id}">${BOTON_SUBIR[id]}</button></div>
      <div id="contenido">${cargado ? '' : '<div class="cargando">Trayendo las historias…</div>'}</div>
    </main>`);
  if (cargado) pintarSeccion();
}

function pintarSeccion() {
  const cont = document.getElementById('contenido');
  if (!cont) return;
  const lista = deSeccion(seccionActual);
  if (!lista.length) { cont.innerHTML = vacio(seccionActual); return; }
  if (seccionActual === 'melancolia') return pintarPared(cont, lista);
  if (seccionActual === 'diario') return pintarDiario(cont, lista);
  if (!cont.querySelector('.feed')) cont.innerHTML = '<div class="feed" id="feed"></div>';
  actualizarFeed(lista);
}

/* Melancolía: polaroids cuadradas pegadas en la página */
function hash(s) { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
function tapaRecuerdo(p) {
  const foto = p.media.find((m) => m.tipo === 'foto');
  const video = p.media.find((m) => m.tipo === 'video');
  const audio = p.media.find((m) => m.tipo === 'audio');
  if (foto) return `<img loading="lazy" src="${esc(urlFoto(foto, 600))}" alt="">`;
  if (video && posterVideo(video)) return `<img loading="lazy" src="${esc(posterVideo(video))}" alt=""><span class="marca">${ICONOS.play}</span>`;
  if (video) return `<span class="sin-foto">${ICONOS.video}</span>`;
  if (audio) return `<span class="sin-foto">${ICONOS.audio}<small>Audio${audio.dur ? ` de ${mmss(audio.dur)}` : ''}</small></span>`;
  return `<span class="sin-foto texto-tapa">${esc((p.texto || '').slice(0, 90))}${(p.texto || '').length > 90 ? '…' : ''}</span>`;
}
function pintarPared(cont, lista) {
  cont.innerHTML = `<div class="pared"><span class="pared-olivo" aria-hidden="true">${D.olivo}</span><span class="pared-mate" aria-hidden="true">${D.mate}</span>${lista.map((p) => {
    const h = hash(p.id);
    const giro = ((h % 70) / 10 - 3.5).toFixed(1);
    const baja = (h >> 3) % 18;
    const cinta = ((h >> 5) % 30) - 15;
    const pie = p.titulo || (p.media.length ? (p.texto || '').split('\n')[0].slice(0, 40) : '') || '';
    return `<button class="polaroid recuerdo" style="transform:rotate(${giro}deg);margin-top:${baja}px" data-ir="p/${p.id}">
      <span class="cinta" style="transform:translateX(-50%) rotate(${cinta}deg)"></span>
      ${esNuevo(p) ? '<span class="sello">Nuevo</span>' : ''}${p.paraDelfi ? `<span class="candado-recuerdo" aria-label="Privado">${CANDADO}</span>` : ''}
      <span class="foto">${tapaRecuerdo(p)}</span>
      <span class="pie">${esc(pie)}</span>
    </button>`;
  }).join('')}</div>`;
}

/* Un recuerdo abierto */
function vistaPost(id) {
  seccionActual = null;
  postActual = id;
  const p = posts.find((x) => x.id === id);
  const volverA = p ? `s/${p.seccion}` : '';
  marco(`
    <main class="pantalla">
      <button class="link volver" data-ir="${volverA}">${ICONOS.flecha} Volver</button>
      <div class="feed" id="feed">${cargado ? '' : '<div class="cargando">Trayendo el recuerdo…</div>'}</div>
    </main>`);
  if (cargado) pintarPostActual();
}
function pintarPostActual() {
  const p = posts.find((x) => x.id === postActual);
  const feed = document.getElementById('feed');
  if (!feed) return;
  if (!p) { feed.innerHTML = '<div class="vacio"><div class="mano" style="font-size:26px">Este recuerdo ya no está</div></div>'; return; }
  actualizarFeed([p]);
}

/* Diario: historias tipo Instagram */
const LS_VISTAS = 'un-mate-juntas-vistas';
let vistas;
try { vistas = new Set(JSON.parse(localStorage.getItem(LS_VISTAS)) || []); } catch { vistas = new Set(); }
function marcarVista(id) {
  if (vistas.has(id)) return;
  vistas.add(id);
  try { localStorage.setItem(LS_VISTAS, JSON.stringify([...vistas])); } catch {}
}
const FONDOS = ['#B5533C', '#6E8B3D', '#5A4673', '#2F5E5E', '#C98A2B'];
const visto = (p) => vistas.has(p.id) || mismo(p.autor, yo.nombre);
function miniHistoria(p) {
  const m = p.media[0];
  let fondo = '', dentro = '';
  if (m?.tipo === 'foto') fondo = `background-image:url('${urlFoto(m, 400)}')`;
  else if (m?.tipo === 'video') { fondo = posterVideo(m) ? `background-image:url('${posterVideo(m)}')` : 'background:#3a2c1f'; dentro = `<span class="marca">${ICONOS.play}</span>`; }
  else if (m?.tipo === 'audio') { fondo = `background:${p.fondo || '#6E8B3D'}`; dentro = `<span class="marca">${ICONOS.audio}</span>`; }
  else { fondo = `background:${p.fondo || FONDOS[0]}`; dentro = `<span class="frase">${esc((p.texto || '').slice(0, 60))}</span>`; }
  return `<button class="mini-historia ${visto(p) ? '' : 'sin-ver'}" style="${fondo}" data-ir="h/${p.id}/todas">${dentro}${p.paraDelfi ? `<span class="candado-mini">${CANDADO}</span>` : ''}<span class="quien">${esc(p.autor)} · ${hace(p.fecha)}</span></button>`;
}
function pintarDiario(cont, lista) {
  const porAutora = new Map();
  for (const p of lista) {
    const k = (p.autor || '').trim().toLowerCase();
    if (!porAutora.has(k)) porAutora.set(k, []);
    porAutora.get(k).push(p);
  }
  const circulos = [...porAutora.values()].map((ps) => {
    const crono = [...ps].sort((a, b) => a.fecha - b.fecha);
    const primera = crono.find((p) => !visto(p)) || crono[0];
    const sinVer = crono.some((p) => !visto(p));
    return `<button class="circulo" data-ir="h/${primera.id}/autora">
      <span class="anillo ${sinVer ? '' : 'visto'}">${avatar(ps[0].autor)}</span><span class="nombre-circulo">${esc(ps[0].autor)}</span></button>`;
  }).join('');
  cont.innerHTML = `<div class="circulos">${circulos}</div><div class="chico" style="margin:14px 0 8px">Todas las historias</div><div class="grilla-historias">${lista.map(miniHistoria).join('')}</div>`;
}

function listaHistorias(id, modo) {
  const todas = deSeccion('diario');
  if (modo !== 'autora') return todas;
  const p = todas.find((x) => x.id === id);
  return todas.filter((x) => mismo(x.autor, p?.autor)).sort((a, b) => a.fecha - b.fecha);
}

let visor = null;
function cerrarVisor() { if (visor) { clearTimeout(visor.timer); cancelAnimationFrame(visor.raf); visor = null; } }
function vistaHistoria(id, modo = 'todas') {
  seccionActual = null;
  postActual = null;
  cerrarVisor();
  if (!cargado) { $app.innerHTML = '<div class="cargando">Trayendo las historias…</div>'; visor = { esperando: [id, modo] }; return; }
  const lista = listaHistorias(id, modo);
  const i = lista.findIndex((p) => p.id === id);
  if (i < 0) return ir('s/diario');
  const p = lista[i];
  marcarVista(p.id);
  const m = p.media[0];
  const barras = lista.length <= 15
    ? `<div class="barras">${lista.map((x, j) => `<span><i style="width:${j < i ? 100 : 0}%"></i></span>`).join('')}</div>`
    : `<div class="barras"><span><i></i></span></div><div class="contador">${i + 1} de ${lista.length}</div>`;
  let cuerpo = '';
  if (m?.tipo === 'foto') cuerpo = `<img class="media-historia" src="${esc(urlFoto(m, 1400))}" alt="">`;
  else if (m?.tipo === 'video') cuerpo = `<video class="media-historia" playsinline autoplay ${posterVideo(m) ? `poster="${esc(posterVideo(m))}"` : ''}>${fuentesVideo(m).map((u) => `<source src="${esc(u)}">`).join('')}</video>`;
  else if (m?.tipo === 'audio') cuerpo = `<div class="fondo-historia" style="background:${p.fondo || '#6E8B3D'}"><div class="audio audio-grande"><button class="play" aria-label="Escuchar">${ICONOS.play}</button><div class="barra"><span><i></i></span></div><span class="tiempo">${m.dur ? mmss(m.dur) : '--:--'}</span><button class="vel" aria-label="Velocidad">1x</button><audio preload="auto">${fuentesAudio(m).map((u) => `<source src="${esc(u)}">`).join('')}</audio></div></div>`;
  else cuerpo = `<div class="fondo-historia" style="background:${p.fondo || FONDOS[0]}"><div class="frase-grande">${esc(p.texto)}</div></div>`;
  const leyenda = m && p.texto ? `<div class="leyenda">${esc(p.texto)}</div>` : '';
  $app.innerHTML = `
    <div class="visor" data-id="${p.id}">
      ${barras}
      <div class="visor-cabeza">${avatar(p.autor)}<b>${esc(p.autor)}</b><span>${hace(p.fecha)}</span>${privado(p)}<button class="cerrar" aria-label="Cerrar">×</button></div>
      <div class="visor-cuerpo">${cuerpo}${leyenda}
        <button class="zona zona-izq" aria-label="Anterior"></button><button class="zona zona-der" aria-label="Siguiente"></button>
      </div>
      <div class="visor-pie"><div class="pie-post"></div>
        <form class="responder"><input placeholder="Responder a ${esc(p.autor)}…" aria-label="Responder" enterkeyhint="send"><button>Enviar</button></form>
      </div>
    </div>`;
  const raiz = $app.querySelector('.visor');
  const ir2 = (k) => {
    const sig = lista[i + k];
    if (sig) ir(`h/${sig.id}/${modo}`);
    else if (k > 0) ir('s/diario');
  };
  raiz.querySelector('.cerrar').onclick = () => ir('s/diario');
  raiz.querySelector('.zona-izq').onclick = () => ir2(-1);
  raiz.querySelector('.zona-der').onclick = () => ir2(1);
  pintarPie(raiz, p);
  const inp = raiz.querySelector('.responder input');
  raiz.querySelector('.responder').onsubmit = async (e) => {
    e.preventDefault();
    const texto = inp.value.trim();
    if (!texto) return inp.focus();
    inp.value = '';
    try { await store.responder(p.id, { autor: yo.nombre, texto, fecha: Date.now() }); }
    catch (err) { console.error(err); inp.value = texto; alert('No se pudo mandar. Probá de nuevo.'); }
  };

  const barra = raiz.querySelector(lista.length <= 15 ? `.barras span:nth-child(${i + 1}) i` : '.barras i');
  visor = { id: p.id, pausa: false };
  const v = visor;
  inp.onfocus = () => { v.pausa = true; };
  inp.onblur = () => { v.pausa = false; };
  if (!m || m.tipo === 'foto') {
    const DUR = 7000;
    let pasado = 0, ult = performance.now();
    const paso = (t) => {
      if (visor !== v) return;
      if (!v.pausa) pasado += t - ult;
      ult = t;
      barra.style.width = `${Math.min(100, (pasado / DUR) * 100)}%`;
      if (pasado >= DUR) return ir2(1);
      v.raf = requestAnimationFrame(paso);
    };
    v.raf = requestAnimationFrame(paso);
  } else {
    const el = raiz.querySelector(m.tipo === 'video' ? 'video' : 'audio');
    if (m.tipo === 'audio') armarAudio(raiz.querySelector('.audio'));
    el.addEventListener('timeupdate', () => { if (el.duration) barra.style.width = `${(el.currentTime / el.duration) * 100}%`; });
    el.addEventListener('ended', () => { if (visor === v) ir2(1); });
    if (m.tipo === 'video') {
      el.play().catch(() => {});
      raiz.querySelector('.visor-cuerpo').addEventListener('dblclick', () => (el.paused ? el.play() : el.pause()));
    } else el.play().catch(() => {});
  }
}

/* Feed de posteos (Actualizaciones y un recuerdo abierto) */
function actualizarFeed(lista) {
  const feed = document.getElementById('feed');
  if (!feed) return;
  feed.querySelector('.vacio, .cargando')?.remove();
  const existentes = new Map([...feed.querySelectorAll(':scope > .post')].map((el) => [el.dataset.id, el]));
  let anterior = null;
  for (const p of lista) {
    let el = existentes.get(p.id);
    if (el) { existentes.delete(p.id); pintarPie(el, p); }
    else { el = crearPost(p); }
    const enSuLugar = anterior ? anterior.nextElementSibling === el : feed.firstElementChild === el;
    if (!enSuLugar) feed.insertBefore(el, anterior ? anterior.nextElementSibling : feed.firstElementChild);
    anterior = el;
  }
  existentes.forEach((el) => el.remove());
}

function crearPost(p) {
  const el = document.createElement('article');
  el.className = 'post';
  el.dataset.id = p.id;
  const fotos = p.media.filter((m) => m.tipo === 'foto');
  const audios = p.media.filter((m) => m.tipo === 'audio');
  const videos = p.media.filter((m) => m.tipo === 'video');
  const nov = p.seccion === 'actualizaciones';
  const nuevo = esNuevo(p) ? '<span class="nuevo">Nuevo</span>' : '';
  const htmlFotos = fotos.length ? `<div class="fotos">${fotos.map((m) => `<div class="polaroid" data-ver="${esc(urlFoto(m, 2000))}"><div class="foto"><img loading="lazy" src="${esc(urlFoto(m))}" alt=""></div></div>`).join('')}</div>` : '';
  const htmlAudios = audios.map((m) => `<div class="audio"><button class="play" aria-label="Escuchar">${ICONOS.play}</button><div class="barra"><span><i></i></span></div><span class="tiempo">${m.dur ? mmss(m.dur) : '--:--'}</span><button class="vel" aria-label="Velocidad">1x</button><audio preload="metadata">${fuentesAudio(m).map((u) => `<source src="${esc(u)}">`).join('')}</audio></div>`).join('');
  const htmlVideos = videos.map((m) => `<div class="video"><video controls playsinline preload="metadata" ${posterVideo(m) ? `poster="${esc(posterVideo(m))}"` : ''}>${fuentesVideo(m).map((u) => `<source src="${esc(u)}">`).join('')}</video></div>`).join('');
  const htmlTexto = p.texto ? `<div class="texto">${esc(p.texto)}</div>` : '';
  if (nov) el.classList.add('novedad');
  el.innerHTML = (nov ? `
    <div class="nov-top"><span class="etiqueta">Novedad</span><span class="chico">${new Date(p.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</span>${privado(p)}${nuevo}</div>
    <h3 class="titular">${esc(p.titulo || 'Novedad')}</h3>
    <div class="chico contado">${avatar(p.autor)} Contado por ${esc(p.autor)}</div>
    ${htmlFotos}${htmlVideos}${htmlAudios}${htmlTexto}
    <div class="pie-post"></div>` : `
    <div class="autor">${avatar(p.autor)}<div><div class="nombre">${esc(p.autor)}</div><div class="chico">${hace(p.fecha)}</div></div>${privado(p)}${nuevo}</div>
    ${htmlFotos}
    ${p.titulo ? `<div class="titulo-post">${esc(p.titulo)}</div>` : ''}
    ${htmlTexto}${htmlAudios}${htmlVideos}
    <div class="pie-post"></div>`) + `
    <form class="responder"><input placeholder="Responder…" aria-label="Responder" enterkeyhint="send"><button>Enviar</button></form>`;
  el.querySelectorAll('.audio').forEach(armarAudio);
  pintarPie(el, p);
  el.querySelector('.responder').onsubmit = async (e) => {
    e.preventDefault();
    const inp = e.target.querySelector('input');
    const texto = inp.value.trim();
    if (!texto) return inp.focus();
    inp.value = '';
    try { await store.responder(p.id, { autor: yo.nombre, texto, fecha: Date.now() }); }
    catch (err) { console.error(err); inp.value = texto; alert('No se pudo mandar. Probá de nuevo.'); }
  };
  return el;
}

function pintarPie(el, p) {
  const pie = el.querySelector('.pie-post');
  const firma = JSON.stringify([p.corazones, p.respuestas]);
  if (pie.dataset.firma === firma) return;
  pie.dataset.firma = firma;
  const mio = p.corazones.some((n) => mismo(n, yo.nombre));
  const quienes = p.corazones.length ? `A ${p.corazones.length > 3 ? `${p.corazones.slice(0, 2).join(', ')} y ${p.corazones.length - 2} más` : p.corazones.join(p.corazones.length === 2 ? ' y ' : ', ')} ${p.corazones.length === 1 ? 'le gustó' : 'les gustó'}` : '';
  pie.innerHTML = `
    <div class="reacciones">
      <button class="corazon ${mio ? 'lleno' : ''}" aria-label="${mio ? 'Sacar corazón' : 'Poner corazón'}" aria-pressed="${mio}">${mio ? ICONOS.corazonLleno : ICONOS.corazon}</button>
      <span>${esc(quienes)}</span>
      ${mismo(p.autor, yo.nombre) ? '<button class="borrar-post">Borrar</button>' : ''}
    </div>
    ${p.respuestas.length ? `<div class="respuestas">${[...p.respuestas].sort((a, b) => a.fecha - b.fecha).map((r) => `<div class="respuesta"><b>${esc(r.autor)}</b><span class="chico">${hace(r.fecha)}</span><div>${esc(r.texto)}</div></div>`).join('')}</div>` : ''}`;
  pie.querySelector('.corazon').onclick = () => store.corazon(p.id, yo.nombre, !mio).catch(console.error);
  const borrar = pie.querySelector('.borrar-post');
  if (borrar) borrar.onclick = () => { if (confirm('¿Borrar esta historia? No se puede deshacer.')) store.borrar(p.id).catch(console.error); };
}

function armarAudio(caja) {
  const a = caja.querySelector('audio'), play = caja.querySelector('.play'), barra = caja.querySelector('.barra');
  const relleno = barra.querySelector('i'), tiempo = caja.querySelector('.tiempo'), vel = caja.querySelector('.vel');
  const VELS = [1, 1.25, 1.5, 2];
  const mostrar = () => {
    const d = a.duration;
    relleno.style.width = isFinite(d) && d ? `${(a.currentTime / d) * 100}%` : '0';
    tiempo.textContent = a.currentTime > 0 ? mmss(a.currentTime) : (isFinite(d) ? mmss(d) : tiempo.textContent);
  };
  play.onclick = () => {
    if (a.paused) { document.querySelectorAll('audio').forEach((o) => o !== a && o.pause()); a.play().catch(console.error); }
    else a.pause();
  };
  a.onplay = () => { play.innerHTML = ICONOS.pausa; play.setAttribute('aria-label', 'Pausar'); };
  a.onpause = () => { play.innerHTML = ICONOS.play; play.setAttribute('aria-label', 'Escuchar'); };
  a.ontimeupdate = mostrar;
  a.onloadedmetadata = mostrar;
  a.onended = () => { a.currentTime = 0; mostrar(); };
  const saltar = (e) => {
    const r = barra.getBoundingClientRect();
    if (isFinite(a.duration)) a.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * a.duration;
  };
  barra.onpointerdown = (e) => { saltar(e); barra.setPointerCapture(e.pointerId); barra.onpointermove = saltar; };
  barra.onpointerup = () => { barra.onpointermove = null; };
  vel.onclick = () => {
    const v = VELS[(VELS.indexOf(a.playbackRate) + 1) % VELS.length];
    a.playbackRate = v;
    vel.textContent = `${v}x`.replace('.', ',');
  };
}

/* ---------- Contar algo ---------- */
let grabacion = null;
function vistaNuevo(secId) {
  seccionActual = null;
  let elegida = seccion(secId) ? secId : null;
  const adjuntos = [];
  marco(`
    <main class="pantalla">
      <button class="link volver" id="atras">${ICONOS.flecha} Volver</button>
      <h2 class="mano" style="margin:4px 0 20px">Contar algo</h2>
      <form class="form-nuevo" id="f" novalidate>
        <div class="campo"><label>¿Dónde va?</label><div class="chips">${SECCIONES.map((s) => `<button type="button" class="chip" data-sec="${s.id}" aria-pressed="${s.id === elegida}">${s.nombre}</button>`).join('')}</div></div>
        <p class="ayuda" id="ayuda"></p>
        <div class="campo" id="campo-titular"><label for="titular">Titular</label><input id="titular" placeholder="¡Me mudo a Córdoba!" maxlength="90"></div>
        <div class="campo"><label for="texto" id="label-texto">¿Qué querés contar?</label><textarea id="texto" placeholder="¿Te acordás cuando…?"></textarea></div>
        <div class="campo" id="campo-fondo"><label>Color de fondo</label><div class="fondos">${FONDOS.map((c, j) => `<button type="button" class="fondo" data-fondo="${c}" style="background:${c}" aria-label="Fondo ${j + 1}" aria-pressed="${j === 0}"></button>`).join('')}</div></div>
        <div class="campo"><label id="label-sumale">Sumale cosas</label>
          <div class="adjuntar">
            <label>${ICONOS.foto}Fotos o videos<input type="file" id="in-fotos" accept="image/*,video/*" multiple></label>
            <label>${ICONOS.audio}Subir audio<input type="file" id="in-audio" accept="audio/*,.opus,.ogg,.m4a,.mp3,.aac,.amr" multiple></label>
            <button type="button" id="grabar">${ICONOS.micro}<span>Grabar</span></button>
          </div>
          <div class="adjuntos" id="adjuntos"></div>
        </div>
        <div class="campo" id="campo-frase"><label for="titulo">Una frase para la polaroid (si querés)</label><input id="titulo" placeholder="El viaje a Mendoza, 2019" maxlength="60"></div>
        ${soyDelfi() ? '' : `<label class="privado-opcion"><input type="checkbox" id="privado"><span class="interruptor"></span><span>${CANDADO} Solo para ${esc(CONFIG.cumpleanera)}<small>Lo ven solo vos y ella. Si no lo marcás, lo ven todas.</small></span></label>`}
        <p class="error" id="err" role="alert"></p>
        <button class="boton" id="publicar">Publicar</button>
      </form>
    </main>`);
  const f = document.getElementById('f'), err = document.getElementById('err'), lista = document.getElementById('adjuntos');
  document.getElementById('atras').onclick = () => ir(elegida ? `s/${elegida}` : '');
  let fondo = FONDOS[0];
  const unaSola = () => elegida === 'diario' || elegida === 'actualizaciones';
  const mostrar = (id, si) => { document.getElementById(id).style.display = si ? '' : 'none'; };
  const AYUDAS = {
    melancolia: 'Un recuerdo de antes: sale como una polaroid pegada en la página.',
    diario: 'Como una historia de Instagram: una foto, un video, un audio o solo un texto con color de fondo.',
    actualizaciones: 'Una novedad: un titular, lo que quieras contar y una foto, un audio o un video.',
  };
  const aplicar = () => {
    document.getElementById('ayuda').textContent = elegida ? AYUDAS[elegida] : '';
    mostrar('campo-titular', elegida === 'actualizaciones');
    mostrar('campo-frase', elegida === 'melancolia');
    mostrar('campo-fondo', elegida === 'diario');
    document.getElementById('label-texto').textContent = elegida === 'diario' ? 'Texto (si querés)' : elegida === 'actualizaciones' ? 'Contanos más' : '¿Qué querés contar?';
    f.texto.placeholder = elegida === 'diario' ? 'Hoy…' : elegida === 'actualizaciones' ? 'Les cuento todo…' : '¿Te acordás cuando…?';
    document.getElementById('label-sumale').textContent = unaSola() ? 'Sumale una foto, un video o un audio' : 'Sumale cosas';
    document.getElementById('in-fotos').multiple = !unaSola();
    document.getElementById('in-audio').multiple = !unaSola();
  };
  f.querySelectorAll('.chip').forEach((c) => c.onclick = () => {
    elegida = c.dataset.sec;
    f.querySelectorAll('.chip').forEach((o) => o.setAttribute('aria-pressed', o === c));
    err.textContent = '';
    aplicar();
  });
  f.querySelectorAll('.fondo').forEach((b) => b.onclick = () => {
    fondo = b.dataset.fondo;
    f.querySelectorAll('.fondo').forEach((o) => o.setAttribute('aria-pressed', o === b));
  });
  aplicar();
  f.oninput = () => { err.textContent = ''; };

  const agregar = (file) => {
    const tipo = tipoDe(file);
    if (!tipo) { err.textContent = `"${file.name}" no es una foto, un audio ni un video.`; return; }
    const mb = file.size / 1048576;
    const max = tipo === 'foto' ? MAX_FOTO_MB : MAX_VIDEO_MB;
    if (mb > max) { err.textContent = `"${file.name}" pesa ${Math.round(mb)} MB y el máximo es ${max} MB.`; return; }
    if (unaSola() && adjuntos.length) { adjuntos.pop().el.remove(); }
    const item = { file, tipo, el: document.createElement('div') };
    item.el.className = 'adjunto';
    const mini = tipo === 'foto' && file.type.startsWith('image/') && !/hei[cf]/i.test(file.type)
      ? `<img class="miniatura" src="${URL.createObjectURL(file)}" alt="">`
      : `<div class="miniatura">${ICONOS[tipo]}</div>`;
    item.el.innerHTML = `${mini}<div class="nom">${esc(file.name)}<div class="progreso"><i></i></div></div><button type="button" class="quitar" aria-label="Quitar">×</button>`;
    item.el.querySelector('.quitar').onclick = () => { adjuntos.splice(adjuntos.indexOf(item), 1); item.el.remove(); };
    adjuntos.push(item);
    lista.append(item.el);
    err.textContent = '';
  };
  ['in-fotos', 'in-audio'].forEach((id) => {
    const inp = document.getElementById(id);
    inp.onchange = () => { [...inp.files].forEach(agregar); inp.value = ''; };
  });

  const btnGrabar = document.getElementById('grabar');
  btnGrabar.onclick = async () => {
    if (grabacion) return grabacion.rec.stop();
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { err.textContent = 'Este celular no deja grabar desde acá. Grabalo en WhatsApp y subilo.'; return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const partes = [];
      const inicio = Date.now();
      grabacion = { rec, timer: setInterval(() => { btnGrabar.querySelector('span').textContent = `Parar ${mmss((Date.now() - inicio) / 1000)}`; }, 500) };
      btnGrabar.classList.add('grabando');
      btnGrabar.querySelector('span').textContent = 'Parar 0:00';
      rec.ondataavailable = (e) => e.data.size && partes.push(e.data);
      rec.onstop = () => {
        clearInterval(grabacion.timer);
        grabacion = null;
        stream.getTracks().forEach((t) => t.stop());
        btnGrabar.classList.remove('grabando');
        btnGrabar.querySelector('span').textContent = 'Grabar';
        const tipoMime = rec.mimeType || 'audio/webm';
        const ext = tipoMime.includes('mp4') ? 'm4a' : tipoMime.includes('ogg') ? 'ogg' : 'webm';
        const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
        agregar(new File(partes, `Audio grabado ${hora}.${ext}`, { type: tipoMime }));
      };
      rec.start(1000);
    } catch (e) {
      console.error(e);
      err.textContent = 'No pudimos usar el micrófono. Fijate si le diste permiso.';
    }
  };

  f.onsubmit = async (e) => {
    e.preventDefault();
    if (grabacion) { err.textContent = 'Primero pará la grabación.'; return; }
    const texto = f.texto.value.trim();
    if (!elegida) { err.textContent = 'Elegí dónde va: Melancolía, Diario o Actualizaciones.'; return; }
    const titulo = elegida === 'actualizaciones' ? f.titular.value.trim() : elegida === 'melancolia' ? f.titulo.value.trim() : '';
    if (elegida === 'actualizaciones' && !titulo) { err.textContent = 'Ponele un titular a la novedad.'; return f.titular.focus(); }
    if (!texto && !adjuntos.length) { err.textContent = 'Escribí algo o sumá una foto, un audio o un video.'; return f.texto.focus(); }
    if (unaSola() && adjuntos.length > 1) { err.textContent = 'Acá va una sola cosa: quitá las demás.'; return; }
    const btn = document.getElementById('publicar');
    btn.disabled = true;
    f.querySelectorAll('.quitar').forEach((b) => b.disabled = true);
    try {
      const media = [];
      for (const [i, a] of adjuntos.entries()) {
        btn.textContent = adjuntos.length > 1 ? `Subiendo ${i + 1} de ${adjuntos.length}…` : 'Subiendo…';
        const barra = a.el.querySelector('.progreso i');
        media.push(await subirArchivo(a.file, a.tipo, (x) => { barra.style.width = `${Math.round(x * 100)}%`; }));
      }
      btn.textContent = 'Publicando…';
      const nuevo = { fecha: Date.now(), autor: yo.nombre, seccion: elegida, titulo, texto, media, corazones: [], respuestas: [] };
      if (elegida === 'diario') nuevo.fondo = fondo;
      if (f.privado?.checked) nuevo.paraDelfi = true;
      await store.publicar(nuevo);
      ir(`s/${elegida}`);
    } catch (e2) {
      console.error(e2);
      err.textContent = `No se pudo publicar (${e2.message}). Revisá la conexión y probá de nuevo.`;
      btn.disabled = false;
      btn.textContent = 'Publicar';
      f.querySelectorAll('.quitar').forEach((b) => b.disabled = false);
    }
  };
}

/* ---------- Cuando llegan cosas nuevas ---------- */
function alActualizar() {
  const r = ruta();
  if (r.startsWith('s/')) pintarSeccion();
  else if (r.startsWith('p/')) pintarPostActual();
  else if (r.startsWith('h/')) {
    if (visor?.esperando) return vistaHistoria(...visor.esperando);
    const raiz = document.querySelector('.visor');
    const p = raiz && posts.find((x) => x.id === raiz.dataset.id);
    if (p) pintarPie(raiz, p);
  } else if (r === '' && yo.clave) vistaInicio();
}

/* ---------- Clicks generales ---------- */
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-ir]');
  if (a) { e.preventDefault(); return ir(a.dataset.ir); }
  const ver = e.target.closest('[data-ver]');
  if (ver) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `<img src="${esc(ver.dataset.ver)}" alt="">`;
    lb.onclick = () => lb.remove();
    document.body.append(lb);
  }
});
window.addEventListener('pagehide', () => guardar({ ultimaVisita: Date.now() }));

render();

// Datos de la web. Mientras firebase y cloudinary estén en null,
// la web anda en "modo prueba": todo queda guardado solo en este navegador
// y la palabra secreta es "mate".
export const CONFIG = {
  cumpleanera: 'Delfi',
  firma: 'Tus amigas',

  // Foto de la bienvenida (opcional). Por ejemplo 'bienvenida.jpg' dentro de esta carpeta.
  fotoBienvenida: 'bienvenida.jpg?v=2',
  pieFotoBienvenida: 'Nosotras en Copenhague\n(en nuestros sueños, por ahora)',

  // Firestore: se pega acá la configuración de la app web de Firebase.
  firebase: {
    apiKey: 'AIzaSyC1ZnHBCQgHpaTx-j_tWJH8dgWHj5XIEW0',
    authDomain: 'un-mate-juntas-delfi.firebaseapp.com',
    projectId: 'un-mate-juntas-delfi',
    appId: '1:341453771362:web:51757de6cda66f0d14373b',
  },

  // Cloudinary: { cloud: 'nombre-de-la-nube', preset: 'nombre-del-preset' }
  cloudinary: { cloud: 'xgepcvia', preset: 'un_mate_juntas' },
};

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 3000;

// En ES Modules no existe __dirname: se reconstruye así (igual que en el tema)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC = path.join(__dirname, 'public');
const VIEWS = path.join(__dirname, 'views');

// ---------- Middlewares ----------
// Log de cada petición (el orden importa: va el primero)
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Todavía no los usamos, pero los necesitarás cuando haya formularios o fetch a la API
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---------- Rutas ----------
// Página de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(VIEWS, 'menu_inicio.html'));
});

// Recursos estáticos en la raíz:
//   /css/style.css, /js/sesion.js, /images/...
app.use(express.static(PUBLIC));

// TRANSITORIO: por si algún HTML todavía usa rutas tipo ../public/css/style.css
// Cuando los cambies a /css/style.css puedes borrar esta línea.
app.use('/public', express.static(PUBLIC));

// Páginas HTML: funcionan con y sin extensión
//   /aulas.html  y  /aulas
//   /gestiones_administrador/gestion_cursos.html  y  /gestiones_administrador/gestion_cursos
app.use(express.static(VIEWS, { extensions: ['html'] }));

// ---------- 404 y errores (siempre al final) ----------
app.use((req, res) => {
  res.status(404).send('404 - Página no encontrada');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Error interno del servidor');
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import publicasRouter from './routes/publicas.routes.js';
import crudRouter from './routes/crud.routes.js';
import adminRouter from './routes/admin.routes.js';
import cursosApiRouter from './routes/cursos.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC = path.join(__dirname, 'public');

// ---------- Middlewares ----------
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Recursos estáticos: /css/..., /js/..., /images/...
app.use(express.static(PUBLIC));
// TRANSITORIO: por si algún HTML todavía usa ../public/...
app.use('/public', express.static(PUBLIC));

// ---------- Routers ----------
app.use('/crud', crudRouter);                           // /crud/anyadir_curso
app.use('/gestiones_administrador', adminRouter);       // /gestiones_administrador/gestion_cursos
app.use('/api/cursos', cursosApiRouter);
app.use('/', publicasRouter);                           // /  y  /aulas, /catalogo_cursos...

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
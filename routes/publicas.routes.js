import { routerDePaginas, VIEWS } from './paginas.js';

// Páginas de views/  ->  /aulas, /catalogo_cursos, /inicio_sesion ...
const router = routerDePaginas();

// Página de inicio
router.get('/', (req, res) => {
  res.sendFile('menu_inicio.html', { root: VIEWS });
});

export default router;
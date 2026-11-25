import { routerDePaginas } from './paginas.js';

// Páginas de views/gestiones_administrador/  ->  /gestiones_administrador/gestion_cursos ...
// Aquí irá el middleware de protección (solo admin) cuando hagamos las sesiones.
export default routerDePaginas('gestiones_administrador');
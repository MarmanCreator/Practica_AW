import { Router } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const VIEWS = path.join(__dirname, '..', 'views');

// Crea un Router que sirve las páginas .html de una carpeta de views/
//   GET /aulas  y  GET /aulas.html  ->  views/<subcarpeta>/aulas.html
export function routerDePaginas(subcarpeta = '') {
  const router = Router();
  const raiz = path.join(VIEWS, subcarpeta);

  router.get('/:pagina', (req, res, next) => {
    const nombre = req.params.pagina.replace(/\.html$/, '');

    // Solo letras, números, guion y guion bajo: evita rutas raras (../ etc.)
    if (!/^[\w-]+$/.test(nombre)) return next();

    // Con "root", sendFile no puede salirse de esa carpeta.
    // Si el archivo no existe, pasamos al siguiente middleware (acabará en el 404).
    res.sendFile(`${nombre}.html`, { root: raiz }, err => {
      if (err && !res.headersSent) next();
    });
  });

  return router;
}
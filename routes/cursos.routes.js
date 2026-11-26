import { Router } from 'express';
import { listarCursos } from '../services/cursos.service.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const cursos = await listarCursos();
        res.status(200).json(cursos);
    } catch (err) {
        console.error('Error al consultar cursos:', err);
        res.status(500).json({ error: 'Error interno al obtener los cursos' });
    }
});

export default router;
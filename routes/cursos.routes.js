import { Router } from 'express';
import {
    crearCurso,
    desactivarCurso,
    listarCursos,
    listarReferenciasCurso,
    modificarCurso
} from '../services/cursos.service.js';

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

router.get('/referencias', async (req, res) => {
    try {
        const referencias = await listarReferenciasCurso();
        res.status(200).json(referencias);
    } catch (err) {
        console.error('Error al consultar aulas y docentes para cursos:', err);
        res.status(500).json({ error: 'Error interno al obtener aulas y docentes' });
    }
});

router.post('/', async (req, res) => {
    try {
        const curso = validarCurso(req.body);
        const resultado = await crearCurso(curso);
        res.status(201).json(resultado);
    } catch (err) {
        const statusCode = err.statusCode || 500;
        if (statusCode >= 500) {
            console.error('Error al crear curso:', err);
        }
        res.status(statusCode).json({
            error: statusCode >= 500 ? 'Error interno al crear el curso' : err.message
        });
    }
});

router.put('/:id', async (req, res) => {
    const idCurso = Number(req.params.id);
    if (!Number.isInteger(idCurso) || idCurso <= 0) {
        return res.status(400).json({ error: 'El ID del curso no es válido.' });
    }

    try {
        const curso = validarCurso(req.body);
        const modificado = await modificarCurso(idCurso, curso);
        if (!modificado) {
            return res.status(404).json({ error: 'No existe un curso activo con ese ID.' });
        }

        return res.status(200).json({ id_curso: idCurso });
    } catch (err) {
        const statusCode = err.statusCode || 500;
        if (statusCode >= 500) {
            console.error('Error al modificar curso:', err);
        }
        return res.status(statusCode).json({
            error: statusCode >= 500 ? 'Error interno al modificar el curso' : err.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    const idCurso = Number(req.params.id);
    if (!Number.isInteger(idCurso) || idCurso <= 0) {
        return res.status(400).json({ error: 'El ID del curso no es válido.' });
    }

    try {
        const desactivado = await desactivarCurso(idCurso);
        if (!desactivado) {
            return res.status(404).json({ error: 'No existe un curso activo con ese ID.' });
        }

        return res.status(204).end();
    } catch (err) {
        console.error('Error al desactivar curso:', err);
        return res.status(500).json({ error: 'Error interno al eliminar el curso' });
    }
});

function validarCurso(datos) {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        throw crearErrorValidacion('El cuerpo de la solicitud no es válido.');
    }

    const nombre = typeof datos.nombre === 'string' ? datos.nombre.trim() : '';
    const descripcion = typeof datos.descripcion === 'string' ? datos.descripcion.trim() : '';
    const imagen = datos.imagen === undefined
        ? ''
        : typeof datos.imagen === 'string'
            ? datos.imagen.trim()
            : null;
    const fecha_inicio = datos.fecha_inicio;
    const fecha_fin = datos.fecha_fin;
    const horario = typeof datos.horario === 'string' ? datos.horario.trim() : '';
    const plazas = Number(datos.plazas);
    const id_aula = Number(datos.id_aula);
    const id_docente = Number(datos.id_docente);

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        throw crearErrorValidacion('El nombre del curso solo puede contener letras y espacios.');
    }
    if (nombre.length > 100) {
        throw crearErrorValidacion('El nombre del curso no puede superar los 100 caracteres.');
    }
    if (imagen === null || imagen.length > 255) {
        throw crearErrorValidacion('La ruta de la imagen no puede superar los 255 caracteres.');
    }
    if (!Number.isInteger(plazas) || plazas <= 0) {
        throw crearErrorValidacion('Las plazas deben ser un número entero mayor que cero.');
    }
    if (!Number.isInteger(id_aula) || id_aula <= 0 ||
        !Number.isInteger(id_docente) || id_docente <= 0) {
        throw crearErrorValidacion('Debes seleccionar un aula y un docente válidos.');
    }
    if (!fechaValida(fecha_inicio) || !fechaValida(fecha_fin) || fecha_inicio >= fecha_fin) {
        throw crearErrorValidacion('Las fechas del curso no son válidas.');
    }

    const horarioValidado = validarHorario(horario);

    return {
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        horario,
        plazas,
        imagen,
        id_aula,
        id_docente,
        hora_inicio: horarioValidado.hora_inicio,
        hora_final: horarioValidado.hora_final
    };
}

function fechaValida(fecha) {
    if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
    const fechaParseada = new Date(`${fecha}T00:00:00Z`);
    return !Number.isNaN(fechaParseada.getTime()) &&
        fechaParseada.toISOString().slice(0, 10) === fecha;
}

function validarHorario(horario) {
    const coincidencia = horario.match(/^(.+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
    if (!coincidencia) {
        throw crearErrorValidacion('El horario del curso no tiene un formato válido.');
    }

    const diasValidos = new Set(["lunes", "martes", "miercoles", "jueves", "viernes"]);
    const dias = coincidencia[1]
        .split(/\s*,\s*|\s+y\s+/i)
        .map(dia => dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    const formatoHoraValido = hora => {
        const [horas, minutos] = hora.split(":").map(Number);
        return horas >= 0 && horas <= 23 && minutos >= 0 && minutos <= 59;
    };

    if (dias.length === 0 ||
        dias.some(dia => !diasValidos.has(dia)) ||
        new Set(dias).size !== dias.length ||
        !formatoHoraValido(coincidencia[2]) ||
        !formatoHoraValido(coincidencia[3]) ||
        coincidencia[2] >= coincidencia[3]) {
        throw crearErrorValidacion('El horario del curso no es válido.');
    }

    return {
        hora_inicio: coincidencia[2],
        hora_final: coincidencia[3]
    };
}

function crearErrorValidacion(mensaje) {
    const error = new Error(mensaje);
    error.statusCode = 400;
    return error;
}

export default router;
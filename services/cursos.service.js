//Aquí hacemos la consulta real a las tablas oficiales (cursos, docentes y aulas) usando JOIN para traer los nombres del docente y del aula junto a cada curso activo
import { query } from '../db/mariadb.js';

export async function listarCursos() {
    const sql = `
        SELECT
            c.id_curso,
            c.nombre,
            c.descripcion,
            c.fecha_inicio,
            c.fecha_fin,
            c.horario,
            c.plazas,
            c.imagen,
            c.estado,
            c.id_docente,
            d.nombre AS docente_nombre,
            c.id_aula,
            a.nombre AS aula_nombre
        FROM cursos AS c
        JOIN docentes AS d ON d.id_docente = c.id_docente
        JOIN aulas AS a ON a.id_aula = c.id_aula
        WHERE c.estado = 'activo'
        ORDER BY c.id_curso
    `;
    return await query(sql);
}

export async function listarReferenciasCurso() {
    const [aulas, docentes] = await Promise.all([
        query(`
            SELECT id_aula, nombre
            FROM aulas
            WHERE estado = 'activa'
            ORDER BY id_aula
        `),
        query(`
            SELECT id_docente, nombre
            FROM docentes
            WHERE activo = 1
            ORDER BY id_docente
        `)
    ]);

    return { aulas, docentes };
}

export async function crearCurso(curso) {
    const aula = await query(
        "SELECT id_aula FROM aulas WHERE id_aula = ? AND estado = 'activa' LIMIT 1",
        [curso.id_aula]
    );
    if (aula.length === 0) {
        throw crearError("El aula seleccionada no existe o está inactiva.", 400);
    }

    const docente = await query(
        "SELECT id_docente FROM docentes WHERE id_docente = ? AND activo = 1 LIMIT 1",
        [curso.id_docente]
    );
    if (docente.length === 0) {
        throw crearError("El docente seleccionado no existe o está inactivo.", 400);
    }

    const cursoConNombre = await query(
        "SELECT id_curso FROM cursos WHERE LOWER(nombre) = LOWER(?) AND estado = 'activo' LIMIT 1",
        [curso.nombre]
    );
    if (cursoConNombre.length > 0) {
        throw crearError("Ya existe un curso activo con ese nombre.", 409);
    }

    const mismoDocenteEnAula = await query(
        `SELECT id_curso
        FROM cursos
        WHERE id_aula = ? AND id_docente = ? AND estado = 'activo'
            AND fecha_inicio <= ? AND fecha_fin >= ?
        LIMIT 1`,
        [curso.id_aula, curso.id_docente, curso.fecha_fin, curso.fecha_inicio]
    );
    if (mismoDocenteEnAula.length > 0) {
        throw crearError("Ya existe un curso activo en esa aula con ese docente.", 409);
    }

    const cursosEnAula = await query(
        `SELECT horario
        FROM cursos
        WHERE id_aula = ? AND estado = 'activo'
            AND fecha_inicio <= ? AND fecha_fin >= ?`,
        [curso.id_aula, curso.fecha_fin, curso.fecha_inicio]
    );
    const horarioNuevo = analizarHorario(curso.horario);
    const horarioSolapado = cursosEnAula.some(cursoExistente => {
        const horarioExistente = analizarHorario(cursoExistente.horario);
        return horarioExistente &&
            horarioExistente.dias.some(dia => horarioNuevo.dias.includes(dia)) &&
            curso.hora_inicio < horarioExistente.hora_final &&
            curso.hora_final > horarioExistente.hora_inicio;
    });
    if (horarioSolapado) {
        throw crearError("Ya existe un curso en esa aula en ese horario.", 409);
    }

    const resultado = await query(
        `INSERT INTO cursos
            (nombre, descripcion, fecha_inicio, fecha_fin, horario, plazas, imagen, estado, id_docente, id_aula)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'activo', ?, ?)`,
        [
            curso.nombre,
            curso.descripcion,
            curso.fecha_inicio,
            curso.fecha_fin,
            curso.horario,
            curso.plazas,
            "",
            curso.id_docente,
            curso.id_aula
        ]
    );

    return { id_curso: Number(resultado.insertId) };
}

function analizarHorario(horario) {
    const coincidencia = horario.match(/^(.+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
    if (!coincidencia) return null;

    const diasValidos = new Set(["lunes", "martes", "miercoles", "jueves", "viernes"]);
    const dias = coincidencia[1]
        .split(/\s*,\s*|\s+y\s+/i)
        .map(dia => dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

    if (dias.length === 0 || dias.some(dia => !diasValidos.has(dia))) return null;

    return {
        dias,
        hora_inicio: coincidencia[2],
        hora_final: coincidencia[3]
    };
}

function crearError(mensaje, statusCode) {
    const error = new Error(mensaje);
    error.statusCode = statusCode;
    return error;
}
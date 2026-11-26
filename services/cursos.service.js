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
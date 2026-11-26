/*Se encarga de abrir el pool de conexiones leyendo las credenciales de tu .env y liberar cada conexión al terminar*/
import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10
});

export async function query(sql, params = []) {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query(sql, params);
    } finally {
        if (conn) conn.release();
    }
}
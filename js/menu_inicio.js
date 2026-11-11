
document.addEventListener("DOMContentLoaded", () => {
    const contenidoInicio = document.getElementById("contenido-inicio");
    const informacionInicio = document.getElementById("informacion-inicio");

    if (!contenidoInicio || !informacionInicio) {
        return;
    }

    contenidoInicio.innerHTML = `
        <h2>Bienvenido a la escuela</h2>
        <p>Desde este menú puedes consultar la oferta formativa, conocer a nuestros docentes y gestionar tus matrículas.</p>
        <section class="tarjetas">
            <article class="tarjeta">
                <h3>Consulta nuestros cursos</h3>
                <p>Descubre los cursos disponibles y sus plazas.</p>
                <a href="catalogo_cursos.html">Ver cursos</a>
            </article>
            <article class="tarjeta">
                <h3>Conoce al equipo docente</h3>
                <p>Consulta la información de los docentes de la escuela.</p>
                <a href="docentes.html">Ver docentes</a>
            </article>
            <article class="tarjeta">
                <h3>Gestiona tus matrículas</h3>
                <p>Accede a tus matrículas y revisa tu formación.</p>
                <a href="mis_matriculas.html">Ver mis matrículas</a>
            </article>
        </section>
    `;

    
    const usuarioActivo = sessionStorage.getItem("usuarioActivo");

    if (usuarioActivo) {
        
        informacionInicio.innerHTML = `
            <h2>Accesos rápidos</h2>
            <p>Revisa tus datos en el <a href="perfil.html">perfil</a> o consulta tus <a href="mis_matriculas.html">matrículas</a>.</p>
            <p>Si has terminado, recuerda cerrar sesión por seguridad.</p>
            <button onclick="cerrarSesion()">Cerrar sesión</button>
        `;
    } else {
        
        informacionInicio.innerHTML = `
            <h2>Accesos rápidos</h2>
            <p>¿Eres nuevo? Puedes <a href="registro.html">registrarte</a> o <a href="inicio_sesion.html">iniciar sesión</a>.</p>
            <p>Si necesitas ayuda, visita la sección de <a href="formulario_contacto.html">contacto</a>.</p>
        `;
    }
});










































        




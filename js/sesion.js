
//Todo el cçodigo está embuelto sobre este eventLissener para no cometer el error
//de manipular botones y textos que el navegador aun no ha pintado en la pantalla.
//Este evento garantiza que el script espera a que el árbol DOM del HTML actual esté 
//construido al 100% en la memoria antes de intentar leerlo o modificarlo
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Recuperar la sesión actual (carnet de identidad del usuario)
   // Utilizamos sessionStorage en lugar de localStorage para la sesión 
   // activa porque es una memoria volátil que se destruye al cerrar la pestaña, 
   // lo cual es vital por seguridad. Como la Web Storage API solo admite cadenas 
   // de texto, aplicamos JSON.parse() para deserializar la información y convertirla 
   // de nuevo en un objeto JavaScript manejable que contiene el nombre y el rol del usuario.
    const usuarioGuardado = sessionStorage.getItem("usuarioActivo");
    let usuarioActivo = null;

    if (usuarioGuardado) {
        usuarioActivo = JSON.parse(usuarioGuardado); 
    }

    // 2. SEGURIDAD: Protección de rutas
    //Lee la URL en la que está el usuario y usa el método .some() para comprobar si 
    // coincide con alguna de las rutas prohibidas. Si un visitante intenta forzar la 
    // entrada escribiendo perfil.html en la barra del navegador, el script detecta que 
    // usuarioActivo es null, bloquea la carga visual, lanza una alerta y lo expulsa mediante
    //  una redirección por código (window.location.href) a la pantalla de login. Hacemos lo mismo 
    //si un estudiante intenta colarse en administracion.html
    const rutaActual = window.location.pathname;
    const paginasPrivadas = ["mis_matriculas.html", "perfil.html", "administracion.html"];
    
    const intentaAccesoPrivado = paginasPrivadas.some(pagina => rutaActual.includes(pagina));
    if (!usuarioActivo && intentaAccesoPrivado) {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = "inicio_sesion.html";
        return; 
    }

    if (usuarioActivo && usuarioActivo.rol !== "administrador" && rutaActual.includes("administracion.html")) {
        alert("Acceso denegado: No tienes permisos de administrador.");
        window.location.href = "menu_inicio.html";
        return;
    }

    // 3. Mensaje en el header
    const header = document.querySelector("header");
    if (header) {
        let mensajeHeader = document.querySelector("header p");
        
        if (usuarioActivo) {
            // Si el usuario está logueado pero el HTML base no tiene un <p>, lo creamos nosotros
            if (!mensajeHeader) {
                mensajeHeader = document.createElement("p");
                header.appendChild(mensajeHeader);
            }
            mensajeHeader.textContent = `Has iniciado sesión como ${usuarioActivo.rol} (${usuarioActivo.nombre}).`;
        } else {
            // Si es un visitante y existe el mensaje, lo borramos
            if (mensajeHeader) {
                mensajeHeader.remove();
            }
        }
    }

    // 4. OCULTAR ENLACES: Buscamos tanto en el nav como en el header
    const enlaces = document.querySelectorAll("nav a, header a");
    enlaces.forEach(enlace => {
        const href = enlace.getAttribute("href");
        if (!href) return; // Si el enlace no tiene href, lo saltamos
        
        // Subfunción inteligente: Oculta el <li> completo si está en una lista, o solo el <a> si está suelto
        const ocultarElemento = () => {
            if (enlace.parentElement.tagName.toLowerCase() === "li") {
                enlace.parentElement.style.display = "none";
            } else {
                enlace.style.display = "none";
            }
        };

        if (usuarioActivo) {
            // Usuario LOGUEADO: Ocultar los enlaces de login y registro estén donde estén
            if (href.includes("registro.html") || href.includes("inicio_sesion.html")) {
                ocultarElemento();
            }
            // Si es estudiante, ocultar el botón de administración
            if (usuarioActivo.rol === "estudiante" && href.includes("administracion.html")) {
                ocultarElemento();
            }
        } else {
            // Usuario NO LOGUEADO: Ocultar zonas privadas
            if (href.includes("perfil.html") || href.includes("mis_matriculas.html") || href.includes("administracion.html")) {
                ocultarElemento();
            }
        }
    });
});

// Función global para el botón de cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem("usuarioActivo");
    window.location.href = "menu_inicio.html";
}
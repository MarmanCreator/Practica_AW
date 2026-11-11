document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Recuperar la sesión actual (carnet de identidad del usuario)
    const usuarioGuardado = sessionStorage.getItem("usuarioActivo");
    let usuarioActivo = null;

    if (usuarioGuardado) {
        usuarioActivo = JSON.parse(usuarioGuardado); 
    }

    // 2. SEGURIDAD: Protección de rutas
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

    // 3. ADAPTACIÓN DE LA INTERFAZ: Mensaje en el header
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
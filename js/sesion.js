
document.addEventListener("DOMContentLoaded", () => {

    const usuarioGuardado = sessionStorage.getItem("usuarioActivo");
    let usuarioActivo = null;

    if (usuarioGuardado) {
        usuarioActivo = JSON.parse(usuarioGuardado); 
    }
 
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

    
    const header = document.querySelector("header");
    if (header) {
        let mensajeHeader = document.querySelector("header p");
        
        if (usuarioActivo) {
            
            if (!mensajeHeader) {
                mensajeHeader = document.createElement("p");
                header.appendChild(mensajeHeader);
            }
            mensajeHeader.textContent = `Has iniciado sesión como ${usuarioActivo.rol} (${usuarioActivo.nombre}).`;
        } else {
            
            if (mensajeHeader) {
                mensajeHeader.remove();
            }
        }
    }

    
    const enlaces = document.querySelectorAll("nav a, header a");
    enlaces.forEach(enlace => {
        const href = enlace.getAttribute("href");
        if (!href) return; 
        
        
        const ocultarElemento = () => {
            if (enlace.parentElement.tagName.toLowerCase() === "li") {
                enlace.parentElement.style.display = "none";
            } else {
                enlace.style.display = "none";
            }
        };

        if (usuarioActivo) {
            
            if (href.includes("registro.html") || href.includes("inicio_sesion.html")) {
                ocultarElemento();
            }
            
            if (usuarioActivo.rol === "estudiante" && href.includes("administracion.html")) {
                ocultarElemento();
            }
        } else {
            
            if (href.includes("perfil.html") || href.includes("mis_matriculas.html") || href.includes("administracion.html")) {
                ocultarElemento();
            }
        }
    });
});


function cerrarSesion() {
    sessionStorage.removeItem("usuarioActivo");
    window.location.href = "menu_inicio.html";
}

//Todo el cçodigo está embuelto sobre este eventLissener para no cometer el error
//de manipular botones y textos que el navegador aun no ha pintado en la pantalla.
//Este evento garantiza que el script espera a que el árbol DOM del HTML actual esté 
//construido al 100% en la memoria antes de intentar leerlo o modificarlo.
//Literalmente DOMContentLoaded significa el contenido del DOM ha sido cargado.
document.addEventListener("DOMContentLoaded", () => {
    
     /*La web tiene amnesia por defecto. Cuando saltas de inicio_sesion.html a menu_inicio.html, 
    el navegador olvida todo lo que pasó en la página anterior. El sessionStorage es como un bolsillo 
    temporal que sobrevive a esos saltos, pero se vacía al cerrar la pestaña. */
    
    const usuarioGuardado = sessionStorage.getItem("usuarioActivo");
    let usuarioActivo = null;
   
    /*Tu archivo sesion.js se ejecuta cada vez que cargas cualquier página. Al arrancar, 
    mete la mano en ese bolsillo (sessionStorage.getItem). Se dan dos situaciones:*/

    /*Situación A (Está vacío / null)
    Como estás vacío, el script te considera un Visitante y te muestra los botones de "Iniciar Sesión" y "Registro".
    
    Situación B (Hay datos guardados)
    Como el script encuentra tus datos, te considera un Usuario Logueado, borra visualmente los botones de registro y te da acceso a tus matrículas.
    */

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
    /*La etiqueta <p>: Es simplemente la etiqueta estándar de HTML para crear un párrafo de texto. 
    En tu versión antigua, escribías manualmente <p>Has iniciado sesion como alumno</p>*/

    /*¿Qué es un Nodo?: Cuando el navegador lee tu texto HTML (<header>, <h1>, <p>), no lo trata como 
    simple texto, sino que lo convierte en objetos 3D en su memoria. A todo el conjunto se le llama Árbol DOM, y a cada
    pieza individual (un título, un botón, una caja) se le llama Nodo.*/

    /*En lugar de escribir el <p> en el HTML, hacemos que JavaScript lo fabrique en tiempo real:*/
    const header = document.querySelector("header");
    if (header) {
        let mensajeHeader = document.querySelector("header p");
        
        //En caso de que el usuario esté logeado tenemos que mostras el mensajito. 
        if (usuarioActivo) {
            // Si el usuario está logueado pero el HTML base no tiene un <p>, lo creamos nosotros
            if (!mensajeHeader) {
                mensajeHeader = document.createElement("p"); //JavaScript crea un nodo-parrafo de texto "invisible". Aún no está en la página. 
                header.appendChild(mensajeHeader); //Estaa instrucción lo que hace es basicamente incrustar nuestro nodo en el header de la página.
            }
            //Le inyectamos el texto exacto usando los datos del sesionStoreg. 
            mensajeHeader.textContent = `Has iniciado sesión como ${usuarioActivo.rol} (${usuarioActivo.nombre}).`;
        } else {
            // Si es un visitante y existe el mensaje, lo borramos, pues no tiene que verse nada.
            if (mensajeHeader) {
                mensajeHeader.remove();
            }
        }
    }

    // 4. OCULTAR ENLACES

    /*Aqui le estamos diciendo al navegador: "Dame una lista con todas las etiquetas <a> (enlaces) que estén dentro 
    de cualuier <nav> o <header>" 
    El navegador nos devuelve un array NodeList con todos los elementos que cumplan estas caracteristicas.*/
    const enlaces = document.querySelectorAll("nav a, header a");
    
    //Utilizamos un bucle forEach para coger cada enlace de la lista uno por uno.
    enlaces.forEach(enlace => {
        const href = enlace.getAttribute("href"); //Usamos enlace.getAttribute("href") para leer hacia donde apunta ese enlace.
       //Es como mirarle el billete a cada pasajero, si el billete dice "registro.html" ya sabemos que boton tenemos entre manos.
        if (!href) return; // Si el enlace no tiene href, lo saltamos
        
        // Subfunción inteligente: Oculta el <li> completo si está en una lista, o solo el <a> si está suelto
        const ocultarElemento = () => {

            //No ocultamos el enlace directamente, porque esto supondría que se quedara ahi un boton perdido de la mano de dios. 
            //Le decimos a JS que mire quien es el "padre" del enlace, es decir la caja que lo envuelve.
            if (enlace.parentElement.tagName.toLowerCase() === "li") {
                //Leemos su tagName (nombre de la etiqueta) para saber que tipo es. 
                //Si es un <li> aplicamos style.display = "none" a todo el <li>. Lo desactivamos.
                enlace.parentElement.style.display = "none";
            } else {
                enlace.style.display = "none";
            }
        };

        //Aquí reutilizamos nuestra variable usuarioActivo. El script ya sabe con esta variable si el usuario esta logeado o no. 
        if (usuarioActivo) {
            // Usuario LOGUEADO: Ocultar los enlaces de login y registro estén donde estén
            if (href.includes("registro.html") || href.includes("inicio_sesion.html")) { //Recuerda que en href tenemos guardado a donde apunta el enlace.
                ocultarElemento();
            }
            // Si es estudiante, ocultar el botón de administración
            if (usuarioActivo.rol === "estudiante" && href.includes("administracion.html")) {
                ocultarElemento();
            }

        } else { // Usuario NO LOGUEADO: Ocultar zonas privadas
            
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
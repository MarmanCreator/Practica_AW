
//Inicializamos el array de usuarios. 
//Primero rescatamos el almacenamiento local para recuperar informacion de usuarios guardada anteriorment. 
//Usamos JSON para parsear esta informacion, y en caso de que no haya, crear un array vacio. 
const usuariosGuardados = localStorage.getItem("usuarios");
const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

//Seleccionamos el formulario sobre el que vamos a trabajar en este caso el de registro
const formularioRegistro = document.getElementById("registro"); 

//Escuchamos el evento de envio del formulario. 
//Aquí le estamos diciendo al programma que esté atento al evento submit el cual 
// salta al pulsar el boton de envío del formulario. 
if(formularioRegistro){
    formularioRegistro.addEventListener("submit", function(event){
        event.preventDefault(); //Así evitamos que la página se recargue y se pierda la infomracion. 
        
        //Vamos leyendo los campos 
        //.trim() limpia la entrada de datos, elimina los espacios en blanco. 
        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value; 
        const confirPassword = document.getElementById("confirm_password").value; 
        const rol = document.getElementById("rol").value; 
        
        //El nombre solo admite letras y espacios.
        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if (!regexLetras.test(nombre)) {

            alert("Error: El nombre solo puede contener letras y espacios.");
            return; // Detenemos el envío del formulario inmediatamente
        }

        if (!["alumno", "admin"].includes(rol)) {
            alert("Error: El rol seleccionado no es válido.");
            return;
        }

        //Compribacion basica temporal de las contraseñas. Muestra pantallita de error. 
        if(password !== confirPassword){
            alert("Las contraseñas no coinciden. "); 
            return;
        }

        //LLamamos a la funcion que añade al nnuevo usuario con los nuevos datos
        const registroExitoso = AnyadirUsuario(nombre, email, password, rol);
        
        if(registroExitoso){

        //Guardarlo en localStorage convertido a JSON[cite: 257]
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        //Avisamos de que el usuario se ha registrado bien. 
        alert("Usuario registrado correctamente.");


        // Redirigimos a la página unificada tras el registro exitoso
        window.location.href = "/inicio_sesion.html";

         }
    }) 
}

function AnyadirUsuario(nombre, email, password, rol){
    const usuarioExistente = usuarios.find(
        usuario => usuario.email.toLowerCase() === email
    );

    if (usuarioExistente) {
        alert("Email ya registrado en otro usuario");
        return false;
    }

    const nuevoUsuario = {
        id_usuario: usuarios.reduce(
            (mayorId, usuario) => Math.max(mayorId, usuario.id_usuario),
            0
        ) + 1,
        nombre: nombre,
        email: email,
        password: password,
        rol: rol,
        fecha_registro: fechaHoraActual(),
        activo: 1
    };

    usuarios.push(nuevoUsuario);
    return true;
}

function fechaHoraActual() {
    const ahora = new Date();
    const fechaLocal = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000);
    return fechaLocal.toISOString().slice(0, 19).replace("T", " ");
}


// Función para neutralizar etiquetas HTML y evitar inyecciones XSS
function sanitizarEntrada(texto) {
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
//Basicamente aqui lo que hacemos es que el texto que introduzca el usuario 
//en nuestro formulario, antes de procesarlo, vamos a sustituir algunos caracteres
//que sabemos que son utilizados en instrucciones html, por texto plano. 
//De esta forma el navegador no interpreta <script> como una orden por ejemplo 


//          FUNCIONAMIENTO DE GETELEMENTBYID()
// El comando getElementById() rastrea todo el documento HTML desde arriba hacia abajo y devuelve 
// estrictamente el primer elemento que encuentre con ese ID. El programa no tiene ni idea de si ese campo
// pertenece al formulario de registro, al de contacto o a ningún formulario. Funciona asumiendo la regla
// de oro de HTML: los identificadores deben ser únicos para elementos únicos en toda la página. Si por error 
// pones id="nombre" tanto en tu formulario de contacto como en el de registro dentro del mismo HTML, la función 
// cogerá el primero que aparezca en el código fuente y fallará en el segundo.

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
        const apellido = document.getElementById("apellido").value.trim(); 
        const email = document.getElementById("email").value.trim(); 
        const password = document.getElementById("password").value; 
        const confirPassword = document.getElementById("confirm_password").value; 
        const rol = document.getElementById("rol").value; 
        
        //Compribacion basica temporal de las contraseñas. Muestra pantallita de error. 
        if(password !== confirPassword){
            alert("Las contraseñas no coinciden. "); 
            return;
        }

        //LLamamos a la funcion que añade al nnuevo usuario con los nuevos datos
        const registroExitoso = AnyadirUsuario(nombre, apellido, email, password, rol); 
        
        if(registroExitoso){

        //Guardarlo en localStorage convertido a JSON[cite: 257]
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        //Avisamos de que el usuario se ha registrado bien. 
        alert("Usuario registrado correctamente.");


        //Reedirigimos en fncion del rol.
        if(rol == "estudiante"){
            window.location.href = "menu_inicio_alumno.html";
        }else if(rol === "administrador"){
            window.location.href = "menu_inicio_admin.html"; 
        }
         }
    }) 
}

function AnyadirUsuario(nombre, apellido, email, password, rol){
    const nuevoUsuario = {
            id: usuarios.length + 1, // ID simple autoincremental
            nombre: nombre,
            apellido: apellido,
            email: email,
            password: password, 
            rol: rol
        };

        const usuarioExistente = usuarios.find(
            usuario => usuario.email === email
        )

        if(usuarioExistente){
            alert("Email ya registrado en otro usuario")
            return false;  
        }
        usuarios.push(nuevoUsuario);  
        return true; 
}






//          FUNCIONAMIENTO DE GETELEMENTBYID()
// El comando getElementById() rastrea todo el documento HTML desde arriba hacia abajo y devuelve 
// estrictamente el primer elemento que encuentre con ese ID. El programa no tiene ni idea de si ese campo
// pertenece al formulario de registro, al de contacto o a ningún formulario. Funciona asumiendo la regla
// de oro de HTML: los identificadores deben ser únicos para elementos únicos en toda la página. Si por error 
// pones id="nombre" tanto en tu formulario de contacto como en el de registro dentro del mismo HTML, la función 
// cogerá el primero que aparezca en el código fuente y fallará en el segundo.
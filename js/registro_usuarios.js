
const usuariosGuardados = localStorage.getItem("usuarios");
const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : []; 

const formularioRegistro = document.getElementById("registro"); 

if(formularioRegistro){
    formularioRegistro.addEventListener("submit", function(event){
        event.preventDefault(); 
  
        const nombre = document.getElementById("nombre").value.trim();  
        const apellido = document.getElementById("apellido").value.trim(); 
        const email = document.getElementById("email").value.trim(); 
        const password = document.getElementById("password").value; 
        const confirPassword = document.getElementById("confirm_password").value; 
        const rol = document.getElementById("rol").value; 
        
        if(password !== confirPassword){
            alert("Las contraseñas no coinciden. "); 
            return;
        }

        const registroExitoso = AnyadirUsuario(nombre, apellido, email, password, rol); 
        
        if(registroExitoso){

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        alert("Usuario registrado correctamente.");

        window.location.href = "inicio_sesion.html";

         }
    }) 
}

function AnyadirUsuario(nombre, apellido, email, password, rol){
    const nuevoUsuario = {
            id: usuarios.length + 1, 
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













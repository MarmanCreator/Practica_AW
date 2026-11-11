
const formularioLogin = document.getElementById("inicio_sesion"); 

const usuariosGuardados = localStorage.getItem("usuarios");
const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

if(formularioLogin){
    
    formularioLogin.addEventListener("submit", function(event){
        event.preventDefault(); 

        
        const emailInput = document.getElementById("email").value.trim();
        const passwordInput = document.getElementById("password").value; 

        const usuarioValido = usuarios.find(
            usuario => usuario.email === emailInput && usuario.password === passwordInput); 

        if (usuarioValido) {
            
            sessionStorage.setItem("usuarioActivo", JSON.stringify(usuarioValido));
               
            alert("Inicio de sesión exitoso. ¡Bienvenido, " + usuarioValido.nombre + "!");
      
            window.location.href = "menu_inicio.html";
            
        } else {
            
            alert("Error: Correo electrónico o contraseña incorrectos.");
        }
    })


}
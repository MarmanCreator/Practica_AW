//Guardo el formulario con el que vamos a trabajar 
const formularioLogin = document.getElementById("inicio_sesion"); 

//Recuperar la "base de datos" (el array de usuarios) desde localStorage[cite: 237, 257]
//Revisar si esto cunde tenerlo aquí. 
const usuariosGuardados = localStorage.getItem("usuarios");
const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

if(formularioLogin){
    //Escuchamos el evento submit del formulario. 
    formularioLogin.addEventListener("submit", function(event){
        event.preventDefault(); //Evitamos que recargue de una la pagina.

        //Extremos los datoss introducidos, con trim para que no haya lios con el formato.
        const emailInput = document.getElementById("email").value.trim();
        const passwordInput = document.getElementById("password").value; 

        //Buscamos la coincidencia exacta con los parametros introducidos en el inicio de sesion. 
        const usuarioValido = usuarios.find(
            usuario => usuario.email === emailInput && usuario.password === passwordInput); 


 
          //Condicional para procesar el resultado de la búsqueda
        if (usuarioValido) {
            // 1. Guardamos al usuario en sessionStorage (¡ACTIVO, SIN COMENTAR!)
            sessionStorage.setItem("usuarioActivo", JSON.stringify(usuarioValido));
            
            // 2. Lanzamos la alerta de éxito
            alert("Inicio de sesión exitoso. ¡Bienvenido, " + usuarioValido.nombre + "!");

            // 3. Redirigimos a la página unificada
            window.location.href = "menu_inicio.html";
            
        } else {
            // Si find() devuelve undefined, las credenciales no existen o son incorrectas
            alert("Error: Correo electrónico o contraseña incorrectos.");
        }
    })


}
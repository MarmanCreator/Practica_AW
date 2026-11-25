//Guardo el formulario con el que vamos a trabajar 
const formularioLogin = document.getElementById("inicio_sesion"); 

//Recuperar la "base de datos" (el array de usuarios) desde localStorage[cite: 237, 257]
//Revisar si esto cunde tenerlo aquí. 
const usuariosGuardados = localStorage.getItem("usuarios");
const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

if (formularioLogin) {
    //Escuchamos el evento submit del formulario. 
    formularioLogin.addEventListener("submit", function(event) {
        event.preventDefault(); //Evitamos que recargue de una la pagina.

        //Extremos los datoss introducidos, con trim para que no haya lios con el formato.
        const emailInput = document.getElementById("email").value.trim();
        const passwordInput = document.getElementById("password").value; 

        //Buscamos la coincidencia exacta con los parametros introducidos en el inicio de sesion. 
        const usuarioValido = usuarios.find(
            usuario => usuario.email === emailInput &&
                usuario.password === passwordInput &&
                usuario.activo === 1
        );

        //Condicional para procesar el resultado de la búsqueda
        if (usuarioValido) {
            const usuarioEnSesion = {
                id_usuario: usuarioValido.id_usuario,
                nombre: usuarioValido.nombre,
                email: usuarioValido.email,
                rol: usuarioValido.rol,
                fecha_registro: usuarioValido.fecha_registro,
                activo: usuarioValido.activo
            };
            sessionStorage.setItem("usuarioActivo", JSON.stringify(usuarioEnSesion));

            //Lanzamos la alerta de éxito
            alert("Inicio de sesión exitoso. ¡Bienvenido, " + usuarioValido.nombre + "!");

            //Redirigimos a la página unificada
            window.location.href = "/menu_inicio.html";
        } else {
            //Si no hay coincidencia o el usuario está inactivo, se rechaza el acceso.
            alert("Error: Correo electrónico o contraseña incorrectos.");
        }
    });
}

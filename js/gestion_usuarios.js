


const usuariosGuardados = localStorage.getItem("usuarios");

const usuarios = usuariosGuardados
    ? JSON.parse(usuariosGuardados)
    : [
        // {
        //     id: 0,
        //     nombre: "Admin",
        //     apellido: "Molon",
        //     email: "admin@admin.es",
        //     password: "1234",
        //     rol: "administrador",
        //     telefono: "123456789",
        //     activo: true
        // },
        // {
        //     id: 1,
        //     nombre: "User",
        //     apellido: "Molon",
        //     email: "user@user.es",
        //     password: "1234",
        //     rol: "estudiante",
        //     telefono: "123456789",
        //     activo: true
        // }
];

localStorage.setItem("usuarios", JSON.stringify(usuarios));

const usuarioSesionGuardado = sessionStorage.getItem("usuarioActivo");
const usuarioSesionActual = usuarioSesionGuardado
    ? JSON.parse(usuarioSesionGuardado)
    : null;


const selectUsuarioEliminado = document.getElementById("id_usuario_eliminado");

if (selectUsuarioEliminado) {
    for (let i = 0; i < usuarios.length; i++) {
        const user = usuarios[i];

        if (!user.activo) {
            const opcion = document.createElement("option");
            opcion.value = user.id;
            opcion.textContent = `${user.nombre} ${user.apellido || ""}`.trim();
            selectUsuarioEliminado.appendChild(opcion);
        }
    }
}

const selectUsuarioActivo = document.getElementById("id_usuario_activo");

if (selectUsuarioActivo) {
    for (let i = 0; i < usuarios.length; i++) {
        const user = usuarios[i];
        const esFormularioDesactivar =
            document.getElementById("desactivar_usuario") !== null;
        const esUsuarioSesion =
            usuarioSesionActual && user.id === usuarioSesionActual.id;

        if (user.activo &&
            (!esFormularioDesactivar || !esUsuarioSesion)) {
            const opcion = document.createElement("option");
            opcion.value = user.id;
            opcion.textContent = `${user.nombre} ${user.apellido || ""}`.trim();
            selectUsuarioActivo.appendChild(opcion);
        }
    }
}

const formulario_activar_usuario = document.getElementById("activar_usuario");
if (formulario_activar_usuario) {
    formulario_activar_usuario.addEventListener("submit", function (event) {
        event.preventDefault();
        const id = Number(document.getElementById("id_usuario_eliminado").value);
        const usuarioExiste = usuarios.some(usuario => usuario.id === id && !usuario.activo);
        if (!Number.isInteger(id) || !usuarioExiste) {
            alert("No existe ningún usuario con ese ID o ya está activo.");
            return;
        }
        ActivarUsuario(id);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        window.location.href = "../gestiones_administrador/gestion_usuarios.html";
    });
}
function ActivarUsuario(id) {
    usuarios.find(usuario => usuario.id === id).activo = true;
}

const formulario_desactivar_usuario = document.getElementById("desactivar_usuario");
if (formulario_desactivar_usuario) {
    formulario_desactivar_usuario.addEventListener("submit", function (event) {
        event.preventDefault();
        const id = Number(document.getElementById("id_usuario_activo").value);
        const usuarioExiste = usuarios.some(usuario => usuario.id === id && usuario.activo);
        const esUsuarioActual = usuarioSesionActual && id === usuarioSesionActual.id;
        if (esUsuarioActual) {
            alert("No puedes desactivar el usuario que tiene la sesión actual.");
            return;
        }
        if (!Number.isInteger(id) || !usuarioExiste) {
            alert("No existe ningún usuario con ese ID o ya está inactivo.");
            return;
        }
        DesactivarUsuario(id);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        window.location.href = "../gestiones_administrador/gestion_usuarios.html";
    });
}
function DesactivarUsuario(id) {
    usuarios.find(usuario => usuario.id === id).activo = false;
}

const formulario_modificar_usuario = document.getElementById("modificar_usuario");
if (formulario_modificar_usuario) {
    formulario_modificar_usuario.addEventListener("submit", function (event) {
        event.preventDefault();
        const idIntroducido = document.getElementById("id_usuario_activo").value.trim();
        const nombreIntroducido = sanitizarEntrada(document.getElementById("nombre").value.trim());
        const apellidoIntroducido = sanitizarEntrada(document.getElementById("apellido").value.trim());
        const emailIntroducido = sanitizarEntrada(document.getElementById("email").value.trim());
        const contraseñaIntroducida = document.getElementById("contraseña").value; 
        const rolIntroducido = sanitizarEntrada(document.getElementById("rol").value.trim());
        const telefonoIntroducido = document.getElementById("telefono").value.trim();

        const regexNumeros = /^\d+$/;
        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const regexTelefono = /^[\d\s]+$/;

        if (!regexNumeros.test(idIntroducido)) {
            alert("Error: El ID del usuario debe ser un número entero positivo.");
            return;
        }
        
        const id = Number(idIntroducido);
        const usuario = usuarios.find(u => u.id === id);
        
        if (!usuario || !usuario.activo) {
            alert("No existe ningún usuario activo con ese ID.");
            return;
        }

        if ((nombreIntroducido !== "" && !regexLetras.test(nombreIntroducido)) || 
            (apellidoIntroducido !== "" && !regexLetras.test(apellidoIntroducido))) {
            alert("Error: En los campos de nombre y apellido solo están permitidas letras y espacios.");
            return;
        }

        if (emailIntroducido !== "" && !regexEmail.test(emailIntroducido)) {
            alert("Error: El formato del correo electrónico no es válido.");
            return;
        }

        
        if (telefonoIntroducido !== "" && !regexTelefono.test(telefonoIntroducido)) {
            alert("Error: El teléfono solo puede contener números y espacios.");
            return;

        }
        
        const rolesValidos = ["administrador", "docente", "estudiante"];
        if (rolIntroducido !== "" && !rolesValidos.includes(rolIntroducido.toLowerCase())) {
             alert("Error: El rol introducido no es válido.");
             return; 
        }


        let nombre = usuario.nombre;
        if (nombreIntroducido !== "") nombre = nombreIntroducido;
        
        let apellido = usuario.apellido;
        if (apellidoIntroducido !== "") apellido = apellidoIntroducido;
        
        let email = usuario.email;
        if (emailIntroducido !== "") email = emailIntroducido;
        
        let contraseña = usuario.password || usuario.contraseña; 
        if (contraseñaIntroducida !== "") contraseña = contraseñaIntroducida;
        
        let rol = usuario.rol;
        if (rolIntroducido !== "") rol = rolIntroducido;
        
        let telefono = usuario.telefono;
        if (telefonoIntroducido !== "") telefono = telefonoIntroducido;

        modificarUsuario(id, nombre, apellido, email, contraseña, rol, telefono);

        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        window.location.href = "../gestiones_administrador/gestion_usuarios.html";
    });
}
function modificarUsuario(id, nombre, apellido, email, password, rol, telefono) {
    const usuario = usuarios.find(usuario => usuario.id === id);
    if (usuario) {
        usuario.nombre = nombre;
        usuario.apellido = apellido;
        usuario.email = email;
        usuario.password = password;
        usuario.rol = rol;
        usuario.telefono = telefono;
    }
}


const contenedorTarjetas = document.querySelector('.tarjetas');

if (contenedorTarjetas) {
    const fragmento = document.createDocumentFragment();

    const tituloUsuarios = document.createElement('h3');
    tituloUsuarios.textContent = 'Usuarios disponibles';

    const totalUsuarios = document.createElement('p');
    totalUsuarios.className = 'total-cursos';
    const usuariosActivos = usuarios.filter(usuario => usuario.activo);
    totalUsuarios.textContent = 'Usuarios disponibles: ' + usuariosActivos.length;

    for (let i = 0; i < usuariosActivos.length; i++) {
        const usuarioActual = usuariosActivos[i];
        const card = document.createElement('article');
        card.className = 'tarjeta';

        card.innerHTML = `
            <h4>${usuarioActual.nombre} ${usuarioActual.apellido}</h4>
            <p><strong>Id:</strong> ${usuarioActual.id}</p>
            <p><strong>Email:</strong> ${usuarioActual.email}</p>
            <p><strong>Contraseña:</strong> ${"No visible"}</p>
            <p><strong>Rol:</strong> ${usuarioActual.rol}</p>
            <p><strong>Teléfono:</strong> ${usuarioActual.telefono}</p>
        `;

        fragmento.appendChild(card);
    }

    contenedorTarjetas.replaceChildren(fragmento);
    contenedorTarjetas.prepend(tituloUsuarios, totalUsuarios);
}


function sanitizarEntrada(texto) {
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
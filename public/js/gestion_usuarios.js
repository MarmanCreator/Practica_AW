const usuariosGuardados = localStorage.getItem("usuarios");
const usuarios = usuariosGuardados
    ? JSON.parse(usuariosGuardados)
    : [
        {
            id_usuario: 1,
            nombre: "Admin Molon",
            email: "admin@admin.es",
            password: "1234",
            rol: "admin",
            fecha_registro: fechaHoraActual(),
            activo: 1
        },
        {
            id_usuario: 2,
            nombre: "User Molon",
            email: "user@user.es",
            password: "1234",
            rol: "alumno",
            fecha_registro: fechaHoraActual(),
            activo: 1
        }
    ];

localStorage.setItem("usuarios", JSON.stringify(usuarios));

const usuarioSesionGuardado = sessionStorage.getItem("usuarioActivo");
const usuarioSesionActual = usuarioSesionGuardado
    ? JSON.parse(usuarioSesionGuardado)
    : null;

const selectUsuarioEliminado = document.getElementById("id_usuario_eliminado");

if (selectUsuarioEliminado) {
    for (const user of usuarios) {
        if (user.activo === 0) {
            const opcion = document.createElement("option");
            opcion.value = user.id_usuario;
            opcion.textContent = `${user.nombre} (${user.id_usuario})`;
            selectUsuarioEliminado.appendChild(opcion);
        }
    }
}

const selectUsuarioActivo = document.getElementById("id_usuario_activo");

if (selectUsuarioActivo) {
    const esFormularioDesactivar =
        document.getElementById("desactivar_usuario") !== null;

    for (const user of usuarios) {
        const esUsuarioSesion =
            usuarioSesionActual &&
            user.id_usuario === usuarioSesionActual.id_usuario;

        if (user.activo === 1 && (!esFormularioDesactivar || !esUsuarioSesion)) {
            const opcion = document.createElement("option");
            opcion.value = user.id_usuario;
            opcion.textContent = `${user.nombre} (${user.id_usuario})`;
            selectUsuarioActivo.appendChild(opcion);
        }
    }
}

const formularioActivarUsuario = document.getElementById("activar_usuario");
if (formularioActivarUsuario) {
    formularioActivarUsuario.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("id_usuario_eliminado").value);
        const usuario = usuarios.find(user =>
            user.id_usuario === id && user.activo === 0
        );

        if (!Number.isInteger(id) || !usuario) {
            alert("No existe ningún usuario con ese ID o ya está activo.");
            return;
        }

        usuario.activo = 1;
        guardarUsuarios();
        window.location.href = "/gestiones_administrador/gestion_usuarios.html";
    });
}

const formularioDesactivarUsuario = document.getElementById("desactivar_usuario");
if (formularioDesactivarUsuario) {
    formularioDesactivarUsuario.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("id_usuario_activo").value);
        const usuario = usuarios.find(user =>
            user.id_usuario === id && user.activo === 1
        );
        const esUsuarioActual =
            usuarioSesionActual && id === usuarioSesionActual.id_usuario;

        if (esUsuarioActual) {
            alert("No puedes desactivar el usuario que tiene la sesión actual.");
            return;
        }
        if (!Number.isInteger(id) || !usuario) {
            alert("No existe ningún usuario con ese ID o ya está inactivo.");
            return;
        }

        usuario.activo = 0;
        guardarUsuarios();
        window.location.href = "/gestiones_administrador/gestion_usuarios.html";
    });
}

const formularioModificarUsuario = document.getElementById("modificar_usuario");
if (formularioModificarUsuario) {
    formularioModificarUsuario.addEventListener("submit", event => {
        event.preventDefault();

        const idIntroducido = document.getElementById("id_usuario_activo").value.trim();
        const nombreIntroducido = document.getElementById("nombre").value.trim();
        const emailIntroducido = document.getElementById("email").value.trim().toLowerCase();
        const passwordIntroducida = document.getElementById("password").value;
        const rolIntroducido = document.getElementById("rol").value;

        const regexNumeros = /^\d+$/;
        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!regexNumeros.test(idIntroducido)) {
            alert("Error: El ID del usuario debe ser un número entero positivo.");
            return;
        }

        const id = Number(idIntroducido);
        const usuario = usuarios.find(user => user.id_usuario === id);

        if (!usuario || usuario.activo !== 1) {
            alert("No existe ningún usuario activo con ese ID.");
            return;
        }
        if (nombreIntroducido !== "" && !regexLetras.test(nombreIntroducido)) {
            alert("Error: El nombre solo puede contener letras y espacios.");
            return;
        }
        if (emailIntroducido !== "" && !regexEmail.test(emailIntroducido)) {
            alert("Error: El formato del correo electrónico no es válido.");
            return;
        }
        if (rolIntroducido !== "" && !["admin", "alumno"].includes(rolIntroducido)) {
            alert("Error: El rol introducido no es válido.");
            return;
        }

        if (nombreIntroducido !== "") usuario.nombre = nombreIntroducido;
        if (emailIntroducido !== "") usuario.email = emailIntroducido;
        if (passwordIntroducida !== "") usuario.password = passwordIntroducida;
        if (rolIntroducido !== "") usuario.rol = rolIntroducido;

        guardarUsuarios();
        window.location.href = "/gestiones_administrador/gestion_usuarios.html";
    });
}

const contenedorTarjetas = document.querySelector(".tarjetas");

if (contenedorTarjetas) {
    const fragmento = document.createDocumentFragment();
    const tituloUsuarios = document.createElement("h3");
    tituloUsuarios.textContent = "Usuarios disponibles";

    const usuariosActivos = usuarios.filter(usuario => usuario.activo === 1);
    const totalUsuarios = document.createElement("p");
    totalUsuarios.className = "total-cursos";
    totalUsuarios.textContent = "Usuarios disponibles: " + usuariosActivos.length;

    for (const usuario of usuariosActivos) {
        const card = document.createElement("article");
        card.className = "tarjeta";
        card.innerHTML = `
            <h4>${sanitizarEntrada(usuario.nombre)}</h4>
            <p><strong>Id usuario:</strong> ${usuario.id_usuario}</p>
            <p><strong>Email:</strong> ${sanitizarEntrada(usuario.email)}</p>
            <p><strong>Rol:</strong> ${sanitizarEntrada(usuario.rol)}</p>
            <p><strong>Fecha de registro:</strong> ${sanitizarEntrada(usuario.fecha_registro)}</p>
        `;
        fragmento.appendChild(card);
    }

    contenedorTarjetas.replaceChildren(fragmento);
    contenedorTarjetas.prepend(tituloUsuarios, totalUsuarios);
}

function guardarUsuarios() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function fechaHoraActual() {
    const ahora = new Date();
    const fechaLocal = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000);
    return fechaLocal.toISOString().slice(0, 19).replace("T", " ");
}

function sanitizarEntrada(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

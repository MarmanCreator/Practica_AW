


const usuariosGuardados = localStorage.getItem("usuarios");

const usuarios = usuariosGuardados
    ? JSON.parse(usuariosGuardados)
    : [
        // { lo dejo como ejemplo para saber que variables tiene cada usuario
        //     id: 0,
        //     nombre: "Admin",
        //     apellido: "Molon",
        //     email: "garcia@example.com",
        //     contraseña: "Ejemplo",
        //     rol: "admin",
        //     telefono: "123456789",
        //     activo: true
        // }
];

for (const usuario of usuarios) {
    usuario.password = usuario.password ?? usuario.contraseña ?? "";
    usuario.telefono = usuario.telefono ?? "";
}

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
        const id = Number(document.getElementById("id_usuario_activo").value);
        const usuarioExiste = usuarios.some(usuario => usuario.id === id && usuario.activo);
        if (!Number.isInteger(id) || !usuarioExiste) {
            alert("No existe ningún usuario con ese ID.");
            return;
        }
        let nombre = usuarios.find(usuario => usuario.id === id).nombre;
        if(document.getElementById("nombre").value !== "") {
            nombre = document.getElementById("nombre").value;
        }
        let apellido = usuarios.find(usuario => usuario.id === id).apellido;
        if(document.getElementById("apellido").value !== "") {
            apellido = document.getElementById("apellido").value;
        }
        let email = usuarios.find(usuario => usuario.id === id).email;
        if(document.getElementById("email").value !== "") {
            email = document.getElementById("email").value;
        }
        let contraseña = usuarios.find(usuario => usuario.id === id).password;
        if(document.getElementById("contraseña").value !== "") {
            contraseña = document.getElementById("contraseña").value;
        }
        let rol = usuarios.find(usuario => usuario.id === id).rol;
        if(document.getElementById("rol").value !== "") {
            rol = document.getElementById("rol").value;
        }
        let telefono = usuarios.find(usuario => usuario.id === id).telefono;
        if(document.getElementById("telefono").value !== "") {
            telefono = document.getElementById("telefono").value;
        }
        modificarUsuario(id, nombre, apellido, email, contraseña, rol, telefono);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        window.location.href = "../gestiones_administrador/gestion_usuarios.html";

    });
}
function modificarUsuario(id, nombre, apellido, email, contraseña, rol, telefono) {
    const usuario = usuarios.find(usuario => usuario.id === id);
    if (usuario) {
        usuario.nombre = nombre;
        usuario.apellido = apellido;
        usuario.email = email;
        usuario.password = contraseña;
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

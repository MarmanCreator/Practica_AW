


const usuariosGuardados = localStorage.getItem("usuarios");

const usuarios = usuariosGuardados
    ? JSON.parse(usuariosGuardados)
    : [];

const formulario_activar_usuario = document.getElementById("activar_usuario");
if (formulario_activar_usuario) {
    formulario_activar_usuario.addEventListener("submit", function (event) {
        event.preventDefault();
        const id = Number(document.getElementById("id_usuario").value);
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
        const id = Number(document.getElementById("id_usuario").value);
        const usuarioExiste = usuarios.some(usuario => usuario.id === id && usuario.activo);
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
        const id = Number(document.getElementById("id_usuario").value);
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
        let contraseña = usuarios.find(usuario => usuario.id === id).contraseña;
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
        usuario.contraseña = contraseña;
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
            <p><strong>Contraseña:</strong> ${usuarioActual.contraseña}</p>
            <p><strong>Rol:</strong> ${usuarioActual.rol}</p>
            <p><strong>Teléfono:</strong> ${usuarioActual.telefono}</p>
        `;

        fragmento.appendChild(card);
    }

    contenedorTarjetas.replaceChildren(fragmento);
    contenedorTarjetas.prepend(tituloUsuarios, totalUsuarios);
}

const matriculasGuardadas = localStorage.getItem("matriculas");

const matriculas = matriculasGuardadas
    ? JSON.parse(matriculasGuardadas)
    : [];
localStorage.setItem("matriculas", JSON.stringify(matriculas));

const usuariosGuardados = localStorage.getItem("usuarios");

const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

const cursosGuardados = localStorage.getItem("cursos");

const cursos = cursosGuardados ? JSON.parse(cursosGuardados) : [ ];


// Rellena los selectores con matrículas activas y entidades relacionadas disponibles.
const selectMatricula = document.getElementById("id_matricula");

if (selectMatricula) {
    for (let i = 0; i < matriculas.length; i++) {
        const matric = matriculas[i];

        if (matric.estado === "activa") {
            const opcion = document.createElement("option");
            opcion.value = matric.id_matricula;
            opcion.textContent = `${matric.id_matricula}`.trim();
            selectMatricula.appendChild(opcion);
        }
    }
}
// Rellena el selector con usuarios activos de tipo alumno.
const selectUsuario = document.getElementById("id_usuario");

if (selectUsuario) {
    for (let i = 0; i < usuarios.length; i++) {
        const user = usuarios[i];

        if (user.activo === 1 && user.rol === "alumno") {
            const opcion = document.createElement("option");
            opcion.value = obtenerIdUsuario(user);
            opcion.textContent = user.nombre;
            selectUsuario.appendChild(opcion);
        }
    }
}
//y esto para rellenar el select de cursos en el formulario de añadir matrícula, mostrando solo los cursos activos.
const selectCurso = document.getElementById("id_curso");
if (selectCurso) {
    for (let i = 0; i < cursos.length; i++) {
        const curso = cursos[i];

        if (curso.estado === "activo") {
            const opcion = document.createElement("option");
            opcion.value = curso.id_curso;
            opcion.textContent = `${curso.nombre}`.trim();
            selectCurso.appendChild(opcion);
        }
    }
}


const formularioAnyadirMatricula = document.getElementById("anyadir_matricula");
if (formularioAnyadirMatricula &&
    document.getElementById("id_usuario") &&
    document.getElementById("id_curso")) {
    formularioAnyadirMatricula.addEventListener("submit", event => {
        event.preventDefault();
        const id_usuario = Number(document.getElementById("id_usuario").value);
        const id_curso = Number(document.getElementById("id_curso").value);
        const usuario = usuarios.find(usuarioActual =>
            usuarioActual.id_usuario === id_usuario && usuarioActual.activo === 1
        );
        const curso = cursos.find(cursoActual =>
            cursoActual.id_curso === id_curso &&
            cursoActual.estado === "activo"
        );

        if (!Number.isInteger(id_usuario) || !usuario) {
            alert("No existe ningún usuario activo con ese ID.");
            return;
        }
        if (!Number.isInteger(id_curso) || !curso) {
            alert("No existe ningún curso activo con ese ID.");
            return;
        }
        if (matriculas.some(matricula =>
            matricula.id_usuario === id_usuario &&
            matricula.id_curso === id_curso &&
            matricula.estado === "activa"
        )) {
            alert("Ese usuario ya está matriculado en ese curso.");
            return;
        }
        if (usuario.rol !== "alumno") {
            alert("No se puede matricular a un administrador en un curso.");
            return;
        }

        matriculas.push({
            id_matricula: matriculas.reduce((mayorId, matricula) => Math.max(mayorId, matricula.id_matricula), 0) + 1,
            id_usuario: id_usuario,
            id_curso: id_curso,
            fecha_matricula: fechaHoraActual(),
            estado: "activa"
        });
        localStorage.setItem("matriculas", JSON.stringify(matriculas));
        window.location.href = "/gestiones_administrador/gestion_matriculas.html";
    });
}

const formularioEliminarMatricula = document.getElementById("eliminar_matricula");
if (formularioEliminarMatricula) {
    formularioEliminarMatricula.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("id_matricula").value);
        const matricula = matriculas.find(matriculaActual =>
            matriculaActual.id_matricula === id && matriculaActual.estado === "activa"
        );

        if (!Number.isInteger(id) || !matricula) {
            alert("No existe ninguna matrícula activa con ese ID.");
            return;
        }

        matricula.estado = "cancelada";
        localStorage.setItem("matriculas", JSON.stringify(matriculas));
        window.location.href = "/gestiones_administrador/gestion_matriculas.html";
    });
}

const formularioModificarMatricula = document.getElementById("modificar_matricula");
if (formularioModificarMatricula) {
    formularioModificarMatricula.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("id_matricula").value);
        const matricula = matriculas.find(matriculaActual =>
            matriculaActual.id_matricula === id && matriculaActual.estado === "activa"
        );

        if (!Number.isInteger(id) || !matricula) {
            alert("No existe ninguna matrícula activa con ese ID.");
            return;
        }

        const idUsuarioIntroducido = document.getElementById("id_usuario").value;
        const idCursoIntroducido = document.getElementById("id_curso").value;
        const id_usuario = idUsuarioIntroducido === ""
            ? matricula.id_usuario
            : Number(idUsuarioIntroducido);
        const id_curso = idCursoIntroducido === ""
            ? matricula.id_curso
            : Number(idCursoIntroducido);
        const usuario = usuarios.find(usuarioActual =>
            usuarioActual.id_usuario === id_usuario && usuarioActual.activo === 1
        );
        const curso = cursos.find(cursoActual =>
            cursoActual.id_curso === id_curso &&
            cursoActual.estado === "activo"
        );

        if (idUsuarioIntroducido !== "" && (!Number.isInteger(id_usuario) || !usuario)) {
            alert("No existe ningún usuario activo con ese ID.");
            return;
        }
        if (idCursoIntroducido !== "" && (!Number.isInteger(id_curso) || !curso)) {
            alert("No existe ningún curso activo con ese ID.");
            return;
        }
        if (matriculas.some(matriculaActual =>
            matriculaActual.id_matricula !== id &&
            matriculaActual.id_usuario === id_usuario &&
            matriculaActual.id_curso === id_curso &&
            matriculaActual.estado === "activa"
        )) {
            alert("Ese usuario ya está matriculado en ese curso.");
            return;
        }

        matricula.id_usuario = id_usuario;
        matricula.id_curso = id_curso;
        localStorage.setItem("matriculas", JSON.stringify(matriculas));
        window.location.href = "/gestiones_administrador/gestion_matriculas.html";
    });
}

const contenedorTarjetas = document.querySelector(".tarjetas");
const es_mis_matriculas = document.getElementById("tarjetas-mis-matriculas");
const usuarioGuardado = sessionStorage.getItem("usuarioActivo");
const usuarioActual = usuarioGuardado
    ? JSON.parse(usuarioGuardado)
    : null;

if(es_mis_matriculas){
    const fragmento = document.createDocumentFragment();

    const titulo = document.createElement("h3");
    titulo.textContent = "Mis matrículas";

    const total = document.createElement("p");
    total.className = "total-cursos";
    total.id = "total-matriculas";
    const matriculasMias = matriculas.filter(matricula =>
        usuarioActual &&
        matricula.estado === "activa" &&
        matricula.id_usuario === usuarioActual.id_usuario
    );
    total.textContent = "Matrículas disponibles: " + matriculasMias.length;

    for (let i = 0; i < matriculasMias.length; i++) {
        const matriculaActual = matriculasMias[i];
        const usuarioId = matriculaActual.id_usuario;
        const usuario = usuarios.find(usuarioActual =>
            usuarioActual.id_usuario === usuarioId
        );
        const curso = cursos.find(cursoActual =>
            cursoActual.id_curso === matriculaActual.id_curso
        );
        const nombreUsuario = usuario ? usuario.nombre : "Usuario no encontrado";
        const nombreCurso = curso ? curso.nombre : "Curso no encontrado";
        const card = document.createElement("article");
        card.className = "tarjeta";

        card.innerHTML = `
            <h4>Matrícula ${matriculaActual.id_matricula}</h4>
            <p><strong>Usuario:</strong> ${sanitizarEntrada(nombreUsuario)}</p>
            <p><strong>Id del usuario:</strong> ${usuarioId}</p>
            <p><strong>Curso:</strong> ${nombreCurso}</p>
            <p><strong>Id del curso:</strong> ${matriculaActual.id_curso}</p>
            <p><strong>Fecha de matrícula:</strong> ${matriculaActual.fecha_matricula || "No disponible"}</p>
        `;

        fragmento.appendChild(card);
    }

    contenedorTarjetas.replaceChildren(fragmento);
    contenedorTarjetas.prepend(titulo, total);
}
else if (contenedorTarjetas) {
    const fragmento = document.createDocumentFragment();

    const titulo = document.createElement("h3");
    titulo.textContent = "Matrículas disponibles";

    const total = document.createElement("p");
    total.className = "total-cursos";
    total.id = "total-matriculas";
    const matriculasActivas = matriculas.filter(matricula => matricula.estado === "activa");
    total.textContent = "Matrículas disponibles: " + matriculasActivas.length;

    for (let i = 0; i < matriculasActivas.length; i++) {
        const matriculaActual = matriculasActivas[i];
        const usuarioId = matriculaActual.id_usuario;
        const usuario = usuarios.find(usuarioActual =>
            usuarioActual.id_usuario === usuarioId
        );
        const curso = cursos.find(cursoActual =>
            cursoActual.id_curso === matriculaActual.id_curso
        );
        const nombreUsuario = usuario ? usuario.nombre : "Usuario no encontrado";
        const nombreCurso = curso ? curso.nombre : "Curso no encontrado";
        const card = document.createElement("article");
        card.className = "tarjeta";

        card.innerHTML = `
            <h4>Matrícula ${matriculaActual.id_matricula}</h4>
            <p><strong>Usuario:</strong> ${sanitizarEntrada(nombreUsuario)}</p>
            <p><strong>Id del usuario:</strong> ${usuarioId}</p>
            <p><strong>Curso:</strong> ${nombreCurso}</p>
            <p><strong>Id del curso:</strong> ${matriculaActual.id_curso}</p>
            <p><strong>Fecha de matrícula:</strong> ${matriculaActual.fecha_matricula || "No disponible"}</p>
        `;

        
        let button = null;
        button = document.createElement("button");
        button.textContent = "Editar";
        button.addEventListener("click", () => {
            window.location.href = `/crud/modificar_matricula.html?id=${matriculaActual.id_matricula}`;  
        });

        card.appendChild(button);
        fragmento.appendChild(card);
    }

    contenedorTarjetas.replaceChildren(fragmento);
    contenedorTarjetas.prepend(titulo, total);
}

function fechaHoraActual() {
    const ahora = new Date();
    const formato = numero => String(numero).padStart(2, "0");
    return `${ahora.getFullYear()}-${formato(ahora.getMonth() + 1)}-${formato(ahora.getDate())} ` +
        `${formato(ahora.getHours())}:${formato(ahora.getMinutes())}:${formato(ahora.getSeconds())}`;
}

function sanitizarEntrada(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

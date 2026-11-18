const matriculasGuardadas = localStorage.getItem("matriculas");

const matriculas = matriculasGuardadas ? JSON.parse(matriculasGuardadas) : [

    {
        id: 0,
        id_usuario: 0,
        id_curso: 0,
        fecha_matricula: new Date().toLocaleDateString("es-ES"),
        activo: true
    }
];
localStorage.setItem("matriculas", JSON.stringify(matriculas));

const usuariosGuardados = localStorage.getItem("usuarios");

const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [ ];

const cursosGuardados = localStorage.getItem("cursos");

const cursos = cursosGuardados ? JSON.parse(cursosGuardados) : [ ];


// Esto de abajo es para rellenar el select de matrículas en el formulario de modificar matrícula, mostrando solo las matrículas activas.
const selectMatricula = document.getElementById("matricula");

if (selectMatricula) {
    for (let i = 0; i < matriculas.length; i++) {
        const matric = matriculas[i];

        if (matric.activo) {
            const opcion = document.createElement("option");
            opcion.value = matric.id;
            opcion.textContent = `${matric.id}`.trim();
            selectMatricula.appendChild(opcion);
        }
    }
}
// Esto de abajo es para rellenar el select de usuarios en el formulario de añadir matrícula, mostrando solo los usuarios activos que no sean administradores.
const selectUsuario = document.getElementById("usuario");

if (selectUsuario) {
    for (let i = 0; i < usuarios.length; i++) {
        const user = usuarios[i];

        if (user.activo && user.rol !== "administrador") {
            const opcion = document.createElement("option");
            opcion.value = user.id;
            opcion.textContent = `${user.nombre} ${user.apellido || ""}`.trim();
            selectUsuario.appendChild(opcion);
        }
    }
}
//y esto para rellenar el select de cursos en el formulario de añadir matrícula, mostrando solo los cursos activos.
const selectCurso = document.getElementById("curso");
if (selectCurso) {
    for (let i = 0; i < cursos.length; i++) {
        const curso = cursos[i];

        if (curso.estado) {
            const opcion = document.createElement("option");
            opcion.value = curso.id;
            opcion.textContent = `${curso.nombre}`.trim();
            selectCurso.appendChild(opcion);
        }
    }
}


const formularioAnyadirMatricula = document.getElementById("anyadir_matricula");
if (formularioAnyadirMatricula &&
    document.getElementById("usuario") &&
    document.getElementById("curso")) {
    formularioAnyadirMatricula.addEventListener("submit", event => {
        event.preventDefault();
        const id_usuario = Number(document.getElementById("usuario").value);
        const id_curso = Number(document.getElementById("curso").value);
        const usuario = usuarios.find(usuarioActual =>
            usuarioActual.id === id_usuario && usuarioActual.activo
        );
        const curso = cursos.find(cursoActual =>
            cursoActual.id === id_curso && cursoActual.estado
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
            matricula.activo
        )) {
            alert("Ese usuario ya está matriculado en ese curso.");
            return;
        }
        if(usuario.rol === "administrador"){
            alert("No se puede matricular a un administrador en un curso.");
            return;
        }

        matriculas.push({
            id: matriculas.reduce((mayorId, matricula) => Math.max(mayorId, matricula.id), -1) + 1,
            id_usuario: id_usuario,
            id_curso: id_curso,
            fecha_matricula: new Date().toLocaleDateString("es-ES"),
            activo: true
        });
        localStorage.setItem("matriculas", JSON.stringify(matriculas));
        window.location.href = "../gestiones_administrador/gestion_matriculas.html";
    });
}

const formularioEliminarMatricula = document.getElementById("eliminar_matricula");
if (formularioEliminarMatricula) {
    formularioEliminarMatricula.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("matricula").value);
        const matricula = matriculas.find(matriculaActual =>
            matriculaActual.id === id && matriculaActual.activo
        );

        if (!Number.isInteger(id) || !matricula) {
            alert("No existe ninguna matrícula activa con ese ID.");
            return;
        }

        matricula.activo = false;
        localStorage.setItem("matriculas", JSON.stringify(matriculas));
        window.location.href = "../gestiones_administrador/gestion_matriculas.html";
    });
}

const formularioModificarMatricula = document.getElementById("modificar_matricula");
if (formularioModificarMatricula) {
    formularioModificarMatricula.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("matricula").value);
        const matricula = matriculas.find(matriculaActual =>
            matriculaActual.id === id && matriculaActual.activo
        );

        if (!Number.isInteger(id) || !matricula) {
            alert("No existe ninguna matrícula activa con ese ID.");
            return;
        }

        const idUsuarioIntroducido = document.getElementById("usuario").value;
        const idCursoIntroducido = document.getElementById("curso").value;
        const id_usuario = idUsuarioIntroducido === ""
            ? matricula.id_usuario
            : Number(idUsuarioIntroducido);
        const id_curso = idCursoIntroducido === ""
            ? matricula.id_curso
            : Number(idCursoIntroducido);
        const usuario = usuarios.find(usuarioActual =>
            usuarioActual.id === id_usuario && usuarioActual.activo
        );
        const curso = cursos.find(cursoActual =>
            cursoActual.id === id_curso && cursoActual.estado
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
            matriculaActual.id !== id &&
            matriculaActual.id_usuario === id_usuario &&
            matriculaActual.id_curso === id_curso &&
            matriculaActual.activo
        )) {
            alert("Ese usuario ya está matriculado en ese curso.");
            return;
        }

        matricula.id_usuario = id_usuario;
        matricula.id_curso = id_curso;
        localStorage.setItem("matriculas", JSON.stringify(matriculas));
        window.location.href = "../gestiones_administrador/gestion_matriculas.html";
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
    const matriculasMias = matriculas.filter(matricula => matricula.activo && matricula.id_usuario === usuarioActual.id);
    total.textContent = "Matrículas disponibles: " + matriculasMias.length;

    for (let i = 0; i < matriculasMias.length; i++) {
        const matriculaActual = matriculasMias[i];
        const usuarioId = matriculaActual.id_usuario ?? matriculaActual.id_alumno;
        const usuario = usuarios.find(usuarioActual =>
            Number(usuarioActual.id) === Number(usuarioId)
        );
        const curso = cursos.find(cursoActual =>
            Number(cursoActual.id) === Number(matriculaActual.id_curso)
        );
        const nombreUsuario = usuario
            ? `${usuario.nombre} ${usuario.apellido || ""}`.trim()
            : "Usuario no encontrado";
        const nombreCurso = curso ? curso.nombre : "Curso no encontrado";
        const card = document.createElement("article");
        card.className = "tarjeta";

        card.innerHTML = `
            <h4>Matrícula ${matriculaActual.id}</h4>
            <p><strong>Usuario:</strong> ${nombreUsuario}</p>
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
    const matriculasActivas = matriculas.filter(matricula => matricula.activo);
    total.textContent = "Matrículas disponibles: " + matriculasActivas.length;

    for (let i = 0; i < matriculasActivas.length; i++) {
        const matriculaActual = matriculasActivas[i];
        const usuarioId = matriculaActual.id_usuario ?? matriculaActual.id_alumno;
        const usuario = usuarios.find(usuarioActual =>
            Number(usuarioActual.id) === Number(usuarioId)
        );
        const curso = cursos.find(cursoActual =>
            Number(cursoActual.id) === Number(matriculaActual.id_curso)
        );
        const nombreUsuario = usuario
            ? `${usuario.nombre} ${usuario.apellido || ""}`.trim()
            : "Usuario no encontrado";
        const nombreCurso = curso ? curso.nombre : "Curso no encontrado";
        const card = document.createElement("article");
        card.className = "tarjeta";

        card.innerHTML = `
            <h4>Matrícula ${matriculaActual.id}</h4>
            <p><strong>Usuario:</strong> ${nombreUsuario}</p>
            <p><strong>Id del usuario:</strong> ${usuarioId}</p>
            <p><strong>Curso:</strong> ${nombreCurso}</p>
            <p><strong>Id del curso:</strong> ${matriculaActual.id_curso}</p>
            <p><strong>Fecha de matrícula:</strong> ${matriculaActual.fecha_matricula || "No disponible"}</p>
        `;

        
        let button = null;
        button = document.createElement("button");
        button.textContent = "Editar";
        button.addEventListener("click", () => {
            window.location.href = `../crud/modificar_matricula.html?id=${matriculaActual.id}`;  
        });

        card.appendChild(button);
        fragmento.appendChild(card);
    }

    contenedorTarjetas.replaceChildren(fragmento);
    contenedorTarjetas.prepend(titulo, total);
}

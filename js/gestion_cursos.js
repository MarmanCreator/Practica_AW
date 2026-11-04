

const cursosGuardados = localStorage.getItem("cursos");

const cursos = cursosGuardados
    ? JSON.parse(cursosGuardados)
    : [

    {
        id: 0,
        nombre: "Aplicaciones Web",
        categoria: "Desarrollo web",
        duracion: "3", // Duración en meses
        descripcion: "Aprende a desarrollar aplicaciones web modernas utilizando HTML, CSS y JavaScript.",
        plazas: 20
    },
    {
        id: 1,
        nombre: "Gestion de proyectos software",
        categoria: "Gestión de proyectos",
        duracion: "4", // Duración en meses
        descripcion: "Aprende a gestionar proyectos de desarrollo de software utilizando metodologías ágiles y herramientas de gestión.",
        plazas: 2
    },
    {
        id: 2,
        nombre: "Fundamentos de algoritmia",
        categoria: "Programación",
        duracion: "2", // Duración en meses
        descripcion: "Aprende los conceptos básicos de algoritmia y estructuras de datos para resolver problemas de programación.",
        plazas: 0
    }
];

cursos.forEach(curso => {
    if (typeof curso.activo !== "boolean") curso.activo = true;
});
localStorage.setItem("cursos", JSON.stringify(cursos));

function mostrarCursos() {
    const tablaCursos = document.getElementById("tabla-cursos");
    tablaCursos.innerHTML = "";
    cursos.filter(curso => curso.activo).forEach(curso => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${curso.id}</td>
            <td>${curso.nombre}</td>
            <td>${curso.categoria}</td>
            <td>${curso.duracion}</td>
            <td>${curso.descripcion}</td>
            <td>${curso.plazas}</td>
        `;
        tablaCursos.appendChild(fila);
    });
}

const formulario_anyadir_curso = document.getElementById("añadir_curso");
if (formulario_anyadir_curso) {
    formulario_anyadir_curso.addEventListener("submit", function (event) {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const categoria = document.getElementById("categoría").value;
        const duracion = document.getElementById("duracion").value;
        const descripcion = document.getElementById("descripcion").value;
        const plazas = document.getElementById("plazas").value;
        AnyadirCurso(nombre, categoria, duracion, descripcion, plazas);
        localStorage.setItem("cursos", JSON.stringify(cursos));
        window.location.href = "../gestiones_administrador/gestion_cursos.html";
    });
}
function AnyadirCurso(nombre, categoria, duracion, descripcion, plazas) {
    const nuevoCurso = {
        id: cursos.reduce((mayorId, curso) => Math.max(mayorId, curso.id), 0) + 1,
        nombre: nombre,
        categoria: categoria,
        duracion: duracion,
        descripcion: descripcion,
        plazas: plazas,
        activo: true
    };
    cursos.push(nuevoCurso);
}

const formulario_eliminar_curso = document.getElementById("eliminar_curso");
if (formulario_eliminar_curso) {
    formulario_eliminar_curso.addEventListener("submit", function (event) {
        event.preventDefault();
        const id = Number(document.getElementById("id_curso").value);
        const cursoExiste = cursos.some(curso => curso.id === id && curso.activo);

        if (!Number.isInteger(id) || !cursoExiste) {
            alert("No existe ningún curso con ese ID.");
            return;
        }
        EliminarCurso(id);
        localStorage.setItem("cursos", JSON.stringify(cursos));
        window.location.href = "../gestiones_administrador/gestion_cursos.html";

    });
}
function EliminarCurso(id) {
    const curso = cursos.find(cursoActual => cursoActual.id === id && cursoActual.activo);
    if (curso) {
        curso.activo = false;
    }
}

const formulario_modificar_curso = document.getElementById("modificar_curso");
if (formulario_modificar_curso) {
    formulario_modificar_curso.addEventListener("submit", function (event) {
        event.preventDefault();
        const id = Number(document.getElementById("id_curso").value);
        const cursoExiste = cursos.some(curso => curso.id === id && curso.activo);
        if (!Number.isInteger(id) || !cursoExiste) {
            alert("No existe ningún curso con ese ID.");
            return;
        }
        let nombre = cursos.find(curso => curso.id === id).nombre;
        if(document.getElementById("nombre").value !== "") {
            nombre = document.getElementById("nombre").value;
        }
        let categoria = cursos.find(curso => curso.id === id).categoria;
        if(document.getElementById("categoría").value !== "") {
            categoria = document.getElementById("categoría").value;
        }
        let duracion = cursos.find(curso => curso.id === id).duracion;
        if(document.getElementById("duracion").value !== "") {
            duracion = document.getElementById("duracion").value;
        }
        let descripcion = cursos.find(curso => curso.id === id).descripcion;
        if(document.getElementById("descripcion").value !== "") {
            descripcion = document.getElementById("descripcion").value;
        }
        let plazas = cursos.find(curso => curso.id === id).plazas;
        if(document.getElementById("plazas").value !== "") {
            plazas = Number(document.getElementById("plazas").value);
        }
        modificarCurso(id, nombre, categoria, duracion, descripcion, plazas);
        localStorage.setItem("cursos", JSON.stringify(cursos));
        window.location.href = "../gestiones_administrador/gestion_cursos.html";

    });
}
function modificarCurso(id, nombre, categoria, duracion, descripcion, plazas) {
    const curso = cursos.find(curso => curso.id === id);
    if (curso) {
        curso.nombre = nombre;
        curso.categoria = categoria;
        curso.duracion = duracion;
        curso.descripcion = descripcion;
        curso.plazas = plazas;
    }
}
    

const contenedorTarjetas = document.querySelector('.tarjetas');

if (contenedorTarjetas) {
    const fragmento = document.createDocumentFragment();

    const tituloCursos = document.createElement('h3');
    tituloCursos.textContent = 'Cursos disponibles';

    const totalCursos = document.createElement('p');
    totalCursos.className = 'total-cursos';
    const cursosActivos = cursos.filter(curso => curso.activo);
    totalCursos.textContent = 'Cursos disponibles: ' + cursosActivos.length;

    for (let i = 0; i < cursosActivos.length; i++) {
        const cursoActual = cursosActivos[i];
        const card = document.createElement('article');
        card.className = 'tarjeta';

        card.innerHTML = `
            <h4>${cursoActual.nombre}</h4>
            <p><strong>Id:</strong> ${cursoActual.id}</p>
            <p><strong>Categoría:</strong> ${cursoActual.categoria}</p>
            <p><strong>Duración:</strong> ${cursoActual.duracion} meses</p>
            <p>${cursoActual.descripcion}</p>
            <p><strong>Plazas disponibles:</strong> ${cursoActual.plazas}</p>
        `;

        fragmento.appendChild(card);
    }

    contenedorTarjetas.replaceChildren(fragmento);
    contenedorTarjetas.prepend(tituloCursos, totalCursos);
}

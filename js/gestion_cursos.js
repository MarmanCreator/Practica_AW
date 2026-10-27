

const cursos = [

    {
        id: 1,
        nombre: "Aplicaciones Web",
        categoria: "Desarrollo web",
        duracion: "3", // Duración en meses
        descripcion: "Aprende a desarrollar aplicaciones web modernas utilizando HTML, CSS y JavaScript.",
        plazas: 20
    },
    {
        id: 2,
        nombre: "Gestion de proyectos software",
        categoria: "Gestión de proyectos",
        duracion: "4", // Duración en meses
        descripcion: "Aprende a gestionar proyectos de desarrollo de software utilizando metodologías ágiles y herramientas de gestión.",
        plazas: 2
    },
    {
        id: 3,
        nombre: "Fundamentos de algoritmia",
        categoria: "Programación",
        duracion: "2", // Duración en meses
        descripcion: "Aprende los conceptos básicos de algoritmia y estructuras de datos para resolver problemas de programación.",
        plazas: 0
    }
];

function mostrarCursos() {
    const tablaCursos = document.getElementById("tabla-cursos");
    tablaCursos.innerHTML = "";
    cursos.forEach(curso => {
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

function AnyadirCurso(nombre, categoria, duracion, descripcion, plazas) {
    const nuevoCurso = {
        id: cursos.length + 1,
        nombre: nombre,
        categoria: categoria,
        duracion: duracion,
        descripcion: descripcion,
        plazas: plazas
    };
    cursos.push(nuevoCurso);
}

function EliminarCurso(id) {
    const index = cursos.findIndex(curso => curso.id === id);
    if (index !== -1) {
        cursos.splice(index, 1);
    }
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
    

const contenedorTarjetas = document.querySelector('.tarjetas-cursos');

if (contenedorTarjetas) {
    const fragmento = document.createDocumentFragment();

    const tituloCursos = document.createElement('h3');
    tituloCursos.textContent = 'Cursos disponibles';

    const totalCursos = document.createElement('p');
    totalCursos.className = 'total-cursos';
    totalCursos.textContent = 'Cursos disponibles: ' + cursos.length;

    for (let i = 0; i < cursos.length; i++) {
        const cursoActual = cursos[i];
        const card = document.createElement('article');
        card.className = 'curso';

        card.innerHTML = `
            <h4>${cursoActual.nombre}</h4>
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

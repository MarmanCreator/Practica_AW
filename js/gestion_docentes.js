const docentesGuardados = localStorage.getItem("docentes");

const docentes = docentesGuardados
    ? JSON.parse(docentesGuardados)
    : [
        {
            id: 0,
            nombre: "Marcos",
            apellido: "García",
            especialidad: "Matemáticas",
            email: "garcia@example.com",
            telefono: "123456789",
            activo: true
        },
        {
            id: 1,
            nombre: "Pepe",
            apellido: "López",
            especialidad: "Física",
            email: "lopez@example.com",
            telefono: "987654321",
            activo: true
        },
        {
            id: 2,
            nombre: "Antonio",
            apellido: "Martínez",
            especialidad: "Química",
            email: "martinez@example.com",
            telefono: "555555555",
            activo: true
        }
    ];


const formularioAnyadirDocente = document.getElementById("añadir_docente");
if (formularioAnyadirDocente) {
    formularioAnyadirDocente.addEventListener("submit", event => {
        event.preventDefault();
        docentes.push({
            id: docentes.reduce((mayorId, docente) => Math.max(mayorId, docente.id), -1) + 1,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            especialidad: document.getElementById("especialidad").value,
            email: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value,
            activo: true
        });
        localStorage.setItem("docentes", JSON.stringify(docentes));
        window.location.href = "../gestiones_administrador/gestion_docentes.html";
    });
}

const formularioEliminarDocente = document.getElementById("eliminar_docente");
if (formularioEliminarDocente) {
    formularioEliminarDocente.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("id_docente").value);
        const docente = docentes.find(docenteActual => docenteActual.id === id);

        if (!Number.isInteger(id) || !docente || !docente.activo) {
            alert("No existe ningún docente con ese ID.");
            return;
        }

        docente.activo = false;
        localStorage.setItem("docentes", JSON.stringify(docentes));
        window.location.href = "../gestiones_administrador/gestion_docentes.html";
    });
}

const formularioModificarDocente = document.getElementById("modificar_docente");
if (formularioModificarDocente) {
    formularioModificarDocente.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("id_docente").value);
        const docente = docentes.find(docenteActual => docenteActual.id === id && docenteActual.activo);

        if (!Number.isInteger(id) || !docente) {
            alert("No existe ningún docente con ese ID.");
            return;
        }

        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const especialidad = document.getElementById("especialidad").value;
        const email = document.getElementById("email").value;
        const telefono = document.getElementById("telefono").value;

        if (nombre !== "") docente.nombre = nombre;
        if (apellido !== "") docente.apellido = apellido;
        if (especialidad !== "") docente.especialidad = especialidad;
        if (email !== "") docente.email = email;
        if (telefono !== "") docente.telefono = telefono;

        localStorage.setItem("docentes", JSON.stringify(docentes));
        window.location.href = "../gestiones_administrador/gestion_docentes.html";
    });
}

const contenedorTarjetas = document.querySelector(".tarjetas");
if (contenedorTarjetas) {

    const fragmento = document.createDocumentFragment();

    const titulo = document.createElement("h3");
    titulo.textContent = "Docentes disponibles";

    const total = document.createElement("p");
    total.className = "total-cursos";
    total.id = "total-docentes";
    const docentesActivos = docentes.filter(docente => docente.activo);
    total.textContent = "Docentes disponibles: " + docentesActivos.length;

    for (let i = 0; i < docentesActivos.length; i++) {
        const docenteActual = docentesActivos[i];
        const card = document.createElement('article');
        card.className = 'tarjeta';

        card.innerHTML = `
            <h4>${docenteActual.nombre} ${docenteActual.apellido}</h4>
            <p><strong>Id:</strong> ${docenteActual.id}</p>
            <p><strong>Especialidad:</strong> ${docenteActual.especialidad}</p>
            <p><strong>Email:</strong> ${docenteActual.email}</p>
            <p><strong>Teléfono:</strong> ${docenteActual.telefono}</p>
        `;

        fragmento.appendChild(card);
    }

    contenedorTarjetas.replaceChildren(fragmento);
    contenedorTarjetas.prepend(titulo, total);
}

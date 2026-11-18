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

localStorage.setItem("docentes", JSON.stringify(docentes));

const selectDocente = document.getElementById("id_docente");

if (selectDocente) {
    for (let i = 0; i < docentes.length; i++) {
        const doc = docentes[i];

        if (doc.activo) {
            const opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.textContent = `${doc.nombre} ${doc.apellido || ""}`.trim();
            selectDocente.appendChild(opcion);
        }
    }
}

const formularioAnyadirDocente = document.getElementById("añadir_docente");
if (formularioAnyadirDocente) {
    formularioAnyadirDocente.addEventListener("submit", event => {
        event.preventDefault();
        
        const nombre = sanitizarEntrada(document.getElementById("nombre").value.trim());
        const apellido = sanitizarEntrada(document.getElementById("apellido").value.trim());
        const especialidad = sanitizarEntrada(document.getElementById("especialidad").value.trim()); 
        const email = sanitizarEntrada(document.getElementById("email").value.trim());
        const telefono = document.getElementById("telefono").value.trim();

        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const regexTelefono = /^[\d\s]+$/; 
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 

        if (!regexLetras.test(nombre) || !regexLetras.test(apellido) || !regexLetras.test(especialidad)) {
            alert("Error: En los campos de nombre, apellido y especialidad solo están permitidos letras y espacios.");
            return;
        }

        if (!regexEmail.test(email) || !regexTelefono.test(telefono)) {
            alert("Error: El formato del correo electrónico o del teléfono no es válido.");
            return;
        }

        docentes.push({
            id: docentes.reduce((mayorId, docente) => Math.max(mayorId, docente.id), -1) + 1,
            nombre: nombre,
            apellido: apellido,
            especialidad: especialidad, 
            email: email,
            telefono: telefono,
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
        const idIntroducido = document.getElementById("id_docente").value.trim();
        const nombreIntroducido = sanitizarEntrada(document.getElementById("nombre").value.trim());
        const apellidoIntroducido = sanitizarEntrada(document.getElementById("apellido").value.trim());
        const especialidadIntroducida = sanitizarEntrada(document.getElementById("especialidad").value.trim());
        const emailIntroducido = sanitizarEntrada(document.getElementById("email").value.trim());
        const telefonoIntroducido = document.getElementById("telefono").value.trim();

        const regexNumeros = /^\d+$/;
        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const regexTelefono = /^[\d\s]+$/;
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if ((nombreIntroducido !== "" && !regexLetras.test(nombreIntroducido)) || 
            (apellidoIntroducido !== "" && !regexLetras.test(apellidoIntroducido)) || 
            (especialidadIntroducida !== "" && !regexLetras.test(especialidadIntroducida))) {
            alert("Error: En los campos de nombre, apellido y especialidad solo están permitidos letras y espacios.");
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

        
        if (nombreIntroducido !== "") docente.nombre = nombreIntroducido;
        if (apellidoIntroducido !== "") docente.apellido = apellidoIntroducido;
        if (especialidadIntroducida !== "") docente.especialidad = especialidadIntroducida;
        if (emailIntroducido !== "") docente.email = emailIntroducido;
        if (telefonoIntroducido !== "") docente.telefono = telefonoIntroducido;

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

function sanitizarEntrada(texto) {
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
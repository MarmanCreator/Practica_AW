const docentesGuardados = localStorage.getItem("docentes");

const docentes = docentesGuardados
    ? JSON.parse(docentesGuardados).map(normalizarDocente)
    : [
        {
            id_docente: 0,
            nombre: "Marcos García",
            especialidad: "Matemáticas",
            email: "garcia@example.com",
            telefono: "123456789",
            foto: "",
            activo: 1
        },
        {
            id_docente: 1,
            nombre: "Pepe López",
            especialidad: "Física",
            email: "lopez@example.com",
            telefono: "987654321",
            foto: "",
            activo: 1
        },
        {
            id_docente: 2,
            nombre: "Antonio Martínez",
            especialidad: "Química",
            email: "martinez@example.com",
            telefono: "555555555",
            foto: "",
            activo: 1
        }
    ];

localStorage.setItem("docentes", JSON.stringify(docentes));

const selectDocente = document.getElementById("id_docente");

if (selectDocente) {
    for (let i = 0; i < docentes.length; i++) {
        const doc = docentes[i];

        if (esActivo(doc)) {
            const opcion = document.createElement("option");
            opcion.value = doc.id_docente;
            opcion.textContent = `${doc.nombre}`.trim();
            selectDocente.appendChild(opcion);
        }
    }
}

const formularioAnyadirDocente = document.getElementById("añadir_docente");
if (formularioAnyadirDocente) {
    formularioAnyadirDocente.addEventListener("submit", event => {
        event.preventDefault();
        
       // 1. LECTURA Y SANITIZACIÓN
        const nombre = sanitizarEntrada(document.getElementById("nombre").value.trim());
        const especialidad = sanitizarEntrada(document.getElementById("especialidad").value.trim()); 
        const email = sanitizarEntrada(document.getElementById("email").value.trim());
        const telefono = document.getElementById("telefono").value.trim();

        // 2. VALIDACIONES DE SEGURIDAD (REGEX)
        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const regexTelefono = /^[\d\s]+$/; 
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 

        // Agrupamos la validación de todos los campos de texto
        if (!regexLetras.test(nombre) || !regexLetras.test(especialidad)) {
            alert("Error: En los campos de nombre y especialidad solo están permitidos letras y espacios.");
            return;
        }

        // Agrupamos la validación de los datos de contacto
        if (!regexEmail.test(email) || !regexTelefono.test(telefono)) {
            alert("Error: El formato del correo electrónico o del teléfono no es válido.");
            return;
        }

        // 3. EJECUCIÓN (Solo si ha superado todos los return anteriores)
        docentes.push({
            id_docente: docentes.reduce((mayorId, docente) => Math.max(mayorId, docente.id_docente), -1) + 1,
            nombre: nombre,
            especialidad: especialidad, 
            email: email,
            telefono: telefono,
            foto: "",
            activo: 1
        });

        localStorage.setItem("docentes", JSON.stringify(docentes));
        window.location.href = "/gestiones_administrador/gestion_docentes.html";
    });
}

const formularioEliminarDocente = document.getElementById("eliminar_docente");
if (formularioEliminarDocente) {
    formularioEliminarDocente.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("id_docente").value);
        const docente = docentes.find(docenteActual => docenteActual.id_docente === id);

        if (!Number.isInteger(id) || !docente || !esActivo(docente)) {
            alert("No existe ningún docente con ese ID.");
            return;
        }

        docente.activo = 0;
        localStorage.setItem("docentes", JSON.stringify(docentes));
        window.location.href = "/gestiones_administrador/gestion_docentes.html";
    });
}

const formularioModificarDocente = document.getElementById("modificar_docente");
if (formularioModificarDocente) {
    formularioModificarDocente.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("id_docente").value);
        const docente = docentes.find(docenteActual => docenteActual.id_docente === id && esActivo(docenteActual));

        if (!Number.isInteger(id) || !docente) {
            alert("No existe ningún docente con ese ID.");
            return;
        }
        // 1. LECTURA Y SANITIZACIÓN
        const nombreIntroducido = sanitizarEntrada(document.getElementById("nombre").value.trim());
        const especialidadIntroducida = sanitizarEntrada(document.getElementById("especialidad").value.trim());
        const emailIntroducido = sanitizarEntrada(document.getElementById("email").value.trim());
        const telefonoIntroducido = document.getElementById("telefono").value.trim();
        const fotoIntroducida = sanitizarEntrada(document.getElementById("foto").value.trim());
        const limpiarFoto = document.getElementById("limpiar_foto").checked;

        // 2. VALIDACIONES DE SEGURIDAD (REGEX)
        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const regexTelefono = /^[\d\s]+$/;
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Comprobación de campos de texto agrupados (Solo si han escrito algo nuevo)
        if ((nombreIntroducido !== "" && !regexLetras.test(nombreIntroducido)) ||
            (especialidadIntroducida !== "" && !regexLetras.test(especialidadIntroducida))) {
            alert("Error: En los campos de nombre y especialidad solo están permitidos letras y espacios.");
            return;
        }

        // Comprobación de datos de contacto (Solo si han escrito algo nuevo)
        if (emailIntroducido !== "" && !regexEmail.test(emailIntroducido)) {
            alert("Error: El formato del correo electrónico no es válido.");
            return;
        }

        if (telefonoIntroducido !== "" && !regexTelefono.test(telefonoIntroducido)) {
            alert("Error: El teléfono solo puede contener números y espacios.");
            return;
        }

        
        if (nombreIntroducido !== "") docente.nombre = nombreIntroducido;
        if (especialidadIntroducida !== "") docente.especialidad = especialidadIntroducida;
        if (emailIntroducido !== "") docente.email = emailIntroducido;
        if (telefonoIntroducido !== "") docente.telefono = telefonoIntroducido;
        if (fotoIntroducida !== "") docente.foto = fotoIntroducida;
        else if (limpiarFoto) docente.foto = "";

        localStorage.setItem("docentes", JSON.stringify(docentes));
        window.location.href = "/gestiones_administrador/gestion_docentes.html";
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
    const docentesActivos = docentes.filter(esActivo);
    total.textContent = "Docentes disponibles: " + docentesActivos.length;

    for (let i = 0; i < docentesActivos.length; i++) {
        const docenteActual = docentesActivos[i];
        const card = document.createElement('article');
        card.className = 'tarjeta';
        const foto = docenteActual.foto
            ? `<img src="${sanitizarEntrada(docenteActual.foto)}" alt="Foto de ${sanitizarEntrada(docenteActual.nombre)}">`
            : "";

        card.innerHTML = `
            ${foto}
            <h4>${sanitizarEntrada(docenteActual.nombre)}</h4>
            <p><strong>Id:</strong> ${sanitizarEntrada(docenteActual.id_docente)}</p>
            <p><strong>Especialidad:</strong> ${sanitizarEntrada(docenteActual.especialidad)}</p>
            <p><strong>Email:</strong> ${sanitizarEntrada(docenteActual.email)}</p>
            <p><strong>Teléfono:</strong> ${sanitizarEntrada(docenteActual.telefono)}</p>
        `;

        fragmento.appendChild(card);
    }

    contenedorTarjetas.replaceChildren(fragmento);
    contenedorTarjetas.prepend(titulo, total);
}

// Función para neutralizar etiquetas HTML y evitar inyecciones XSS
function sanitizarEntrada(texto) {
    return String(texto)
        .replace(/&(?!(amp|lt|gt|quot|#039);)/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function normalizarDocente(docente) {
    const nombre = docente.apellido
        ? `${docente.nombre} ${docente.apellido}`.trim()
        : docente.nombre;

    return {
        id_docente: Number(docente.id_docente !== undefined ? docente.id_docente : docente.id),
        nombre: nombre,
        email: docente.email,
        especialidad: docente.especialidad,
        telefono: docente.telefono,
        foto: docente.foto || "",
        activo: Number(docente.activo) === 0 ? 0 : 1
    };
}

function esActivo(docente) {
    return Number(docente.activo) === 1;
}
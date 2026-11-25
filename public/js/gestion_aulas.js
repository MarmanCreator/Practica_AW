const aulasGuardadas = localStorage.getItem("aulas");

const aulas = aulasGuardadas
    ? JSON.parse(aulasGuardadas)
    : [
        {
            id_aula: 1,
            nombre: "Aula Informática",
            edificio: "1",
            planta: "1",
            capacidad: 40,
            equipamiento: "",
            estado: "activa"
        },
        {
            id_aula: 2,
            nombre: "Aula Estudio",
            edificio: "1",
            planta: "3",
            capacidad: 80,
            equipamiento: "",
            estado: "activa"
        },
        {
            id_aula: 3,
            nombre: "Aula Trabajos en Grupo",
            edificio: "2",
            planta: "3",
            capacidad: 40,
            equipamiento: "",
            estado: "activa"
        }
    ];
localStorage.setItem("aulas", JSON.stringify(aulas));


const selectAula = document.getElementById("id_aula");

if (selectAula) {
    for (let i = 0; i < aulas.length; i++) {
        const aula = aulas[i];
        if (aula.estado !== "activa") continue;
        const opcion = document.createElement("option");
        opcion.value = aula.id_aula;
        opcion.textContent = `${aula.nombre}`.trim();
        selectAula.appendChild(opcion);
    }
}


const formulario_anyadir_aula = document.getElementById("anyadir_aula");
if (formulario_anyadir_aula) {
    formulario_anyadir_aula.addEventListener("submit", event => {
        event.preventDefault();

        // 1. LECTURA Y SANITIZACIÓN
        const nombre = sanitizarEntrada(document.getElementById("nombre").value.trim());
        const edificio = sanitizarEntrada(document.getElementById("edificio").value.trim());
        const planta = sanitizarEntrada(document.getElementById("planta").value.trim());
        const capacidadInput = document.getElementById("capacidad").value.trim();
        const equipamiento = sanitizarEntrada(document.getElementById("equipamiento").value.trim());

        // 2. VALIDACIONES DE SEGURIDAD (REGEX)
        // Letras, números y espacios (ej: "Aula 101", "Edificio B")
        const regexAlfanumerico = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/; 
        // Solo números enteros positivos
        const regexCapacidad = /^\d+$/; 

        if (!regexAlfanumerico.test(nombre) || !regexAlfanumerico.test(edificio)) {
            alert("Error: El nombre y el edificio solo pueden contener letras, números y espacios.");
            return;
        }

        if (!planta) {
            alert("Debes indicar la planta del aula.");
            return;
        }

        if (!regexCapacidad.test(capacidadInput) || Number(capacidadInput) <= 0) {
            alert("Error: La capacidad debe ser un número entero positivo mayor que cero.");
            return;
        }

        // 3. EJECUCIÓN (Solo si supera las validaciones)
        aulas.push({
            id_aula: aulas.reduce((mayorId, aula) => Math.max(mayorId, aula.id_aula), 0) + 1,
            nombre: nombre,
            edificio: edificio,
            planta: planta,
            capacidad: Number(capacidadInput),
            equipamiento: equipamiento,
            estado: "activa"
        });

        localStorage.setItem("aulas", JSON.stringify(aulas));
        window.location.href = "/gestiones_administrador/gestion_aulas.html";
    });
}

const formulario_eliminar_aula = document.getElementById("eliminar_aula");
if (formulario_eliminar_aula) {
    formulario_eliminar_aula.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("id_aula").value);
        const aula = aulas.find(aulaActual => aulaActual.id_aula === id);

        if (!Number.isInteger(id) || !aula || aula.estado !== "activa") {
            alert("No existe ningún aula con ese ID.");
            return;
        }

        aula.estado = "inactiva";
        localStorage.setItem("aulas", JSON.stringify(aulas));
        window.location.href = "/gestiones_administrador/gestion_aulas.html";
    });
}

const formulario_modificar_aula = document.getElementById("modificar_aula");
if (formulario_modificar_aula) {
    formulario_modificar_aula.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("id_aula").value);
        const aula = aulas.find(aulaActual => aulaActual.id_aula === id && aulaActual.estado === "activa");

        if (!Number.isInteger(id) || !aula) {
            alert("No existe ningún aula con ese ID.");
            return;
        }

        // 1. LECTURA Y SANITIZACIÓN
        const nombreIntroducido = sanitizarEntrada(document.getElementById("nombre").value.trim());
        const edificioIntroducido = sanitizarEntrada(document.getElementById("edificio").value.trim());
        const plantaIntroducida = sanitizarEntrada(document.getElementById("planta").value.trim());
        const capacidadIntroducida = document.getElementById("capacidad").value.trim();
        const equipamientoIntroducido = sanitizarEntrada(document.getElementById("equipamiento").value.trim());
        const limpiarEquipamiento = document.getElementById("limpiar_equipamiento").checked;

        // 2. VALIDACIONES DE SEGURIDAD (REGEX)
        const regexNumeros = /^\d+$/; 
        const regexAlfanumerico = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/; 

        // Comprobación de campos de texto (Solo si han escrito algo nuevo)
        if ((nombreIntroducido !== "" && !regexAlfanumerico.test(nombreIntroducido)) || 
            (edificioIntroducido !== "" && !regexAlfanumerico.test(edificioIntroducido))) {
            alert("Error: El nombre y el edificio solo pueden contener letras, números y espacios.");
            return; 
        }

        if (capacidadIntroducida !== "") {
            if (!regexNumeros.test(capacidadIntroducida) || Number(capacidadIntroducida) <= 0) {
                alert("Error: La capacidad debe ser un número entero positivo mayor que cero.");
                return;
            }
        }
        
        if (nombreIntroducido !== "") aula.nombre = nombreIntroducido;
        if (edificioIntroducido !== "") aula.edificio = edificioIntroducido;
        if (plantaIntroducida !== "") aula.planta = plantaIntroducida;
        if (capacidadIntroducida !== "") aula.capacidad = Number(capacidadIntroducida); 
        if (equipamientoIntroducido !== "") aula.equipamiento = equipamientoIntroducido;
        else if (limpiarEquipamiento) aula.equipamiento = "";

        localStorage.setItem("aulas", JSON.stringify(aulas));
        window.location.href = "/gestiones_administrador/gestion_aulas.html";
    });
}

const contenedorTarjetas = document.querySelector(".tarjetas");
if (contenedorTarjetas) {
    const fragmento = document.createDocumentFragment();

    const titulo = document.createElement("h3");
    titulo.textContent = "Aulas disponibles";

    const total = document.createElement("p");
    total.className = "total-cursos";
    
    const aulasActivas = aulas.filter(aula => aula.estado === "activa");
    total.textContent = "Aulas disponibles: " + aulasActivas.length;

    for (let i = 0; i < aulasActivas.length; i++) {
        const aulaActual = aulasActivas[i];
        const card = document.createElement('article');
        card.className = 'tarjeta';
        const nombre = sanitizarEntrada(aulaActual.nombre);
        const idAula = sanitizarEntrada(aulaActual.id_aula);
        const edificio = sanitizarEntrada(aulaActual.edificio);
        const planta = sanitizarEntrada(aulaActual.planta);
        const capacidad = sanitizarEntrada(aulaActual.capacidad);
        const equipamiento = sanitizarEntrada(aulaActual.equipamiento || "No especificado");

        card.innerHTML = `
            <h4>${nombre}</h4>
            <p><strong>Id:</strong> ${idAula}</p>
            <p><strong>Edificio:</strong> ${edificio}</p>
            <p><strong>Planta:</strong> ${planta}</p>
            <p><strong>Capacidad:</strong> ${capacidad}</p>
            <p><strong>Equipamiento:</strong> ${equipamiento}</p>
        `;

        fragmento.appendChild(card);
    }

    contenedorTarjetas.replaceChildren(fragmento);
    contenedorTarjetas.prepend(titulo, total);
}

function sanitizarEntrada(texto) {
    return String(texto)
        .replace(/&(?!(amp|lt|gt|quot|#039);)/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


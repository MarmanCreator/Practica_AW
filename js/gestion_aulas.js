const aulasGuardadas = localStorage.getItem("aulas");

const aulas = aulasGuardadas
    ? JSON.parse(aulasGuardadas)
    : [
        {
            id: 0,
            nombre: "Aula Informática",
            edificio: "1",
            planta: "1",
            capacidad: 40,
            activo: true
        },
        {
            id: 1,
            nombre: "Aula Estudio",
            edificio: "1",
            planta: "3",
            capacidad: 80,
            activo: true
        },
        {
            id: 2,
            nombre: "Aula Trabajos en Grupo",
            edificio: "2",
            planta: "3",
            capacidad: 40,
            activo: true
        }
    ];
localStorage.setItem("aulas", JSON.stringify(aulas));


const selectAula = document.getElementById("id_aula");

if (selectAula) {
    for (let i = 0; i < aulas.length; i++) {
        const aula = aulas[i];
        const opcion = document.createElement("option");
        opcion.value = aula.id;
        opcion.textContent = `${aula.nombre}`.trim();
        selectAula.appendChild(opcion);
    }
}


const formulario_anyadir_aula = document.getElementById("anyadir_aula");
if (formulario_anyadir_aula) {
    formulario_anyadir_aula.addEventListener("submit", event => {
        event.preventDefault();

        const nombre = sanitizarEntrada(document.getElementById("nombre").value.trim());
        const edificio = sanitizarEntrada(document.getElementById("edificio").value.trim());
        const plantaInput = document.getElementById("planta").value.trim();
        const capacidadInput = document.getElementById("capacidad").value.trim();


        const regexAlfanumerico = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/; 
        const regexPlanta = /^-?\d+$/; 
        const regexCapacidad = /^\d+$/; 

        if (!regexAlfanumerico.test(nombre) || !regexAlfanumerico.test(edificio)) {
            alert("Error: El nombre y el edificio solo pueden contener letras, números y espacios.");
            return;
        }

        if (!regexPlanta.test(plantaInput)) {
            alert("Error: La planta debe ser un número entero (se admiten negativos para sótanos).");
            return;
        }

        if (!regexCapacidad.test(capacidadInput) || Number(capacidadInput) <= 0) {
            alert("Error: La capacidad debe ser un número entero positivo mayor que cero.");
            return;
        }

        aulas.push({
            id: aulas.reduce((mayorId, aula) => Math.max(mayorId, aula.id), -1) + 1,
            nombre: nombre,
            edificio: edificio,
            planta: Number(plantaInput),
            capacidad: Number(capacidadInput),
            activo: true
        });

        localStorage.setItem("aulas", JSON.stringify(aulas));
        window.location.href = "../gestiones_administrador/gestion_aulas.html";
    });
}

const formulario_eliminar_aula = document.getElementById("eliminar_aula");
if (formulario_eliminar_aula) {
    formulario_eliminar_aula.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("id_aula").value);
        const aula = aulas.find(aulaActual => aulaActual.id === id);

        if (!Number.isInteger(id) || !aula || !aula.activo) {
            alert("No existe ningún aula con ese ID.");
            return;
        }

        aula.activo = false;
        localStorage.setItem("aulas", JSON.stringify(aulas));
        window.location.href = "../gestiones_administrador/gestion_aulas.html";
    });
}

const formulario_modificar_aula = document.getElementById("modificar_aula");
if (formulario_modificar_aula) {
    formulario_modificar_aula.addEventListener("submit", event => {
        event.preventDefault();
        const id = Number(document.getElementById("id_aula").value);
        const aula = aulas.find(aulaActual => aulaActual.id === id && aulaActual.activo);

        if (!Number.isInteger(id) || !aula) {
            alert("No existe ningún aula con ese ID.");
            return;
        }

        const nombreIntroducido = sanitizarEntrada(document.getElementById("nombre").value.trim());
        const edificioIntroducido = sanitizarEntrada(document.getElementById("edificio").value.trim());
        const plantaIntroducida = document.getElementById("planta").value.trim();
        const capacidadIntroducida = document.getElementById("capacidad").value.trim();

        const regexNumeros = /^\d+$/; 
        const regexAlfanumerico = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/; 
        const regexPlanta = /^-?\d+$/;

        if ((nombreIntroducido !== "" && !regexAlfanumerico.test(nombreIntroducido)) || 
            (edificioIntroducido !== "" && !regexAlfanumerico.test(edificioIntroducido))) {
            alert("Error: El nombre y el edificio solo pueden contener letras, números y espacios.");
            return; 
        }

        if (plantaIntroducida !== "" && !regexPlanta.test(plantaIntroducida)) {
            alert("Error: La planta debe ser un número entero (se admiten negativos para sótanos).");
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

        localStorage.setItem("aulas", JSON.stringify(aulas));
        window.location.href = "../gestiones_administrador/gestion_aulas.html";
    });
}

const contenedorTarjetas = document.querySelector(".tarjetas");
if (contenedorTarjetas) {
    const fragmento = document.createDocumentFragment();

    const titulo = document.createElement("h3");
    titulo.textContent = "Aulas disponibles";

    const total = document.createElement("p");
    total.className = "total-cursos";
    
    const aulasActivas = aulas.filter(aula => aula.activo);
    total.textContent = "Aulas disponibles: " + aulasActivas.length;

    for (let i = 0; i < aulasActivas.length; i++) {
        const aulaActual = aulasActivas[i];
        const card = document.createElement('article');
        card.className = 'tarjeta';

        card.innerHTML = `
            <h4>${aulaActual.nombre}</h4>
            <p><strong>Id:</strong> ${aulaActual.id}</p>
            <p><strong>Edificio:</strong> ${aulaActual.edificio}</p>
            <p><strong>Planta:</strong> ${aulaActual.planta}</p>
            <p><strong>Capacidad:</strong> ${aulaActual.capacidad}</p>
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
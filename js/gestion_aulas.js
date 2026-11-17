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

const formulario_anyadir_aula = document.getElementById("anyadir_aula");
if (formulario_anyadir_aula) {
    formulario_anyadir_aula.addEventListener("submit", event => {
        event.preventDefault();
        aulas.push({
            id: aulas.reduce((mayorId, aula) => Math.max(mayorId, aula.id), -1) + 1,
            nombre: document.getElementById("nombre").value,
            edificio: document.getElementById("edificio").value,
            planta: Number(document.getElementById("planta").value),
            capacidad: Number(document.getElementById("capacidad").value),
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

        const nombre = document.getElementById("nombre").value;
        const edificio = document.getElementById("edificio").value;
        const planta = document.getElementById("planta").value;
        const capacidad = document.getElementById("capacidad").value;

        if (nombre !== "") aula.nombre = nombre;
        if (edificio !== "") aula.edificio = edificio;
        if (planta !== "") aula.planta = planta;
        if (capacidad !== "") aula.capacidad = Number(capacidad);

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



const cursosGuardados = localStorage.getItem("cursos");

const cursos = cursosGuardados
    ? JSON.parse(cursosGuardados)
    : [

];

const aulasGuardadas = localStorage.getItem("aulas");

const aulas = aulasGuardadas ? JSON.parse(aulasGuardadas): [ ];

const docentesGuardados = localStorage.getItem("docentes");

const docentes = docentesGuardados ? JSON.parse(docentesGuardados): [ ];

function leerImagenComoDataURL(archivo) {
    
    if (!archivo) return Promise.resolve("");

    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => {
            if (typeof lector.result === "string") {
                
                resolve(lector.result);
            } else {
                reject(new Error("No se pudo leer la imagen."));
            }
        };
        lector.onerror = () => reject(new Error("No se pudo leer la imagen."));
        lector.readAsDataURL(archivo);
    });
}


const formulario_anyadir_curso = document.getElementById("añadir_curso");
if (formulario_anyadir_curso) {
    formulario_anyadir_curso.addEventListener("submit", async function (event) { 
        event.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const categoria = document.getElementById("categoría").value;
        const descripcion = document.getElementById("descripcion").value;
        const plazas = document.getElementById("plazas").value;
        const id_aula = document.getElementById("id_aula").value;
        const id_docente = document.getElementById("id_docente").value;
        const dias = [...document.querySelectorAll('input[name="dias"]:checked')]
            .map(dia => dia.value); 
        const hora_inicio = document.getElementById("hora_inicio").value;
        const hora_final = document.getElementById("hora_final").value;
        const fecha_inicio = document.getElementById("fecha_inicio").value;
        const fecha_fin = document.getElementById("fecha_fin").value;
        if (dias.length === 0) {
            alert("Debes seleccionar al menos un día.");
            return;
        }
        if (hora_inicio >= hora_final) {
            alert("La hora de inicio debe ser anterior a la hora final.");
            return;
        }
        if (fecha_inicio >= fecha_fin) {
            alert("La fecha de inicio debe ser anterior a la fecha de finalización.");
            return;
        }
        if (!Number.isInteger(Number(id_aula)) || !Number.isInteger(Number(id_docente))) {
            alert("El ID del aula y el ID del docente deben ser números enteros.");
            return;
        }
        if (!aulas.some(aula => aula.id === Number(id_aula))){
            alert("No existe ningún aula con ese ID.");
            return;
        }
        if (!docentes.some(docente => docente.id === Number(id_docente) && docente.activo)){
            alert("No existe ningún docente con ese ID.");
            return;
        }
        if(!Number.isInteger(Number(plazas)) || Number(plazas) < 0) {
            alert("El número de plazas debe ser un número entero no negativo.");
            return;
        }
        if (cursos.some(curso => curso.nombre.toLowerCase() === nombre.toLowerCase() && curso.estado)) {
            alert("Ya existe un curso con ese nombre y no puede haber 2 cursos con el mismo nombre.");
            return;
        }
        if(cursos.find(curso => curso.id_aula === Number(id_aula) && curso.estado && curso.id_docente === Number(id_docente))) {
            alert("Ya existe un curso en esa aula con ese docente.");
            return;
        }
        if(cursos.find(curso => curso.id_aula === Number(id_aula) && curso.estado && curso.dias.some(dia => dias.includes(dia)) && ((hora_inicio >= curso.hora_inicio && hora_inicio < curso.hora_final) || (hora_final > curso.hora_inicio && hora_final <= curso.hora_final)))) {
            alert("Ya existe un curso en esa aula en ese horario.");
            return;
        }
        let imagen = "";
        try {
            imagen = await leerImagenComoDataURL(document.getElementById("imagen").files[0]);
        } catch (error) {
            alert(error.message);
            return;
        }
        AnyadirCurso(nombre, categoria, descripcion, plazas, id_aula, id_docente, dias, hora_inicio, hora_final, fecha_inicio, fecha_fin, imagen);
        localStorage.setItem("cursos", JSON.stringify(cursos));
        window.location.href = "../gestiones_administrador/gestion_cursos.html";
    });
}
function AnyadirCurso(nombre, categoria, descripcion, plazas, id_aula, id_docente, dias, hora_inicio, hora_final, fecha_inicio, fecha_fin, imagen) {
    const nuevoCurso = {
        id: cursos.reduce((mayorId, curso) => Math.max(mayorId, curso.id), 0) + 1,
        nombre: nombre,
        categoria: categoria,
        descripcion: descripcion,
        plazas: plazas,
        id_aula: Number(id_aula),
        id_docente: Number(id_docente),
        dias: dias,
        hora_inicio: hora_inicio,
        hora_final: hora_final,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        imagen: imagen,
        estado: true
    };
    cursos.push(nuevoCurso);
}

const formulario_eliminar_curso = document.getElementById("eliminar_curso");
if (formulario_eliminar_curso) {
    formulario_eliminar_curso.addEventListener("submit", function (event) {
        event.preventDefault();
        const id = Number(document.getElementById("id_curso").value);
        const cursoExiste = cursos.some(curso => curso.id === id && curso.estado);

        if (!Number.isInteger(id) || !cursoExiste) {
            alert("No existe ningún curso con ese ID.");
            return;
        }
        const curso = cursos.find(cursoActual => cursoActual.id === id && cursoActual.estado);
        if (curso && curso.estado) {
            curso.estado = false;
        }
        else{
            alert("No existe ningún curso con ese ID o ya está eliminado.");
            return;
        }
        localStorage.setItem("cursos", JSON.stringify(cursos));
        window.location.href = "../gestiones_administrador/gestion_cursos.html";

    });
}

const formulario_modificar_curso = document.getElementById("modificar_curso");
if (formulario_modificar_curso) {
    formulario_modificar_curso.addEventListener("submit", async function (event) {
        event.preventDefault();
        const id = Number(document.getElementById("id_curso").value);
        const cursoExiste = cursos.some(curso => curso.id === id && curso.estado);
        if (!Number.isInteger(id) || !cursoExiste) {
            alert("No existe ningún curso con ese ID.");
            return;
        }
        const curso = cursos.find(cursoActual => cursoActual.id === id);
        const nombreIntroducido = document.getElementById("nombre").value.trim();
        
        let nombre = curso.nombre;
        if (nombreIntroducido !== "") {
            if (cursos.some(cursoActual =>
                cursoActual.id !== id &&
                cursoActual.nombre.toLowerCase() === nombreIntroducido.toLowerCase() &&
                cursoActual.estado
            )) {
                alert("Ya existe un curso activo con ese nombre.");
                return;
            }
            nombre = nombreIntroducido;
        }
        let categoria = curso.categoria;
        if (document.getElementById("categoría").value.trim() !== "") {
            categoria = document.getElementById("categoría").value;
        }
        let descripcion = curso.descripcion;
        if (document.getElementById("descripcion").value.trim() !== "") {
            descripcion = document.getElementById("descripcion").value;
        }
        let plazas = curso.plazas;
        const plazasIntroducidas = document.getElementById("plazas").value.trim();
        if (plazasIntroducidas !== "") {
            plazas = Number(plazasIntroducidas);
            if (!Number.isInteger(plazas) || plazas < 0) {
                alert("El número de plazas debe ser un número entero no negativo.");
                return;
            }
        }

        let id_aula = curso.id_aula;
        const idAulaIntroducido = document.getElementById("id_aula").value.trim();
        if (idAulaIntroducido !== "") {
            id_aula = Number(idAulaIntroducido);
            if (!Number.isInteger(id_aula)) {
                alert("El ID del aula debe ser un número entero.");
                return;
            }
            if (!aulas.some(aula => aula.id === id_aula)) {
                alert("No existe ningún aula con ese ID.");
                return;
            }
        }

        let id_docente = curso.id_docente;
        const idDocenteIntroducido = document.getElementById("id_docente").value.trim();
        if (idDocenteIntroducido !== "") {
            id_docente = Number(idDocenteIntroducido);
            if (!Number.isInteger(id_docente)) {
                alert("El ID del docente debe ser un número entero.");
                return;
            }
            if (!docentes.some(docente => docente.id === id_docente && docente.activo)) {
                alert("No existe ningún docente con ese ID.");
                return;
            }
        }

        let dias = curso.dias;
        let hora_inicio = curso.hora_inicio;
        let hora_final = curso.hora_final;
        const diasIntroducidos = [...document.querySelectorAll('input[name="dias"]:checked')]
            .map(dia => dia.value);
        const horaInicioIntroducida = document.getElementById("hora_inicio").value;
        const horaFinalIntroducida = document.getElementById("hora_final").value;
        const horarioIntroducido = diasIntroducidos.length > 0 ||
            horaInicioIntroducida !== "" ||
            horaFinalIntroducida !== "";
        if (horarioIntroducido) {
            if ((horaInicioIntroducida === "" && horaFinalIntroducida !== "") || (horaFinalIntroducida === "" && horaInicioIntroducida !== "")) {
                alert("Debes introducir la hora de inicio y la hora final.");
                return;
            }
            if (horaInicioIntroducida >= horaFinalIntroducida) {
                alert("La hora de inicio debe ser anterior a la hora final.");
                return;
            }
            if (diasIntroducidos.length > 0) {
                dias = diasIntroducidos;
            }
            hora_inicio = horaInicioIntroducida;
            hora_final = horaFinalIntroducida;
        }

        if (horarioIntroducido && cursos.some(cursoActual =>
            cursoActual.id !== id &&
            cursoActual.estado &&
            Array.isArray(cursoActual.dias) &&
            cursoActual.dias.some(dia => dias.includes(dia)) &&
            hora_inicio < cursoActual.hora_final &&
            hora_final > cursoActual.hora_inicio
        )) {
            alert("Ya existe otro curso con un horario que se solapa en alguno de esos días.");
            return;
        }

        let fecha_inicio = curso.fecha_inicio;
        let fecha_fin = curso.fecha_fin;
        const fechaInicioIntroducida = document.getElementById("fecha_inicio").value;
        const fechaFinIntroducida = document.getElementById("fecha_fin").value;
        if (fechaInicioIntroducida !== "" || fechaFinIntroducida !== "") {
            if (fechaInicioIntroducida === "" || fechaFinIntroducida === "") {
                alert("Debes introducir la fecha de inicio y la fecha de finalización.");
                return;
            }
            if (fechaInicioIntroducida >= fechaFinIntroducida) {
                alert("La fecha de inicio debe ser anterior a la fecha de finalización.");
                return;
            }
            fecha_inicio = fechaInicioIntroducida;
            fecha_fin = fechaFinIntroducida;
        }

        if ((idAulaIntroducido !== "" || idDocenteIntroducido !== "") &&
            cursos.some(cursoActual =>
            cursoActual.id !== id &&
            cursoActual.estado &&
            Number(cursoActual.id_aula) === Number(id_aula) &&
            Number(cursoActual.id_docente) === Number(id_docente)
        )) {
            alert("Ya existe un curso en esa aula con ese docente.");
            return;
        }

        let imagen = curso.imagen || "";
        const archivoImagen = document.getElementById("imagen").files[0];
        if (archivoImagen) {
            try {
                
                imagen = await leerImagenComoDataURL(archivoImagen); 
            } catch (error) {
                alert(error.message);
                return;
            }
        }

        modificarCurso(id, nombre, categoria, descripcion, plazas, id_aula, id_docente, dias, hora_inicio, hora_final, fecha_inicio, fecha_fin, imagen);
        localStorage.setItem("cursos", JSON.stringify(cursos));
        window.location.href = "../gestiones_administrador/gestion_cursos.html";

    });
}
function modificarCurso(id, nombre, categoria, descripcion, plazas, id_aula, id_docente, dias, hora_inicio, hora_final, fecha_inicio, fecha_fin, imagen) {
    const curso = cursos.find(curso => curso.id === id);
    if (curso) {
        curso.nombre = nombre;
        curso.categoria = categoria;
        curso.descripcion = descripcion;
        curso.plazas = plazas;
        curso.id_aula = id_aula;
        curso.id_docente = id_docente;
        curso.dias = dias;
        curso.hora_inicio = hora_inicio;
        curso.hora_final = hora_final;
        curso.fecha_inicio = fecha_inicio;
        curso.fecha_fin = fecha_fin;
        curso.imagen = imagen;
    }
}
    

const contenedorTarjetas = document.querySelector('.tarjetas');

if (contenedorTarjetas) {
    const fragmento = document.createDocumentFragment();

    const tituloCursos = document.createElement('h3');
    tituloCursos.textContent = 'Cursos disponibles';

    const totalCursos = document.createElement('p');
    totalCursos.className = 'total-cursos';
    const cursosActivos = cursos.filter(curso => curso.estado);
    totalCursos.textContent = 'Cursos disponibles: ' + cursosActivos.length;

    for (let i = 0; i < cursosActivos.length; i++) {
        const cursoActual = cursosActivos[i];
        const card = document.createElement('article');
        card.className = 'tarjeta';
        const dias = cursoActual.dias.length > 0
            ? cursoActual.dias.join(", ")
            : "No especificados";
        const horaInicio = cursoActual.hora_inicio || "No especificada";
        const horaFinal = cursoActual.hora_final || "No especificada";
        const fechaInicio = cursoActual.fecha_inicio || "No especificada";
        const fechaFin = cursoActual.fecha_fin || "No especificada";
        const imagen = cursoActual.imagen
            ? `<img src="${cursoActual.imagen}" alt="Imagen del curso ${cursoActual.nombre}">`
            : "";

        card.innerHTML = `
            ${imagen}
            <h4>${cursoActual.nombre}</h4>
            <p><strong>Id:</strong> ${cursoActual.id}</p>
            <p><strong>Categoría:</strong> ${cursoActual.categoria}</p>
            <p><strong>Días:</strong> ${dias}</p>
            <p><strong>Horario:</strong> ${horaInicio} - ${horaFinal}</p>
            <p><strong>Fechas:</strong> ${fechaInicio} - ${fechaFin}</p>
            <p>${cursoActual.descripcion}</p>
            <p><strong>Plazas disponibles:</strong> ${cursoActual.plazas}</p>
            <p><strong>Aula:</strong> ${aulas.find(aula => aula.id === cursoActual.id_aula).nombre}</p>
            <p><strong>Docente:</strong> ${docentes.find(docente => docente.id === cursoActual.id_docente).nombre} ${docentes.find(docente => docente.id === cursoActual.id_docente).apellido}</p>
        `;

        fragmento.appendChild(card);
    }

    contenedorTarjetas.replaceChildren(fragmento);
    contenedorTarjetas.prepend(tituloCursos, totalCursos);
}

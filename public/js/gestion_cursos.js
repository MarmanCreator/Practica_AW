

const cursosGuardados = localStorage.getItem("cursos");

const cursos = cursosGuardados
    ? JSON.parse(cursosGuardados).map(normalizarCurso)
    : [

    {
        id_curso: 0,
        nombre: "Aplicaciones Web",
        descripcion: "Aprende a desarrollar aplicaciones web modernas utilizando HTML, CSS y JavaScript.",
        id_aula: 1,
        id_docente: 0,
        plazas: 20,
        fecha_inicio: "2026-09-01",
        fecha_fin: "2026-12-20",
        horario: "Miércoles, jueves y viernes 10:00-12:00",
        imagen: "",
        estado: "activo"
    },
    {
        id_curso: 1,
        nombre: "Gestion de proyectos software",
        descripcion: "Aprende a gestionar proyectos de desarrollo de software utilizando metodologías ágiles y herramientas de gestión.",
        id_aula: 3,
        id_docente: 1,
        plazas: 2,
        fecha_inicio: "2026-10-01",
        fecha_fin: "2027-01-31",
        horario: "Lunes y martes 14:00-16:00",
        imagen: "/images/recurso-imagenes/vehiculos/byd_seal1.png",
        estado: "activo"
    },
    {
        id_curso: 2,
        nombre: "Fundamentos de algoritmia",
        descripcion: "Aprende los conceptos básicos de algoritmia y estructuras de datos para resolver problemas de programación.",
        id_aula: 1,
        id_docente: 2,
        plazas: 0,
        fecha_inicio: "2026-11-03",
        fecha_fin: "2027-01-15",
        horario: "Lunes y martes 09:00-11:00",
        imagen: "/images/recurso-imagenes/vehiculos/byd_seal1.png",
        estado: "activo"
    }
];
localStorage.setItem("cursos", JSON.stringify(cursos));

const aulasGuardadas = localStorage.getItem("aulas");

const aulas = aulasGuardadas ? JSON.parse(aulasGuardadas).map(aula => ({
    id_aula: Number(aula.id_aula !== undefined ? aula.id_aula : aula.id),
    nombre: aula.nombre,
    estado: aula.estado !== undefined
        ? aula.estado
        : aula.activo
            ? "activa"
            : "inactiva"
})) : [ ];

const docentesGuardados = localStorage.getItem("docentes");

const docentes = docentesGuardados ? JSON.parse(docentesGuardados).map(docente => ({
    id_docente: Number(docente.id_docente !== undefined ? docente.id_docente : docente.id),
    nombre: docente.apellido
        ? `${docente.nombre} ${docente.apellido}`.trim()
        : docente.nombre,
    activo: Number(docente.activo) === 0 ? 0 : 1
})) : [ ];

const matriculasGuardadas = localStorage.getItem("matriculas");

const matriculas = matriculasGuardadas
    ? JSON.parse(matriculasGuardadas).map(matricula => ({
        id_matricula: Number(matricula.id_matricula !== undefined ? matricula.id_matricula : matricula.id),
        id_usuario: Number(matricula.id_usuario !== undefined ? matricula.id_usuario : matricula.id_alumno),
        id_curso: Number(matricula.id_curso),
        fecha_matricula: matricula.fecha_matricula || "",
        estado: matricula.estado === "activa" || matricula.estado === "cancelada"
            ? matricula.estado
            : matricula.activo === false
                ? "cancelada"
                : "activa"
    }))
    : [];



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
const selectDocente = document.getElementById("id_docente");
if (selectDocente) {
    for (let i = 0; i < docentes.length; i++) {
        const doc = docentes[i];

        if (Number(doc.activo) === 1) {
            const opcion = document.createElement("option");
            opcion.value = doc.id_docente;
            opcion.textContent = `${doc.nombre}`.trim();
            selectDocente.appendChild(opcion);
        }
    }
}
//y esto para rellenar el select de cursos en el formulario de añadir matrícula, mostrando solo los cursos activos.
const selectCurso = document.getElementById("id_curso");
if (selectCurso) {
    for (let i = 0; i < cursos.length; i++) {
        const curso = cursos[i];

        if (esCursoActivo(curso)) {
            const opcion = document.createElement("option");
            opcion.value = curso.id_curso;
            opcion.textContent = `${curso.nombre}`.trim();
            selectCurso.appendChild(opcion);
        }
    }
}

const formulario_anyadir_curso = document.getElementById("añadir_curso");
if (formulario_anyadir_curso) {
    formulario_anyadir_curso.addEventListener("submit", function (event) {
        event.preventDefault();
        const nombre = sanitizarEntrada(document.getElementById("nombre").value);
        const descripcion = sanitizarEntrada(document.getElementById("descripcion").value);
        const plazasIntroducidas = document.getElementById("plazas").value.trim();
        const plazas = Number(plazasIntroducidas);
        const id_aula = document.getElementById("id_aula").value;
        const id_docente = document.getElementById("id_docente").value;
        const dias = [...document.querySelectorAll('input[name="dias"]:checked')]
            .map(dia => dia.value); // los 3 puntos son para que se convierta en un array y luego se mapea para obtener los valores de los días seleccionados
        const hora_inicio = document.getElementById("hora_inicio").value;
        const hora_final = document.getElementById("hora_final").value;
        const fecha_inicio = document.getElementById("fecha_inicio").value;
        const fecha_fin = document.getElementById("fecha_fin").value;

        //Esta linea establece lo que se puede usar en los campos.
        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        //Lo mismo para números.
        const regexNumeros = /^\d+$/;
        if (!regexLetras.test(nombre.trim())) {
            alert("El nombre del curso solo puede contener letras y espacios.");
            return;
        }
        if (!regexNumeros.test(plazasIntroducidas)) {
            alert("Las plazas deben ser un número entero no negativo.");
            return;
        }

        if (!Number.isInteger(plazas) || plazas < 0) {
            alert("El número de plazas debe ser un número entero no negativo.");
            return;
        }
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
        if (cursos.some(curso =>
            curso.nombre.toLowerCase() === nombre.toLowerCase() && esCursoActivo(curso)
        )) {
            alert("Ya existe un curso con ese nombre y no puede haber 2 cursos con el mismo nombre.");
            return;
        }
        if (cursos.some(curso =>
            curso.id_aula === Number(id_aula) &&
            esCursoActivo(curso) &&
            curso.id_docente === Number(id_docente)
        )) {
            alert("Ya existe un curso en esa aula con ese docente.");
            return;
        }
        if (cursos.some(curso => {
            const horarioExistente = analizarHorario(curso.horario);
            return curso.id_aula === Number(id_aula) &&
                esCursoActivo(curso) &&
                horarioExistente &&
                horarioExistente.dias.some(dia => dias.includes(dia)) &&
                hora_inicio < horarioExistente.hora_final &&
                hora_final > horarioExistente.hora_inicio;
        })) {
            alert("Ya existe un curso en esa aula en ese horario.");
            return;
        }

        const horario = crearHorario(dias, hora_inicio, hora_final);
        AnyadirCurso(nombre, descripcion, plazas, id_aula, id_docente, fecha_inicio, fecha_fin, horario);
        localStorage.setItem("cursos", JSON.stringify(cursos));
        window.location.href = "/gestiones_administrador/gestion_cursos.html";
    });
}
function AnyadirCurso(nombre, descripcion, plazas, id_aula, id_docente, fecha_inicio, fecha_fin, horario) {
    const nuevoCurso = {
        id_curso: cursos.reduce((mayorId, curso) => Math.max(mayorId, curso.id_curso), -1) + 1,
        nombre: nombre,
        descripcion: descripcion,
        plazas: Number(plazas),
        id_aula: Number(id_aula),
        id_docente: Number(id_docente),
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        horario: horario,
        imagen: "",
        estado: "activo"
    };
    cursos.push(nuevoCurso);
}

const formulario_eliminar_curso = document.getElementById("eliminar_curso");
if (formulario_eliminar_curso) {
    formulario_eliminar_curso.addEventListener("submit", function (event) {
        event.preventDefault();
        const id = Number(document.getElementById("id_curso").value);
        const cursoExiste = cursos.some(curso => curso.id_curso === id && esCursoActivo(curso));

        if (!Number.isInteger(id) || !cursoExiste) {
            alert("No existe ningún curso con ese ID.");
            return;
        }
        const curso = cursos.find(cursoActual =>
            cursoActual.id_curso === id && esCursoActivo(cursoActual)
        );
        if (curso) {
            curso.estado = "inactivo";
        }
        else {
            alert("No existe ningún curso con ese ID o ya está eliminado.");
            return;
        }
        localStorage.setItem("cursos", JSON.stringify(cursos));
        window.location.href = "/gestiones_administrador/gestion_cursos.html";

    });
}

const formulario_modificar_curso = document.getElementById("modificar_curso");
if (formulario_modificar_curso) {
    formulario_modificar_curso.addEventListener("submit", function (event) {
        event.preventDefault();

        const id = Number(sanitizarEntrada(document.getElementById("id_curso").value));
        const curso = cursos.find(cursoActual =>
            cursoActual.id_curso === id && esCursoActivo(cursoActual)
        );
        if (!Number.isInteger(id) || !curso) {
            alert("No existe ningún curso con ese ID.");
            return;
        }

        const nombreIntroducido = sanitizarEntrada(document.getElementById("nombre").value.trim());
        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (nombreIntroducido !== "" && !regexLetras.test(nombreIntroducido)) {
            alert("El nombre del curso solo puede contener letras y espacios.");
            return;
        }

        let nombre = curso.nombre;
        if (nombreIntroducido !== "") {
            if (cursos.some(cursoActual =>
                cursoActual.id_curso !== id &&
                cursoActual.nombre.toLowerCase() === nombreIntroducido.toLowerCase() &&
                esCursoActivo(cursoActual)
            )) {
                alert("Ya existe un curso activo con ese nombre.");
                return;
            }
            nombre = nombreIntroducido;
        }

        let descripcion = curso.descripcion;
        if (sanitizarEntrada(document.getElementById("descripcion").value.trim()) !== "") {
            descripcion = sanitizarEntrada(document.getElementById("descripcion").value);
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
            if (!aulas.some(aula => aula.id_aula === id_aula && aula.estado === "activa")) {
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
            if (!docentes.some(docente => docente.id_docente === id_docente && Number(docente.activo) === 1)) {
                alert("No existe ningún docente con ese ID.");
                return;
            }
        }

        const horarioActual = analizarHorario(curso.horario);
        let dias = horarioActual ? horarioActual.dias : [];
        let hora_inicio = horarioActual ? horarioActual.hora_inicio : "";
        let hora_final = horarioActual ? horarioActual.hora_final : "";
        const diasIntroducidos = [...document.querySelectorAll('input[name="dias"]:checked')]
            .map(dia => dia.value);
        const horaInicioIntroducida = document.getElementById("hora_inicio").value;
        const horaFinalIntroducida = document.getElementById("hora_final").value;
        const horarioIntroducido = diasIntroducidos.length > 0 ||
            horaInicioIntroducida !== "" ||
            horaFinalIntroducida !== "";
        if (horarioIntroducido) {
            if ((horaInicioIntroducida === "") !== (horaFinalIntroducida === "")) {
                alert("Debes introducir la hora de inicio y la hora final.");
                return;
            }
            if (diasIntroducidos.length > 0) dias = diasIntroducidos;
            if (horaInicioIntroducida !== "") hora_inicio = horaInicioIntroducida;
            if (horaFinalIntroducida !== "") hora_final = horaFinalIntroducida;
            if (dias.length === 0 || !hora_inicio || !hora_final || hora_inicio >= hora_final) {
                alert("La hora de inicio debe ser anterior a la hora final.");
                return;
            }
        }

        const horario = horarioIntroducido
            ? crearHorario(dias, hora_inicio, hora_final)
            : curso.horario;
        if (horarioIntroducido && cursos.some(cursoActual => {
            const horarioExistente = analizarHorario(cursoActual.horario);
            return cursoActual.id_curso !== id &&
                esCursoActivo(cursoActual) &&
                Number(cursoActual.id_aula) === Number(id_aula) &&
                horarioExistente &&
                horarioExistente.dias.some(dia => dias.includes(dia)) &&
                hora_inicio < horarioExistente.hora_final &&
                hora_final > horarioExistente.hora_inicio;
        })) {
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
                cursoActual.id_curso !== id &&
                esCursoActivo(cursoActual) &&
                Number(cursoActual.id_aula) === Number(id_aula) &&
                Number(cursoActual.id_docente) === Number(id_docente)
            )) {
            alert("Ya existe un curso en esa aula con ese docente.");
            return;
        }

        const regexNumeros = /^\d+$/;
        if ((idAulaIntroducido !== "" && !regexNumeros.test(idAulaIntroducido)) ||
            (plazasIntroducidas !== "" && !regexNumeros.test(plazasIntroducidas)) ||
            (idDocenteIntroducido !== "" && !regexNumeros.test(idDocenteIntroducido))) {
            alert("Error: En estos campos solo están permitidos números positivos.");
            return;
        }

        let imagen = curso.imagen || "";
        const imagenIntroducida = sanitizarEntrada(document.getElementById("imagen").value.trim());
        const limpiarImagen = document.getElementById("limpiar_imagen").checked;
        if (imagenIntroducida !== "") imagen = imagenIntroducida;
        else if (limpiarImagen) imagen = "";

        modificarCurso(id, {
            nombre,
            descripcion,
            plazas,
            id_aula,
            id_docente,
            fecha_inicio,
            fecha_fin,
            horario,
            imagen
        });
        localStorage.setItem("cursos", JSON.stringify(cursos));
        window.location.href = "/gestiones_administrador/gestion_cursos.html";

    });
}
function modificarCurso(id, datos) {
    const curso = cursos.find(cursoActual => cursoActual.id_curso === id);
    if (!curso) return;

    curso.nombre = datos.nombre;
    curso.descripcion = datos.descripcion;
    curso.plazas = Number(datos.plazas);
    curso.id_aula = Number(datos.id_aula);
    curso.id_docente = Number(datos.id_docente);
    curso.fecha_inicio = datos.fecha_inicio;
    curso.fecha_fin = datos.fecha_fin;
    curso.horario = datos.horario;
    curso.imagen = datos.imagen;
}
    

const contenedorTarjetas = document.querySelector('.tarjetas');
const usuarioGuardado = sessionStorage.getItem("usuarioActivo");
const usuarioActual = usuarioGuardado
    ? normalizarUsuarioSesion(JSON.parse(usuarioGuardado))
    : null;
if (contenedorTarjetas) {
    const fragmento = document.createDocumentFragment();

    const tituloCursos = document.createElement('h3');
    tituloCursos.textContent = 'Cursos disponibles';

    const totalCursos = document.createElement('p');
    totalCursos.className = 'total-cursos';
    const cursosActivos = cursos.filter(esCursoActivo);
    totalCursos.textContent = 'Cursos disponibles: ' + cursosActivos.length;

    for (let i = 0; i < cursosActivos.length; i++) {
        const cursoActual = cursosActivos[i];
        const card = document.createElement('article');
        card.className = 'tarjeta';
        const horario = cursoActual.horario || "No especificado";
        const fechaInicio = cursoActual.fecha_inicio || "No especificada";
        const fechaFin = cursoActual.fecha_fin || "No especificada";
        const imagen = cursoActual.imagen
            ? `<img src="${sanitizarEntrada(cursoActual.imagen)}" alt="Imagen del curso ${sanitizarEntrada(cursoActual.nombre)}">`
            : "";
        const aula = aulas.find(aulaActual => aulaActual.id_aula === Number(cursoActual.id_aula));
        const docente = docentes.find(docenteActual => docenteActual.id_docente === Number(cursoActual.id_docente));
        const nombreAula = aula ? aula.nombre : "No especificada";
        const nombreDocente = docente ? docente.nombre : "No especificado";

        card.innerHTML = `
            ${imagen}
            <h4>${sanitizarEntrada(cursoActual.nombre)}</h4>
            <p><strong>Id:</strong> ${sanitizarEntrada(cursoActual.id_curso)}</p>
            <p><strong>Horario:</strong> ${sanitizarEntrada(horario)}</p>
            <p><strong>Fechas:</strong> ${sanitizarEntrada(fechaInicio)} - ${sanitizarEntrada(fechaFin)}</p>
            <p>${sanitizarEntrada(cursoActual.descripcion)}</p>
            <p><strong>Plazas disponibles:</strong> ${sanitizarEntrada(cursoActual.plazas)}</p>
            <p><strong>Aula:</strong> ${sanitizarEntrada(nombreAula)}</p>
            <p><strong>Docente:</strong> ${sanitizarEntrada(nombreDocente)}</p>
        `;

        let button = null;
        if (usuarioActual && usuarioActual.activo === 1 && usuarioActual.rol === "alumno") {
            button = document.createElement("button");
            button.textContent = "Matricularse";
            button.addEventListener("click", () => {
                const idUsuarioActual = usuarioActual.id_usuario;
                const idCursoActual = cursoActual.id_curso;
                if(matriculas.some(matricula =>
                    matricula.id_curso === idCursoActual &&
                    matricula.id_usuario === idUsuarioActual &&
                    matricula.estado === "activa"
                )) {
                    alert("No te puedes matricular en un curso en el que ya estás matriculado.");
                    return;
                }
                if(cursoActual.plazas <= 0) {
                    alert("No hay plazas disponibles en este curso.");
                    return;
                }
                const nuevaMatricula = {
                    id_matricula: matriculas.reduce((mayorId, matricula) => Math.max(mayorId, matricula.id_matricula), 0) + 1,
                    id_curso: idCursoActual,
                    id_usuario: idUsuarioActual,
                    fecha_matricula: fechaHoraActual(),
                    estado: "activa"
                };
                matriculas.push(nuevaMatricula);
                localStorage.setItem("matriculas", JSON.stringify(matriculas));
                alert("Te has matriculado en el curso " + cursoActual.nombre + ".");
            });
        }

        if (button) {
            card.appendChild(button);
        }

        fragmento.appendChild(card);
    }

    contenedorTarjetas.replaceChildren(fragmento);
    contenedorTarjetas.prepend(tituloCursos, totalCursos);
}

function fechaHoraActual() {
    const ahora = new Date();
    const formato = numero => String(numero).padStart(2, "0");
    return `${ahora.getFullYear()}-${formato(ahora.getMonth() + 1)}-${formato(ahora.getDate())} ` +
        `${formato(ahora.getHours())}:${formato(ahora.getMinutes())}:${formato(ahora.getSeconds())}`;
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

function normalizarUsuarioSesion(usuario) {
    const rol = usuario.rol === "administrador"
        ? "admin"
        : usuario.rol === "estudiante"
            ? "alumno"
            : usuario.rol;
    const nombre = [usuario.nombre, usuario.apellido]
        .filter(Boolean)
        .join(" ")
        .trim();

    return {
        id_usuario: Number(usuario.id_usuario ?? usuario.id),
        nombre: nombre,
        rol: ["alumno", "admin"].includes(rol) ? rol : "alumno",
        activo: usuario.activo === false || Number(usuario.activo) === 0 ? 0 : 1
    };
}

function normalizarCurso(curso) {
    const horarioAntiguo = Array.isArray(curso.dias)
        ? crearHorario(curso.dias, curso.hora_inicio || "", curso.hora_final || "")
        : "";
    const estado = curso.estado === "activo" || curso.estado === "inactivo"
        ? curso.estado
        : curso.estado === false
            ? "inactivo"
            : "activo";

    return {
        id_curso: Number(curso.id_curso !== undefined ? curso.id_curso : curso.id),
        id_docente: Number(curso.id_docente),
        id_aula: Number(curso.id_aula),
        nombre: curso.nombre,
        descripcion: curso.descripcion || "",
        fecha_inicio: curso.fecha_inicio,
        fecha_fin: curso.fecha_fin,
        horario: curso.horario || horarioAntiguo,
        plazas: Number(curso.plazas),
        imagen: curso.imagen || "",
        estado
    };
}

function esCursoActivo(curso) {
    return curso.estado === "activo" || curso.estado === true;
}

function crearHorario(dias, horaInicio, horaFinal) {
    const nombresDias = {
        lunes: "lunes",
        martes: "martes",
        miercoles: "miércoles",
        jueves: "jueves",
        viernes: "viernes"
    };
    const ordenDias = ["lunes", "martes", "miercoles", "jueves", "viernes"];
    const diasOrdenados = ordenDias
        .filter(dia => dias.includes(dia))
        .map(dia => nombresDias[dia]);
    if (diasOrdenados.length === 0) return "";

    diasOrdenados[0] = `${diasOrdenados[0][0].toUpperCase()}${diasOrdenados[0].slice(1)}`;
    const diasTexto = diasOrdenados.length === 1
        ? diasOrdenados[0]
        : `${diasOrdenados.slice(0, -1).join(", ")} y ${diasOrdenados[diasOrdenados.length - 1]}`;
    return `${diasTexto} ${horaInicio}-${horaFinal}`;
}

function analizarHorario(horario) {
    if (typeof horario !== "string") return null;
    const coincidencia = horario.trim().match(/^(.*?)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);
    if (!coincidencia) return null;

    const valoresDias = {
        lunes: "lunes",
        martes: "martes",
        miercoles: "miercoles",
        jueves: "jueves",
        viernes: "viernes"
    };
    const dias = coincidencia[1]
        .split(/\s*,\s*|\s+y\s+/i)
        .map(dia => dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        .map(dia => valoresDias[dia])
        .filter(Boolean);
    if (dias.length === 0) return null;

    return {
        dias,
        hora_inicio: coincidencia[2],
        hora_final: coincidencia[3]
    };
}
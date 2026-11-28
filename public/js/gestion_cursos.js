

const cursosGuardados = localStorage.getItem("cursos");

const cursos = cursosGuardados ? JSON.parse(cursosGuardados) : [];

localStorage.setItem("cursos", JSON.stringify(cursos));

const aulasGuardadas = localStorage.getItem("aulas");

const aulas = aulasGuardadas ? JSON.parse(aulasGuardadas) : [];

const docentesGuardados = localStorage.getItem("docentes");

const docentes = docentesGuardados ? JSON.parse(docentesGuardados) : [];

const matriculasGuardadas = localStorage.getItem("matriculas");

const matriculas = matriculasGuardadas
    ? JSON.parse(matriculasGuardadas)
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

        if (doc.activo === 1) {
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

// AÑADIR CURSO

const formulario_anyadir_curso = document.getElementById("añadir_curso");
const cargaReferenciasCurso = formulario_anyadir_curso
    ? cargarReferenciasCurso()
    : Promise.resolve(true);

if (formulario_anyadir_curso) {
    formulario_anyadir_curso.addEventListener("submit", async function (event) {
        event.preventDefault();
        const nombre = sanitizarEntrada(document.getElementById("nombre").value.trim());
        const descripcion = sanitizarEntrada(document.getElementById("descripcion").value.trim());
        const plazasIntroducidas = document.getElementById("plazas").value.trim();
        const plazas = Number(plazasIntroducidas);
        const id_aula = Number(document.getElementById("id_aula").value);
        const id_docente = Number(document.getElementById("id_docente").value);
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
        if (!regexNumeros.test(plazasIntroducidas) || Number(plazasIntroducidas) <= 0) {
            alert("Las plazas deben ser un número entero mayor que cero.");
            return;
        }

        if (!Number.isInteger(plazas) || plazas <= 0) {
            alert("El número de plazas debe ser un número entero mayor que cero.");
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

        if (!await cargaReferenciasCurso) {
            return;
        }

        const horario = crearHorario(dias, hora_inicio, hora_final);
        try {
            const respuesta = await fetch("/api/cursos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    fecha_inicio,
                    fecha_fin,
                    horario,
                    plazas,
                    id_aula,
                    id_docente
                })
            });
            const resultado = await respuesta.json().catch(() => ({}));

            if (!respuesta.ok) {
                throw new Error(resultado.error || "No se pudo añadir el curso.");
            }

            alert("Curso añadido correctamente.");
            window.location.href = "/gestiones_administrador/gestion_cursos.html";
        } catch (error) {
            console.error("Error al añadir el curso:", error);
            alert(error.message || "No se pudo conectar con el servidor.");
        }
    });
}

async function cargarReferenciasCurso() {
    try {
        const respuesta = await fetch("/api/cursos/referencias");
        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const referencias = await respuesta.json();
        if (!Array.isArray(referencias.aulas) || !Array.isArray(referencias.docentes)) {
            throw new Error("La respuesta de aulas y docentes no tiene el formato esperado.");
        }

        const selectAulaCurso = document.getElementById("id_aula");
        const selectDocenteCurso = document.getElementById("id_docente");
        const opcionInicialAula = selectAulaCurso.options[0];
        const opcionInicialDocente = selectDocenteCurso.options[0];
        selectAulaCurso.replaceChildren(opcionInicialAula);
        selectDocenteCurso.replaceChildren(opcionInicialDocente);

        for (const aula of referencias.aulas) {
            const opcion = document.createElement("option");
            opcion.value = aula.id_aula;
            opcion.textContent = aula.nombre;
            selectAulaCurso.appendChild(opcion);
        }
        for (const docente of referencias.docentes) {
            const opcion = document.createElement("option");
            opcion.value = docente.id_docente;
            opcion.textContent = docente.nombre;
            selectDocenteCurso.appendChild(opcion);
        }

        return true;
    } catch (error) {
        console.error("Error al cargar aulas y docentes:", error);
        alert("No se pudieron cargar las aulas y los docentes desde la base de datos.");
        return false;
    }
}

// ELIMINAR CURSO

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

// MODIFICAR CURSO

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
            if (!docentes.some(docente => docente.id_docente === id_docente && docente.activo === 1)) {
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
                cursoActual.id_aula === id_aula &&
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
                cursoActual.id_aula === id_aula &&
                cursoActual.id_docente === id_docente
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

////////////////////////////AVANCE PARA CONECTAR CON LA BD///////////////////////////////////////////////
    
// 1. REFERENCIAS INICIALES Y SESIÓN
// Buscamos la sección del HTML (<section class="tarjetas">) donde pintaremos los cursos.
// Si estamos en otra página (como añadir curso), esto valdrá null y no se ejecutará la carga del catálogo.
const contenedorTarjetas = document.querySelector('.tarjetas');

// Recuperamos al usuario que inició sesión en esta pestaña (si lo hay) para saber si debemos mostrar el botón "Matricularse".
const usuarioGuardado = sessionStorage.getItem("usuarioActivo");
const usuarioActual = usuarioGuardado
    ? JSON.parse(usuarioGuardado)
    : null;


// 2. FUNCIONES AUXILIARES DE FORMATO Y DOM SEGURO

// MariaDB devuelve las fechas en formato ISO completo (ej: "2027-01-10T23:00:00.000Z").
// Con .slice(0, 10) nos quedamos solo con los primeros 10 caracteres ("2027-01-10").
function formatearFecha(fecha) {
    if (!fecha) return "No especificada";
    return String(fecha).slice(0, 10);
}

// Crea un párrafo del tipo <p><strong>Etiqueta: </strong>Valor</p> usando el DOM puro.
// Al usar textContent y createTextNode en lugar de innerHTML, evitamos cualquier ataque XSS
// porque el navegador trata todo como texto plano y nunca ejecuta etiquetas HTML ni scripts.
function crearParrafoDato(etiqueta, valor) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = etiqueta + ": ";
    p.appendChild(strong);
    p.appendChild(document.createTextNode(String(valor)));
    return p;
}

// Si la petición fetch falla (por ejemplo, si MariaDB está apagada o hay un error 500),
// limpiamos el contenedor y mostramos un mensaje amigable sin revelar detalles técnicos.
function mostrarErrorCatalogo(mensaje) {
    const p = document.createElement('p');
    p.className = 'error-catalogo';
    p.textContent = mensaje;
    contenedorTarjetas.replaceChildren(p);
}


// 3. RENDERIZADO DE LAS TARJETAS DE CURSOS
function mostrarCursos(listaCursos) {
    // DocumentFragment es un contenedor temporal en memoria.
    // Metemos todas las tarjetas aquí y al final lo insertamos todo de golpe en el HTML (mejor rendimiento).
    const fragmento = document.createDocumentFragment();

    // Cabecera de la sección con el número total de cursos recibidos desde la BD
    const tituloCursos = document.createElement('h3');
    tituloCursos.textContent = 'Cursos disponibles';

    const totalCursos = document.createElement('p');
    totalCursos.className = 'total-cursos';
    totalCursos.textContent = 'Cursos disponibles: ' + listaCursos.length;

    // Recorremos cada curso del array JSON que nos ha devuelto Express
    for (let i = 0; i < listaCursos.length; i++) {
        const cursoActual = listaCursos[i];
        const card = document.createElement('article');
        card.className = 'tarjeta';

        // Si el curso tiene ruta de imagen en la BD, creamos la etiqueta <img>
        if (cursoActual.imagen) {
            const img = document.createElement('img');
            // Nos aseguramos de que la ruta empiece por "/" para que Express la busque desde la carpeta public/
            img.src = cursoActual.imagen.startsWith('/') ? cursoActual.imagen : '/' + cursoActual.imagen;
            img.alt = 'Imagen del curso ' + cursoActual.nombre;
            card.appendChild(img);
        }

        // Título del curso
        const titulo = document.createElement('h4');
        titulo.textContent = cursoActual.nombre;
        card.appendChild(titulo);

        // Preparamos los textos con valores por defecto por si algún campo viene vacío (NULL en la BD).
        // aula_nombre y docente_nombre vienen directamente del JOIN que hicimos en cursos.service.js.
        const horario = cursoActual.horario || "No especificado";
        const fechas = `${formatearFecha(cursoActual.fecha_inicio)} - ${formatearFecha(cursoActual.fecha_fin)}`;
        const nombreAula = cursoActual.aula_nombre || "No especificada";
        const nombreDocente = cursoActual.docente_nombre || "No especificado";

        // Añadimos los datos a la tarjeta de forma segura
        card.appendChild(crearParrafoDato("Id", cursoActual.id_curso));
        card.appendChild(crearParrafoDato("Horario", horario));
        card.appendChild(crearParrafoDato("Fechas", fechas));

        const desc = document.createElement('p');
        desc.textContent = cursoActual.descripcion || "";
        card.appendChild(desc);

        card.appendChild(crearParrafoDato("Plazas disponibles", cursoActual.plazas));
        card.appendChild(crearParrafoDato("Aula", nombreAula));
        card.appendChild(crearParrafoDato("Docente", nombreDocente));

        // Si hay un alumno activo logueado, le añadimos el botón de matricularse
        // (las matrículas siguen usando localStorage de forma provisional hasta la entrega final)
        if (usuarioActual && usuarioActual.activo === 1 && usuarioActual.rol === "alumno") {
            const button = document.createElement("button");
            button.textContent = "Matricularse";
            button.addEventListener("click", () => {
                const idUsuarioActual = usuarioActual.id_usuario;
                const idCursoActual = cursoActual.id_curso;

                // Comprobamos que no esté ya matriculado en este mismo curso
                if (matriculas.some(matricula =>
                    matricula.id_curso === idCursoActual &&
                    matricula.id_usuario === idUsuarioActual &&
                    matricula.estado === "activa"
                )) {
                    alert("No te puedes matricular en un curso en el que ya estás matriculado.");
                    return;
                }

                // Comprobamos que queden plazas
                if (cursoActual.plazas <= 0) {
                    alert("No hay plazas disponibles en este curso.");
                    return;
                }

                // Creamos y guardamos la matrícula en localStorage
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
            card.appendChild(button);
        }

        // Añadimos la tarjeta terminada al fragmento en memoria
        fragmento.appendChild(card);
    }

    // Reemplazamos el contenido de <section class="tarjetas"> con todas las tarjetas nuevas
    contenedorTarjetas.replaceChildren(fragmento);
    // Colocamos el título y el contador justo encima de las tarjetas
    contenedorTarjetas.prepend(tituloCursos, totalCursos);
}


// 4. PETICIÓN A LA API REST (CONEXIÓN CON EXPRESS Y MARIADB)
// Solo hacemos la petición si estamos en una página que tiene el contenedor de tarjetas.
if (contenedorTarjetas) {
    // Enviamos una petición HTTP GET asíncrona a nuestro endpoint de Express
    fetch('/api/cursos')
        .then(r => {
            // fetch() no lanza error automáticamente ante códigos 404 o 500;
            // por eso comprobamos r.ok (true si el estado es 200-299). Si falla, saltamos al .catch().
            if (!r.ok) throw new Error('Error HTTP ' + r.status);
            // Convertimos el cuerpo de la respuesta (texto JSON) en un array de objetos JavaScript
            return r.json();
        })
        // Cuando tenemos el array real de MariaDB, llamamos a la función que pinta las tarjetas
        .then(cursosBD => mostrarCursos(cursosBD))
        // Si se cae el servidor, no hay red o MariaDB devuelve un 500, mostramos el error controlado
        .catch(() => mostrarErrorCatalogo('No se pudo cargar el catálogo de cursos.'));
}
function fechaHoraActual() {
    const ahora = new Date();
    const formato = numero => String(numero).padStart(2, "0");
    return `${ahora.getFullYear()}-${formato(ahora.getMonth() + 1)}-${formato(ahora.getDate())} ` +
        `${formato(ahora.getHours())}:${formato(ahora.getMinutes())}:${formato(ahora.getSeconds())}`;
}


/*Si en la defensa te preguntan por el recorrido completo de los datos, puedes resumirlo en una frase:
 gestion_cursos.js lanza fetch('/api/cursos') → app.js lo redirige a routes/cursos.routes.js → llama a services/cursos.service.js → 
 ejecuta el SELECT con JOIN en db/mariadb.js → vuelve como JSON con código 200 y mostrarCursos() lo pinta con textConten
*/

////////////////////////////AVANCE PARA CONECTAR CON LA BD///////////////////////////////////////////////


// Función para neutralizar etiquetas HTML y evitar inyecciones XSS
function sanitizarEntrada(texto) {
    return String(texto)
        .replace(/&(?!(amp|lt|gt|quot|#039);)/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function esCursoActivo(curso) {
    return curso.estado === "activo";
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
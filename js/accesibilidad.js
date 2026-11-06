// Esta función lee el objeto de preferencias y añade las 
// clases CSS correctas al <body>.

function aplicarPreferencias(preferencias){

    //Vaciamos las clases del body para que no se acumulen
    //si el usuario cambia de opinión varias veces. 

    //document.body apunta direcamente al body de nuestro html. HTML que tenga en el head
    //la referencia a este .js. 
    //El .className = '' Accede a tdos los nombres de clase que tenga aplicados el 
    // <body> en ese momento y los borra. Como borrar la pizarra antes de volver a dibujar. 
    document.body.className = ''; 

    //Vemos que tema  hay que poner 
    //Comprueba de forma estricta si dentro de tu objeto de preferencias, la clave tema guarda
    // exactamente el texto 'oscuro'.
    if(preferencias.tema === 'oscuro'){

        //La propiedad classList es un listado que contiene las clases actuales
        //del elemento. Con .add inyectamos una nueva clase (tema_oscuro) al aplicarse
        //el navegador detecta que tu <body> ahora tiene una clase y aplica automaitcamente 
        //lo que el style.css pone. 
        document.body.classList.add('tema_oscuro'); 
    }

    //Vemos que tamaño de la fuente hay que poner
    if(preferencias.tamano === 'grande'){
        document.body.classList.add('fuente_grande'); 
    }else if(preferencias.tamano === 'pequeno'){
        document.body.classList.add('fuente_pequena'); 
    }

    //Vemos el contraste 
    if(preferencias.contraste === true){
        document.body.classList.add('alto_contraste'); 
    }
}


//Vamos ahora a recuperar los datos al abrir la pagina 
//El evento DOMContentLoaded es un aviso de radio automático
// que dispara el navegador cuando termina de leer y construir todo tu esqueleto HTML en memoria.
document.addEventListener('DOMContentLoaded', () => {
//Al envolver tu código de recuperación de datos en document.addEventListener('DOMContentLoaded', () => { ... }), 
// le estás diciendo a JavaScript: "No intentes pintar el tema oscuro ni buscar el formulario en localStorage hasta 
// que el navegador me garantice que el HTML está 100% construido y listo para ser modificado".
    

//Buscamos en LocalStorage si el usuario guardó algo previamente. 
    const guardado = localStorage.getItem('preferenciasAccesibilidad'); 

    //Si existe información guardada: 
    if(guardado){
        //La parseamos a texto plano
        const preferencias = JSON.parse(guardado); 

        //Ejecutamos nuestra funcion para pintar la pagina con las preferencias guardas
        aplicarPreferencias(preferencias); 


        // 4. Sincronizamos el formulario visualmente.
        // Si estamos en la página "accesibilidad.html", queremos que
        // las opciones seleccionadas coincidan con lo guardado.
        const formAccesibilidad = document.getElementById('form_accesibilidad');
        if (formAccesibilidad) {
            document.getElementById('tema_visual').value = preferencias.tema;
            document.getElementById('tamano_fuente').value = preferencias.tamano;
            document.getElementById('alto_contraste').checked = preferencias.contraste;
        }

    }
}); 

//Guardar datos al pulsar guardar en el formulario 

const formAccesibilidad = document.getElementById('form_accesibilidad');

//Vamos a escuchar el submit en caso de que el formulario exista 
//en la página actual en la que se encuente el usuario 

if(formAccesibilidad){
    formAccesibilidad.addEventListener('submit', function(event){
        event.preventDefault(); 

        //preferenciasActuales es un objeto, es decir la  información que almacena 
        //lo hace en pares de clave-valor. 
        const preferenciasActuales = {
            tema: document.getElementById('tema_visual').value,
            tamano: document.getElementById('tamano_fuente').value,
            contraste: document.getElementById('alto_contraste').checked
        }; 

        //Aplicamos el rediseño 
        aplicarPreferencias(preferenciasActuales); 

        //Guardamos en localStorage para futuras visitas. 
        //Para guardarlo debemos convertir el objeto preferenciasActuales en texto con JSON

        localStorage.setItem('preferenciasAccesibilidad', JSON.stringify(preferenciasActuales)); 

        //Avisar al usuario de que todo ha ido bien
        alert('Preferencias de accesibilidad guardadas y aplicadas'); 

    })
}



function aplicarPreferencias(preferencias){

    document.body.className = ''; 

    if(preferencias.tema === 'oscuro'){
  
        document.body.classList.add('tema_oscuro'); 
    }

    if(preferencias.tamano === 'grande'){
        document.body.classList.add('fuente_grande'); 
    }else if(preferencias.tamano === 'pequeno'){
        document.body.classList.add('fuente_pequena'); 
    }

    if(preferencias.contraste === true){
        document.body.classList.add('alto_contraste'); 
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const guardado = localStorage.getItem('preferenciasAccesibilidad'); 

    if(guardado){
        
        const preferencias = JSON.parse(guardado); 

        aplicarPreferencias(preferencias); 

        const formAccesibilidad = document.getElementById('form_accesibilidad');
        if (formAccesibilidad) {
            document.getElementById('tema_visual').value = preferencias.tema;
            document.getElementById('tamano_fuente').value = preferencias.tamano;
            document.getElementById('alto_contraste').checked = preferencias.contraste;
        }

    }
}); 

const formAccesibilidad = document.getElementById('form_accesibilidad');

if(formAccesibilidad){
    formAccesibilidad.addEventListener('submit', function(event){
        event.preventDefault(); 

        const preferenciasActuales = {
            tema: document.getElementById('tema_visual').value,
            tamano: document.getElementById('tamano_fuente').value,
            contraste: document.getElementById('alto_contraste').checked
        }; 

        aplicarPreferencias(preferenciasActuales); 

        localStorage.setItem('preferenciasAccesibilidad', JSON.stringify(preferenciasActuales)); 

        alert('Preferencias de accesibilidad guardadas y aplicadas'); 

    })
}
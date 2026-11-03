document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("nav").forEach(configurarNavegacion);
});

function configurarNavegacion(nav) {
    const listaPrincipal = nav.querySelector(":scope > ul");
    if (!listaPrincipal) {
        return;
    }

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "nav_toggle";
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-label", "Abrir menu");
    boton.textContent = "☰";

    const menuLateral = document.createElement("aside");
    menuLateral.className = "nav_overflow";
    menuLateral.setAttribute("aria-hidden", "true");

    const botonCerrar = document.createElement("button");
    botonCerrar.type = "button";
    botonCerrar.className = "nav_close";
    botonCerrar.setAttribute("aria-label", "Cerrar menu");
    botonCerrar.textContent = "x";

    const listaLateral = document.createElement("ul");
    menuLateral.append(botonCerrar, listaLateral);
    nav.append(boton, menuLateral);

    boton.addEventListener("click", () => {
        const abierto = nav.classList.toggle("nav_open");
        boton.setAttribute("aria-expanded", String(abierto));
        boton.setAttribute("aria-label", abierto ? "Cerrar menu" : "Abrir menu");
        menuLateral.setAttribute("aria-hidden", String(!abierto));
    });

    botonCerrar.addEventListener("click", cerrarMenu);

    window.addEventListener("resize", recalcular);
    recalcular();

    function recalcular() {
        const elementos = [...listaPrincipal.children, ...listaLateral.children]
            .filter(elemento => elemento !== botonCerrar);

        elementos.forEach(elemento => listaPrincipal.appendChild(elemento));
        nav.classList.remove("nav_overflow_active");
        boton.hidden = true;
        menuLateral.hidden = true;

        const anchoDisponible = nav.clientWidth - 32;
        const anchos = elementos.map(elemento => elemento.getBoundingClientRect().width);
        const anchoElementos = cantidad => anchos
            .slice(0, cantidad)
            .reduce((total, ancho) => total + ancho, 0)
            + Math.max(0, cantidad - 1) * 8;

        if (anchoElementos(elementos.length) <= anchoDisponible) {
            cerrarMenu();
            return;
        }

        nav.classList.add("nav_overflow_active");
        boton.hidden = false;
        menuLateral.hidden = false;

        const anchoConBoton = anchoDisponible - boton.offsetWidth - 8;
        while (elementos.length > 1 && anchoElementos(elementos.length) > anchoConBoton) {
            const elemento = elementos.pop();
            listaLateral.prepend(elemento);
        }
    }

    function cerrarMenu() {
        nav.classList.remove("nav_open");
        boton.setAttribute("aria-expanded", "false");
        boton.setAttribute("aria-label", "Abrir menu");
        menuLateral.setAttribute("aria-hidden", "true");
    }
}

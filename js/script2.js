// =========================================================
// Simracing Academy — script.js
// Lógica del menú desplegable (botón MENU + panel de navegación)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  const menu = document.querySelector('[data-menu]');
  if (!menu) return; // si no existe el menú en esta página, no hace nada

  const trigger = menu.querySelector('[data-menu-trigger]');
  const panel = menu.querySelector('[data-menu-panel]');

  const openMenu = () => {
    menu.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    menu.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => {
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  };

  // Abrir/cerrar al hacer click en el botón
  trigger.addEventListener('click', (event) => {
    event.stopPropagation(); // evita que el click "burbujee" y dispare el cierre por click-afuera
    toggleMenu();
  });

  // Cerrar al hacer click en cualquier link del panel (navegación a una sección)
  panel.querySelectorAll('.menu__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar al hacer click fuera del menú
  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target)) {
      closeMenu();
    }
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
  });

});

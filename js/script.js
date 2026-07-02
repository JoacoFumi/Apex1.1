// =========================================================
// Simracing Academy — script.js
// Lógica del menú desplegable (botón MENU + panel de navegación)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== MENÚ HAMBURGUESA (mobile) =====
  const menu = document.querySelector('[data-menu]');
  if (menu) {
    const trigger = menu.querySelector('[data-menu-trigger]');
    const panel   = menu.querySelector('[data-menu-panel]');

    const openMenu  = () => { menu.classList.add('is-open');    trigger.setAttribute('aria-expanded', 'true');  };
    const closeMenu = () => { menu.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); };
    const toggleMenu = () => menu.classList.contains('is-open') ? closeMenu() : openMenu();

    trigger.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });

    panel.querySelectorAll('.menu__link').forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('click',   (e) => { if (!menu.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  // ===== FLIP CARDS =====
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
    });
  });

  // Ocultar logo al scrollear
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ===== CARRUSEL DE PROGRAM CARDS =====
  const track     = document.querySelector('[data-carousel-track]');
  const items     = Array.from(document.querySelectorAll('[data-carousel-item]'));
  const btnPrev   = document.querySelector('[data-carousel-prev]');
  const btnNext   = document.querySelector('[data-carousel-next]');

  if (track && items.length) {
    let current = 0;

    // Mueve el track y actualiza estados
    const goTo = (index) => {
      current = index;

      // Calcula el offset: cada card ocupa su ancho + gap
      const cardWidth  = items[0].offsetWidth;
      const gap        = 24; // debe coincidir con el gap del CSS (1.5rem ≈ 24px)
      const offset     = current * (cardWidth + gap);

      track.style.transform = `translateX(-${offset}px)`;

      // Actualiza clase activa en cada card
      items.forEach((item, i) => {
        item.classList.toggle('is-active', i === current);
      });

      // Deshabilita flechas en los extremos (no hay loop)
      btnPrev.disabled = current === 0;
      btnNext.disabled = current === items.length - 1;
    };

    // Init
    goTo(0);

    // Flechas
    btnPrev.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
    btnNext.addEventListener('click', () => { if (current < items.length - 1) goTo(current + 1); });

    // ===== DRAG / SWIPE =====
    let startX    = 0;
    let isDragging = false;
    const DRAG_THRESHOLD = 50; // px mínimos para considerar un swipe

    track.addEventListener('pointerdown', (e) => {
      startX     = e.clientX;
      isDragging = true;
      track.classList.add('is-dragging');
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointerup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('is-dragging');

      const delta = e.clientX - startX;

      if (delta < -DRAG_THRESHOLD && current < items.length - 1) {
        goTo(current + 1); // swipe izquierda → siguiente
      } else if (delta > DRAG_THRESHOLD && current > 0) {
        goTo(current - 1); // swipe derecha → anterior
      }
    });

    // Recalcula en resize para que los offsets sean siempre exactos
    window.addEventListener('resize', () => goTo(current));
  }

  // ===== SIM PREVIEW — video cursor follower =====
const simItems   = document.querySelectorAll('[data-sim-video]');
const simPreview = document.getElementById('simPreview');
const simVideo   = simPreview?.querySelector('.sim-preview__video');

if (simItems.length && simPreview && simVideo) {

  let rafId = null; // para animar la posición con requestAnimationFrame

  const movePreview = (x, y) => {
    // Cancelamos el frame anterior si todavía está pendiente
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      simPreview.style.left = `${x}px`;
      simPreview.style.top  = `${y}px`;
    });
  };

  simItems.forEach(item => {
    const videoSrc = item.dataset.simVideo;

    item.addEventListener('mouseenter', () => {
      // Cambiamos la fuente solo si es diferente al video actual
      if (simVideo.src !== videoSrc && !simVideo.src.endsWith(videoSrc)) {
        simVideo.src = videoSrc;
        simVideo.load();
      }
      simVideo.play().catch(() => {}); // .catch() evita error si el browser bloquea autoplay
      simPreview.classList.add('is-visible');
    });

    item.addEventListener('mousemove', (e) => {
      movePreview(e.clientX, e.clientY);
    });

    item.addEventListener('mouseleave', () => {
      simPreview.classList.remove('is-visible');
      simVideo.pause();
    });
  });
}
});

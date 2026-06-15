'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollProgress();
  initNav();
  initMobileMenu();
  initRevealAnimations();
  initCounters();
  initTestimonialCarousel();
  initMenuFilter();
  initGalleryFilter();
  initLightbox();
  initReservationForm();
  initNewsletterForm();
  initActiveNavLinks();
  setCurrentYear();
  initDateMin();
});

/* ── Theme Toggle ── */
function initThemeToggle() {
  const html    = document.documentElement;
  const btnNav  = document.getElementById('themeToggleBtn');
  const btnMob  = document.getElementById('themeToggleMobile');

  const STORAGE_KEY = 'chirp-theme';
  const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
  html.setAttribute('data-theme', saved);
  syncAriaLabels(saved);

  function toggle() {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

    // Brief transition class so color changes animate smoothly
    document.body.classList.add('theme-transitioning');
    html.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
    syncAriaLabels(next);
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 400);
  }

  function syncAriaLabels(theme) {
    const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    [btnNav, btnMob].forEach(btn => btn && btn.setAttribute('aria-label', label));
  }

  btnNav && btnNav.addEventListener('click', toggle);
  btnMob && btnMob.addEventListener('click', toggle);

  // Keyboard shortcut: Shift+T
  document.addEventListener('keydown', e => {
    if (e.shiftKey && e.key === 'T' && !e.ctrlKey && !e.metaKey &&
        !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
      toggle();
    }
  });
}

/* ── Scroll Progress Bar ── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
  }, { passive: true });
}

/* ── Nav scroll state ── */
function initNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const btn      = document.getElementById('hamburgerBtn');
  const menu     = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('menuCloseBtn');
  const overlay  = document.getElementById('menuOverlay');
  if (!btn || !menu) return;

  const links = menu.querySelectorAll('.mobile-menu__link, .mobile-menu__ctas a');

  function open() {
    menu.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => menu.classList.contains('open') ? close() : open());
  closeBtn && closeBtn.addEventListener('click', close);
  overlay  && overlay.addEventListener('click', close);
  links.forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) close(); });
}

/* ── Reveal Animations (IntersectionObserver) ── */
function initRevealAnimations() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Stagger children in grid/flex parents
  document.querySelectorAll('.dishes__grid, .awards__grid, .experience__features, .footer__grid').forEach(parent => {
    parent.querySelectorAll('.reveal').forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  // Hero fires quickly
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('revealed'));
  }, 100);

  els.forEach(el => {
    if (!el.closest('.hero')) observer.observe(el);
  });
}

/* ── Counters ── */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const target = parseInt(entry.target.dataset.count, 10);
      const duration = 1800;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        entry.target.textContent = Math.floor(ease * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else entry.target.textContent = target.toLocaleString();
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  els.forEach(el => observer.observe(el));
}

/* ── Testimonial Carousel ── */
function initTestimonialCarousel() {
  const carousel = document.getElementById('testimonialsCarousel');
  const wrap     = carousel && carousel.parentElement;
  const prevBtn  = document.getElementById('testimonialPrev');
  const nextBtn  = document.getElementById('testimonialNext');
  const dotsWrap = document.getElementById('testimonialDots');
  if (!carousel || !wrap) return;

  const cards = Array.from(carousel.querySelectorAll('.testimonial-card'));
  let current = 0;
  let autoplay;
  let startX = 0;
  const GAP = 16; // 1rem

  function getPerView() {
    if (window.innerWidth <= 640)  return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function totalSlides() {
    return Math.ceil(cards.length / getPerView());
  }

  function getCardWidth() {
    const pv = getPerView();
    const wrapW = wrap.offsetWidth || 900;
    return Math.floor((wrapW - GAP * (pv - 1)) / pv);
  }

  function setCardWidths() {
    const w = getCardWidth();
    cards.forEach(card => {
      card.style.flex = `0 0 ${w}px`;
      card.style.width = `${w}px`;
    });
  }

  function goTo(index) {
    const pv = getPerView();
    const max = totalSlides() - 1;
    current = Math.max(0, Math.min(index, max));
    const cardW = getCardWidth();
    const slideStep = cardW + GAP;
    carousel.style.transform = `translateX(-${current * pv * slideStep}px)`;
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    const n = totalSlides();
    for (let i = 0; i < n; i++) {
      const btn = document.createElement('button');
      btn.className = 'dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `Review ${i + 1} of ${n}`);
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', () => { goTo(i); resetAutoplay(); });
      dotsWrap.appendChild(btn);
    }
  }

  function updateLayout() {
    setCardWidths();
    const clamped = Math.min(current, totalSlides() - 1);
    goTo(clamped);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => goTo((current + 1) % totalSlides()), 5000);
  }

  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = startX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) { dx > 0 ? goTo(current + 1) : goTo(current - 1); resetAutoplay(); }
  });

  wrap.addEventListener('mouseenter', () => clearInterval(autoplay));
  wrap.addEventListener('mouseleave', resetAutoplay);

  buildDots();
  updateLayout();
  resetAutoplay();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildDots(); updateLayout(); }, 150);
  });
}

/* ── Menu Filter + Search ── */
function initMenuFilter() {
  const tabs  = document.querySelectorAll('.menu-tab');
  const items = document.querySelectorAll('.menu-item');
  const search = document.getElementById('menuSearch');
  const empty  = document.getElementById('menuEmpty');
  const grid   = document.getElementById('menuGrid');
  if (!tabs.length) return;

  let activeCat = 'all';

  function applyFilters() {
    const query = (search ? search.value.toLowerCase().trim() : '');
    let visible = 0;
    items.forEach(item => {
      const cat  = item.dataset.cat || '';
      const name = (item.dataset.name || '').toLowerCase();
      const matchCat  = activeCat === 'all' || cat === activeCat;
      const matchSearch = !query || name.includes(query);
      const show = matchCat && matchSearch;
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
    if (grid)  grid.style.display  = visible === 0 ? 'none' : '';
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeCat = tab.dataset.cat || 'all';
      applyFilters();
    });
  });

  search && search.addEventListener('input', applyFilters);
}

/* ── Gallery Filter ── */
function initGalleryFilter() {
  const filters = document.querySelectorAll('.gallery-filter');
  const items   = document.querySelectorAll('.gallery-item');
  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => { f.classList.remove('active'); f.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const cat = btn.dataset.gcat || 'all';
      items.forEach(item => {
        const match = cat === 'all' || item.dataset.gcat === cat;
        item.classList.toggle('hidden', !match);
      });
    });
  });
}

/* ── Lightbox ── */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const img      = document.getElementById('lightboxImg');
  const close    = document.getElementById('lightboxClose');
  const backdrop = document.getElementById('lightboxBackdrop');
  const prev     = document.getElementById('lightboxPrev');
  const next     = document.getElementById('lightboxNext');
  const counter  = document.getElementById('lightboxCounter');
  if (!lightbox || !img) return;

  const galleryBtns = Array.from(document.querySelectorAll('.gallery-item__btn'));
  let current = 0;
  let startX  = 0;

  function getVisible() {
    return galleryBtns.filter(btn => !btn.closest('.gallery-item.hidden'));
  }

  function openAt(index) {
    const visible = getVisible();
    if (!visible.length) return;
    current = Math.max(0, Math.min(index, visible.length - 1));
    const src = visible[current].querySelector('img').src;
    const alt = visible[current].querySelector('img').alt;
    img.src = src;
    img.alt = alt;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (counter) counter.textContent = `${current + 1} / ${visible.length}`;
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    img.src = '';
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    const visible = getVisible();
    current = (current + dir + visible.length) % visible.length;
    openAt(current);
  }

  galleryBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const visible = getVisible();
      const visibleIdx = visible.indexOf(btn);
      openAt(visibleIdx >= 0 ? visibleIdx : 0);
    });
  });

  close    && close.addEventListener('click', closeLightbox);
  backdrop && backdrop.addEventListener('click', closeLightbox);
  prev     && prev.addEventListener('click', () => navigate(-1));
  next     && next.addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', e => {
    if (lightbox.style.display === 'none') return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });

  // Touch swipe
  lightbox.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = startX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) navigate(dx > 0 ? 1 : -1);
  });
}

/* ── Reservation Form ── */
function initReservationForm() {
  const form    = document.getElementById('reservationForm');
  const submitBtn = document.getElementById('reservationSubmit');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  function validateField(input, errorId, validator) {
    const error = document.getElementById(errorId);
    const msg = validator(input.value.trim());
    if (error) error.textContent = msg;
    input.classList.toggle('valid', !msg);
    input.classList.toggle('invalid', !!msg);
    return !msg;
  }

  const fields = [
    {
      id: 'guestName',
      errorId: 'guestNameError',
      validate: v => !v ? 'Please enter your full name.' : v.length < 2 ? 'Name must be at least 2 characters.' : ''
    },
    {
      id: 'guestPhone',
      errorId: 'guestPhoneError',
      validate: v => {
        if (!v) return 'Please enter your phone number.';
        const clean = v.replace(/[\s\-()]/g, '');
        if (!/^(\+91|91|0)?[6-9]\d{9}$/.test(clean)) return 'Please enter a valid Indian phone number.';
        return '';
      }
    },
    {
      id: 'bookingDate',
      errorId: 'bookingDateError',
      validate: v => {
        if (!v) return 'Please select a date.';
        const today = new Date(); today.setHours(0,0,0,0);
        if (new Date(v) < today) return 'Date cannot be in the past.';
        return '';
      }
    },
    {
      id: 'bookingTime',
      errorId: 'bookingTimeError',
      validate: v => !v ? 'Please select a time.' : ''
    },
    {
      id: 'guestCount',
      errorId: 'guestCountError',
      validate: v => !v ? 'Please select your group size.' : ''
    }
  ];

  // Live validation on blur
  fields.forEach(({ id, errorId, validate }) => {
    const el = document.getElementById(id);
    el && el.addEventListener('blur', () => validateField(el, errorId, validate));
    el && el.addEventListener('input', () => {
      if (el.classList.contains('invalid')) validateField(el, errorId, validate);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    fields.forEach(({ id, errorId, validate }) => {
      const el = document.getElementById(id);
      if (el && !validateField(el, errorId, validate)) valid = false;
    });
    if (!valid) {
      const firstInvalid = form.querySelector('.invalid');
      firstInvalid && firstInvalid.focus();
      return;
    }

    // Show loader
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      form.reset();
      fields.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) { el.classList.remove('valid', 'invalid'); }
      });
      if (success) {
        success.style.display = 'flex';
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { success.style.display = 'none'; }, 8000);
      }
    }, 1200);
  });
}

/* ── Newsletter Form ── */
function initNewsletterForm() {
  const form  = document.getElementById('newsletterForm');
  const input = document.getElementById('newsletterEmail');
  const msg   = document.getElementById('newsletterMsg');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = (input ? input.value.trim() : '');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (msg) { msg.className = 'footer__newsletter-msg error'; msg.textContent = 'Please enter a valid email address.'; }
      return;
    }
    if (msg) { msg.className = 'footer__newsletter-msg success'; msg.textContent = '✓ You\'re in! Expect cocktail specials & Chirp events in your inbox.'; }
    form.reset();
    setTimeout(() => { if (msg) msg.textContent = ''; }, 5000);
  });
}

/* ── Active Nav Links (IntersectionObserver) ── */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ── Set Current Year ── */
function setCurrentYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Date Input Min = Today ── */
function initDateMin() {
  const dateInput = document.getElementById('bookingDate');
  if (!dateInput) return;
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

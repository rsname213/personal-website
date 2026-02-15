/* =====================================================
   SPA ROUTING
   ===================================================== */
const SECTIONS = ['hello', 'about', 'investments', 'experience', 'ai', 'contact'];
let currentSection  = null;
let isTransitioning = false;
let firstLoad       = true;

const pageWipe = document.getElementById('pageWipe');

function navigate(id, fromEl) {
  if (!SECTIONS.includes(id)) id = 'hello';
  if (id === currentSection) { closeNav(); return; }
  if (isTransitioning) return;

  // Capture clone position BEFORE closing nav (overlay may be open)
  let clone = null;
  if (fromEl && !firstLoad) {
    const iconEl = fromEl.querySelector('.icon i');
    const rect   = fromEl.getBoundingClientRect();

    clone = document.createElement('div');
    clone.className = 'nav-clone';
    Object.assign(clone.style, {
      left: rect.left + 'px',
      top:  rect.top  + 'px',
      width:  rect.width  + 'px',
      height: rect.height + 'px',
      transition: 'none'
    });
    if (iconEl) clone.innerHTML = `<i class="${iconEl.className}"></i>`;
    document.body.appendChild(clone);

    // Calculate container left edge (heading will land here)
    const vw = window.innerWidth;
    const containerLeft = Math.max(40, (vw - 1200) / 2 + 40);

    // Phase 1 flight: icon flies as compact box toward heading position
    requestAnimationFrame(() => requestAnimationFrame(() => {
      clone.style.transition = '';
      clone.style.left   = containerLeft + 'px';
      clone.style.top    = '115px';   // header (75px) + section padding-top (40px)
      clone.style.width  = '50px';
      clone.style.height = '50px';
    }));
  }

  closeNav();

  // Update nav highlight immediately
  document.querySelectorAll('.element-box').forEach(el => {
    el.classList.toggle('active', el.dataset.section === id);
  });
  const logo = document.querySelector('.header__logo');
  if (logo) logo.classList.toggle('active', id === 'hello');

  const next = document.getElementById(id);
  if (!next) return;

  if (firstLoad) {
    firstLoad = false;
    doSwitch(id, next);
    // Small delay so first paint completes before animations fire
    setTimeout(() => {
      triggerAnims(next);
      if (id === 'about') animateSkillBars();
      if (id === 'hello') animateCounters();
    }, 60);
    return;
  }

  isTransitioning = true;

  // Phase 1: dark bar sweeps left → right (350ms)
  pageWipe.classList.remove('wipe--out');
  pageWipe.classList.add('wipe--in');

  setTimeout(() => {
    // Phase 2: swap section while screen is covered
    doSwitch(id, next);

    // Contract clone to the heading's border-left shape (instant, behind the wipe)
    if (clone) {
      const h2El = next.querySelector('.section-header h2');
      if (h2El) {
        const h2Rect = h2El.getBoundingClientRect();
        clone.innerHTML = '';              // remove icon — just a blue sliver
        clone.style.transition = 'none';  // instant jump — wipe is covering the screen
        clone.style.left   = h2Rect.left + 'px';
        clone.style.top    = h2Rect.top  + 'px';
        clone.style.width  = '6px';
        clone.style.height = h2Rect.height + 'px';
        // Fade after barReveal has started — bar immediately sweeps past the 6px clone
        setTimeout(() => {
          clone.style.transition = 'opacity .2s ease';
          clone.style.opacity = '0';
          setTimeout(() => clone.remove(), 250);
        }, 150);
      } else {
        // Hello section (no section-header h2) — just fade out
        clone.style.transition = 'opacity .2s ease';
        clone.style.opacity = '0';
        setTimeout(() => clone.remove(), 250);
      }
    }

    // Phase 3: dark bar sweeps right → off (400ms)
    pageWipe.classList.remove('wipe--in');
    pageWipe.classList.add('wipe--out');

    // Phase 4: trigger content anims as the wipe is clearing
    setTimeout(() => {
      triggerAnims(next);
      if (id === 'about') animateSkillBars();
      if (id === 'hello') animateCounters();
    }, 80);

    // Phase 5: done
    setTimeout(() => {
      pageWipe.classList.remove('wipe--out');
      isTransitioning = false;
    }, 420);
  }, 350);
}

function doSwitch(id, next) {
  if (currentSection) {
    const prev = document.getElementById(currentSection);
    if (prev) prev.classList.remove('active');
  }
  next.classList.add('active');
  currentSection = id;
  window.scrollTo(0, 0);
}

function triggerAnims(section) {
  const els = section.querySelectorAll('[data-anim]');
  els.forEach(el => el.classList.remove('anim-done'));

  requestAnimationFrame(() => {
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add('anim-done'), i * 80);
    });
  });
}


/* =====================================================
   MENU BUTTON + NAV OVERLAY
   ===================================================== */
const menuBtn    = document.getElementById('menuBtn');
const navOverlay = document.getElementById('navOverlay');
let navOpen = false;

function openNav() {
  navOpen = true;
  menuBtn.classList.add('open');
  navOverlay.classList.add('open');
  document.body.classList.add('nav-open');
  menuBtn.setAttribute('aria-label', 'Close navigation');
}

function closeNav() {
  navOpen = false;
  menuBtn.classList.remove('open');
  navOverlay.classList.remove('open');
  document.body.classList.remove('nav-open');
  menuBtn.setAttribute('aria-label', 'Open navigation');
}

menuBtn.addEventListener('click', () => {
  navOpen ? closeNav() : openNav();
});

// Close on overlay background click
navOverlay.addEventListener('click', e => {
  if (e.target === navOverlay) closeNav();
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navOpen) closeNav();
});


/* =====================================================
   ELEMENT-BOX NAV LINKS
   ===================================================== */
document.querySelectorAll('.element-box[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.dataset.section;
    history.pushState(null, '', '#' + id);
    navigate(id, link);  // pass clicked element for clone animation
  });
});

// Header logo
const headerLogo = document.querySelector('.header__logo[data-section]');
if (headerLogo) {
  headerLogo.addEventListener('click', e => {
    e.preventDefault();
    history.pushState(null, '', '#hello');
    navigate('hello');
  });
}

// CTA links in sections (href="#section" + data-section)
document.querySelectorAll('a[data-section]').forEach(link => {
  if (link.classList.contains('element-box') || link.classList.contains('header__logo')) return;
  link.addEventListener('click', e => {
    const id = link.dataset.section;
    if (id && SECTIONS.includes(id)) {
      e.preventDefault();
      history.pushState(null, '', '#' + id);
      navigate(id);
    }
  });
});

// Hash change (back/forward)
window.addEventListener('hashchange', () => {
  const id = window.location.hash.replace('#', '') || 'hello';
  navigate(id);
});


/* =====================================================
   SKILL BAR ANIMATION
   ===================================================== */
let skillsAnimated = false;

function animateSkillBars() {
  if (skillsAnimated) return;
  skillsAnimated = true;

  document.querySelectorAll('.skill-bar[data-pct]').forEach((bar, i) => {
    const pct = parseInt(bar.dataset.pct, 10);
    setTimeout(() => {
      bar.style.width = pct + '%';
    }, 200 + i * 120);
  });
}


/* =====================================================
   HELLO WORLD! TYPEWRITER
   ===================================================== */
let helloTyped = false;

function typeHello() {
  if (helloTyped) return;
  helloTyped = true;

  const el = document.getElementById('helloTyped');
  if (!el) return;

  const text = 'Hello World!';
  let i = 0;
  el.textContent = '';

  // slight delay before typing starts (after section animates in)
  setTimeout(() => {
    const iv = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) clearInterval(iv);
    }, 85);
  }, 200);
}

// Called when hello section activates
function animateCounters() {
  typeHello();
}


/* =====================================================
   INVESTMENT FILTER
   ===================================================== */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const items  = document.querySelectorAll('#investGrid > li');

    items.forEach((item, i) => {
      const show = filter === 'all' || item.dataset.cat === filter;
      if (show) {
        item.style.display = '';
        setTimeout(() => item.classList.add('anim-done'), i * 60);
      } else {
        item.classList.remove('anim-done');
        item.style.display = 'none';
      }
    });
  });
});


/* =====================================================
   HEADER — hide on scroll down, show on scroll up (Niño's behavior)
   ===================================================== */
const header = document.getElementById('header');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > lastScrollY && y > 80) {
    header.classList.add('hide');
  } else {
    header.classList.remove('hide');
  }
  lastScrollY = y;
}, { passive: true });


/* =====================================================
   INITIAL LOAD
   ===================================================== */
(function init() {
  const hash = window.location.hash.replace('#', '') || 'hello';
  navigate(hash);
})();

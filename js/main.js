/* =====================================================
   SPA ROUTING
   ===================================================== */
const SECTIONS = ['hello', 'about', 'investments', 'collection', 'contact'];
let currentSection  = null;
let isTransitioning = false;
let firstLoad       = true;

const pageWipe = document.getElementById('pageWipe');

function spawnNavClone(fromEl, targetId) {
  const targetSection = document.getElementById(targetId);
  if (!targetSection) return;

  // Briefly make the section measurable (fixed + invisible so layout isn't disrupted)
  targetSection.style.cssText = 'display:block;visibility:hidden;position:fixed;top:0;left:0;width:100%;pointer-events:none;z-index:-1;';
  const h2El = targetSection.querySelector('.section-header h2');
  if (!h2El) { targetSection.style.cssText = ''; return; }

  const fromRect = fromEl.getBoundingClientRect();
  const h2Rect   = h2El.getBoundingClientRect();
  targetSection.style.cssText = '';

  // Target = the blue left border stripe on the h2 (6px wide, full h2 height)
  const targetLeft   = h2Rect.left;
  const targetTop    = h2Rect.top;
  const targetWidth  = 6;
  const targetHeight = h2Rect.height;

  // Create a blue clone at the nav element's position
  const clone = document.createElement('div');
  clone.style.cssText = [
    'position:fixed',
    `left:${fromRect.left}px`,
    `top:${fromRect.top}px`,
    `width:${fromRect.width}px`,
    `height:${fromRect.height}px`,
    `background:${getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2196f3'}`,
    'border-radius:8px',
    'z-index:250',               // sits BELOW the page wipe (z-index 300)
    'pointer-events:none',
    'will-change:left,top,width,height',
    'transition:left .35s cubic-bezier(.19,1,.22,1),top .35s cubic-bezier(.19,1,.22,1),width .35s cubic-bezier(.19,1,.22,1),height .35s cubic-bezier(.19,1,.22,1),border-radius .35s ease',
  ].join(';');
  document.body.appendChild(clone);

  // Next two frames: morph clone into the thin blue left-border stripe of the h2
  requestAnimationFrame(() => requestAnimationFrame(() => {
    clone.style.left         = targetLeft   + 'px';
    clone.style.top          = targetTop    + 'px';
    clone.style.width        = targetWidth  + 'px';
    clone.style.height       = targetHeight + 'px';
    clone.style.borderRadius = '0';
  }));

  // Remove once the wipe has fully covered the screen
  setTimeout(() => clone.remove(), 420);
}

function navigate(id, fromEl) {
  if (!SECTIONS.includes(id)) id = 'hello';
  if (id === currentSection) { closeNav(); return; }
  if (isTransitioning) return;

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

  // Nav-clone: blue box flies from clicked element → target section's header bar
  // Kept at z-index 250 (below the page wipe at 300) so the wipe covers it cleanly
  if (fromEl) spawnNavClone(fromEl, id);

  // Phase 1: dark bar sweeps left → right (350ms)
  pageWipe.classList.remove('wipe--out');
  pageWipe.classList.add('wipe--in');

  setTimeout(() => {
    // Phase 2: swap section while screen is covered
    doSwitch(id, next);

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
  // Don't reset the section-header — its bar/text animation should stay visible
  els.forEach(el => {
    if (!el.classList.contains('section-header')) el.classList.remove('anim-done');
  });

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
   THEME PANEL
   ===================================================== */
(function initThemePanel() {
  const btn   = document.getElementById('themeBtn');
  const panel = document.getElementById('themePanel');
  if (!btn || !panel) return;

  // ── Open / close ──────────────────────────────────
  let panelOpen = false;
  function openPanel()  { panelOpen = true;  panel.classList.add('open');    panel.setAttribute('aria-hidden', 'false'); }
  function closePanel() { panelOpen = false; panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true');  }

  btn.addEventListener('click', e => { e.stopPropagation(); panelOpen ? closePanel() : openPanel(); });
  document.addEventListener('click', e => { if (panelOpen && !panel.contains(e.target)) closePanel(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panelOpen) closePanel(); });

  // ── Apply a preset ────────────────────────────────
  function applyPreset(accent, bg, text) {
    const root = document.documentElement;
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--bg',     bg);
    root.style.setProperty('--text',   text);
    // Keep split-circle button in sync
    document.querySelector('.theme-btn__top').style.background    = accent;
    document.querySelector('.theme-btn__bottom').style.background = bg;
  }

  // ── Preset buttons ────────────────────────────────
  panel.querySelectorAll('.theme-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('.theme-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyPreset(btn.dataset.accent, btn.dataset.bg, btn.dataset.text);
    });
  });
})();


/* =====================================================
   INITIAL LOAD
   ===================================================== */
(function init() {
  const hash = window.location.hash.replace('#', '') || 'hello';
  navigate(hash);
})();

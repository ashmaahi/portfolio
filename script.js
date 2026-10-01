/* ─────────────────────────────────────────
   Setup
───────────────────────────────────────── */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const hasGsap      = typeof window.gsap !== 'undefined';
const animate      = hasGsap && !reduceMotion;

if (animate && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
if (animate) document.body.classList.add('is-loading');

document.getElementById('year').textContent = new Date().getFullYear();

/* ─────────────────────────────────────────
   Split headings into words
───────────────────────────────────────── */
function splitWords(el) {
  const walk = node => {
    Array.from(node.childNodes).forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const w = document.createElement('span');
            w.className = 'w';
            const inner = document.createElement('span');
            inner.textContent = part;
            w.appendChild(inner);
            frag.appendChild(w);
          }
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
}

if (animate) document.querySelectorAll('.split').forEach(splitWords);

/* ─────────────────────────────────────────
   Preloader & hero intro
───────────────────────────────────────── */
const preloader = document.querySelector('.preloader');
const countEl   = document.querySelector('.preloader-count');
const barEl     = document.querySelector('.preloader-bar span');

function heroIntro() {
  if (!animate) return;
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('.hero-title .word', { yPercent: 110, duration: 1.2, stagger: 0.08 })
    .from('[data-hero]', { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, '-=0.9')
    .from('.portrait-frame', {
      clipPath: 'inset(100% 0% 0% 0% round 28px)',
      scale: 1.08,
      duration: 1.4,
      ease: 'expo.out',
    }, 0.1)
    .from('.float-chip, .portrait-card', {
      scale: 0.6,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'back.out(1.8)',
    }, '-=0.8')
    .from('.nav-container', { y: -30, opacity: 0, duration: 0.8 }, 0.2)
    .from('.scroll-cue', { opacity: 0, duration: 0.8 }, '-=0.4');
}

function finishLoading() {
  document.body.classList.remove('is-loading');
  preloader.classList.add('done');
  setTimeout(() => preloader.remove(), 1000);
  heroIntro();
  if (animate && window.ScrollTrigger) ScrollTrigger.refresh();
}

if (animate) {
  gsap.set('.hero-title .word, [data-hero], .portrait-frame, .float-chip, .portrait-card', { willChange: 'transform' });
  const counter = { v: 0 };
  gsap.to(counter, {
    v: 100,
    duration: 1.3,
    ease: 'power2.inOut',
    onUpdate: () => {
      countEl.textContent = Math.round(counter.v);
      barEl.style.width = counter.v + '%';
    },
    onComplete: () => {
      if (document.readyState === 'complete') finishLoading();
      else window.addEventListener('load', finishLoading, { once: true });
    },
  });
} else {
  finishLoading();
}

/* ─────────────────────────────────────────
   Scroll animations
───────────────────────────────────────── */
if (animate && window.ScrollTrigger) {
  gsap.utils.toArray('.split').forEach(el => {
    gsap.from(el.querySelectorAll('.w > span'), {
      yPercent: 110,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.04,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  gsap.utils.toArray('.section-label, .contact-sub, .contact-actions, .contact-links').forEach(el => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  gsap.from('.marquee', { opacity: 0, duration: 1.2, scrollTrigger: { trigger: '.marquee', start: 'top 95%' } });

  gsap.utils.toArray('.project').forEach(project => {
    const media = project.querySelector('.project-media');
    const img   = media.querySelector('img');
    const fromLeft = !project.classList.contains('project-reverse');

    gsap.from(media, {
      clipPath: fromLeft ? 'inset(0% 100% 0% 0% round 24px)' : 'inset(0% 0% 0% 100% round 24px)',
      duration: 1.5,
      ease: 'expo.inOut',
      scrollTrigger: { trigger: project, start: 'top 75%' },
    });
    gsap.fromTo(img, { yPercent: -3, scale: 1.08 }, {
      yPercent: 3,
      scale: 1.08,
      ease: 'none',
      scrollTrigger: { trigger: project, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from(project.querySelectorAll('.project-info > *'), {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: project, start: 'top 70%' },
    });
  });

  gsap.from('.service-card', {
    y: 80,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '.services-grid', start: 'top 80%' },
  });

  gsap.from('.bento', {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '.skills-bento', start: 'top 80%' },
  });

  const steps = gsap.utils.toArray('.process-step');
  gsap.from(steps, {
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.15,
    scrollTrigger: { trigger: '.process', start: 'top 80%' },
  });
  gsap.to('.process-line-fill', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '.process',
      start: 'top 70%',
      end: 'bottom 55%',
      scrub: 0.6,
      onUpdate: self => {
        steps.forEach((step, i) => {
          step.classList.toggle('active', self.progress >= i / (steps.length - 1) - 0.02);
        });
      },
    },
  });
  ScrollTrigger.create({
    trigger: '.process',
    start: 'top 70%',
    onEnter: () => {
      if (window.innerWidth <= 900) steps.forEach(s => s.classList.add('active'));
    },
  });

  gsap.from('.about-photo', {
    clipPath: 'inset(100% 0% 0% 0% round 24px)',
    duration: 1.6,
    ease: 'expo.inOut',
    scrollTrigger: { trigger: '.about', start: 'top 75%' },
  });
  gsap.from('.about-body p, .about-stats', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '.about-body', start: 'top 75%' },
  });

  gsap.to('.aurora', {
    yPercent: 40,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero-content', {
    y: -80,
    opacity: 0.2,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
}

/* ─────────────────────────────────────────
   Counters
───────────────────────────────────────── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target);
    counterObserver.unobserve(el);
    if (!animate) { el.textContent = target.toLocaleString('en-US'); return; }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('en-US'); },
    });
  });
}, { threshold: 0.6 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ─────────────────────────────────────────
   Rotating role text (typewriter)
───────────────────────────────────────── */
const roles = ['custom modules', 'OpenCart features', 'web scrapers', 'Telegram bots', 'sales CRMs', 'e-commerce systems'];
const rotatorWord = document.querySelector('.rotator-word');

if (!reduceMotion && rotatorWord) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting  = true;

  const tick = () => {
    const word = roles[roleIndex];
    if (deleting) {
      charIndex--;
      if (charIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    } else {
      charIndex++;
    }
    rotatorWord.textContent = roles[roleIndex].slice(0, Math.max(charIndex, 0)) || '\u00a0';

    let delay = deleting ? 40 : 75;
    if (!deleting && charIndex === roles[roleIndex].length) {
      deleting = true;
      delay = 2200;
    }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 3800);
}

/* ─────────────────────────────────────────
   Navigation: scroll state, hide on scroll down, progress
───────────────────────────────────────── */
const navHeader = document.querySelector('.nav-header');
const progress  = document.querySelector('.scroll-progress');
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
let lastY = 0;

function onScroll() {
  const y   = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  navHeader.classList.toggle('scrolled', y > 30);
  const menuOpen = navLinks.classList.contains('open');
  navHeader.classList.toggle('hidden', !menuOpen && y > lastY && y > 400);
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  lastY = y;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

function setMenu(open) {
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.classList.toggle('open', open);
  navLinks.classList.toggle('open', open);
}
navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

/* ─────────────────────────────────────────
   Custom cursor
───────────────────────────────────────── */
if (finePointer && !reduceMotion) {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = -100, my = -100, rx = -100, ry = -100;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    document.body.classList.add('has-cursor');
  }, { passive: true });
  document.addEventListener('mouseleave', () => document.body.classList.remove('has-cursor'));

  const loop = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.transform  = `translate(${mx}px, ${my}px)`;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  };
  loop();

  document.querySelectorAll('a, button, .project-media, .pills span').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ─────────────────────────────────────────
   Magnetic buttons
───────────────────────────────────────── */
if (finePointer && animate) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width / 2) * 0.3,
        y: (e.clientY - r.top - r.height / 2) * 0.4,
        duration: 0.4,
        ease: 'power3.out',
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ─────────────────────────────────────────
   3D tilt + hero parallax
───────────────────────────────────────── */
if (finePointer && animate) {
  document.querySelectorAll('.project-media.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateY: px * 8, rotateX: -py * 8, transformPerspective: 1000, duration: 0.6, ease: 'power3.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.9, ease: 'power3.out' });
    });
  });

  const hero     = document.querySelector('.hero');
  const portrait = document.querySelector('.portrait');
  const depthEls = document.querySelectorAll('[data-depth]');

  hero.addEventListener('mousemove', e => {
    const px = e.clientX / window.innerWidth - 0.5;
    const py = e.clientY / window.innerHeight - 0.5;
    gsap.to(portrait, { rotateY: px * 10, rotateX: -py * 10, duration: 1, ease: 'power3.out' });
    depthEls.forEach(el => {
      const d = Number(el.dataset.depth);
      gsap.to(el, { x: px * d, y: py * d, duration: 1.2, ease: 'power3.out' });
    });
  });
  hero.addEventListener('mouseleave', () => {
    gsap.to(portrait, { rotateY: 0, rotateX: 0, duration: 1.2, ease: 'power3.out' });
    gsap.to(depthEls, { x: 0, y: 0, duration: 1.2, ease: 'power3.out' });
  });
}

/* ─────────────────────────────────────────
   Spotlight hover
───────────────────────────────────────── */
document.querySelectorAll('.spotlight').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ─────────────────────────────────────────
   Copy email
───────────────────────────────────────── */
const copyBtn = document.querySelector('.copy-email');
copyBtn.addEventListener('click', async () => {
  const label = copyBtn.querySelector('span');
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    label.textContent = 'Copied!';
  } catch {
    label.textContent = copyBtn.dataset.email;
  }
  copyBtn.classList.add('copied');
  setTimeout(() => {
    label.textContent = 'Copy email';
    copyBtn.classList.remove('copied');
  }, 2000);
});

/* ─────────────────────────────────────────
   Project detail modal
───────────────────────────────────────── */
const projectData = {
  pcbuilder: {
    title: 'OpenCart PC Builder System',
    tags: ['OpenCart', 'PHP', 'JavaScript', 'MySQL'],
    images: [
      'pc%20builder%20software%20performance.png',
      'pcbuilder%20games%20performance.png',
    ],
    imageAlts: [
      'PC Builder performance overview',
      'PC Builder games performance estimation',
    ],
    overview: `A custom-built PC configuration system integrated into OpenCart that dynamically calculates performance scores and guides users through selecting compatible hardware components — designed as a seamless shopping experience on top of the OpenCart catalog.`,
    challenge: `The core challenge was implementing real-time component compatibility logic and a performance estimation engine entirely within the OpenCart module system, without replacing the native cart and product workflows.`,
    highlights: [
      'Real-time component compatibility validation as the user selects parts',
      'FPS and performance estimation based on selected CPU/GPU combination',
      'Dynamic UI updates via AJAX — no full page reloads',
      'Custom OpenCart module architecture with OCMOD hooks',
      'Database-driven rules for compatibility and scoring',
    ],
  },
  tracker: {
    title: 'Price & Stock Tracker with Telegram Bot',
    tags: ['Python', 'Scrapy', 'MongoDB', 'Telegram Bot API', 'Charts'],
    images: [
      'images/tracker-dashboard.png',
      'images/tracker-history.png',
      'scrapper.png',
    ],
    imageAlts: [
      'Tracker dashboard listing 22,670 products with price and stock',
      'Price and stock history chart for a single product',
      'Raw structured product data collected by the scraper',
    ],
    overview: `A competitor-intelligence system for a computer retail business. A Scrapy spider collects every product from Startech each day (name, product code, brand, category, price, regular price and stock) and stores a daily snapshot in MongoDB. A live web dashboard lets you search 22,000+ products and open any one to see its price and stock history as a chart. A Telegram bot sends alerts when prices change and answers product-code or name searches with a chart image and a history table.`,
    challenge: `Turning a one-off scraper into a reliable daily system: capturing product codes for stable matching, storing history without duplicates, rendering clear charts for products that are "to be announced" or out of stock, and keeping the scraper, dashboard and bot running unattended through Windows Task Scheduler.`,
    highlights: [
      '22,000+ products scraped and snapshotted daily, with tens of thousands of history points',
      'Searchable dashboard with 50-per-page lists, stock filters and auto-refresh',
      'Interactive price and stock history graph per product',
      'Telegram bot with password access, code and name lookup, and chart reports',
      'Automatic price-change alerts after each daily scrape',
      'One-click "Send to Telegram" from the dashboard',
    ],
  },
  crm: {
    title: 'Lead Crawler & Call Desk CRM',
    tags: ['Node.js', 'MySQL', 'Cheerio', 'JavaScript', 'WhatsApp'],
    images: ['images/cover-crm.jpg'],
    imageAlts: ['Lead crawler and CRM illustration'],
    overview: `A lead-generation and outreach system for selling business software to computer shops. A concurrent Node.js crawler collects every member company from the Bangladesh Computer Samity public directory (company, branch, representative, phone, email, website and address) and upserts it into MySQL. A local call-desk web app then turns that list into a daily sales routine.`,
    challenge: `Making outreach consistent. The app tracks who has been called and how interested they are, generates a personalised Bangla WhatsApp message for each contact, reuses a single WhatsApp tab instead of opening dozens, and enforces a daily target of 10 messages. It even opens itself every morning.`,
    highlights: [
      '3,172 member records crawled into MySQL in about 14 seconds (30+ concurrent requests)',
      'Resumable crawl with JSON and CSV exports',
      'Call status, interest level, notes and full call-log history per lead',
      'Personalised Bangla WhatsApp templates, sent from one reusable tab',
      'Daily outreach target with progress tracking and reminders',
      '"Tomorrow Jobs" drag-and-drop Kanban: To Do, Waiting, Callback, Interested, Not interested',
    ],
  },
  fileserver: {
    title: 'High-Speed LAN File Server',
    tags: ['Python', 'pyftpdlib', 'HTTP', 'Networking'],
    images: ['images/cover-fileserver.jpg'],
    imageAlts: ['LAN file server illustration'],
    overview: `A home and office file-sharing server that exposes a storage drive to every device on the local network. It runs an FTP server for file managers like FileZilla and a browser-based file explorer for phones and TVs, with one-click start, stop and firewall setup scripts.`,
    challenge: `The first version crashed with MemoryError on large videos because files were read fully into RAM, and transfers crawled at about 11 MB/s. I rewrote file delivery to stream in chunks with HTTP Range support, so videos can seek, then added zero-copy sendfile, larger socket buffers and HTTP/1.1 keep-alive.`,
    highlights: [
      'FTP (passive mode) and a web file browser served from the same drive',
      'Chunked streaming with HTTP Range requests, so large videos play and seek',
      'Zero-copy sendfile and tuned TCP buffers: ~11 MB/s → ~89 MB/s in local tests',
      'Path-safe directory browsing that blocks access outside the shared root',
      'Automatic firewall rules and port-conflict detection',
    ],
  },
  erp: {
    title: 'ERP Customization (FrontAccounting)',
    tags: ['PHP', 'FrontAccounting', 'ERP', 'MySQL'],
    images: [
      'accouting%20software.png',
      'accouting%20software%20serial%20number%20search.png',
    ],
    imageAlts: [
      'FrontAccounting ERP dashboard',
      'Serial number search interface',
    ],
    overview: `Extended a FrontAccounting-based ERP system with domain-specific features for a hardware retail business — adding serial number tracking, warranty lifecycle management, and improved product handling workflows tailored to the company's operations.`,
    challenge: `FrontAccounting's architecture required careful extension without modifying core files, while ensuring the new modules integrated seamlessly with the existing inventory and sales workflows.`,
    highlights: [
      'Per-unit serial number assignment and lookup across all transactions',
      'Warranty start/end date tracking tied to sales records',
      'Warranty status reporting per product and per customer',
      'Improved stock-in workflow for bulk product receiving',
      'Custom reports for warranty claims and expiry tracking',
    ],
  },
};

const overlay = document.getElementById('modal-overlay');
const content = document.getElementById('modal-content');
let lastFocused = null;

function openModal(key) {
  const d = projectData[key];
  if (!d) return;
  lastFocused = document.activeElement;

  content.innerHTML = `
    <h2>${d.title}</h2>
    <div class="modal-tags">${d.tags.map(t => `<span>${t}</span>`).join('')}</div>
    <div class="modal-images">
      ${d.images.map((src, i) => `<a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${d.imageAlts[i] || ''}" loading="lazy" /></a>`).join('')}
    </div>
    <h3>Overview</h3>
    <p>${d.overview}</p>
    <h3>The challenge</h3>
    <p>${d.challenge}</p>
    <h3>Key highlights</h3>
    <ul>${d.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
  `;

  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  overlay.querySelector('.modal').scrollTop = 0;
  overlay.querySelector('.modal-close').focus();
}

function closeModal() {
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
});

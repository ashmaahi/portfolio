/* ─────────────────────────────────────────
   Mobile navigation toggle
───────────────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ─────────────────────────────────────────
   Project detail modal data
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
  scraper: {
    title: 'Product Data Scraper',
    tags: ['Python', 'Automation', 'Data Collection', 'CSV/JSON'],
    images: ['scrapper.png'],
    imageAlts: ['Product Data Scraper output'],
    overview: `An automated tool that extracts structured product data — names, SKUs, prices, specifications, and images — from e-commerce websites, then outputs clean datasets ready for bulk import into catalog systems.`,
    challenge: `Handling pagination, dynamic content, and inconsistent HTML structures across target sites while keeping the output schema consistent for downstream import pipelines.`,
    highlights: [
      'Multi-page automated crawling with configurable depth',
      'Structured output in CSV and JSON formats',
      'Robust error handling with retry logic on failed requests',
      'Configurable field mapping for different site structures',
      'Rate limiting to avoid server-side blocking',
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

/* ─────────────────────────────────────────
   Modal open / close
───────────────────────────────────────── */
const overlay = document.getElementById('modal-overlay');
const content = document.getElementById('modal-content');

function openModal(key) {
  const d = projectData[key];
  if (!d) return;

  const tagsHtml = d.tags
    .map(t => `<span class="project-tag">${t}</span>`)
    .join('');

  const imagesHtml = d.images && d.images.length
    ? `<div class="modal-images">
        ${d.images.map((src, i) =>
          `<img src="${src}" alt="${d.imageAlts ? d.imageAlts[i] : ''}" loading="lazy" />`
        ).join('')}
       </div><div class="modal-divider"></div>`
    : '';

  const featuresHtml = d.highlights
    .map(f => `
      <li>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        ${f}
      </li>`)
    .join('');

  content.innerHTML = `
    <h2>${d.title}</h2>
    <div class="modal-tags">${tagsHtml}</div>
    ${imagesHtml}
    <p>${d.overview}</p>
    <div class="modal-divider"></div>
    <h3>The Challenge</h3>
    <p>${d.challenge}</p>
    <h3>Key Highlights</h3>
    <ul>${featuresHtml}</ul>
  `;

  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Set focus inside modal for accessibility
  const firstFocusable = overlay.querySelector('button, a');
  if (firstFocusable) firstFocusable.focus();
}

function closeModal() {
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Close on overlay click (outside modal box)
overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('active')) {
    closeModal();
  }
});

/* ─────────────────────────────────────────
   Highlight active nav link on scroll
───────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );
        if (active) active.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => observer.observe(s));

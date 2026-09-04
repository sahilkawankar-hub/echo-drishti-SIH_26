/* ===================================================================
   RUDRA CHAVAN — PORTFOLIO ENGINE & INTERACTION SYSTEM
   Piyush Koli Physics Trailing Cursor, Scroll Progress, Terminal, Modals
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initScrollProgress();
  initScrollReveals();
  initProjectFilters();
  initModals();
  initTerminal();
  initContactForm();
  initHeaderNav();
});

/* ===================================================================
   1. PIYUSH KOLI STYLE TRAILING CURSOR (SMOOTH LERP & EXPAND)
   =================================================================== */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = mouseX;
  let trailY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.18;
    trailY += (mouseY - trailY) * 0.18;

    trail.style.left = `${trailX}px`;
    trail.style.top = `${trailY}px`;

    requestAnimationFrame(animateTrail);
  }
  requestAnimationFrame(animateTrail);

  const hoverElements = document.querySelectorAll('a, button, input, textarea, .project-showcase-card, .cert-tile, .channel-card, .social-circle');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover-grow');
      trail.style.borderColor = 'rgba(0, 229, 255, 0.6)';
      trail.style.transform = 'translate(-50%, -50%) scale(1.3)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover-grow');
      trail.style.borderColor = 'rgba(255, 56, 56, 0.35)';
      trail.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

/* ===================================================================
   2. TOP SCROLL PROGRESS BAR
   =================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

/* ===================================================================
   3. SCROLL REVEALS
   =================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ===================================================================
   4. PROJECT FILTER TABS
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.pf-pill');
  const cards = document.querySelectorAll('.project-showcase-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const tags = card.dataset.tags || '';
        if (filter === 'all' || tags.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   5. ARCHITECTURAL DEEP-DIVE MODALS
   =================================================================== */
const PROJECT_DATA = {
  meetingflow: {
    title: 'Meeting Flow',
    tagline: 'Real-Time Speech-to-Text & AI Intelligence Co-Pilot',
    badge: 'GenAI Co-Pilot',
    image: 'assets/images/meetingflow.png',
    github: 'https://github.com/chavanrudra2006/Meetflow.git',
    description: 'An AI-driven meeting intelligence system built to eliminate manual note-taking and streamline post-meeting operations. Transcribes live conversations in real time, generates instant action items, and syncs summaries across Gmail and Google Calendar.',
    features: [
      '<strong>Live Meeting Capture:</strong> Real-time browser speech-to-text via Web Speech API with automatic speech segmentation.',
      '<strong>Paste Transcript Mode:</strong> Paste existing transcripts from Zoom, Google Meet, MS Teams, or manual notes in any format.',
      '<strong>Dual AI Engine:</strong> Fast inference via Groq (LLaMA 3.3-70B) with automatic fallback to Google Gemini 1.5 Flash.',
      '<strong>Action Item Extraction:</strong> Pulls out decisions, tasks, deadlines, and priorities (High/Medium/Low/Done).',
      '<strong>Map-Reduce Chunking:</strong> Handles long transcripts beyond typical token limits without truncation.',
      '<strong>Unified Task Board:</strong> View, filter, search, and check off action items with instant state updates.',
      '<strong>Absentee Q&A Chat:</strong> Question-answering agent strictly grounded in actual transcript content to prevent hallucinations.',
      '<strong>Gmail & Google Calendar Sync:</strong> One-click professional HTML summary emails & automated calendar event creation.'
    ],
    techStack: [
      { component: 'Python 3.13 & Flask', role: 'Backend REST API & Map-Reduce Pipeline' },
      { component: 'Groq API (LLaMA 3.3-70B)', role: 'Primary ultra-fast LLM inference' },
      { component: 'Google Gemini 1.5 Flash', role: 'Automated fallback AI engine' },
      { component: 'Web Speech API', role: 'In-browser real-time speech capture' },
      { component: 'Firebase Auth', role: 'Google OAuth & email sign-in with session persistence' },
      { component: 'Gmail & Calendar APIs', role: 'Automated scheduling and summary mailings' },
      { component: 'Render & GitHub Pages', role: 'Cloud backend hosting and client deployment' }
    ]
  },
  civilink: {
    title: 'CiviLink AI',
    tagline: 'Hyperlocal Community Platform with YOLO Computer Vision & Semantic Matching',
    badge: 'Vision & Full-Stack',
    image: 'assets/images/civilink.png',
    github: 'https://github.com/chavanrudra2006/Civilink_AI.git',
    description: 'A comprehensive, AI-powered hyperlocal community operating system for residential societies, apartment complexes, and university campuses, bridging neighborhood collaboration and automated civic defect resolution.',
    features: [
      '<strong>CivicEye AI Issue Reporting:</strong> Automated civic defect analysis using Ultralytics YOLO object detection with automated priority classification.',
      '<strong>Semantic Lost & Found Matching:</strong> AI-powered item search utilizing Sentence Transformers to pair lost and found items regardless of wording differences.',
      '<strong>Hyperlocal Marketplace:</strong> Peer-to-peer buy, sell, and exchange platform for verified community members.',
      '<strong>Community Feed & Discussions:</strong> Social announcements, neighborhood updates, comments, and engagement reactions.',
      '<strong>Local Jobs & Services:</strong> Post and discover nearby employment opportunities and domestic services.',
      '<strong>Google Maps Geocoding:</strong> Map-based issue cluster visualization and location tracking for civic interventions.'
    ],
    techStack: [
      { component: 'FastAPI (Python)', role: 'High-performance async web framework for AI services' },
      { component: 'React + TypeScript & Vite', role: 'Modern UI framework and client routing' },
      { component: 'Ultralytics YOLO', role: 'Object detection for civic issue vision analysis' },
      { component: 'Sentence Transformers', role: 'Semantic embeddings for Lost & Found item matching' },
      { component: 'Supabase PostgreSQL', role: 'Relational database for civic issues, posts, and users' },
      { component: 'Supabase Storage & Auth', role: 'Bucket storage for civic images & Google OAuth' },
      { component: 'Docker & Google Maps API', role: 'Containerization and geolocation mapping' }
    ]
  },
  nutriplan: {
    title: 'NutriPlan',
    tagline: 'Intelligent Nutrition Analysis & Calorie Planning Engine',
    badge: 'Kaggle 2026 Agentic AI',
    image: 'assets/images/nutriplan.png',
    github: 'https://github.com/chavanrudra2006/NutriPlan.git',
    description: 'Built for the Kaggle 5-Day Agentic AI Course 2026, NutriPlan is a responsive, single-page application that provides science-backed dietary management, real-time macro analysis, and automated grocery planning.',
    features: [
      '<strong>Scientific Calorie Engine:</strong> Uses the Mifflin-St Jeor equation to compute BMR, TDEE, and personalized macronutrient ratios.',
      '<strong>Natural Language Meal Analyzer:</strong> Accepts plain-text descriptions (e.g., "150g chicken breast, 2 eggs") and parses ingredient weights with detailed nutrition breakdown.',
      '<strong>Weekly Meal Planner Matrix:</strong> Mon–Sun weekly grid across Breakfast, Lunch, Dinner, and Snacks with per-day calorie targets.',
      '<strong>Curated Healthy Recipes:</strong> 8+ nutrient-dense chef recipes filterable by High Protein, Low Carb, Vegan, Keto, and Under 500 kcal.',
      '<strong>Automated Grocery Generator:</strong> Aggregates ingredients across planned meals into an interactive checklist with quantity summing.',
      '<strong>Zero-Server Privacy:</strong> Complete data persistence in browser localStorage — lightning fast with total user data privacy.'
    ],
    techStack: [
      { component: 'Vanilla JavaScript (ES6+)', role: 'Modular client calculation engines & state' },
      { component: 'Semantic HTML5 & Modern CSS3', role: 'Cinematic glassmorphic interface' },
      { component: 'Mifflin-St Jeor Formula', role: 'Energetic expenditure & metabolic rate modeling' },
      { component: 'NLP Ingredient Parser', role: 'Text tokenization for weights, measurements, and foods' },
      { component: 'LocalStorage Store', role: 'Zero-latency persistent local data store' }
    ]
  }
};

function initModals() {
  const projectModal = document.getElementById('projectModal');
  const modalSlot = document.getElementById('modalSlot');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  const resumeModal = document.getElementById('resumeModal');
  const btnNavDownloadCv = document.getElementById('btnNavDownloadCv');
  const resumeCloseBtn = document.getElementById('resumeCloseBtn');

  window.openProjectDetails = function(id) {
    const data = PROJECT_DATA[id];
    if (!data) return;

    let featuresHtml = data.features.map(f => `
      <li style="display:flex; align-items:flex-start; gap:10px; margin-bottom:10px; font-size:0.9rem; color:var(--text-muted);">
        <span style="color:var(--coral); margin-top:3px;"><i class="fa-solid fa-circle-check"></i></span>
        <div>${f}</div>
      </li>
    `).join('');

    let stackHtml = data.techStack.map(s => `
      <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
        <td style="padding:10px; font-weight:700; color:#fff; font-size:0.86rem;">${s.component}</td>
        <td style="padding:10px; font-size:0.86rem; color:var(--text-muted);">${s.role}</td>
      </tr>
    `).join('');

    modalSlot.innerHTML = `
      <img src="${data.image}" alt="${data.title}" style="width:100%; max-height:300px; object-fit:cover; border-radius:12px; margin-bottom:20px; border:1px solid var(--border-subtle);">
      
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
        <span class="badge-tag ai">${data.badge}</span>
      </div>

      <h2 style="font-family:var(--font-sans); font-size:2.2rem; font-weight:800; color:#fff; margin-bottom:4px;">${data.title}</h2>
      <div style="font-family:var(--font-mono); font-size:0.82rem; color:var(--coral); margin-bottom:16px;">${data.tagline}</div>
      
      <p style="font-size:0.95rem; color:var(--text-muted); line-height:1.65; margin-bottom:22px;">${data.description}</p>
      
      <div style="margin-bottom:24px;">
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn-primary-coral" style="padding:10px 22px; font-size:0.88rem;">
          <i class="fa-brands fa-github"></i> Inspect GitHub Repository
        </a>
      </div>

      <h3 style="font-size:1.15rem; font-weight:700; color:#fff; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-list-check" style="color:var(--coral);"></i> Engineering Capabilities
      </h3>
      <ul style="list-style:none; margin-bottom:24px;">
        ${featuresHtml}
      </ul>

      <h3 style="font-size:1.15rem; font-weight:700; color:#fff; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-microchip" style="color:var(--cyan);"></i> Architectural Tech Stack
      </h3>
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="background:rgba(255,255,255,0.03); text-align:left;">
              <th style="padding:10px; font-family:var(--font-mono); font-size:0.75rem; color:var(--coral);">COMPONENT</th>
              <th style="padding:10px; font-family:var(--font-mono); font-size:0.75rem; color:var(--coral);">PURPOSE & INTEGRATION</th>
            </tr>
          </thead>
          <tbody>${stackHtml}</tbody>
        </table>
      </div>
    `;

    projectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeProjectModal() {
    projectModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  // Resume Modal Handling
  function openResume() {
    resumeModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeResume() {
    resumeModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (btnNavDownloadCv) btnNavDownloadCv.addEventListener('click', openResume);
  if (resumeCloseBtn) resumeCloseBtn.addEventListener('click', closeResume);
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResume();
    }
  });
}

/* ===================================================================
   6. DEVELOPER TERMINAL (CLI)
   =================================================================== */
function initTerminal() {
  const input = document.getElementById('termInput');
  const logs = document.getElementById('termLogs');
  const sendBtn = document.getElementById('termSend');
  const clearBtn = document.getElementById('termClearBtn');
  if (!input || !logs) return;

  const COMMANDS = {
    help: () => `
      <div class="term-row">Available system instructions:</div>
      <div class="term-row">&nbsp;&nbsp;<span class="coral font-bold">certs</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Inspect verified Oracle & MongoDB certifications</div>
      <div class="term-row">&nbsp;&nbsp;<span class="coral font-bold">projects</span>&nbsp;&nbsp;- Production engineering systems</div>
      <div class="term-row">&nbsp;&nbsp;<span class="coral font-bold">skills</span>&nbsp;&nbsp;&nbsp;&nbsp;- Core competencies in AI & backend</div>
      <div class="term-row">&nbsp;&nbsp;<span class="coral font-bold">contact</span>&nbsp;&nbsp;&nbsp;- Phone, email, and coordinates</div>
      <div class="term-row">&nbsp;&nbsp;<span class="coral font-bold">whoami</span>&nbsp;&nbsp;&nbsp;&nbsp;- Profile overview of Rudra Chavan</div>
      <div class="term-row">&nbsp;&nbsp;<span class="coral font-bold">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear the console screen</div>
    `,
    certs: () => `
      <div class="term-row coral font-bold">Verified Accreditations & Certifications:</div>
      <div class="term-row">&nbsp;1. <span class="cyan font-bold">Oracle Cloud Generative AI Certified Professional</span></div>
      <div class="term-row">&nbsp;&nbsp;&nbsp;&nbsp;Badge: <a href="https://catalog-education.oracle.com/ords/certview/sharebadge?id=B77702CC8EF21F4C494D7C84FBC3E0F379D4F996C64C318A7CE9BD4D9990F159" target="_blank" style="color:var(--coral);">Oracle Verified Badge Link</a></div>
      <div class="term-row">&nbsp;2. <span class="cyan font-bold">MongoDB Database & Aggregation Framework</span></div>
      <div class="term-row">&nbsp;&nbsp;&nbsp;&nbsp;Credential: <a href="https://www.linkedin.com/posts/rudra-chavan-703a52383_mongo-db-certificate-activity-7495673966452416512-m6CL" target="_blank" style="color:var(--coral);">LinkedIn Certificate Post</a></div>
      <div class="term-row">&nbsp;3. <span class="cyan font-bold">Kaggle 5-Days Agentic AI Course 2026</span></div>
      <div class="term-row">&nbsp;&nbsp;&nbsp;&nbsp;Capstone: NutriPlan Dietary System</div>
    `,
    projects: () => `
      <div class="term-row coral font-bold">Featured Engineering Systems:</div>
      <div class="term-row">&nbsp;1. <span class="cyan font-bold">Meeting Flow</span> (Python/Groq/Gemini/Flask) - Real-time AI speech intelligence</div>
      <div class="term-row">&nbsp;2. <span class="cyan font-bold">CiviLink AI</span> (FastAPI/React/YOLO/Supabase) - Hyperlocal community platform</div>
      <div class="term-row">&nbsp;3. <span class="cyan font-bold">NutriPlan</span> (Kaggle '26 Agentic AI) - Dietary calculation engine</div>
    `,
    skills: () => `
      <div class="term-row coral font-bold">Technical Core Competencies:</div>
      <div class="term-row">&nbsp;• Generative AI: Oracle GenAI Certified, Groq LLaMA 3.3-70B, Gemini Flash, RAG</div>
      <div class="term-row">&nbsp;• Computer Vision: Ultralytics YOLO Object Detection</div>
      <div class="term-row">&nbsp;• Databases: MongoDB Certified, PostgreSQL, Supabase, Firebase</div>
      <div class="term-row">&nbsp;• Backend & Web: FastAPI, Flask, JavaScript, HTML5, CSS3, Docker</div>
    `,
    contact: () => `
      <div class="term-row coral font-bold">Direct Frequencies:</div>
      <div class="term-row">&nbsp;• Phone / WhatsApp: <span class="coral">+91 7678009313</span></div>
      <div class="term-row">&nbsp;• Official Email:&nbsp;&nbsp;&nbsp;<span class="coral">chavanrudra2006@gmail.com</span></div>
      <div class="term-row">&nbsp;• Base Location:&nbsp;&nbsp;&nbsp;&nbsp;<span class="coral">Mumbai Central, Mumbai, MH, India</span></div>
      <div class="term-row">&nbsp;• Status:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:var(--emerald);">🟢 Available for Opportunities</span></div>
    `,
    whoami: () => `
      <div class="term-row">Candidate: <span class="coral font-bold">Rudra Chavan</span></div>
      <div class="term-row">Role: Aspiring Data Scientist & Developer</div>
      <div class="term-row">Location: Mumbai Central, India</div>
      <div class="term-row">Focus: Generative AI, Machine Learning, NoSQL databases, and Scalable Web Backends.</div>
    `
  };

  function execute() {
    const raw = input.value.trim();
    if (!raw) return;

    const row = document.createElement('div');
    row.className = 'term-row';
    row.innerHTML = `<span class="term-prompt">rudra@dev:~$</span> <span>${escapeHtml(raw)}</span>`;
    logs.appendChild(row);

    const cmd = raw.toLowerCase();
    if (cmd === 'clear') {
      logs.innerHTML = '';
    } else if (COMMANDS[cmd]) {
      const resp = document.createElement('div');
      resp.innerHTML = COMMANDS[cmd]();
      logs.appendChild(resp);
    } else {
      const err = document.createElement('div');
      err.className = 'term-row';
      err.style.color = '#EF4444';
      err.textContent = `Command not recognized: '${raw}'. Type 'help' or 'certs' for options.`;
      logs.appendChild(err);
    }

    input.value = '';
    logs.scrollTop = logs.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') execute();
  });
  if (sendBtn) sendBtn.addEventListener('click', execute);
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      logs.innerHTML = `<div class="term-row dim">Console screen cleared. Type 'help' or 'certs'.</div>`;
    });
  }
}

/* ===================================================================
   7. CLIPBOARD & TOAST NOTIFICATION
   =================================================================== */
window.copySnippet = function(text, msg = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast(msg)).catch(() => fallbackCopy(text, msg));
  } else {
    fallbackCopy(text, msg);
  }
};

function fallbackCopy(text, msg) {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  showToast(msg);
}

function showToast(msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = 'toast-bubble';
  bubble.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--coral); margin-right:8px;"></i> ${escapeHtml(msg)}`;
  container.appendChild(bubble);

  setTimeout(() => {
    bubble.style.transition = 'all 0.3s ease';
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(20px)';
    setTimeout(() => bubble.remove(), 300);
  }, 3200);
}

/* ===================================================================
   8. DIRECT CONTACT FORM
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('senderName').value;
    const email = document.getElementById('senderEmail').value;
    const subject = document.getElementById('msgSubject').value;
    const body = document.getElementById('msgBody').value;

    const btn = document.getElementById('btnSend');
    const orig = btn.innerHTML;
    btn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
    btn.disabled = true;

    setTimeout(() => {
      showToast(`Transmission sent from ${name}! Launching email client...`);
      const mailto = `mailto:chavanrudra2006@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + body)}`;
      window.location.href = mailto;

      btn.innerHTML = `<span>Sent!</span> <i class="fa-solid fa-check"></i>`;
      form.reset();

      setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled = false;
      }, 3000);
    }, 700);
  });
}

/* ===================================================================
   9. HEADER NAVIGATION & SCROLLSPY
   =================================================================== */
function initHeaderNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('headerNav');

  // Clear any stale inline styles left by previous JS sessions (fixes duplicate/floating nav bug)
  if (nav) {
    nav.removeAttribute('style');
    nav.classList.remove('mobile-open');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      // Use class toggle instead of inline styles — prevents the duplicate nav bug
      nav.classList.toggle('mobile-open');
    });

    // Close mobile nav when any link is clicked
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('mobile-open');
      });
    });

    // Close mobile nav on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('mobile-open');
      }
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 140;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === `#${id}`) {
            l.classList.add('active');
          }
        });
      }
    });
  });
}


function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

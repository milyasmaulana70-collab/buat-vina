// ===== DATA =====
const BIRTH_DATE = new Date(2006, 6, 17);

// ===== STATE =====
let currentPage = 0;
const totalPages = 5;
let isAnimating = false;
let musicPlaying = false;
let touchStartX = 0, touchStartY = 0;

// ===== ELEMENTS =====
const pages = document.querySelectorAll('.page');
const navDots = document.querySelectorAll('.nav-dot');
const bgMusic = document.getElementById('bgMusic');
const soundToggle = document.getElementById('soundToggle');
const openBtn = document.getElementById('openBtn');

// ===== NAVIGATE =====
function goToPage(index) {
  if (isAnimating || index === currentPage || index < 0 || index >= totalPages) return;
  isAnimating = true;

  pages[currentPage].classList.remove('active');
  navDots[currentPage].classList.remove('active');

  currentPage = index;

  pages[currentPage].classList.add('active');
  navDots[currentPage].classList.add('active');

  onPageEnter(currentPage);

  setTimeout(() => { isAnimating = false; }, 750);
}

function onPageEnter(index) {
  // Reset animasi child tiap masuk page
  if (index === 1) {
    // Halaman 2 — reset animasi umur & confetti
    startConfetti();
    setTimeout(() => animateAge(), 600);
    resetPageAnimations('#page2');
  }
  if (index === 2) {
    // Halaman 3 — mulai slideshow foto
    startPhotoSlideshow();
  }
  if (index === 3) {
    // Halaman 4 — animasi surat
    const lw = document.querySelector('.letter-wrap');
    lw.classList.remove('visible');
    void lw.offsetWidth;
    lw.classList.add('visible');
  }
  if (index === 4) {
    // Halaman 5 — sparkle
    resetPageAnimations('#page5');
    startSparkles();
  }
}

function resetPageAnimations(selector) {
  const el = document.querySelector(selector);
  const children = el.querySelectorAll('[style*="animation"], .hb-line1, .hb-line2, .hb-name, .hb-divider, .hb-age-wrap, .ending-ornament, .ending-quote, .ending-divider, .ending-name, .ending-date, .ending-heart, .page1-content, .swipe-hint');
  children.forEach(c => {
    c.style.animation = 'none';
    void c.offsetWidth;
    c.style.animation = '';
  });
}

// ===== SWIPE =====
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx < 0) goToPage(currentPage + 1); // swipe kiri = next
    else goToPage(currentPage - 1);         // swipe kanan = prev
  }
}, { passive: true });

// Keyboard (desktop)
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPage(currentPage + 1);
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPage(currentPage - 1);
});

// ===== OPEN BUTTON =====
openBtn.addEventListener('click', () => {
  tryAutoplay();
  goToPage(1);
});

// ===== STARS (page 1) =====
function initStars() {
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    speed: Math.random() * 0.3 + 0.05,
    opacity: Math.random(),
    dir: Math.random() > 0.5 ? 1 : -1,
    twinkleSpeed: Math.random() * 0.02 + 0.005
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.opacity += s.twinkleSpeed * s.dir;
      if (s.opacity >= 1 || s.opacity <= 0) s.dir *= -1;
      s.y -= s.speed;
      if (s.y < 0) s.y = canvas.height;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(241,208,120,${s.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ===== CONFETTI (page 2) =====
let confettiActive = false;
function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#f1d078', '#cba135', '#efe6cf', '#fff8e0', '#c8a400'];
  const pieces = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    w: Math.random() * 8 + 4,
    h: Math.random() * 4 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 4,
    speedY: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 1.5,
    opacity: Math.random() * 0.7 + 0.3
  }));

  confettiActive = true;
  function draw() {
    if (!confettiActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rot += p.rotSpeed;
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ===== UMUR (page 2) =====
function calculateAge() {
  const today = new Date();
  let age = today.getFullYear() - BIRTH_DATE.getFullYear();
  const m = today.getMonth() - BIRTH_DATE.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < BIRTH_DATE.getDate())) age--;
  return age;
}

function animateAge() {
  const el = document.getElementById('hbAge');
  const target = calculateAge();
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

// ===== FOTO SLIDESHOW (page 3) =====
let photoIndex = 0;
let photoTimer = null;
const photoSlides = document.querySelectorAll('.photo-slide');
const photoDots = document.getElementById('photoDots');

function buildPhotoDots() {
  photoSlides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    photoDots.appendChild(d);
  });
}

function goToPhoto(i) {
  photoSlides[photoIndex].classList.remove('active');
  photoDots.querySelectorAll('.dot')[photoIndex].classList.remove('active');
  photoIndex = i % photoSlides.length;
  photoSlides[photoIndex].classList.add('active');
  photoDots.querySelectorAll('.dot')[photoIndex].classList.add('active');
}

function startPhotoSlideshow() {
  clearInterval(photoTimer);
  goToPhoto(0);
  photoTimer = setInterval(() => goToPhoto(photoIndex + 1), 3500);
}

buildPhotoDots();

// ===== SPARKLES (page 5) =====
function startSparkles() {
  const field = document.getElementById('sparkleField');
  field.innerHTML = '';
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const s = document.createElement('div');
      s.style.cssText = `
        position:absolute;
        width:3px;height:3px;border-radius:50%;
        background:#f1d078;
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        opacity:0;
        animation: sparkPop ${1+Math.random()*2}s ease forwards;
      `;
      field.appendChild(s);
    }, i * 80);
  }
}

// inject sparkPop keyframes
const style = document.createElement('style');
style.textContent = `@keyframes sparkPop {
  0%{opacity:0;transform:scale(0)}
  50%{opacity:1;transform:scale(1.5)}
  100%{opacity:0;transform:scale(0)}
}`;
document.head.appendChild(style);

// ===== MUSIK =====
function tryAutoplay() {
  bgMusic.volume = 0;
  bgMusic.play().then(() => {
    musicPlaying = true;
    soundToggle.textContent = '🔊';
    fadeInMusic();
  }).catch(() => {
    musicPlaying = false;
    soundToggle.textContent = '🔇';
  });
}

function fadeInMusic() {
  let vol = 0;
  const interval = setInterval(() => {
    vol = Math.min(vol + 0.02, 0.5);
    bgMusic.volume = vol;
    if (vol >= 0.5) clearInterval(interval);
  }, 100);
}

soundToggle.addEventListener('click', () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
    soundToggle.textContent = '🔇';
  } else {
    bgMusic.play().then(() => {
      musicPlaying = true;
      soundToggle.textContent = '🔊';
      if (bgMusic.volume === 0) fadeInMusic();
    });
  }
});

// Coba autoplay saat load
window.addEventListener('load', () => {
  initStars();
  tryAutoplay();
});

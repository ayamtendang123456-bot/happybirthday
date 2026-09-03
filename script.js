// ── Device Capability Detection — dihapus sesuai permintaan: semua device dapat animasi penuh ──
const device = {
  lowEnd: false,
  reducedMotion: false,
};

// ── Realistic Falling Flower Petals ──
(function initPetals() {
  if (device.lowEnd || device.reducedMotion) return;
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let pageVisible = !document.hidden;
  let resizeFrame = 0;

  document.addEventListener('visibilitychange', function () {
    pageVisible = !document.hidden;
  });

  // Resize canvas to fill window
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', function () {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(function () {
      resizeFrame = 0;
      resize();
    });
  });

  // Petal color palette — soft sakura pinks
  const colors = [
    'rgba(255,182,193,',  // light pink
    'rgba(255,153,170,',  // medium pink
    'rgba(255,192,203,',  // pink
    'rgba(255,210,220,',  // pale pink
    'rgba(230,130,150,',  // deep sakura
    'rgba(255,228,235,',  // blush
  ];

  // Draw a 5-petal flower shape centered at (0,0)
  function drawPetal(ctx, r, color, alpha) {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const bx = Math.cos(angle) * r;
      const by = Math.sin(angle) * r;
      const cp1x = Math.cos(angle - 0.5) * r * 1.6;
      const cp1y = Math.sin(angle - 0.5) * r * 1.6;
      const cp2x = Math.cos(angle + 0.5) * r * 1.6;
      const cp2y = Math.sin(angle + 0.5) * r * 1.6;
      if (i === 0) {
        ctx.moveTo(bx, by);
      }
      // Next petal tip
      const nextAngle = ((i + 1) / 5) * Math.PI * 2 - Math.PI / 2;
      const nx = Math.cos(nextAngle) * r;
      const ny = Math.sin(nextAngle) * r;
      ctx.bezierCurveTo(cp2x, cp2y, cp1x + (nx - bx) * 0.2, cp1y + (ny - by) * 0.2, nx, ny);
    }
    ctx.closePath();

    // Solid fill — lebih ringan dari radial gradient (mengurangi leg)
    ctx.fillStyle = color + alpha + ')';
    ctx.fill();
    ctx.restore();
  }

  // Petal class
  function Petal() {
    this.reset(true);
  }

  Petal.prototype.reset = function (initial) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : -20;
    this.r = 6 + Math.random() * 10;          // size
    this.vy = 0.6 + Math.random() * 1.2;       // fall speed
    this.vx = (Math.random() - 0.5) * 0.8;     // slight horizontal drift
    this.angle = Math.random() * Math.PI * 2;      // current rotation
    this.spin = (Math.random() - 0.5) * 0.04;    // rotation speed
    this.swing = Math.random() * Math.PI * 2;      // sway phase
    this.swingSpd = 0.015 + Math.random() * 0.02;    // sway speed
    this.swingAmp = 0.6 + Math.random() * 1.2;       // sway width
    this.alpha = 0.5 + Math.random() * 0.45;      // opacity
    this.color = colors[Math.floor(Math.random() * colors.length)];
  };

  Petal.prototype.update = function () {
    this.swing += this.swingSpd;
    this.x += this.vx + Math.sin(this.swing) * this.swingAmp;
    this.y += this.vy;
    this.angle += this.spin;

    if (this.y > canvas.height + 30) this.reset(false);
  };

  Petal.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    drawPetal(ctx, this.r, this.color, this.alpha);
    ctx.restore();
  };

  // Create petals - dikurangi biar tidak leg (35→20)
  const isMobileScreen = window.innerWidth < 658;
  const PETAL_COUNT = device.lowEnd ? 6 : (isMobileScreen ? 10 : 20);
  const petals = Array.from({ length: PETAL_COUNT }, () => new Petal());

  // Animation loop
  function loop() {
    if (!pageVisible) {
      requestAnimationFrame(loop);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(ctx); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── Floating Emoji Particles ──
(function initFloatingEmojis() {
  const container = document.getElementById('floatingEmojis');
  if (!container) return;

  const emojis = ['🌸', '🎂', '🎀', '💖', '⭐', '🎈', '✨', '🌷', '🦋', '🍭', '🎊', '💫'];
  const isMobileScreen = window.innerWidth < 658;
  const count = device.lowEnd ? 2 : (isMobileScreen ? 4 : 7);

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.classList.add('float-item');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Random horizontal position
    el.style.left = Math.random() * 100 + 'vw';

    // Random size variation
    const size = 1.2 + Math.random() * 1.4;
    el.style.fontSize = size + 'rem';

    // Random duration (10s – 22s) and delay (0s – 15s)
    const duration = 10 + Math.random() * 12;
    const delay = Math.random() * 15;
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = '-' + delay + 's'; // negative delay = already in progress

    container.appendChild(el);
  }
})();

// ── Space Stars — bintang jatuh luar angkasa persis love (pembeda: palette cream, lebih lembut) ──
(function initSpaceStars() {
  if (device.lowEnd || device.reducedMotion) return;
  var sc = document.getElementById('spaceCanvas');
  var sparkleLayer = document.getElementById('spaceSparkle');
  if (!sc) return;
  var ctx = sc.getContext('2d');
  if (!ctx) return;
  var isMobileScreen = window.innerWidth < 658;
  var pageVisible2 = !document.hidden;
  document.addEventListener('visibilitychange', function () { pageVisible2 = !document.hidden; });

  function resizeSpace() {
    sc.width = Math.min(window.innerWidth, device.lowEnd ? 600 : 1200);
    sc.height = Math.min(window.innerWidth < 658 ? 700 : 900, window.innerHeight);
  }
  resizeSpace();
  var resizeFrame2 = 0;
  window.addEventListener('resize', function () {
    if (resizeFrame2) return;
    resizeFrame2 = requestAnimationFrame(function () {
      resizeFrame2 = 0;
      resizeSpace();
    });
  });

  // CSS sparkles — banyak tapi aman: desktop banyak, mobile sedang
  if (sparkleLayer) {
    var sparkleColors = ['#fff8f0', '#ffe39f', '#fce8cc', '#f5d4a4', '#eedcc7', '#d4a55a'];
    var sparkleCount = device.lowEnd ? 6 : (isMobileScreen ? 12 : 22);
    for (var si = 0; si < sparkleCount; si++) {
      var el = document.createElement('div');
      var sz = 4 + Math.random() * 9;
      var dur = 1.9 + Math.random() * 2.6;
      var delay = Math.random() * 5;
      el.className = 'space-sparkle';
      el.style.setProperty('--sz', sz + 'px');
      el.style.setProperty('--dur', dur + 's');
      el.style.setProperty('--delay', delay + 's');
      el.style.setProperty('--color', sparkleColors[Math.floor(Math.random() * sparkleColors.length)]);
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 100 + '%';
      sparkleLayer.appendChild(el);
    }
  }

  var starColors = ['#ffffff', '#fff9e6', '#ffe39f', '#fce8cc', '#f5d4a4'];
  var meteorColors = ['#ffffff', '#ffe7b3', '#ffd59e', '#faecc9'];
  var stars = [];
  var fallingStars = [];
  var meteors = [];
  // banyak tapi aman: desktop 44 bintang, mobile 16, lowEnd 6
  var starCount = device.lowEnd ? 6 : (isMobileScreen ? 16 : 44);
  for (var s = 0; s < starCount; s++) {
    stars.push({
      x: Math.random() * sc.width,
      y: Math.random() * sc.height,
      r: 0.8 + Math.random() * 1.9,
      alpha: 0.25 + Math.random() * 0.7,
      speed: 0.012 + Math.random() * 0.028,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      pulse: Math.random() * Math.PI * 2,
      hasRays: Math.random() > 0.72
    });
  }

  function spawnFallingStar() {
    var angle = Math.PI / 3 + Math.random() * 0.20;
    var speed = 1.7 + Math.random() * 2.4; // ~40% lebih lambat
    fallingStars.push({
      x: Math.random() * sc.width,
      y: -15 - Math.random() * 80,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 14 + Math.random() * 28,
      alpha: 0.42 + Math.random() * 0.45,
      life: 0,
      maxLife: 85 + Math.random() * 55, // hidup lebih lama karena lambat
      color: starColors[Math.floor(Math.random() * starColors.length)]
    });
  }

  function spawnMeteor() {
    var angle = Math.PI / 5 + Math.random() * 0.20;
    var speed = 4.8 + Math.random() * 5.2; // ~38% lebih lambat
    var fromSide = Math.random() > 0.72;
    var startX = fromSide ? -80 - Math.random() * 120 : Math.random() * sc.width;
    var startY = fromSide ? Math.random() * (sc.height * 0.45) : -40 - Math.random() * 120;
    meteors.push({
      x: startX, y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 85 + Math.random() * 130,
      color: meteorColors[Math.floor(Math.random() * meteorColors.length)],
      alpha: 1.0,
      decay: 0.007 + Math.random() * 0.008, // pudar lebih lambat
      thick: 1.3 + Math.random() * 1.9,
      life: 0,
      maxLife: 130 + Math.random() * 80
    });
  }

  function drawStarSpark(cx, cy, spikes, outerR, innerR, color, alpha) {
    var rot = Math.PI / 2 * 3;
    var step = Math.PI / spikes;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (var i = 0; i < spikes; i++) {
      var x = cx + Math.cos(rot) * outerR;
      var y = cy + Math.sin(rot) * outerR;
      ctx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerR;
      y = cy + Math.sin(rot) * innerR;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = outerR * 2.8;
    ctx.fill();
    ctx.restore();
  }

  // banyak tapi aman: interval lebih rapat di desktop, jarang di mobile/lowEnd + cap concurrent
  var meteorTimer = 0, meteorInterval = device.lowEnd ? 320 : (isMobileScreen ? 110 : 72);
  var fallingTimer = 0, fallingInterval = device.lowEnd ? 85 : (isMobileScreen ? 32 : 18);

  function tickSpace() {
    if (!pageVisible2) { requestAnimationFrame(tickSpace); return; }
    ctx.clearRect(0, 0, sc.width, sc.height);
    meteorTimer++; fallingTimer++;
    // cap concurrent biar tidak leg walau interval rapat
    if (meteorTimer >= meteorInterval && meteors.length < (device.lowEnd ? 2 : (isMobileScreen ? 3 : 6))) {
      spawnMeteor();
      if (!device.lowEnd && Math.random() > 0.55) setTimeout(function(){ if(meteors.length < 6) spawnMeteor(); }, 220);
      meteorInterval = device.lowEnd ? 280 : (isMobileScreen ? 95 : 62) + Math.floor(Math.random() * 55);
      meteorTimer = 0;
    }
    if (fallingTimer >= fallingInterval && fallingStars.length < (device.lowEnd ? 3 : (isMobileScreen ? 6 : 10))) {
      spawnFallingStar();
      // burst 2-3 falling stars di desktop biar mewah tapi aman
      if (!device.lowEnd && !isMobileScreen && Math.random() > 0.65) {
        setTimeout(spawnFallingStar, 90);
        if (Math.random() > 0.5) setTimeout(spawnFallingStar, 170);
      }
      fallingInterval = device.lowEnd ? 72 : (isMobileScreen ? 28 : 16) + Math.floor(Math.random() * 22);
      fallingTimer = 0;
    }
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.pulse += s.speed;
      var curA = 0.22 + ((Math.sin(s.pulse) + 1) / 2) * (s.alpha - 0.22);
      if (s.hasRays) drawStarSpark(ctx, s.x, s.y, 4, s.r * 2.2, s.r * 0.8, s.color, curA * 0.85);
      else {
        ctx.save();
        ctx.globalAlpha = curA;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = s.r * 1.8;
        ctx.fill();
        ctx.restore();
      }
    }
    for (var f = fallingStars.length - 1; f >= 0; f--) {
      var fs = fallingStars[f];
      fs.x += fs.vx; fs.y += fs.vy; fs.life++;
      if (fs.life >= fs.maxLife || fs.y > sc.height + 30 || fs.x > sc.width + 30) { fallingStars.splice(f, 1); continue; }
      var fade = Math.min(1, fs.life / 10, (fs.maxLife - fs.life) / 16);
      var tx = fs.x - fs.vx * (fs.len / 6);
      var ty = fs.y - fs.vy * (fs.len / 6);
      var grad = ctx.createLinearGradient(fs.x, fs.y, tx, ty);
      grad.addColorStop(0, fs.color);
      grad.addColorStop(1, 'transparent');
      ctx.save();
      ctx.globalAlpha = fade * fs.alpha * 0.9;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.0;
      ctx.lineCap = 'round';
      ctx.shadowColor = fs.color;
      ctx.shadowBlur = 3;
      ctx.beginPath(); ctx.moveTo(fs.x, fs.y); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.restore();
    }
    for (var m = meteors.length - 1; m >= 0; m--) {
      var mt = meteors[m];
      mt.x += mt.vx; mt.y += mt.vy; mt.alpha -= mt.decay; mt.life++;
      if (mt.alpha <= 0 || mt.life >= mt.maxLife || mt.y > sc.height + 90 || mt.x > sc.width + 90) { meteors.splice(m, 1); continue; }
      var trailX = mt.x - (mt.vx / 10) * mt.len;
      var trailY = mt.y - (mt.vy / 10) * mt.len;
      ctx.save();
      var g = ctx.createLinearGradient(mt.x, mt.y, trailX, trailY);
      g.addColorStop(0, mt.color);
      g.addColorStop(0.12, 'rgba(255,246,215,' + (mt.alpha * 0.94) + ')');
      g.addColorStop(0.42, 'rgba(229,167,81,' + (mt.alpha * 0.48) + ')');
      g.addColorStop(1, 'transparent');
      ctx.globalAlpha = mt.alpha * 0.92;
      ctx.strokeStyle = g;
      ctx.lineWidth = mt.thick * 1.8;
      ctx.lineCap = 'round';
      ctx.shadowColor = mt.color;
      ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(mt.x, mt.y); ctx.lineTo(trailX, trailY); ctx.stroke();
      ctx.globalAlpha = mt.alpha * 0.88;
      ctx.strokeStyle = '#fffdf3';
      ctx.lineWidth = mt.thick * 0.55;
      ctx.shadowBlur = 3;
      ctx.beginPath(); ctx.moveTo(mt.x, mt.y); ctx.lineTo(mt.x - (mt.vx / 10) * mt.len * 0.28, mt.y - (mt.vy / 10) * mt.len * 0.28); ctx.stroke();
      ctx.globalAlpha = mt.alpha;
      ctx.beginPath(); ctx.arc(mt.x, mt.y, mt.thick * 1.6, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(tickSpace);
  }
  tickSpace();
})();

// ── Seamless Fog Transition to Love Gallery ──
document.addEventListener('DOMContentLoaded', function () {
  const lanjutButton = document.querySelector('.lanjut-button');
  const mistOverlay = document.getElementById('dreamMistOverlay');

  if (lanjutButton && mistOverlay) {
    lanjutButton.addEventListener('click', function (e) {
      e.preventDefault();
      const targetUrl = this.getAttribute('href');

      // 1. Munculkan kabut tebal dreamy yang menyelimuti seluruh layar
      mistOverlay.classList.add('is-active');

      // 2. Berpindah halaman setelah kabut tebal menyelimuti layar penuh
      setTimeout(function () {
        window.location.href = targetUrl;
      }, 1200);
    });
  }

  // ── Photo Modal Popup Handlers ──
  const photoModal = document.getElementById('photoModal');
  const closeModalBtn = document.getElementById('closePhotoModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalWish = document.getElementById('modalWish');
  const polaroidCards = document.querySelectorAll('.polaroid-card');

  polaroidCards.forEach(card => {
    card.addEventListener('click', function (e) {
      e.stopPropagation(); // jangan trigger listener body
      const img = card.querySelector('img');
      const title = card.getAttribute('data-title') || '';
      const wish = card.getAttribute('data-wish') || '';
      const modalCard = photoModal ? photoModal.querySelector('.photo-modal-card') : null;

      if (img && modalImg) modalImg.src = img.src;
      if (modalTitle) modalTitle.textContent = title;
      if (modalWish) modalWish.textContent = wish;

      if (modalCard) {
        if (card.classList.contains('pol-1')) {
          modalCard.setAttribute('data-current', 'pol-1');
        } else {
          modalCard.removeAttribute('data-current');
        }
      }

      if (photoModal) photoModal.classList.add('is-open');
    });
  });

  function closePhotoModal() {
    if (photoModal) photoModal.classList.remove('is-open');
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closePhotoModal();
    });
  }

  if (photoModal) {
    photoModal.addEventListener('click', function (e) {
      if (e.target === photoModal) {
        closePhotoModal();
      }
    });
  }
});

// ── Interactive Sparkle & Touch Ripples on Click / Tap ──
(function initTapEffects() {
  const cuteEmojis = ['✨', '🌸', '🤎', '⭐', '🎀', '💫'];

  function createTapEffect(x, y) {
    // 1. Create subtle expanding ripple
    const ripple = document.createElement('div');
    ripple.className = 'tap-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);

    // 2. Spawn 2-3 cute flying mini sparkles/emojis
    const count = 3;
    for (let i = 0; i < count; i++) {
      const sp = document.createElement('span');
      sp.className = 'tap-sparkle-mini';
      sp.textContent = cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)];
      sp.style.left = x + 'px';
      sp.style.top = y + 'px';

      const angle = (Math.random() * Math.PI * 2);
      const distance = 25 + Math.random() * 45;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 20;
      const rot = -40 + Math.random() * 80;

      sp.style.setProperty('--dx', dx + 'px');
      sp.style.setProperty('--dy', dy + 'px');
      sp.style.setProperty('--rot', rot + 'deg');

      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 800);
    }
  }

  document.addEventListener('pointerdown', function (e) {
    if (e.target.closest('#music-toggle, .btn, .lanjut-button, input, textarea')) return;
    createTapEffect(e.clientX, e.clientY);
  });
})();

// ── Music Toggle Logic ──
const musicEl     = document.getElementById('background-music');
const toggleBtn   = document.getElementById('music-toggle');
const musicIcon   = document.getElementById('music-icon');

function setPlayingState(playing) {
  if (playing) {
    musicIcon.textContent = '⏸';
    toggleBtn.classList.add('is-playing');
    toggleBtn.setAttribute('aria-label', 'Pause Musik');
  } else {
    musicIcon.textContent = '▶';
    toggleBtn.classList.remove('is-playing');
    toggleBtn.setAttribute('aria-label', 'Play Musik');
  }
}

// Fungsi untuk memulai musik
function playMusic() {
  if (!musicEl) return;
  const promise = musicEl.play();
  if (promise) {
    promise
      .then(() => setPlayingState(true))
      .catch(() => {
        // Browser memblokir autoplay — tombol tetap tersedia bagi user
        setPlayingState(false);
      });
  }
}

// Toggle play / pause saat tombol diklik
if (toggleBtn) {
  toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation(); // jangan trigger body click listener
    if (musicEl.paused) {
      playMusic();
    } else {
      musicEl.pause();
      setPlayingState(false);
    }
  });
}

// Sync ikon jika musik berhenti karena sebab lain
if (musicEl) {
  musicEl.addEventListener('pause', () => setPlayingState(false));
  musicEl.addEventListener('play',  () => setPlayingState(true));
}

// Auto-play saat halaman siap
window.addEventListener('DOMContentLoaded', function () {
  playMusic();
});
// Fallback: play saat user pertama kali klik halaman
document.body.addEventListener('click', playMusic, { once: true });

const content = document.getElementById('content');
const footer = document.getElementsByTagName('footer')[0];
const timer = document.getElementById('timer');

const second = 1000,
  minute = second * 60,
  hour = minute * 60,
  day = hour * 24;
let countDown = new Date('Sep 04, 2026 00:00:00').getTime(),
  x = setInterval(function () {
    let now = new Date().getTime(),
      distance = countDown - now;

    if (distance <= 0) {
      openBirthday();
      return;
    }

    document.getElementById('days').innerText = Math.floor(distance / (day)),
      document.getElementById('hours').innerText = Math.floor(distance / (hour)),
      document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute)),
      document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second);

  }, second);

if (Date.now() >= countDown) {
  openBirthday();
}

function openBirthday() {
  if (!timer || timer.classList.contains('d-none')) return;
  clearInterval(x);
  // nyambung seamless: kabut + bunga langsung menyelimuti timer yang memudar
  timer.classList.add('is-fading-out');
  confetti();
  _triggerFogBloom(function () { _slideSatu(); });
  setTimeout(function () {
    timer.classList.add('d-none');
    timer.classList.remove('is-fading-out');
  }, 380);
}

// ── Kabut menyelimuti + bunga berkilau dari love/images (wrapper div supaya ::after glint kelihatan) ──
function _triggerFogBloom(done) {
  var overlay = document.getElementById('fogBloomTransition');
  var grid = document.getElementById('fogBloomGrid');
  if (!overlay || !grid) { if (done) done(); return; }
  if (device.reducedMotion) { if (done) done(); return; }

  grid.innerHTML = '';
  overlay.classList.remove('is-fading-out');
  overlay.classList.add('is-active');

  var flowerImages = ['./love/images/bunga3.webp', './love/images/bunga4.webp'];
  var isMobile = window.innerWidth < 658;
  // ringan seperti sebelum berat: 5×4 desktop biar tidak leg tapi tetap berkilau
  var isLow = !!device.lowEnd;
  var cols = isLow ? 3 : (isMobile ? 4 : 5);
  var rows = isLow ? 3 : (isMobile ? 5 : 4);
  var createdFlowers = [];

  function makeFlowerWrap(src) {
    var wrap = document.createElement('div');
    wrap.className = 'fog-bloom-flower';
    var img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = 'eager';
    img.decoding = 'async';
    img.onerror = function () { wrap.style.display = 'none'; };
    wrap.appendChild(img);
    return wrap;
  }

  // Grid utama — ringan
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      var imgSize = isMobile ? (110 + Math.random() * 35) : (150 + Math.random() * 40);
      if (isLow) imgSize *= 0.85;
      var rowOffset = r % 2 ? 0.5 / cols : 0;
      var posX = ((c + 0.5) / cols) * 100 + rowOffset * 100 + (Math.random() * 10 - 5);
      var posY = ((r + 0.5) / rows) * 100 + (Math.random() * 10 - 5);
      var explodeDelay = Math.random() * 0.32;
      var rot = -45 + Math.random() * 90;
      var burstX = (50 - posX) * window.innerWidth / 100 * 0.18;
      var burstY = (50 - posY) * window.innerHeight / 100 * 0.18;

      var flower = makeFlowerWrap(flowerImages[(r * 2 + c) % flowerImages.length]);
      flower.style.setProperty('--cov-size', imgSize + 'px');
      flower.style.setProperty('--cov-x', posX + '%');
      flower.style.setProperty('--cov-y', posY + '%');
      flower.style.setProperty('--cov-delay', explodeDelay + 's');
      flower.style.setProperty('--cov-rot', rot + 'deg');
      flower.style.setProperty('--burst-x', burstX + 'px');
      flower.style.setProperty('--burst-y', burstY + 'px');

      grid.appendChild(flower);
      createdFlowers.push(flower);
    }
  }

  // Bunga tepi — ringan
  var edgeCount = isLow ? 3 : (isMobile ? 4 : 6);
  for (var e = 0; e < edgeCount; e++) {
    var edge = e % 4;
    var progress = Math.random() * 100;
    var posXE = progress;
    var posYE = progress;
    if (edge === 0) posYE = -4 - Math.random() * 8;
    if (edge === 1) posXE = 104 + Math.random() * 8;
    if (edge === 2) posYE = 104 + Math.random() * 8;
    if (edge === 3) posXE = -4 - Math.random() * 8;

    var imgSizeE = isMobile ? (95 + Math.random() * 28) : (120 + Math.random() * 35);
    if (isLow) imgSizeE *= 0.85;
    var distance = Math.hypot(posXE - 50, posYE - 50) / 70;
    var explodeDelayE = 0.10 + distance * 0.14 + Math.random() * 0.16;

    var flowerE = makeFlowerWrap(flowerImages[e % flowerImages.length]);
    flowerE.style.setProperty('--cov-size', imgSizeE + 'px');
    flowerE.style.setProperty('--cov-x', posXE + '%');
    flowerE.style.setProperty('--cov-y', posYE + '%');
    flowerE.style.setProperty('--cov-delay', explodeDelayE + 's');
    flowerE.style.setProperty('--cov-rot', (-70 + Math.random() * 140) + 'deg');
    flowerE.style.setProperty('--burst-x', ((50 - posXE) * window.innerWidth / 100 * 0.14) + 'px');
    flowerE.style.setProperty('--burst-y', ((50 - posYE) * window.innerHeight / 100 * 0.14) + 'px');

    grid.appendChild(flowerE);
    createdFlowers.push(flowerE);
  }

  // Transisi sempurna: biarkan kabut + bunga mekar penuh dulu (1.6s), baru peel spiral
  // HAPPY BIRTHDAY baru muncul SETELAH kabut & bunga selesai — tidak keburu muncul duluan
  setTimeout(function () {
    var shuffled = createdFlowers.slice().sort(function () { return Math.random() - 0.5; });
    shuffled.forEach(function (fl, idx) {
      var peelDelay = idx * 0.028;
      var peelDx = (Math.random() - 0.5) * 110;
      var peelDy = (Math.random() - 0.5) * 110;
      fl.style.setProperty('--peel-delay', peelDelay + 's');
      fl.style.setProperty('--peel-dx', peelDx + 'px');
      fl.style.setProperty('--peel-dy', peelDy + 'px');
      fl.classList.add('flower-peel-away');
    });

    // Kabut dissolve nyambung bersamaan dengan peel — seperti love #incoming-fog
    overlay.classList.add('is-fading-out');

    var totalPeel = (shuffled.length * 0.028 + 1.1) * 1000;
    setTimeout(function () {
      overlay.classList.remove('is-active', 'is-fading-out');
      grid.innerHTML = '';
      if (done) done(); // baru tampilkan HAPPY BIRTHDAY setelah transisi selesai sempurna
    }, totalPeel);
  }, 1650);
}

// Meteor removed — transisi smooth langsung ke slideSatu tanpa animasi berat

const _slideSatu = function () {
  const tap = document.getElementById('tap');
  const slideSatu = document.getElementById('slideSatu');
  if (!slideSatu) return;

  slideSatu.classList.remove('d-none');
  // smooth enter pengganti meteor — ringan, pakai CSS animation yang sudah ada di letter
  slideSatu.classList.add('is-entering');
  setTimeout(function () { slideSatu.classList.remove('is-entering'); }, 800);
  setTimeout(function () {
    if (tap) tap.classList.remove('d-none');
    document.body.addEventListener('click', function () {
      _slideDua();
    }, { once: true });
  }, 4500);
};

const _slideDua = function () {
  const slideSatu = document.getElementById('slideSatu');
  const tap = document.getElementById('tap');
  const slideDua = document.getElementById('slideDua');

  if (slideSatu) {
    slideSatu.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    slideSatu.style.opacity = '0';
    slideSatu.style.transform = 'translateY(-30px) scale(0.9)';
    if (tap) tap.classList.add('d-none');
    setTimeout(function () {
      slideSatu.classList.add('d-none');
    }, 800);
  }

  if (slideDua) slideDua.classList.remove('d-none');
};

const _slideTiga = function () {
  const slideTiga = document.getElementById('slideTiga');
  slideTiga.classList.remove('d-none');
};

const _showTap = function (onClick) {
  const tap = document.getElementById('tap');
  if (!tap) return;
  tap.classList.remove('d-none');
  tap.classList.add('animate__fadeIn');
  document.body.addEventListener('click', onClick, { once: true });
};

// ─── JS Page Flip Engine (CSS transition fallback untuk low-end) ─────────
function triggerPageFlip(sourceEl, targetEl) {
  if (device.lowEnd || device.reducedMotion) {
    sourceEl.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    sourceEl.style.opacity = '0';
    sourceEl.style.transform = 'scale(0.95)';
    targetEl.classList.remove('d-none', 'animate__fadeInRight', 'animate__animated');
    targetEl.style.opacity = '0';
    requestAnimationFrame(() => {
      targetEl.style.opacity = '1';
    });
    setTimeout(() => sourceEl.remove(), 450);
    return;
  }

  const rect = sourceEl.getBoundingClientRect();

  const stage = document.createElement('div');
  stage.className = 'flip-stage';
  stage.style.cssText = `
    top:${rect.top}px;
    left:${rect.left}px;
    width:${rect.width}px;
    height:${rect.height}px;
    z-index:900;
    perspective:${rect.width * 3}px;
  `;

  const leaf = document.createElement('div');
  leaf.className = 'flip-leaf';

  const front = document.createElement('div');
  front.className = 'flip-face flip-front';
  front.innerHTML = sourceEl.innerHTML;

  const back = document.createElement('div');
  back.className = 'flip-face flip-back';

  const shadowEl = document.createElement('div');
  shadowEl.className = 'flip-shadow';

  leaf.appendChild(shadowEl);
  leaf.appendChild(front);
  leaf.appendChild(back);
  stage.appendChild(leaf);
  document.body.appendChild(stage);

  sourceEl.style.visibility = 'hidden';

  targetEl.classList.remove('d-none', 'animate__fadeInRight', 'animate__animated');
  targetEl.style.opacity = '0';

  const DURATION = 1150;
  let startTime = null;
  let midDone = false;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(ts) {
    if (!startTime) startTime = ts;
    const raw = Math.min((ts - startTime) / DURATION, 1);
    const ease = easeInOutCubic(raw);
    const deg = -180 * ease;
    const yScale = 1 - Math.sin(ease * Math.PI) * 0.035;

    leaf.style.transform = `rotateY(${deg}deg) scaleY(${yScale})`;

    const sinRaw = Math.sin(raw * Math.PI);
    if (sinRaw > 0.01) {
      const spread = Math.round(70 * sinRaw);
      const alpha = (0.22 * sinRaw).toFixed(3);
      shadowEl.style.background =
        `linear-gradient(to left, rgba(0,0,0,${alpha}) 0%, transparent ${spread}%)`;
    } else {
      shadowEl.style.background = 'transparent';
    }

    if (raw >= 0.5 && !midDone) {
      midDone = true;
      sourceEl.style.visibility = '';
      sourceEl.classList.add('d-none');
    }

    if (raw > 0.5) {
      const revealT = (raw - 0.5) * 2;
      targetEl.style.opacity = revealT.toFixed(3);
    }

    if (raw < 1) {
      requestAnimationFrame(step);
    } else {
      stage.remove();
      targetEl.style.opacity = '1';
      targetEl.style.transition = '';
    }
  }

  requestAnimationFrame(step);
}

const _siapkanTapSlideDua = function () {
  const tap = document.getElementById('tap');
  const slideDua = document.getElementById('slideDua');

  if (!tap || !slideDua || slideDua.classList.contains('d-none')) return;

  _showTap(function () {
    tap.classList.add('d-none');
    tap.classList.remove('animate__fadeIn');

    // Remove any leftover animate.css classes from the entry animation
    slideDua.classList.remove(
      'animate__zoomInDown', 'animate__fadeOutLeft',
      'animate__delay-2s', 'animate__slow', 'animate__animated'
    );

    const slideTiga = document.getElementById('slideTiga');
    triggerPageFlip(slideDua, slideTiga);
  });
};


const _siapkanTapSlideTiga = function () {
  const tap = document.getElementById('tap');
  const slideTiga = document.getElementById('slideTiga');

  if (!tap || !slideTiga || slideTiga.classList.contains('d-none')) return;

  _showTap(function () {
    slideTiga.classList.remove('animate__delay-2s', 'animate__slow');
    slideTiga.classList.replace('animate__fadeInRight', 'animate__fadeOut');
    tap.classList.add('d-none');
    tap.classList.remove('animate__fadeIn');
    setTimeout(function () {
      tap.remove();
      slideTiga.remove();
      _slideEmpat();
    }, 800);
  });
};

function getRandomPosition(element) {
  var x = document.body.offsetHeight - element.clientHeight;
  var y = document.body.offsetWidth - element.clientWidth;
  var randomX = Math.floor(Math.random() * 500);
  var randomY = Math.floor(Math.random() * y);
  return [randomX, randomY];
};

const _slideEmpat = function () {
  const slideEmpat = document.getElementById('slideEmpat');
  const gakButton = document.getElementById('gak');
  const sukaButton = document.getElementById('suka');
  const dodgeHint = document.getElementById('dodgeHint');
  if (!slideEmpat || !gakButton || !sukaButton) return;

  slideEmpat.classList.remove('d-none');

  let dodgeCount = 0;
  const cuteDodges = [
    'Eits gak kena! 😜',
    'Gak bisa diklik wleee 😝',
    'Tombol ini rusak hihi 🙈',
    'Pencet yang kanan aja! 💖',
    'Harus suka dong! 🥺'
  ];

  // Efek tombol "Gak!" kabur dan lari dengan animasi lucu
  gakButton.addEventListener('click', function (e) {
    e.stopPropagation();
    dodgeCount++;
    gakButton.classList.add('is-dodging');

    if (dodgeHint) {
      dodgeHint.textContent = cuteDodges[dodgeCount % cuteDodges.length];
    }

    // Goyangkan kartu sedikit
    slideEmpat.classList.remove('card-dodge-wiggle');
    void slideEmpat.offsetWidth;
    slideEmpat.classList.add('card-dodge-wiggle');

    // Geser posisi tombol secara acak di dalam area tombol
    const offsetX = (Math.random() - 0.5) * 120;
    const offsetY = (Math.random() - 0.5) * 60;
    const rot = (Math.random() - 0.5) * 20;

    gakButton.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${Math.max(0.75, 1 - dodgeCount * 0.05)}) rotate(${rot}deg)`;
    
    // Perbesar tombol "Suka!!" semakin user mencoba klik "Gak"
    sukaButton.style.transform = `scale(${Math.min(1.35, 1 + dodgeCount * 0.08)})`;

    setTimeout(() => {
      gakButton.classList.remove('is-dodging');
    }, 1200);
  });

  sukaButton.addEventListener('click', function (e) {
    e.stopPropagation();
    slideEmpat.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    slideEmpat.style.transform = 'scale(1.15)';
    slideEmpat.style.opacity = '0';

    setTimeout(function () {
      slideEmpat.remove();
      setTimeout(() => {
        _slideLima();
      }, 300);
    }, 600);
  });
};

const _slideLima = function () {
  const slideLima = document.getElementById('slideLima');
  slideLima.classList.remove('d-none');
  const trims = document.getElementById('trims');

  setTimeout(() => {
    trims.classList.remove('d-none');
  }, 600);
};

const _showLanjut = function () {
  const slideLima = document.getElementById('slideLima');
  const trims = document.getElementById('trims');
  const slideEnam = document.getElementById('slideEnam');

  if (!slideLima || !trims) return;

  // Efek transisi hati mengecil dan mekar menjadi kartu surprise box
  slideLima.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
  slideLima.style.transform = 'scale(0.3)';
  slideLima.style.opacity = '0';
  trims.style.transition = 'opacity 0.4s ease';
  trims.style.opacity = '0';

  setTimeout(() => {
    slideLima.remove();
    trims.remove();
    _slideEnam();
  }, 500);
};

const _slideEnam = function () {
  const slideEnam = document.getElementById('slideEnam');
  if (!slideEnam) return;
  slideEnam.classList.remove('d-none');
};


new TypeIt("#teks1", {
  strings: ["Hari ini, saya langitkan semua doa terbaik saya untuk kamu.", "Semoga hal-hal yang membuat kamu runtuh turut menjadi alasan kamu untuk tetap tumbuh.", "Semoga dunia senantiasa menjaga kamu dimanapun kamu berada.", "Semoga hari-hari kamu selalu diiringi cinta yang tak pernah ada batasnya.", "Semoga setiap langkahmu dimudahkan hingga tercapai apa yang kamu inginkan."],
  startDelay: 4000,
  speed: 75,
  waitUntilVisible: true,
  afterComplete: function () {
    _siapkanTapSlideDua();
  },
}).go();

new TypeIt("#teks2", {
  strings: ["Maaf yah aku cuman bisa ngelakuin ini doang, semoga semesta selalu membahagiakan kamu bagimanapun caranya.", " ", "barakallah fi umrik, Kamu hebat udah bertahan sampai sejauh ini.", " ", "- Wish you all the best"],
  startDelay: 2000,
  speed: 75,
  waitUntilVisible: true,
  afterComplete: function () {
    _siapkanTapSlideTiga();
  },
}).go();


new TypeIt("#trims", {
  strings: ["Terimakasih."],
  startDelay: 0,
  speed: 150,
  loop: false,
  waitUntilVisible: true,
  afterComplete: function () {
    _showLanjut();
  },
}).go();



'use strict';

var onlyOnKonami = false;

function confetti() {
  // Globals
  var $window = $(window),
    random = Math.random,
    cos = Math.cos,
    sin = Math.sin,
    PI = Math.PI,
    PI2 = PI * 2,
    timer = undefined,
    frame = undefined,
    confetti = [];

  var runFor = device.lowEnd ? 800 : 2000
  var isRunning = true

  setTimeout(() => {
    isRunning = false
  }, runFor);

  // Settings
  var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
    pointer = 0;

  var particles = device.lowEnd ? 20 : 150,
    spread = 20,
    sizeMin = 5,
    sizeMax = 12 - sizeMin,
    eccentricity = 10,
    deviation = 100,
    dxThetaMin = -.1,
    dxThetaMax = -dxThetaMin - dxThetaMin,
    dyMin = .13,
    dyMax = .18,
    dThetaMin = .4,
    dThetaMax = .7 - dThetaMin;

  var colorThemes = [
    function () {
      return color(200 * random() | 0, 200 * random() | 0, 200 * random() | 0);
    },
    function () {
      var black = 200 * random() | 0;
      return color(200, black, black);
    },
    function () {
      var black = 200 * random() | 0;
      return color(black, 200, black);
    },
    function () {
      var black = 200 * random() | 0;
      return color(black, black, 200);
    },
    function () {
      return color(200, 100, 200 * random() | 0);
    },
    function () {
      return color(200 * random() | 0, 200, 200);
    },
    function () {
      var black = 256 * random() | 0;
      return color(black, black, black);
    },
    function () {
      return colorThemes[random() < .5 ? 1 : 2]();
    },
    function () {
      return colorThemes[random() < .5 ? 3 : 5]();
    },
    function () {
      return colorThemes[random() < .5 ? 2 : 4]();
    }
  ];

  function color(r, g, b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  // Cosine interpolation
  function interpolation(a, b, t) {
    return (1 - cos(PI * t)) / 2 * (b - a) + a;
  }

  // Create a 1D Maximal Poisson Disc over [0, 1]
  var radius = 1 / eccentricity,
    radius2 = radius + radius;

  function createPoisson() {
    // domain is the set of points which are still available to pick from
    // D = union{ [d_i, d_i+1] | i is even }
    var domain = [radius, 1 - radius],
      measure = 1 - radius2,
      spline = [0, 1];
    while (measure) {
      var dart = measure * random(),
        i, l, interval, a, b, c, d;

      // Find where dart lies
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        a = domain[i], b = domain[i + 1], interval = b - a;
        if (dart < measure + interval) {
          spline.push(dart += a - measure);
          break;
        }
        measure += interval;
      }
      c = dart - radius, d = dart + radius;

      for (i = domain.length - 1; i > 0; i -= 2) {
        l = i - 1, a = domain[l], b = domain[i];
        // c---d          c---d  Do nothing
        //   c-----d  c-----d    Move interior
        //   c--------------d    Delete interval
        //         c--d          Split interval
        //       a------b
        if (a >= c && a < d)
          if (b > d) domain[l] = d; // Move interior (Left case)
          else domain.splice(l, 2); // Delete interval
        else if (a < c && b > c)
          if (b <= d) domain[i] = c; // Move interior (Right case)
          else domain.splice(i, 0, c, d); // Split interval
      }

      for (i = 0, l = domain.length, measure = 0; i < l; i += 2)
        measure += domain[i + 1] - domain[i];
    }

    return spline.sort();
  }

  var container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '0';
  container.style.overflow = 'visible';
  container.style.zIndex = '9999';

  // Confetto constructor
  function Confetto(theme) {
    this.frame = 0;
    this.outer = document.createElement('div');
    this.inner = document.createElement('div');
    this.outer.appendChild(this.inner);

    var outerStyle = this.outer.style,
      innerStyle = this.inner.style;
    outerStyle.position = 'absolute';
    outerStyle.width = (sizeMin + sizeMax * random()) + 'px';
    outerStyle.height = (sizeMin + sizeMax * random()) + 'px';
    innerStyle.width = '100%';
    innerStyle.height = '100%';
    innerStyle.backgroundColor = theme();

    outerStyle.perspective = '50px';
    outerStyle.transform = 'rotate(' + (360 * random()) + 'deg)';
    this.axis = 'rotate3D(' +
      cos(360 * random()) + ',' +
      cos(360 * random()) + ',0,';
    this.theta = 360 * random();
    this.dTheta = dThetaMin + dThetaMax * random();
    innerStyle.transform = this.axis + this.theta + 'deg)';

    this.x = $window.width() * random();
    this.y = -deviation;
    this.dx = sin(dxThetaMin + dxThetaMax * random());
    this.dy = dyMin + dyMax * random();
    outerStyle.left = this.x + 'px';
    outerStyle.top = this.y + 'px';

    // Create the periodic spline
    this.splineX = createPoisson();
    this.splineY = [];
    for (var i = 1, l = this.splineX.length - 1; i < l; ++i)
      this.splineY[i] = deviation * random();
    this.splineY[0] = this.splineY[l] = deviation * random();

    this.update = function (height, delta) {
      this.frame += delta;
      this.x += this.dx * delta;
      this.y += this.dy * delta;
      this.theta += this.dTheta * delta;

      // Compute spline and convert to polar
      var phi = this.frame % 7777 / 7777,
        i = 0,
        j = 1;
      while (phi >= this.splineX[j]) i = j++;
      var rho = interpolation(
        this.splineY[i],
        this.splineY[j],
        (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i])
      );
      phi *= PI2;

      outerStyle.left = this.x + rho * cos(phi) + 'px';
      outerStyle.top = this.y + rho * sin(phi) + 'px';
      innerStyle.transform = this.axis + this.theta + 'deg)';
      return this.y > height + deviation;
    };
  }


  function poof() {
    if (!frame) {
      // Append the container
      document.body.appendChild(container);

      // Add confetti

      var theme = colorThemes[onlyOnKonami ? colorThemes.length * random() | 0 : 0],
        count = 0;

      (function addConfetto() {

        if (onlyOnKonami && ++count > particles)
          return timer = undefined;

        if (isRunning) {
          var confetto = new Confetto(theme);
          confetti.push(confetto);

          container.appendChild(confetto.outer);
          timer = setTimeout(addConfetto, spread * random());
        }
      })(0);


      // Start the loop
      var prev = undefined;
      requestAnimationFrame(function loop(timestamp) {
        var delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        var height = $window.height();

        for (var i = confetti.length - 1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            container.removeChild(confetti[i].outer);
            confetti.splice(i, 1);
          }
        }

        if (timer || confetti.length)
          return frame = requestAnimationFrame(loop);

        // Cleanup
        document.body.removeChild(container);
        frame = undefined;
      });
    }
  }

  $window.keydown(function (event) {
    pointer = konami[pointer] === event.which ?
      pointer + 1 :
      +(event.which === konami[0]);
    if (pointer === konami.length) {
      pointer = 0;
      poof();
    }
  });

  if (!onlyOnKonami) poof();
};

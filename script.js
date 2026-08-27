// ── Realistic Falling Flower Petals ──
(function initPetals() {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Resize canvas to fill window
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

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

    // Gradient fill for depth
    const grad = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r * 1.4);
    grad.addColorStop(0, color + (alpha + 0.15) + ')');
    grad.addColorStop(1, color + (alpha * 0.5) + ')');
    ctx.fillStyle = grad;
    ctx.fill();

    // Soft stroke
    ctx.strokeStyle = color + (alpha * 0.3) + ')';
    ctx.lineWidth = 0.5;
    ctx.stroke();
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

  // Create petals
  const PETAL_COUNT = 55;
  const petals = Array.from({ length: PETAL_COUNT }, () => new Petal());

  // Animation loop
  function loop() {
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
  const count = 18;

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

// ================================================================
// MUSIK — Play/Pause dengan tombol
// ================================================================
window.addEventListener('DOMContentLoaded', function () {
  var audio = document.getElementById('background-music');
  var btn = document.getElementById('music-toggle-btn');
  var icon = document.getElementById('music-btn-icon');
  var label = document.getElementById('music-btn-label');
  if (!audio) return;

  function setPlaying(playing) {
    if (playing) {
      icon.textContent = '❚❚';
      label.textContent = 'Pause';
    } else {
      icon.textContent = '▶';
      label.textContent = 'Putar';
    }
  }

  // Trik muted autoplay bypass
  audio.muted = true;
  audio.play().then(function () {
    audio.muted = false;
    setPlaying(true);
  }).catch(function () {
    setPlaying(false);
  });

  // Klik tombol = toggle play/pause
  if (btn) {
    btn.addEventListener('click', function () {
      if (audio.paused) {
        audio.muted = false;
        audio.play().then(function () { setPlaying(true); }).catch(function () { });
      } else {
        audio.pause();
        setPlaying(false);
      }
    });
  }
});
const content = document.getElementById('content');
const footer = document.getElementsByTagName('footer')[0];
const timer = document.getElementById('timer');


const second = 1000,
  minute = second * 60,
  hour = minute * 60,
  day = hour * 24;
let countDown = new Date('august 26, 2026 00:00:00').getTime(),
  x = setInterval(function () {
    let now = new Date().getTime(),
      distance = countDown - now;
    document.getElementById('days').innerText = Math.floor(distance / (day)),
      document.getElementById('hours').innerText = Math.floor(distance / (hour)),
      document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute)),
      document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second);

    if (distance < 0) {
      openBirthday();
    }

  }, second)

function openBirthday() {
  if (timer.classList.contains('d-none')) return;

  timer.classList.add('d-none');
  clearInterval(x);
  confetti();
  _slideSatu();
}



const _slideSatu = function () {
  const tap = document.getElementById('tap');
  const slideSatu = document.getElementById('slideSatu');
  slideSatu.classList.remove('d-none');
  setTimeout(function () {
    tap.classList.remove('d-none');
    document.body.addEventListener('click', function () {
      _slideDua();
    }, { once: true })
  }, 7000);
};

const _slideDua = function () {
  const slideSatu = document.getElementById('slideSatu');
  const tap = document.getElementById('tap');
  const slideDua = document.getElementById('slideDua');

  setTimeout(function () {
    slideSatu.classList.replace('animate__slideInDown', 'animate__backOutDown');
    tap.classList.add('d-none');
    setTimeout(function () {
      slideSatu.classList.add('d-none');
    }, 1000);
  }, 1000);

  slideDua.classList.remove('d-none');
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

// ─── Realistic JS Page Flip Engine ───────────────────────────────────────────
function triggerPageFlip(sourceEl, targetEl) {
  const rect = sourceEl.getBoundingClientRect();

  // 1. Stage: provides perspective context (perspective on parent = realistic 3D)
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

  // 2. Leaf: the element that actually rotates
  const leaf = document.createElement('div');
  leaf.className = 'flip-leaf';

  // 3. Front face: paper look (page 1 side)
  const front = document.createElement('div');
  front.className = 'flip-face flip-front';

  // Ring holes decoration on front
  const holes = document.createElement('div');
  holes.style.cssText = `
    position:absolute; top:0; bottom:0; left:6px;
    width:44px;
    background:radial-gradient(#c0c0c0 5px, transparent 6px) repeat-y;
    background-size:30px 32px;
    border-right:3px solid #ffb3c6;
  `;
  front.appendChild(holes);

  // 4. Back face: slightly pink back of paper
  const back = document.createElement('div');
  back.className = 'flip-face flip-back';

  // 5. Shadow overlay (cast on page beneath as page lifts)
  const shadowEl = document.createElement('div');
  shadowEl.className = 'flip-shadow';

  leaf.appendChild(shadowEl);
  leaf.appendChild(front);
  leaf.appendChild(back);
  stage.appendChild(leaf);
  document.body.appendChild(stage);

  // Hide actual source element while overlay is in place
  sourceEl.style.visibility = 'hidden';

  // Prepare target: show but invisible so layout is ready
  targetEl.classList.remove('d-none', 'animate__fadeInRight', 'animate__animated');
  targetEl.style.opacity = '0';

  // ─── Animation engine ───────────────────────────────────────────────────────
  const DURATION = 1150; // ms — total flip time
  let startTime = null;
  let midDone = false;

  // Smooth easeInOutCubic: slow → fast (90°) → slow (landing)
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(ts) {
    if (!startTime) startTime = ts;
    const raw = Math.min((ts - startTime) / DURATION, 1);
    const ease = easeInOutCubic(raw);
    const deg = -180 * ease;

    // Slight Y compression at 90°: paper bends physically as it turns
    const yScale = 1 - Math.sin(ease * Math.PI) * 0.035;

    leaf.style.transform = `rotateY(${deg}deg) scaleY(${yScale})`;

    // Dynamic shadow: peaks at 90° (midpoint), fades out as page lands
    const sinRaw = Math.sin(raw * Math.PI); // 0 → 1 → 0
    if (sinRaw > 0.01) {
      const spread = Math.round(70 * sinRaw);
      const alpha = (0.22 * sinRaw).toFixed(3);
      shadowEl.style.background =
        `linear-gradient(to left, rgba(0,0,0,${alpha}) 0%, transparent ${spread}%)`;
    } else {
      shadowEl.style.background = 'transparent';
    }

    // Midpoint (≈ 90°): swap content underneath the overlay
    if (raw >= 0.5 && !midDone) {
      midDone = true;
      sourceEl.style.visibility = '';
      sourceEl.classList.add('d-none');
    }

    // Second half: gradually reveal target page (it's beneath the overlay)
    if (raw > 0.5) {
      const revealT = (raw - 0.5) * 2; // 0 → 1
      targetEl.style.opacity = revealT.toFixed(3);
    }

    if (raw < 1) {
      requestAnimationFrame(step);
    } else {
      // Cleanup — flip done
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
  slideEmpat.classList.remove('d-none');

  gakButton.addEventListener('click', function () {
    var xy = getRandomPosition(slideEmpat);
    slideEmpat.style.top = xy[0] + 'px';
    // slideEmpat.style.left = xy[1] + 'px';
  });

  sukaButton.addEventListener('click', function () {
    slideEmpat.classList.replace('animate__fadeInDown', 'animate__bounceOut');
    slideEmpat.classList.remove('animate__delay-2s');
    setTimeout(function () {
      slideEmpat.remove()
      setTimeout(() => {
        _slideLima();
      }, 500);
    }, 1000);
  })
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

  if (!slideLima || !trims) return;

  slideLima.classList.replace('animate__bounceIn', 'animate__fadeOut');

  setTimeout(() => {
    slideLima.remove();
    _slideEnam();
  }, 500);
};

const _slideEnam = function () {
  const slideEnam = document.getElementById('slideEnam');
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

  var runFor = 2000
  var isRunning = true

  setTimeout(() => {
    isRunning = false
  }, runFor);

  // Settings
  var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
    pointer = 0;

  var particles = 150,
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

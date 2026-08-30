// ================================================================
// CONFIGURATION — Happy Birthday Dini Nuranisa
// ================================================================
var deviceLowEnd = (function () {
  var cores = navigator.hardwareConcurrency || 2;
  var memory = navigator.deviceMemory || 4;
  var isMobile = /Mobi|Android/i.test(navigator.userAgent);
  var screenArea = window.innerWidth * window.innerHeight;
  return cores <= 2 || memory <= 2 || (isMobile && screenArea < 500000);
})();
var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var radius          = 260;
var autoRotate      = true;
var rotateSpeed     = -55;
var imgWidth        = 130;
var imgHeight       = 180;
var bgMusicURL      = null;
var bgMusicControls = false;
// Photos emerge through the opening flower curtain instead of appearing behind it.
var photoRevealDelay = 3450;
var removeIntroDelay = 6200;

// ================================================================
// CAROUSEL SETUP
// ================================================================
var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg  = ospin.getElementsByTagName('img');
var aVid  = ospin.getElementsByTagName('video');
var aEle  = [...aImg, ...aVid];
var photoTitle = ospin.querySelector('p');
var pageVisible = !document.hidden;
var resizeFrame = 0;

document.addEventListener('visibilitychange', function () {
  pageVisible = !document.hidden;
});

// Responsive sizing setup
function setupCarouselDimensions() {
  var isMobile = window.innerWidth < 658;
  imgWidth  = isMobile ? 105 : 130;
  imgHeight = isMobile ? 150 : 180;
  radius    = isMobile ? 180 : 250;

  ospin.style.width  = imgWidth  + "px";
  ospin.style.height = imgHeight + "px";

  var ground = document.getElementById('ground');
  if (ground) {
    ground.style.width  = radius * 3 + "px";
    ground.style.height = radius * 3 + "px";
  }
}
setupCarouselDimensions();
window.addEventListener('resize', function () {
  if (resizeFrame) return;
  resizeFrame = requestAnimationFrame(function () {
    resizeFrame = 0;
    setupCarouselDimensions();
    if (!document.body.classList.contains('intro-playing')) {
      init(0.5);
    }
  });
});
applyTransform(odrag);

// Sembunyikan semua foto pada awalnya untuk animasi satu per satu
for (var i = 0; i < aEle.length; i++) {
  aEle[i].classList.add('photo-hidden');
}

createFlowerIntro();

// Open the exact photo that was clicked in a playful, accessible lightbox.
(function () {
  var modal = document.getElementById('photo-modal');
  var modalImage = document.getElementById('photo-modal-image');
  var modalCaption = document.getElementById('photo-modal-caption');
  var closeButton = document.getElementById('photo-modal-close');
  var previousButton = document.getElementById('photo-modal-prev');
  var nextButton = document.getElementById('photo-modal-next');
  if (!modal || !modalImage || !modalCaption || !closeButton || !previousButton || !nextButton) return;

  var captions = [
    'Senyum paling manis hari ini ✨',
    'Kenangan kecil, bahagia besar 💖',
    'Momen hangat yang selalu dirindukan 🌸',
    'Tetap bersinar seperti bintang ⭐',
    'Satu foto, seribu cerita 🎀'
  ];
  var currentIndex = 0;

  function closePhoto() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function sprinkleConfetti() {
    var colors = ['#ffe39f', '#f8c9c9', '#fff8f0', '#b9845a', '#e8caa5'];
    for (var i = 0; i < 14; i++) {
      var confetti = document.createElement('span');
      var angle = Math.random() * Math.PI * 2;
      var distance = 55 + Math.random() * 105;
      confetti.className = 'photo-confetti';
      confetti.style.setProperty('--x', Math.cos(angle) * distance + 'px');
      confetti.style.setProperty('--y', Math.sin(angle) * distance + 'px');
      confetti.style.setProperty('--rot', (Math.random() * 360) + 'deg');
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = '50%';
      confetti.style.top = '50%';
      modal.appendChild(confetti);
      setTimeout(function (item) {
        return function () { item.remove(); };
      }(confetti), 850);
    }
  }

  function showPhoto(index, withConfetti) {
    currentIndex = (index + aImg.length) % aImg.length;
    var photo = aImg[currentIndex];
    modalImage.src = photo.getAttribute('src') || photo.src;
    modalImage.alt = photo.alt || 'Foto kenangan';
    modalCaption.textContent = captions[currentIndex % captions.length];
    modalImage.classList.remove('modal-photo-refresh');
    void modalImage.offsetWidth;
    modalImage.classList.add('modal-photo-refresh');
    if (withConfetti) sprinkleConfetti();
  }

  Array.prototype.forEach.call(aImg, function (photo, index) {
    photo.addEventListener('click', function (event) {
      event.stopPropagation();
      showPhoto(index, true);
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      closeButton.focus();
    });
  });

  previousButton.addEventListener('click', function (event) {
    event.stopPropagation();
    showPhoto(currentIndex - 1, false);
  });
  nextButton.addEventListener('click', function (event) {
    event.stopPropagation();
    showPhoto(currentIndex + 1, false);
  });
  closeButton.addEventListener('click', closePhoto);
  modal.addEventListener('click', function (event) {
    if (event.target === modal) closePhoto();
  });
  document.addEventListener('keydown', function (event) {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      closePhoto();
    } else if (event.key === 'ArrowLeft') {
      showPhoto(currentIndex - 1, false);
    } else if (event.key === 'ArrowRight') {
      showPhoto(currentIndex + 1, false);
    }
  });
})();

// Reveal elemen bertahap
setTimeout(function () {
  document.body.classList.remove('intro-playing');
  revealPhotosStaggered();
}, photoRevealDelay);

setTimeout(function () {
  var intro = document.getElementById('flower-intro');
  if (intro) intro.remove();
}, removeIntroDelay);

// ----------------------------------------------------------------
// Munculkan foto satu per satu secara berurutan melingkar (Carousel 3D)
// ----------------------------------------------------------------
function revealPhotosStaggered() {
  var totalPhotos = aEle.length;
  var stepDelay = 220; // Jeda waktu proporsional antar foto

  aEle.forEach(function (el, index) {
    setTimeout(function () {
      el.classList.remove('photo-hidden');
      el.style.transform = "rotateY(" + (index * (360 / totalPhotos)) + "deg) translateZ(" + radius + "px)";
      el.classList.add('photo-revealed');
    }, index * stepDelay);
  });

  setTimeout(function () {
    if (photoTitle) {
      photoTitle.classList.add('title-visible');
    }
  }, totalPhotos * stepDelay + 350);
}

// ----------------------------------------------------------------
// Dense Flower Cluster Opening (Tumpukan Bunga Mekar Menutupi Penuh 100% Layar)
// ----------------------------------------------------------------
function createFlowerIntro() {
  var clusterLeft  = document.getElementById('flower-cluster-left');
  var clusterRight = document.getElementById('flower-cluster-right');
  if (!clusterLeft || !clusterRight) return;

  var flowerImages = ['./images/bunga4.webp', './images/bunga3.webp'];
  var clusters = [
    { el: clusterLeft,  side: 'left' },
    { el: clusterRight, side: 'right' }
  ];

  clusters.forEach(function (item) {
    var cluster = item.el;
    // Dense Flower Cluster Opening (Optimal Density Layout)
    var cols = window.innerWidth < 658 ? 4 : 5;
    var rows = window.innerWidth < 658 ? 5 : 5;

    // Lapisan 1: Base Grid padat & rapat
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var flower   = document.createElement('img');
        var imgSrc   = flowerImages[(r * cols + c) % flowerImages.length];
        var baseSize = window.innerWidth < 658 ? 135 : 180;
        var size     = baseSize + Math.random() * (window.innerWidth < 658 ? 45 : 60);
        var delay    = Math.random() * 2.2;
        var duration = 2.4 + Math.random() * 2.0;
        var scale    = 0.95 + Math.random() * 0.35;
        var rotation = -50 + Math.random() * 100;
        var dx       = -10 + Math.random() * 20;
        var dy       = -10 + Math.random() * 20;

        var x = ((c + 0.5) / cols) * 100 + (-8 + Math.random() * 16);
        var y = ((r + 0.5) / rows) * 100 + (-8 + Math.random() * 16);

        flower.src = imgSrc;
        flower.alt = '';
        flower.className = 'dense-flower';
        flower.style.setProperty('--x',     x + '%');
        flower.style.setProperty('--y',     y + '%');
        flower.style.setProperty('--size',  size + 'px');
        flower.style.setProperty('--s',     scale);
        flower.style.setProperty('--rot',   rotation + 'deg');
        flower.style.setProperty('--dx',    dx + 'px');
        flower.style.setProperty('--dy',    dy + 'px');
        flower.style.setProperty('--delay', delay + 's');
        flower.style.setProperty('--dur',   duration + 's');

        cluster.appendChild(flower);
      }
    }

    // Lapisan 2: Overlap Bunga Tepi
    var extraCount = window.innerWidth < 658 ? 8 : 12;
    for (var k = 0; k < extraCount; k++) {
      var extraFlower = document.createElement('img');
      var extraImg    = flowerImages[Math.floor(Math.random() * flowerImages.length)];
      var extraSize   = window.innerWidth < 658 ? 145 + Math.random() * 50 : 190 + Math.random() * 70;
      var eDelay      = Math.random() * 2.2;
      var eDur        = 2.2 + Math.random() * 1.8;
      var eScale      = 1.0 + Math.random() * 0.35;
      var eRot        = -70 + Math.random() * 140;

      var ex = item.side === 'left' ? 40 + Math.random() * 65 : -5 + Math.random() * 65;
      var ey = Math.random() * 105;

      extraFlower.src = extraImg;
      extraFlower.alt = '';
      extraFlower.className = 'dense-flower';
      extraFlower.style.setProperty('--x',     ex + '%');
      extraFlower.style.setProperty('--y',     ey + '%');
      extraFlower.style.setProperty('--size',  extraSize + 'px');
      extraFlower.style.setProperty('--s',     eScale);
      extraFlower.style.setProperty('--rot',   eRot + 'deg');
      extraFlower.style.setProperty('--dx',    (-12 + Math.random() * 24) + 'px');
      extraFlower.style.setProperty('--dy',    (-12 + Math.random() * 24) + 'px');
      extraFlower.style.setProperty('--delay', eDelay + 's');
      extraFlower.style.setProperty('--dur',   eDur + 's');

      cluster.appendChild(extraFlower);
    }
  });
}

// ----------------------------------------------------------------
// Carousel init / transform helpers
// ----------------------------------------------------------------
function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTransform(obj) {
  if (tY > 180) tY = 180;
  if (tY < 0)   tY = 0;
  obj.style.transform = "translate(-50%, -50%) rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = yes ? 'running' : 'paused';
}

var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 8;

if (autoRotate) {
  var animName = rotateSpeed > 0 ? 'spin' : 'spinRevert';
  ospin.style.animation = animName + " " + Math.abs(rotateSpeed) + "s infinite linear";
}

if (bgMusicURL) {
  document.getElementById('music-container').innerHTML += `
    <audio src="${bgMusicURL}" ${bgMusicControls ? 'controls' : ''} autoplay loop>
      <p>Browser Anda tidak mendukung audio.</p>
    </audio>`;
}

// Smooth Drag & Momentum Inertia (Rotasi 3D Halus pada Formasi Hati)
document.onpointerdown = function (e) {
  if (odrag.timer) cancelAnimationFrame(odrag.timer);
  e = e || window.event;
  sX = e.clientX;
  sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    nX = e.clientX;
    nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTransform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function () {
    function continueMomentum() {
      desX *= 0.94;
      desY *= 0.94;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTransform(odrag);
      if (Math.abs(desX) < 0.4 && Math.abs(desY) < 0.4) {
        odrag.timer = 0;
        return;
      }
      odrag.timer = requestAnimationFrame(continueMomentum);
    }
    odrag.timer = requestAnimationFrame(continueMomentum);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

// Smooth Wheel Zoom
document.onwheel = function (e) {
  e = e || window.event;
  var d = e.deltaY ? -e.deltaY / 15 : e.wheelDelta / 20;
  radius += d;
  if (radius < 150) radius = 150;
  if (radius > 450) radius = 450;
  init(0.2);
};

// ================================================================
// WEBGL HEART SHADER
// ================================================================
var canvas = document.getElementById('canvas');
var gl = null;

if (!deviceLowEnd && !reducedMotion && canvas) {
  try {
    gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) console.error("WebGL tidak tersedia.");
  } catch (e) {
    console.warn("WebGL error:", e);
    gl = null;
  }
}

if (!gl && canvas) {
  // Fallback: sembunyikan canvas WebGL
  canvas.style.display = 'none';
}

// WebGL Resolution Scale (Optimized for Mobile/GPU)
function updateCanvasSize() {
  var dpr = deviceLowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
  if (!canvas) return;
  canvas.width  = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
}
if (gl) updateCanvasSize();

var time = 0.0;

var vertexSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

var fragmentSource = `
precision highp float;

uniform float width;
uniform float height;
vec2 resolution = vec2(width, height);

uniform float time;

#define POINT_COUNT 8

vec2 points[POINT_COUNT];
const float speed = -0.5;
const float len = 0.25;
float intensity = 1.3;
float radius = 0.008;

float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C) {
  vec2 a = B - A;
  vec2 b = A - 2.0*B + C;
  vec2 c = a * 2.0;
  vec2 d = A - pos;

  float kk = 1.0 / dot(b,b);
  float kx = kk * dot(a,b);
  float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;
  float kz = kk * dot(d,a);

  float res = 0.0;
  float p  = ky - kx*kx;
  float p3 = p*p*p;
  float q  = kx*(2.0*kx*kx - 3.0*ky) + kz;
  float h  = q*q + 4.0*p3;

  if (h >= 0.0) {
    h = sqrt(h);
    vec2 x = (vec2(h,-h) - q) / 2.0;
    vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
    float t = uv.x + uv.y - kx;
    t = clamp(t, 0.0, 1.0);
    vec2 qos = d + (c + b*t)*t;
    res = length(qos);
  } else {
    float z = sqrt(-p);
    float v = acos(q/(p*z*2.0)) / 3.0;
    float m = cos(v);
    float n = sin(v)*1.732050808;
    vec3 t = vec3(m+m,-n-m,n-m)*z - kx;
    t = clamp(t, 0.0, 1.0);
    vec2 qos = d + (c + b*t.x)*t.x;
    float dis = dot(qos,qos);
    res = dis;
    qos = d + (c + b*t.y)*t.y;
    dis = dot(qos,qos);
    res = min(res,dis);
    qos = d + (c + b*t.z)*t.z;
    dis = dot(qos,qos);
    res = min(res,dis);
    res = sqrt(res);
  }
  return res;
}

vec2 getHeartPosition(float t) {
  return vec2(
    16.0 * sin(t)*sin(t)*sin(t),
    -(13.0*cos(t) - 5.0*cos(2.0*t) - 2.0*cos(3.0*t) - cos(4.0*t))
  );
}

float getGlow(float dist, float radius, float intensity) {
  return pow(radius/dist, intensity);
}

float getSegment(float t, vec2 pos, float offset, float scale) {
  for (int i = 0; i < POINT_COUNT; i++) {
    points[i] = getHeartPosition(offset + float(i)*len + fract(speed*t)*6.28);
  }
  vec2 c = (points[0]+points[1])/2.0;
  vec2 c_prev;
  float dist = 10000.0;
  for (int i = 0; i < POINT_COUNT-1; i++) {
    c_prev = c;
    c = (points[i]+points[i+1])/2.0;
    dist = min(dist, sdBezier(pos, scale*c_prev, scale*points[i], scale*c));
  }
  return max(0.0, dist);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float whr = resolution.x / resolution.y;
  vec2 centre = vec2(0.5, 0.5);
  vec2 pos = centre - uv;
  pos.y /= whr;
  pos.y += 0.02;
  float scale = 0.000015 * height;
  float t = time;

  // Segment 1 — warm gold
  float dist = getSegment(t, pos, 0.0, scale);
  float glow = getGlow(dist, radius, intensity);
  vec3 col = vec3(0.0);
  col += 10.0 * vec3(smoothstep(0.003, 0.001, dist));
  col += glow * vec3(1.0, 0.70, 0.28);   // warm gold glow

  // Segment 2 — cream shimmer
  dist = getSegment(t, pos, 3.4, scale);
  glow = getGlow(dist, radius, intensity);
  col += 10.0 * vec3(smoothstep(0.003, 0.001, dist));
  col += glow * vec3(1.0, 0.88, 0.62);   // cream shimmer glow

  col = 1.0 - exp(-col);
  col = pow(col, vec3(0.4545));

  gl_FragColor = vec4(col, max(max(col.r, col.g), col.b));
}
`;

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  updateCanvasSize();
  gl.uniform1f(widthHandle, canvas.width);
  gl.uniform1f(heightHandle, canvas.height);
}

function compileShader(src, type) {
  var s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw "Shader error: " + gl.getShaderInfoLog(s);
  return s;
}

function getAttribLocation(prog, name) {
  var loc = gl.getAttribLocation(prog, name);
  if (loc === -1) throw 'Attribute not found: ' + name;
  return loc;
}
function getUniformLocation(prog, name) {
  var loc = gl.getUniformLocation(prog, name);
  if (loc === -1) throw 'Uniform not found: ' + name;
  return loc;
}

var vertexShader   = compileShader(vertexSource,   gl.VERTEX_SHADER);
var fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);
var program        = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

var vertexData = new Float32Array([
  -1.0,  1.0,
  -1.0, -1.0,
   1.0,  1.0,
   1.0, -1.0,
]);
var vertexDataBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

var positionHandle = getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionHandle);
gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 2 * 4, 0);

var timeHandle   = getUniformLocation(program, 'time');
var widthHandle  = getUniformLocation(program, 'width');
var heightHandle = getUniformLocation(program, 'height');
gl.uniform1f(widthHandle,  canvas.width);
gl.uniform1f(heightHandle, canvas.height);

var lastFrame = Date.now();
function draw() {
  if (!pageVisible) {
    requestAnimationFrame(draw);
    return;
  }
  var thisFrame = Date.now();
  time += (thisFrame - lastFrame) / 1000;
  lastFrame = thisFrame;
  gl.uniform1f(timeHandle, time);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(draw);
}
draw();

// ================================================================
// PARTICLE SYSTEM — Canvas 2D (Meteors, Cosmic Stars, Petals & Sparkles)
// ================================================================
(function () {
  var pc = document.getElementById('particles-canvas');
  if (!pc) return;
  var ctx = pc.getContext('2d');

  pc.width  = Math.min(window.innerWidth, deviceLowEnd ? 600 : 1200);
  pc.height = Math.min(window.innerHeight, deviceLowEnd ? 600 : 1200);

  var particleResizeFrame = 0;
  window.addEventListener('resize', function () {
    if (particleResizeFrame) return;
    particleResizeFrame = requestAnimationFrame(function () {
      particleResizeFrame = 0;
      pc.width = Math.min(window.innerWidth, deviceLowEnd ? 600 : 1200);
      pc.height = Math.min(window.innerHeight, deviceLowEnd ? 600 : 1200);
    });
  });

  /* ---- Cosmic Cream & Space Star Color Palettes ---- */
  var starColors    = ['#ffffff', '#fff9e6', '#ffe39f', '#fce8cc', '#f5d4a4'];
  var meteorColors  = ['#ffffff', '#ffe7b3', '#ffd59e', '#faecc9'];
  var flowerColors  = ['#f8c9c9', '#fad2d2', '#ffe6cc', '#ffd6ba', '#fceddb'];
  var dustColors    = ['#ffe39f', '#fce8cc', '#fffbf0', '#ebd0b0'];

  /* ---- Particle pools ---- */
  var stars     = [];
  var fallingStars = [];
  var meteors   = [];
  var petals    = [];
  var dusts     = [];

  // Inisialisasi bintang-bintang luar angkasa berkelip (Cosmic Milky Way)
  var isMobileScreen = window.innerWidth < 658;
  var starCount = deviceLowEnd ? 8 : (isMobileScreen ? 15 : 50);
  for (var s = 0; s < starCount; s++) {
    stars.push({
      x: Math.random() * pc.width,
      y: Math.random() * pc.height,
      r: 0.8 + Math.random() * 2.2,
      alpha: 0.2 + Math.random() * 0.8,
      speed: 0.015 + Math.random() * 0.035,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      pulse: Math.random() * Math.PI * 2,
      hasRays: Math.random() > 0.7
    });
  }

  /* ---- Spawn Falling Star (small, frequent streaks) ---- */
  function spawnFallingStar() {
    var angle = Math.PI / 3 + Math.random() * 0.22;
    var speed = 3.5 + Math.random() * 4.5;

    fallingStars.push({
      x: Math.random() * pc.width,
      y: -15 - Math.random() * 80,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 18 + Math.random() * 38,
      alpha: 0.45 + Math.random() * 0.5,
      life: 0,
      maxLife: 55 + Math.random() * 45,
      color: starColors[Math.floor(Math.random() * starColors.length)]
    });
  }

  /* ---- Spawn Meteor (layered hot core and tapered trail) ---- */
  function spawnMeteor() {
    var angle  = Math.PI / 5 + Math.random() * 0.22;
    var speed  = 9 + Math.random() * 9;
    var startsFromSide = Math.random() > 0.72;
    var startX = startsFromSide ? -80 - Math.random() * 120 : Math.random() * pc.width;
    var startY = startsFromSide ? Math.random() * (pc.height * 0.45) : -40 - Math.random() * 120;

    meteors.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 90 + Math.random() * 150,
      color: meteorColors[Math.floor(Math.random() * meteorColors.length)],
      alpha: 1.0,
      decay: 0.009 + Math.random() * 0.012,
      thick: 1.4 + Math.random() * 2.2,
      life: 0,
      maxLife: 90 + Math.random() * 80
    });
  }

  /* ---- Spawn Floating Flower Petal (Bunga luar angkasa melayang santai) ---- */
  function spawnPetal() {
    var sz = 8 + Math.random() * 14;
    petals.push({
      x: Math.random() * pc.width,
      y: -20,
      sz: sz,
      vx: -0.6 + Math.random() * 1.2,
      vy: 0.8 + Math.random() * 1.5,
      rot: Math.random() * Math.PI * 2,
      rotV: -0.02 + Math.random() * 0.04,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.03 + Math.random() * 0.03,
      alpha: 0.3 + Math.random() * 0.6,
      color: flowerColors[Math.floor(Math.random() * flowerColors.length)]
    });
  }

  /* ---- Spawn Cosmic Glowing Dust Particle ---- */
  function spawnDust() {
    dusts.push({
      x: Math.random() * pc.width,
      y: pc.height + 10,
      sz: 1.5 + Math.random() * 3.5,
      vx: -0.5 + Math.random() * 1.0,
      vy: -(0.5 + Math.random() * 1.2),
      alpha: 0.0,
      maxA: 0.4 + Math.random() * 0.5,
      life: 0,
      maxLife: 100 + Math.random() * 140,
      color: dustColors[Math.floor(Math.random() * dustColors.length)]
    });
  }

  // Draw 5-pointed Star with Soft Glow
  function drawStarSpark(ctx, cx, cy, spikes, outerRadius, innerRadius, color, alpha) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (var i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = outerRadius * 3;
    ctx.fill();
    ctx.restore();
  }

  // Draw Realistic Petal
  function drawPetal(ctx, x, y, size, rot, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 0.8, -size * 0.4, size * 0.8, size * 0.6, 0, size);
    ctx.bezierCurveTo(-size * 0.8, size * 0.6, -size * 0.8, -size * 0.4, 0, -size);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }

  var meteorTimer = 0, meteorInterval = deviceLowEnd ? 300 : (isMobileScreen ? 120 : 85); // Meteor melintas berkala
  var fallingStarTimer = 0, fallingStarInterval = deviceLowEnd ? 80 : (isMobileScreen ? 40 : 24);
  var petalTimer  = 0, petalInterval  = deviceLowEnd ? 80 : (isMobileScreen ? 40 : 22);
  var dustTimer   = 0, dustInterval   = deviceLowEnd ? 60 : (isMobileScreen ? 30 : 16);

  /* ---- Main Render Loop ---- */
  function tick() {
    if (!pageVisible) {
      requestAnimationFrame(tick);
      return;
    }
    ctx.clearRect(0, 0, pc.width, pc.height);

    meteorTimer++;
    fallingStarTimer++;
    petalTimer++;
    dustTimer++;

    if (meteorTimer >= meteorInterval) {
      spawnMeteor();
      // Kadang meteor muncul ganda (meteor shower)
      if (Math.random() > 0.5) {
        setTimeout(spawnMeteor, 180);
      }
      meteorInterval = 60 + Math.floor(Math.random() * 90);
      meteorTimer = 0;
    }
    if (fallingStarTimer >= fallingStarInterval) {
      spawnFallingStar();
      fallingStarInterval = 16 + Math.floor(Math.random() * 30);
      fallingStarTimer = 0;
    }

    if (petalTimer >= petalInterval) { spawnPetal(); petalTimer = 0; }
    if (dustTimer >= dustInterval)   { spawnDust();  dustTimer = 0; }

    /* ---- 1. Draw Twinkling Stars ---- */
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.pulse += s.speed;
      var curAlpha = 0.25 + ((Math.sin(s.pulse) + 1) / 2) * (s.alpha - 0.25);

      if (s.hasRays) {
        drawStarSpark(ctx, s.x, s.y, 4, s.r * 2.8, s.r * 0.8, s.color, curAlpha);
      } else {
        ctx.save();
        ctx.globalAlpha = curAlpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = s.r * 4;
        ctx.fill();
        ctx.restore();
      }
    }

    /* ---- 2. Draw Falling Stars ---- */
    for (var f = fallingStars.length - 1; f >= 0; f--) {
      var fs = fallingStars[f];
      fs.x += fs.vx;
      fs.y += fs.vy;
      fs.life++;

      if (fs.life >= fs.maxLife || fs.y > pc.height + 30 || fs.x > pc.width + 30) {
        fallingStars.splice(f, 1);
        continue;
      }

      var starFade = Math.min(1, fs.life / 10, (fs.maxLife - fs.life) / 16);
      var starTailX = fs.x - fs.vx * (fs.len / 6);
      var starTailY = fs.y - fs.vy * (fs.len / 6);
      var starGradient = ctx.createLinearGradient(fs.x, fs.y, starTailX, starTailY);
      starGradient.addColorStop(0, fs.color);
      starGradient.addColorStop(1, 'transparent');

      ctx.save();
      ctx.globalAlpha = starFade * fs.alpha;
      ctx.strokeStyle = starGradient;
      ctx.lineWidth = 1.1;
      ctx.lineCap = 'round';
      ctx.shadowColor = fs.color;
      ctx.shadowBlur = 7;
      ctx.beginPath();
      ctx.moveTo(fs.x, fs.y);
      ctx.lineTo(starTailX, starTailY);
      ctx.stroke();
      ctx.restore();
    }

    /* ---- 3. Draw Meteors (Shooting Stars) ---- */
    for (var m = meteors.length - 1; m >= 0; m--) {
      var mt = meteors[m];
      mt.x += mt.vx;
      mt.y += mt.vy;
      mt.alpha -= mt.decay;
      mt.life++;

      if (mt.alpha <= 0 || mt.life >= mt.maxLife || mt.y > pc.height + 100 || mt.x > pc.width + 100) {
        meteors.splice(m, 1);
        continue;
      }

      var trailX = mt.x - (mt.vx / 10) * mt.len;
      var trailY = mt.y - (mt.vy / 10) * mt.len;
      ctx.save();
      var grad = ctx.createLinearGradient(
        mt.x, mt.y,
        trailX,
        trailY
      );
      grad.addColorStop(0, mt.color);
      grad.addColorStop(0.12, 'rgba(255, 246, 215, ' + (mt.alpha * 0.95) + ')');
      grad.addColorStop(0.42, 'rgba(229, 167, 81, ' + (mt.alpha * 0.5) + ')');
      grad.addColorStop(1, 'transparent');

      ctx.globalAlpha = mt.alpha;
      ctx.strokeStyle = grad;
      ctx.lineWidth = mt.thick * 2.2;
      ctx.lineCap = 'round';
      ctx.shadowColor = mt.color;
      ctx.shadowBlur = 18;

      ctx.beginPath();
      ctx.moveTo(mt.x, mt.y);
      ctx.lineTo(trailX, trailY);
      ctx.stroke();

      // Narrow hot core inside the softer atmospheric trail.
      ctx.globalAlpha = mt.alpha * 0.95;
      ctx.strokeStyle = '#fffdf3';
      ctx.lineWidth = mt.thick * 0.65;
      ctx.shadowBlur = 7;
      ctx.beginPath();
      ctx.moveTo(mt.x, mt.y);
      ctx.lineTo(mt.x - (mt.vx / 10) * mt.len * 0.28, mt.y - (mt.vy / 10) * mt.len * 0.28);
      ctx.stroke();

      // Kepala Meteor Bercahaya Terang
      ctx.globalAlpha = mt.alpha;
      ctx.beginPath();
      ctx.arc(mt.x, mt.y, mt.thick * 1.7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();
    }

    /* ---- 4. Draw Floating Petals ---- */
    for (var p = petals.length - 1; p >= 0; p--) {
      var pt = petals[p];
      pt.wobble += pt.wobbleSpeed;
      pt.x += pt.vx + Math.sin(pt.wobble) * 0.8;
      pt.y += pt.vy;
      pt.rot += pt.rotV;

      if (pt.y > pc.height + 30) {
        petals.splice(p, 1);
        continue;
      }

      drawPetal(ctx, pt.x, pt.y, pt.sz, pt.rot, pt.color, pt.alpha);
    }

    /* ---- 5. Draw Cosmic Glowing Dust ---- */
    for (var d = dusts.length - 1; d >= 0; d--) {
      var dt = dusts[d];
      dt.life++;
      dt.x += dt.vx;
      dt.y += dt.vy;

      var progress = dt.life / dt.maxLife;
      dt.alpha = progress < 0.3
        ? (progress / 0.3) * dt.maxA
        : (1 - (progress - 0.3) / 0.7) * dt.maxA;

      if (dt.life >= dt.maxLife || dt.y < -20) {
        dusts.splice(d, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = dt.alpha;
      ctx.beginPath();
      ctx.arc(dt.x, dt.y, dt.sz, 0, Math.PI * 2);
      ctx.fillStyle = dt.color;
      ctx.shadowColor = dt.color;
      ctx.shadowBlur = dt.sz * 4;
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(tick);
  }
  tick();
})();

// ================================================================
// CSS SPARKLE LAYER — scattered star sparks
// ================================================================
(function () {
  var layer = document.getElementById('sparkle-layer');
  if (!layer) return;

  var colors = [
    '#d4a55a', '#f0c878', '#c9956c', '#fff8f0',
    '#9e6b47', '#e8d0b0', '#d6aa80', '#f5e6d3'
  ];

  var count = window.innerWidth < 658 ? 18 : 32;

  for (var i = 0; i < count; i++) {
    var el    = document.createElement('div');
    var sz    = 4 + Math.random() * 12;
    var dur   = 1.8 + Math.random() * 2.8;
    var delay = Math.random() * 5;
    var x     = Math.random() * 100;
    var y     = Math.random() * 100;
    var color = colors[Math.floor(Math.random() * colors.length)];

    el.className = 'sparkle';
    el.style.setProperty('--sz',    sz + 'px');
    el.style.setProperty('--dur',   dur + 's');
    el.style.setProperty('--delay', delay + 's');
    el.style.setProperty('--color', color);
    el.style.left = x + '%';
    el.style.top  = y + '%';

    layer.appendChild(el);
  }
})();

// ================================================================
// CUTE STAMP — top right corner
// ================================================================
(function () {
  var stamp = document.getElementById('cute-stamp');
  if (!stamp) return;
  // reveal after intro
  setTimeout(function () {
    stamp.style.opacity = '1';
    stamp.style.transition = 'opacity 1s ease';
  }, 2000);
})();

// ================================================================
// GREETING OVERLAY — clean & readable watermark text
// ================================================================
(function () {
  var overlay = document.getElementById('greeting-overlay');
  if (!overlay) return;
  var lines = ["Happy Birthday", "Dini Nuranisa"];
  lines.forEach(function (text, idx) {
    var div = document.createElement('div');
    div.className = 'greeting-line';
    div.textContent = text;
    div.style.animationDelay = (idx * 0.8) + 's';
    overlay.appendChild(div);
  });
})();

// ================================================================
// INTERACTIVE SPARKLE ON CLICK / TAP
// ================================================================
(function () {
  var colors = ['#d4a55a','#f0c878','#c9956c','#fff8f0','#9e6b47','#e8d0b0'];
  var emojis = ['✨','🌸','⭐','🌺','💫'];

  document.addEventListener('click', burst);
  document.addEventListener('touchstart', function (e) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      burst({ clientX: e.changedTouches[i].clientX, clientY: e.changedTouches[i].clientY });
    }
  });

  function burst(e) {
    var count = 6 + Math.floor(Math.random() * 5);

    // emoji burst
    var emoji = emojis[Math.floor(Math.random() * emojis.length)];
    spawnBurstEmoji(e.clientX, e.clientY, emoji);

    // mini particle burst
    for (var i = 0; i < count; i++) {
      spawnBurstParticle(e.clientX, e.clientY,
        colors[Math.floor(Math.random() * colors.length)]);
    }
  }

  function spawnBurstEmoji(x, y, emoji) {
    var el = document.createElement('div');
    el.textContent = emoji;
    el.style.cssText = [
      'position:fixed', 'z-index:300', 'pointer-events:none',
      'left:' + x + 'px', 'top:' + y + 'px',
      'font-size:' + (20 + Math.random() * 16) + 'px',
      'transform:translate(-50%,-50%)',
      'transition:transform 0.8s cubic-bezier(0.34,1.56,0.64,1), opacity 0.8s ease',
      'will-change:transform,opacity',
    ].join(';');
    document.body.appendChild(el);

    requestAnimationFrame(function () {
      var dy = -(60 + Math.random() * 60);
      var dx = -30 + Math.random() * 60;
      el.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(1.4)';
      el.style.opacity = '0';
    });

    setTimeout(function () { el.remove(); }, 900);
  }

  function spawnBurstParticle(cx, cy, color) {
    var el    = document.createElement('div');
    var sz    = 4 + Math.random() * 7;
    var angle = Math.random() * Math.PI * 2;
    var dist  = 30 + Math.random() * 70;
    var dx    = Math.cos(angle) * dist;
    var dy    = Math.sin(angle) * dist;

    el.style.cssText = [
      'position:fixed', 'z-index:300', 'pointer-events:none',
      'border-radius:50%',
      'width:' + sz + 'px', 'height:' + sz + 'px',
      'background:' + color,
      'box-shadow:0 0 ' + sz + 'px ' + color,
      'left:' + cx + 'px', 'top:' + cy + 'px',
      'transform:translate(-50%,-50%)',
      'transition:transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.7s ease',
      'will-change:transform,opacity',
    ].join(';');
    document.body.appendChild(el);

    requestAnimationFrame(function () {
      el.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(0)';
      el.style.opacity = '0';
    });

    setTimeout(function () { el.remove(); }, 800);
  }
})();

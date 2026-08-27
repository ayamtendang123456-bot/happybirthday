// ================================================================
// CONFIGURATION — Happy Birthday Dini Nuranisa
// ================================================================
var radius        = 240;   // Carousel radius (px)
var autoRotate    = true;
var rotateSpeed   = -60;   // Seconds for one full rotation
var imgWidth      = 120;
var imgHeight     = 170;
var bgMusicURL    = null;
var bgMusicControls = false;
var photoRevealDelay = 1300;
var removeIntroDelay = 5600;

// ================================================================
// CAROUSEL SETUP
// ================================================================
var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg  = ospin.getElementsByTagName('img');
var aVid  = ospin.getElementsByTagName('video');
var aEle  = [...aImg, ...aVid];

ospin.style.width  = imgWidth  + "px";
ospin.style.height = imgHeight + "px";

var ground = document.getElementById('ground');
ground.style.width  = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

init(0.02);
createFlowerIntro();

setTimeout(function () {
  document.body.classList.remove('intro-playing');
}, photoRevealDelay);

setTimeout(function () {
  var intro = document.getElementById('flower-intro');
  if (intro) intro.remove();
}, removeIntroDelay);

// ----------------------------------------------------------------
// Flower curtain intro
// ----------------------------------------------------------------
function createFlowerIntro() {
  var intro = document.getElementById('flower-intro');
  if (!intro) return;
  var curtains = intro.getElementsByClassName('flower-curtain');
  if (!curtains.length) return;

  for (var c = 0; c < curtains.length; c++) {
    var cols = window.innerWidth < 658 ? 3 : 4;
    var rows = 5;

    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var flower    = document.createElement('img');
        var size      = window.innerWidth < 658 ? 140 + Math.random() * 70 : 200 + Math.random() * 110;
        var delay     = 0.10 + Math.random() * 0.70;
        var duration  = 4.0  + Math.random() * 0.80;
        var drift     = -40  + Math.random() * 80;
        var lift      = -26  + Math.random() * 52;
        var rotation  = -40  + Math.random() * 80;
        var x         = ((col + 0.5) / cols) * 100 + (-12 + Math.random() * 24);
        var y         = ((row + 0.5) / rows) * 100 + (-10 + Math.random() * 20);

        flower.src = './images/bunga4.gif';
        flower.alt = '';
        flower.className = 'intro-flower';
        flower.style.setProperty('--x',         x + '%');
        flower.style.setProperty('--y',         y + '%');
        flower.style.setProperty('--size',      size + 'px');
        flower.style.setProperty('--delay',     delay + 's');
        flower.style.setProperty('--dur',       duration + 's');
        flower.style.setProperty('--drift',     drift + 'px');
        flower.style.setProperty('--drift-end', (drift * 1.3) + 'px');
        flower.style.setProperty('--lift',      lift + 'px');
        flower.style.setProperty('--lift-end',  (lift - 24) + 'px');
        flower.style.setProperty('--rot',       rotation + 'deg');
        curtains[c].appendChild(flower);
      }
    }
  }
}

// ----------------------------------------------------------------
// Carousel init / transform helpers
// ----------------------------------------------------------------
function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTranform(obj) {
  if (tY > 180) tY = 180;
  if (tY < 0)   tY = 0;
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = yes ? 'running' : 'paused';
}

var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10;

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

// Drag / pointer events
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX, sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX, nY = e.clientY;
    desX = nX - sX; desY = nY - sY;
    tX += desX * 0.1;  tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX; sY = nY;
  };

  this.onpointerup = function () {
    odrag.timer = setInterval(function () {
      desX *= 0.95; desY *= 0.95;
      tX += desX * 0.1; tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function (e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};

// ================================================================
// WEBGL HEART SHADER
// ================================================================
var canvas = document.getElementById("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

var gl = canvas.getContext('webgl', { alpha: true });
if (!gl) console.error("WebGL tidak tersedia.");

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
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform1f(widthHandle,  window.innerWidth);
  gl.uniform1f(heightHandle, window.innerHeight);
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
gl.uniform1f(widthHandle,  window.innerWidth);
gl.uniform1f(heightHandle, window.innerHeight);

var lastFrame = Date.now();
function draw() {
  var thisFrame = Date.now();
  time += (thisFrame - lastFrame) / 1000;
  lastFrame = thisFrame;
  gl.uniform1f(timeHandle, time);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(draw);
}
draw();

// ================================================================
// PARTICLE SYSTEM — Canvas 2D (hearts, sparkles, confetti)
// ================================================================
(function () {
  var pc = document.getElementById('particles-canvas');
  if (!pc) return;
  var ctx = pc.getContext('2d');

  pc.width  = window.innerWidth;
  pc.height = window.innerHeight;

  window.addEventListener('resize', function () {
    pc.width  = window.innerWidth;
    pc.height = window.innerHeight;
  });

  /* ---- Colour palettes — Cream & Brown ---- */
  var heartColors   = ['#d4a55a','#c9956c','#e8d0b0','#9e6b47','#f0c878','#d6aa80','#fff8f0'];
  var sparkColors   = ['#d4a55a','#f0c878','#fff8f0','#c9956c','#e8d0b0'];
  var confettiColors= ['#d4a55a','#c9956c','#9e6b47','#e8d0b0','#f0c878','#fff8f0','#d6aa80','#f5e6d3'];

  /* ---- Particle pools ---- */
  var hearts    = [];
  var sparks    = [];
  var confettis = [];
  var ribbons   = [];

  /* ---- Heart path helper ---- */
  function heartPath(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 10, size / 10);
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.bezierCurveTo( 5, -9,  11, -3,  0,  5);
    ctx.bezierCurveTo(-11, -3, -5, -9,  0, -3);
    ctx.closePath();
    ctx.restore();
  }

  /* ---- Spawn helpers ---- */
  function spawnHeart() {
    var sz = 10 + Math.random() * 20;
    hearts.push({
      x:     Math.random() * pc.width,
      y:     pc.height + sz,
      sz:    sz,
      vx:   -1.2 + Math.random() * 2.4,
      vy:   -(1.2 + Math.random() * 2.2),
      alpha: 0.0,
      maxA:  0.5 + Math.random() * 0.5,
      fadeIn: true,
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      rot:   Math.random() * Math.PI * 2,
      rotV:  (-0.015 + Math.random() * 0.03),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.025 + Math.random() * 0.02,
    });
  }

  function spawnSpark() {
    sparks.push({
      x:     Math.random() * pc.width,
      y:     Math.random() * pc.height,
      sz:    2 + Math.random() * 5,
      alpha: 0.0,
      maxA:  0.6 + Math.random() * 0.4,
      life:  0,
      maxLife: 60 + Math.random() * 80,
      color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
    });
  }

  function spawnConfetti() {
    var isRibbon = Math.random() > 0.55;
    var w = isRibbon ? (2 + Math.random() * 4) : (5 + Math.random() * 9);
    var h = isRibbon ? (10 + Math.random() * 16) : (5 + Math.random() * 9);
    confettis.push({
      x:     Math.random() * pc.width,
      y:    -h,
      w:     w,
      h:     h,
      vx:   -1.4 + Math.random() * 2.8,
      vy:    1.5 + Math.random() * 2.5,
      rot:   Math.random() * Math.PI * 2,
      rotV: (-0.06 + Math.random() * 0.12),
      wobble: 0,
      wobbleSpeed: 0.04 + Math.random() * 0.03,
      alpha: 0.9 + Math.random() * 0.1,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      isRibbon,
    });
  }

  /* ---- Spawn timer ---- */
  var heartTimer    = 0, heartInterval    = 28;
  var sparkTimer    = 0, sparkInterval    = 12;
  var confettiTimer = 0, confettiInterval = 35;

  /* ---- Main loop ---- */
  function tick() {
    ctx.clearRect(0, 0, pc.width, pc.height);

    heartTimer++;
    sparkTimer++;
    confettiTimer++;

    if (heartTimer >= heartInterval)    { spawnHeart();    heartTimer = 0; }
    if (sparkTimer >= sparkInterval)    { spawnSpark();    sparkTimer = 0; }
    if (confettiTimer >= confettiInterval){ spawnConfetti(); confettiTimer = 0; }

    /* ---- Draw hearts ---- */
    for (var i = hearts.length - 1; i >= 0; i--) {
      var h = hearts[i];
      h.wobble += h.wobbleSpeed;
      h.x  += h.vx + Math.sin(h.wobble) * 0.6;
      h.y  += h.vy;
      h.rot += h.rotV;
      h.vy -= 0.008; // gentle upward drift

      if (h.fadeIn) {
        h.alpha += 0.03;
        if (h.alpha >= h.maxA) { h.alpha = h.maxA; h.fadeIn = false; }
      } else {
        if (h.y < -h.sz * 2) { h.alpha -= 0.02; }
      }

      if (h.alpha <= 0) { hearts.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = h.alpha;

      // soft glow behind heart
      var grd = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.sz * 2.8);
      grd.addColorStop(0, h.color);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      heartPath(ctx, h.x, h.y, h.sz * 2.8);
      ctx.fill();

      // solid heart
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rot);
      heartPath(ctx, 0, 0, h.sz);
      ctx.fillStyle = h.color;
      ctx.fill();

      ctx.restore();
    }

    /* ---- Draw sparkles ---- */
    for (var i = sparks.length - 1; i >= 0; i--) {
      var s = sparks[i];
      s.life++;
      var progress = s.life / s.maxLife;
      s.alpha = progress < 0.3
        ? (progress / 0.3) * s.maxA
        : (1 - (progress - 0.3) / 0.7) * s.maxA;

      if (s.life >= s.maxLife) { sparks.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = s.alpha;

      // cross sparkle shape
      var arms = 4;
      var innerR = s.sz * 0.35;
      var outerR = s.sz;
      ctx.translate(s.x, s.y);
      ctx.rotate(Math.PI * progress * 2);
      ctx.beginPath();
      for (var a = 0; a < arms * 2; a++) {
        var r = a % 2 === 0 ? outerR : innerR;
        var angle = (a / (arms * 2)) * Math.PI * 2;
        if (a === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else         ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur  = s.sz * 2;
      ctx.fill();
      ctx.restore();
    }

    /* ---- Draw confetti ---- */
    for (var i = confettis.length - 1; i >= 0; i--) {
      var c = confettis[i];
      c.wobble += c.wobbleSpeed;
      c.x  += c.vx + Math.sin(c.wobble) * 1.2;
      c.y  += c.vy;
      c.rot += c.rotV;

      if (c.y > pc.height + 30) { confettis.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = c.alpha;
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.fillStyle = c.color;

      if (c.isRibbon) {
        // wavy ribbon
        ctx.beginPath();
        ctx.ellipse(0, 0, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      }
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
// FLOATING EMOJI HEARTS (DOM)
// ================================================================
(function () {
  var emojis = ['🌸','💕','✨','💖','🌷','💗','🌺','💝','⭐','🌟','💫','🎀'];
  var count  = window.innerWidth < 658 ? 10 : 18;

  for (var i = 0; i < count; i++) {
    var el    = document.createElement('div');
    var emoji = emojis[Math.floor(Math.random() * emojis.length)];
    var sz    = 14 + Math.random() * 22;
    var dur   = 6  + Math.random() * 8;
    var delay = Math.random() * 10;
    var x     = 3  + Math.random() * 94;
    var drift = -40 + Math.random() * 80;
    var rot   = -18 + Math.random() * 36;

    el.className = 'float-heart';
    el.textContent = emoji;
    el.style.setProperty('--sz',    sz + 'px');
    el.style.setProperty('--dur',   dur + 's');
    el.style.setProperty('--delay', delay + 's');
    el.style.setProperty('--x',     x + '%');
    el.style.setProperty('--drift', drift + 'px');
    el.style.setProperty('--rot',   rot + 'deg');
    document.body.appendChild(el);
  }
})();

// ================================================================
// BOUNCING CUTE CHARACTERS (bottom of screen)
// ================================================================
(function () {
  var chars  = ['🌸','💕','⭐','🌺','💖','🌷','✨','🎀','💗','🌟'];
  var count  = window.innerWidth < 658 ? 6 : 10;

  for (var i = 0; i < count; i++) {
    var el    = document.createElement('div');
    var emoji = chars[Math.floor(Math.random() * chars.length)];
    var sz    = 18 + Math.random() * 24;
    var dur   = 2.0 + Math.random() * 1.5;
    var delay = Math.random() * 4;
    var x     = 3  + Math.random() * 94;
    var b     = 8  + Math.random() * 20;
    var rot   = -20 + Math.random() * 40;

    el.className = 'bounce-char';
    el.textContent = emoji;
    el.style.setProperty('--sz',    sz + 'px');
    el.style.setProperty('--dur',   dur + 's');
    el.style.setProperty('--delay', delay + 's');
    el.style.setProperty('--x',     x + '%');
    el.style.setProperty('--b',     b + 'vh');
    el.style.setProperty('--rot',   rot + 'deg');
    el.style.fontSize = sz + 'px';
    document.body.appendChild(el);
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
// GREETING OVERLAY — subtle watermark text
// ================================================================
(function () {
  var overlay = document.getElementById('greeting-overlay');
  if (!overlay) return;
  var lines = ["Happy Birthday", "Dini Nuranisa", "🌸💕✨"];
  lines.forEach(function (text, idx) {
    var div = document.createElement('div');
    div.className = 'greeting-line';
    div.textContent = text;
    div.style.animationDelay = (idx * 0.8) + 's';
    div.style.fontSize = idx === 2 ? 'clamp(2rem, 6vw, 5rem)' : undefined;
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

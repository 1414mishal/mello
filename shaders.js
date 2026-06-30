/* Shared behavior + shaders for summit studios subpages.
   Home (index.html) keeps its own inline scripts (plus the three.js hero). */

/* ---------- Icons ---------- */
if (window.lucide) lucide.createIcons();

/* ---------- Sticky header colour state ---------- */
(function () {
  var header = document.getElementById('site-header');
  if (!header) return;
  function onScroll() {
    if (window.scrollY > 16) {
      header.classList.add('scrolled', 'border-b', 'border-white/10', 'bg-black/80', 'backdrop-blur-md');
    } else {
      header.classList.remove('scrolled', 'border-b', 'border-white/10', 'bg-black/80', 'backdrop-blur-md');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ---------- Mobile menu ---------- */
(function () {
  var btn = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  var menuIcon = btn.querySelector('.menu-icon');
  var closeIcon = btn.querySelector('.close-icon');
  var open = false;
  function setOpen(v) {
    open = v;
    btn.setAttribute('aria-expanded', String(v));
    btn.setAttribute('aria-label', v ? 'Close menu' : 'Open menu');
    document.body.style.overflow = v ? 'hidden' : '';
    if (menuIcon) menuIcon.classList.toggle('hidden', v);
    if (closeIcon) closeIcon.classList.toggle('hidden', !v);
    if (v) {
      menu.classList.remove('pointer-events-none', '-translate-y-2', 'opacity-0');
      menu.classList.add('translate-y-0', 'opacity-100');
    } else {
      menu.classList.add('pointer-events-none', '-translate-y-2', 'opacity-0');
      menu.classList.remove('translate-y-0', 'opacity-100');
    }
  }
  btn.addEventListener('click', function () { setOpen(!open); });
  document.querySelectorAll('.mobile-link').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
})();

/* ---------- Perf caps ---------- */
var IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
var DPR_CAP = Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1.5 : 2);

/* ---------- FOOTER: flow-field particles (Canvas 2D) ---------- */
(function () {
  var canvas = document.getElementById('footer-flow');
  var container = document.getElementById('site-footer');
  if (!canvas || !container) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var color = '#4a6fa5', trailOpacity = 0.08, speed = 0.6;
  var particleCount = IS_MOBILE ? 400 : 800;
  var width = container.clientWidth, height = container.clientHeight;
  var particles = [], mouse = { x: -1000, y: -1000 };

  container.addEventListener('mousemove', function (e) {
    var rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  container.addEventListener('mouseleave', function () { mouse.x = -1000; mouse.y = -1000; });

  function Particle() { this.reset(); }
  Particle.prototype.reset = function () {
    this.x = Math.random() * width; this.y = Math.random() * height;
    this.vx = 0; this.vy = 0; this.age = 0; this.life = Math.random() * 200 + 100;
  };
  Particle.prototype.update = function () {
    var angle = (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI;
    this.vx += Math.cos(angle) * 0.2 * speed;
    this.vy += Math.sin(angle) * 0.2 * speed;
    var dx = mouse.x - this.x, dy = mouse.y - this.y;
    var dist = Math.sqrt(dx * dx + dy * dy), r = 150;
    if (dist < r) { var f = (r - dist) / r; this.vx -= dx * f * 0.05; this.vy -= dy * f * 0.05; }
    this.x += this.vx; this.y += this.vy; this.vx *= 0.95; this.vy *= 0.95;
    this.age++; if (this.age > this.life) this.reset();
    if (this.x < 0) this.x = width; if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height; if (this.y > height) this.y = 0;
  };
  Particle.prototype.draw = function () {
    ctx.fillStyle = color;
    ctx.globalAlpha = 1 - Math.abs((this.age / this.life) - 0.5) * 2;
    ctx.fillRect(this.x, this.y, 1.5, 1.5);
  };
  function init() {
    width = container.clientWidth; height = container.clientHeight;
    canvas.width = width * DPR_CAP; canvas.height = height * DPR_CAP;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(DPR_CAP, DPR_CAP);
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    particles = []; for (var i = 0; i < particleCount; i++) particles.push(new Particle());
  }
  function animate() {
    ctx.fillStyle = 'rgba(0,0,0,' + trailOpacity + ')';
    ctx.fillRect(0, 0, width, height);
    for (var i = 0; i < particles.length; i++) { particles[i].update(); particles[i].draw(); }
    requestAnimationFrame(animate);
  }
  window.addEventListener('resize', init);
  // Re-fit once the page has fully laid out (images/fonts can change footer height)
  window.addEventListener('load', init);
  init(); animate();
})();

/* ---------- PAGE-WIDE IRIDESCENCE: one continuous motion behind all sections ---------- */
/* Fixed full-viewport canvas, cosine-palette flow shader recolored blue/black/white.    */
(function () {
  var canvas = document.getElementById('page-shader');
  if (!canvas) return;
  var gl = canvas.getContext('webgl');
  if (!gl) return;

  var uColor = [0.25, 0.42, 0.82], uAmplitude = 0.12, uSpeed = 0.55;
  var mousePos = { x: 0.5, y: 0.5 };

  var vsrc = 'attribute vec2 aPosition; varying vec2 vUv; void main(){ vUv = aPosition * 0.5 + 0.5; gl_Position = vec4(aPosition,0.0,1.0); }';
  var fsrc = [
    'precision highp float;',
    'uniform float uTime; uniform vec3 uColor; uniform vec3 uResolution; uniform vec2 uMouse;',
    'uniform float uAmplitude; uniform float uSpeed;',
    'varying vec2 vUv;',
    'void main(){',
    '  float mr = min(uResolution.x, uResolution.y);',
    '  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;',
    '  uv += (uMouse - vec2(0.5)) * uAmplitude;',
    '  float d = -uTime * 0.5 * uSpeed;',
    '  float a = 0.0;',
    '  for (float i = 0.0; i < 8.0; ++i) {',
    '    a += cos(i - d - a * uv.x);',
    '    d += sin(uv.y * i + a);',
    '  }',
    '  d += uTime * 0.5 * uSpeed;',
    '  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);',
    '  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function compile(src, type) {
    var sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(sh)); return null; }
    return sh;
  }
  var vs = compile(vsrc, gl.VERTEX_SHADER), fs = compile(fsrc, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return;
  var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return; }
  gl.useProgram(prog);

  var verts = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog, 'aPosition'); gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, 'uResolution'), uTime = gl.getUniformLocation(prog, 'uTime'), uMouse = gl.getUniformLocation(prog, 'uMouse');
  var uCol = gl.getUniformLocation(prog, 'uColor'), uAmp = gl.getUniformLocation(prog, 'uAmplitude'), uSpd = gl.getUniformLocation(prog, 'uSpeed');

  var start = performance.now();
  window.addEventListener('mousemove', function (e) {
    mousePos = { x: e.clientX / window.innerWidth, y: 1.0 - e.clientY / window.innerHeight };
  });
  function resize() {
    canvas.width = Math.floor(window.innerWidth * DPR_CAP);
    canvas.height = Math.floor(window.innerHeight * DPR_CAP);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.uniform3f(uRes, gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
  }
  window.addEventListener('resize', resize); resize();
  gl.uniform3f(uCol, uColor[0], uColor[1], uColor[2]);
  gl.uniform1f(uAmp, uAmplitude);
  gl.uniform1f(uSpd, uSpeed);
  (function loop() {
    if (!gl || gl.isContextLost()) return;
    gl.uniform1f(uTime, (performance.now() - start) / 1000.0);
    gl.uniform2f(uMouse, mousePos.x, mousePos.y);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(loop);
  })();
})();

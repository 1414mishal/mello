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

  var color = '#818cf8', trailOpacity = 0.1, speed = 0.8;
  var particleCount = IS_MOBILE ? 300 : 600;
  var width = container.clientWidth, height = container.clientHeight;
  var particles = [], mouse = { x: -1000, y: -1000 };

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

/* ---------- PAGE-WIDE AURORA: one continuous motion behind all sections ---------- */
/* Fixed full-viewport canvas, aurora shader recolored blue/black/white to match.    */
(function () {
  var canvas = document.getElementById('page-shader');
  if (!canvas) return;
  var gl = canvas.getContext('webgl');
  if (!gl) return;

  var flowSpeed = 0.4, colorIntensity = 0.7, noiseLayers = 4.0, mouseInfluence = 0.3;
  var mousePos = { x: 0.5, y: 0.5 };

  var vsrc = 'attribute vec2 aPosition; void main(){ gl_Position = vec4(aPosition,0.0,1.0); }';
  var fsrc = [
    'precision highp float;',
    'uniform vec2 iResolution; uniform float iTime; uniform vec2 iMouse;',
    'uniform float uFlowSpeed; uniform float uColorIntensity; uniform float uNoiseLayers; uniform float uMouseInfluence;',
    '#define MARCH_STEPS 32',
    'float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }',
    'float fbm(vec3 p){ float f=0.0; float amp=0.5; for(int i=0;i<8;i++){ if(float(i)>=uNoiseLayers) break; f+=amp*hash(p.xy); p*=2.0; amp*=0.5; } return f; }',
    'float map(vec3 p){ vec3 q=p; q.z+=iTime*uFlowSpeed; vec2 m=(iMouse.xy/iResolution.xy-0.5)*2.0; q.xy+=m*uMouseInfluence; float f=fbm(q*2.0); f*=sin(p.y*2.0+iTime)*0.5+0.5; return clamp(f,0.0,1.0); }',
    'void main(){',
    '  vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;',
    '  vec3 ro=vec3(0,-1,0); vec3 rd=normalize(vec3(uv,1.0));',
    '  vec3 col=vec3(0); float t=0.0;',
    '  for(int i=0;i<MARCH_STEPS;i++){',
    '    vec3 p=ro+rd*t; float d=map(p);',
    '    if(d>0.0){',
    '      float m=0.5+0.5*sin(iTime*0.4+p.y*2.0);',
    '      vec3 c=mix(vec3(0.03,0.09,0.26), vec3(0.22,0.34,0.62), m);',
    '      col+=c*d*0.08*uColorIntensity;',
    '    }',
    '    t+=0.1;',
    '  }',
    '  col=min(col,vec3(0.32,0.40,0.62));',
    '  gl_FragColor=vec4(col,1.0);',
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

  var uRes = gl.getUniformLocation(prog, 'iResolution'), uTime = gl.getUniformLocation(prog, 'iTime'), uMouse = gl.getUniformLocation(prog, 'iMouse');
  var uFlow = gl.getUniformLocation(prog, 'uFlowSpeed'), uCol = gl.getUniformLocation(prog, 'uColorIntensity'), uNoise = gl.getUniformLocation(prog, 'uNoiseLayers'), uMI = gl.getUniformLocation(prog, 'uMouseInfluence');

  var start = performance.now();
  window.addEventListener('mousemove', function (e) {
    mousePos = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
  });
  function resize() {
    canvas.width = Math.floor(window.innerWidth * DPR_CAP);
    canvas.height = Math.floor(window.innerHeight * DPR_CAP);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(uRes, gl.canvas.width, gl.canvas.height);
  }
  window.addEventListener('resize', resize); resize();
  (function loop() {
    if (!gl || gl.isContextLost()) return;
    gl.uniform1f(uTime, (performance.now() - start) / 1000.0);
    gl.uniform2f(uMouse, mousePos.x * canvas.width, (1.0 - mousePos.y) * canvas.height);
    gl.uniform1f(uFlow, flowSpeed); gl.uniform1f(uCol, colorIntensity); gl.uniform1f(uNoise, noiseLayers); gl.uniform1f(uMI, mouseInfluence);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(loop);
  })();
})();

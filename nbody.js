const canvas = document.getElementById('nbody');
const ctx = canvas.getContext('2d');

let W, H;
let particles = [];
const MAX_BODIES = 9;
const G = 600;
const SOFTENING = 15;
const DAMPING = 0.99;
const MAX_SPEED = 600;
const RADIUS = 18;

let isDark = false;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

class Body {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * 2 * Math.PI;
    const speed = 50 + Math.random() * 150;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.mass = 2 + Math.random() * 8;
    this.hue = Math.random() * 360;
  }
}

function spawnBody(x, y) {
  if (particles.length >= MAX_BODIES) return;
  particles.push(new Body(x, y));
}

function wrap(p) {
  if (p.x < 0) p.x += W;
  if (p.x > W) p.x -= W;
  if (p.y < 0) p.y += H;
  if (p.y > H) p.y -= H;
}

function computeForces() {
  const n = particles.length;
  for (let i = 0; i < n; i++) {
    let fx = 0, fy = 0;
    const pi = particles[i];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const pj = particles[j];
      let dx = pj.x - pi.x;
      let dy = pj.y - pi.y;
      if (dx > W / 2) dx -= W;
      else if (dx < -W / 2) dx += W;
      if (dy > H / 2) dy -= H;
      else if (dy < -H / 2) dy += H;
      const distSq = dx * dx + dy * dy + SOFTENING;
      const dist = Math.sqrt(distSq);
      if (dist < 5) continue;
      const force = (G * pi.mass * pj.mass) / distSq;
      fx += force * dx / dist;
      fy += force * dy / dist;
    }
    pi.ax = fx / pi.mass;
    pi.ay = fy / pi.mass;
  }
}

function integrate(dt) {
  for (const p of particles) {
    p.vx += p.ax * dt;
    p.vy += p.ay * dt;
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (speed > MAX_SPEED) {
      p.vx = (p.vx / speed) * MAX_SPEED;
      p.vy = (p.vy / speed) * MAX_SPEED;
    }
    p.vx *= DAMPING;
    p.vy *= DAMPING;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    wrap(p);
  }
}

function draw() {
  ctx.fillStyle = isDark ? '#1a1a1a' : '#ffffff';
  ctx.fillRect(0, 0, W, H);

  ctx.lineWidth = 2.5;
  for (const p of particles) {
    ctx.strokeStyle = isDark
      ? `hsla(${p.hue}, 80%, 75%, 0.85)`
      : `hsla(${p.hue}, 70%, 30%, 0.85)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2);
    ctx.stroke();
  }
}

let lastTime = 0;

function loop(time) {
  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;
  if (dt > 0 && particles.length > 1) {
    computeForces();
    integrate(dt);
  }
  draw();
  requestAnimationFrame(loop);
}

function detectTheme() {
  isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const mq = window.matchMedia('(prefers-color-scheme: dark)');
mq.addEventListener('change', detectTheme);

document.addEventListener('click', (e) => {
  if (e.target.closest('.project-box, .btn, a, img')) return;
  spawnBody(e.clientX, e.clientY);
});

resize();
detectTheme();
spawnBody(W / 3, H / 2);
spawnBody(2 * W / 3, H / 2);
requestAnimationFrame(loop);

window.addEventListener('resize', resize);

const canvas = document.getElementById('nbody');
const ctx = canvas.getContext('2d');

let W, H;
let particles = [];
const MAX_PARTICLES = 200;
const G = 180;
const SOFTENING = 25;
const DAMPING = 0.997;
const SPAWN_COUNT = 6;
const MAX_SPEED = 250;

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

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * 2 * Math.PI;
    const speed = 20 + Math.random() * 60;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.mass = 4 + Math.random() * 12;
    this.radius = Math.sqrt(this.mass) * 1.2;
    this.hue = Math.random() * 360;
  }
}

function spawnParticles(x, y, count) {
  for (let i = 0; i < count; i++) {
    if (particles.length >= MAX_PARTICLES) particles.shift();
    const angle = Math.random() * 2 * Math.PI;
    const dist = 3 + Math.random() * 12;
    particles.push(new Particle(
      x + Math.cos(angle) * dist,
      y + Math.sin(angle) * dist
    ));
  }
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

  for (const p of particles) {
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 5);
    if (isDark) {
      grad.addColorStop(0, `hsla(${p.hue}, 80%, 70%, 0.45)`);
      grad.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`);
    } else {
      grad.addColorStop(0, `hsla(${p.hue}, 60%, 35%, 0.25)`);
      grad.addColorStop(1, `hsla(${p.hue}, 60%, 35%, 0)`);
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isDark
      ? `hsla(${p.hue}, 80%, 85%, 0.9)`
      : `hsla(${p.hue}, 60%, 25%, 0.85)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

let lastTime = 0;

function loop(time) {
  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;
  if (dt > 0 && particles.length > 0) {
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
  spawnParticles(e.clientX, e.clientY, SPAWN_COUNT);
});

resize();
detectTheme();
spawnParticles(W / 2, H / 2, 18);
requestAnimationFrame(loop);

window.addEventListener('resize', resize);

const canvas = document.getElementById('nbody');
const ctx = canvas.getContext('2d');

let W, H;
let bodies = [];
const G = 2000000;
const SOFTENING = 5;
const MAX_SPEED = 400;
const MAX_IMPULSE = 20;
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
    const speed = 80 + Math.random() * 200;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.mass = 1 + Math.random() * 5;
  }
}

function spawnBody(x, y) {
  bodies.push(new Body(x, y));
}

function wrap(p) {
  if (p.x < 0) p.x += W;
  if (p.x > W) p.x -= W;
  if (p.y < 0) p.y += H;
  if (p.y > H) p.y -= H;
}

function handleCollisions() {
  const minDist = RADIUS * 2;
  const minDistSq = minDist * minDist;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i], b = bodies[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      if (dx > W / 2) dx -= W;
      else if (dx < -W / 2) dx += W;
      if (dy > H / 2) dy -= H;
      else if (dy < -H / 2) dy += H;
      const distSq = dx * dx + dy * dy;
      if (distSq < minDistSq && distSq > 0.01) {
        const dist = Math.sqrt(distSq);
        const nx = dx / dist, ny = dy / dist;
        const overlap = minDist - dist;
        a.x -= nx * overlap / 2;
        a.y -= ny * overlap / 2;
        b.x += nx * overlap / 2;
        b.y += ny * overlap / 2;
        const relVn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        if (relVn > 0) {
          const totalMass = a.mass + b.mass;
          const impulse = 2 * relVn / totalMass;
          a.vx -= impulse * b.mass * nx;
          a.vy -= impulse * b.mass * ny;
          b.vx += impulse * a.mass * nx;
          b.vy += impulse * a.mass * ny;
        }
      }
    }
  }
}

function computeAccelerations() {
  const n = bodies.length;
  for (let i = 0; i < n; i++) {
    let ax = 0, ay = 0;
    const bi = bodies[i];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const bj = bodies[j];
      let dx = bj.x - bi.x;
      let dy = bj.y - bi.y;
      if (dx > W / 2) dx -= W;
      else if (dx < -W / 2) dx += W;
      if (dy > H / 2) dy -= H;
      else if (dy < -H / 2) dy += H;
      const distSq = dx * dx + dy * dy + SOFTENING;
      const dist = Math.sqrt(distSq);
      const accel = (G * bj.mass) / distSq;
      ax += accel * dx / dist;
      ay += accel * dy / dist;
    }
    bi.ax = ax;
    bi.ay = ay;
  }
}

function draw() {
  ctx.fillStyle = isDark ? '#1a1a1a' : '#ffffff';
  ctx.fillRect(0, 0, W, H);

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = isDark ? '#ffffff' : '#000000';
  for (const b of bodies) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, RADIUS, 0, Math.PI * 2);
    ctx.stroke();
  }
}

const DT = 1 / 240;
let accumulator = 0;
let lastTime = 0;

function simStep(dt) {
  computeAccelerations();
  for (const b of bodies) {
    let dvx = b.ax * dt;
    let dvy = b.ay * dt;
    const impulse = Math.sqrt(dvx * dvx + dvy * dvy);
    if (impulse > MAX_IMPULSE) {
      dvx = (dvx / impulse) * MAX_IMPULSE;
      dvy = (dvy / impulse) * MAX_IMPULSE;
    }
    b.vx += dvx;
    b.vy += dvy;
    const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
    if (speed > MAX_SPEED) {
      b.vx = (b.vx / speed) * MAX_SPEED;
      b.vy = (b.vy / speed) * MAX_SPEED;
    }
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    wrap(b);
  }
  handleCollisions();
  for (const b of bodies) wrap(b);
}

function loop(time) {
  if (lastTime === 0) lastTime = time;
  const frameDt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;
  if (bodies.length > 0) {
    accumulator += frameDt;
    while (accumulator >= DT) {
      simStep(DT);
      accumulator -= DT;
    }
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
loop();

window.addEventListener('resize', resize);

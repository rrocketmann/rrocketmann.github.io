const canvas = document.getElementById('nbody');
const ctx = canvas.getContext('2d');

let W, H;
let bodies = [];
const G = 2000000;
const MIN_R = 60;
const RADIUS = 14;
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
    this.color = `rgb(${128 + Math.random() * 127}, ${128 + Math.random() * 127}, ${128 + Math.random() * 127})`;
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
      const dist = Math.max(MIN_R, Math.sqrt(dx * dx + dy * dy));
      const accel = (G * bj.mass) / (dist * dist * dist);
      ax += accel * dx;
      ay += accel * dy;
    }
    bi.ax = ax;
    bi.ay = ay;
  }
}

function draw() {
  ctx.fillStyle = isDark ? 'rgba(26,26,26,0.12)' : 'rgba(255,255,255,0.12)';
  ctx.fillRect(0, 0, W, H);

  for (const b of bodies) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.fill();
  }
}

const WARP_RADIUS = 280;
const WARP_LERP = 0.22;
let projectBoxes = [];

function layoutBoxes() {
  projectBoxes = Array.from(document.querySelectorAll('.project-box'));
  for (const box of projectBoxes) {
    box.style.transform = 'none';
    const r = box.getBoundingClientRect();
    box._cx = r.left + r.width / 2;
    box._cy = r.top + r.height / 2;
    box._w = r.width;
    box._h = r.height;
    box.style.transform = '';
  }
}

function warpBoxes() {
  for (const box of projectBoxes) {
    if (box._cx == null) continue;
    let pullX = 0;
    let pullY = 0;
    let influence = 0;
    let highlightX = box._cx;
    let highlightY = box._cy;
    let best = 0;

    for (const b of bodies) {
      const dx = b.x - box._cx;
      const dy = b.y - box._cy;
      const dist = Math.hypot(dx, dy);
      if (dist >= WARP_RADIUS || dist < 1) continue;
      const t = 1 - dist / WARP_RADIUS;
      const falloff = t * t * (b.mass / 3);
      pullX += (dx / dist) * falloff;
      pullY += (dy / dist) * falloff;
      influence += falloff;
      if (falloff > best) {
        best = falloff;
        highlightX = b.x;
        highlightY = b.y;
      }
    }

    const mag = Math.min(influence, 1.35);
    const targetX = pullX * 18;
    const targetY = pullY * 18;
    const targetZ = mag * 18;
    const targetRy = pullX * 7;
    const targetRx = -pullY * 7;
    const targetS = 1 + mag * 0.04;
    const targetG = Math.min(1, mag * 0.85);

    box._tx = (box._tx || 0) + (targetX - (box._tx || 0)) * WARP_LERP;
    box._ty = (box._ty || 0) + (targetY - (box._ty || 0)) * WARP_LERP;
    box._tz = (box._tz || 0) + (targetZ - (box._tz || 0)) * WARP_LERP;
    box._trx = (box._trx || 0) + (targetRx - (box._trx || 0)) * WARP_LERP;
    box._try = (box._try || 0) + (targetRy - (box._try || 0)) * WARP_LERP;
    box._ts = (box._ts == null ? 1 : box._ts) + (targetS - (box._ts == null ? 1 : box._ts)) * WARP_LERP;
    box._tg = (box._tg || 0) + (targetG - (box._tg || 0)) * WARP_LERP;

    box.style.setProperty('--wx', box._tx.toFixed(2) + 'px');
    box.style.setProperty('--wy', box._ty.toFixed(2) + 'px');
    box.style.setProperty('--wz', box._tz.toFixed(2) + 'px');
    box.style.setProperty('--rx', box._trx.toFixed(2) + 'deg');
    box.style.setProperty('--ry', box._try.toFixed(2) + 'deg');
    box.style.setProperty('--ws', box._ts.toFixed(3));
    box.style.setProperty('--lg', box._tg.toFixed(3));
    box.style.setProperty('--lx', (((highlightX - (box._cx - box._w / 2)) / box._w) * 100).toFixed(1) + '%');
    box.style.setProperty('--ly', (((highlightY - (box._cy - box._h / 2)) / box._h) * 100).toFixed(1) + '%');
    box.style.zIndex = box._tg > 0.04 ? String(5 + Math.round(box._tg * 10)) : '';
  }
}

const DT = 1 / 240;
let accumulator = 0;
let lastTime = -1;

function simStep(dt) {
  computeAccelerations();
  for (const b of bodies) {
    b.vx += b.ax * dt;
    b.vy += b.ay * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    wrap(b);
  }
}

function loop(time) {
  if (lastTime === -1) { lastTime = time || 0; requestAnimationFrame(loop); return; }
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
  warpBoxes();
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
layoutBoxes();
loop();

window.addEventListener('resize', () => {
  resize();
  layoutBoxes();
});
window.addEventListener('scroll', layoutBoxes, { passive: true });
window.addEventListener('load', layoutBoxes);

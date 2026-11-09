/* Kosmiczne tło. Kolory biorą się ze zmiennych w css/theme.css. */

const canvas = document.querySelector("#sky");

const context = canvas.getContext("2d", { alpha: true });
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

let stars = [];
let planets = [];
let shot = null;
let nextShot = 0;
let width = 0;
let height = 0;
let running = false;
let frame = 0;

function color(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.round(Math.min(48, 18 + width / 28));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.4 + 0.4,
    tw: Math.random() * Math.PI * 2,
    speed: 0.15 + Math.random() * 0.45,
    drift: (Math.random() - 0.5) * 0.08,
  }));
  planets = [
    { x: width * 0.82, y: height * 0.18, r: 18, vx: -0.04, vy: 0.012, tone: 0 },
    { x: width * 0.12, y: height * 0.72, r: 10, vx: 0.03, vy: -0.01, tone: 1 },
    { x: width * 0.55, y: height * 0.88, r: 7, vx: -0.02, vy: -0.015, tone: 2 },
  ];
}

function drawNebula() {
  const nebula = color("--sky-nebula", "rgba(90, 70, 160, 0.28)");
  const glow = color("--sky-glow", "rgba(80, 150, 170, 0.2)");
  const drift = reduce.matches ? 0 : frame * 0.15;
  const blobs = [
    [width * 0.3 + Math.sin(drift * 0.01) * 20, height * 0.25, 180, nebula],
    [width * 0.75 + Math.cos(drift * 0.008) * 16, height * 0.7, 140, glow],
  ];
  for (const [x, y, radius, fill] of blobs) {
    const gradient = context.createRadialGradient(x, y, 10, x, y, radius);
    gradient.addColorStop(0, fill);
    gradient.addColorStop(1, "transparent");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
}

function drawStars() {
  const ink = color("--sky-star", "#f4f7ff");
  const soft = color("--sky-star-soft", "#9ad7e0");
  for (const star of stars) {
    const alpha = reduce.matches ? 0.7 : 0.35 + Math.abs(Math.sin(star.tw + frame * 0.02 * star.speed)) * 0.65;
    context.globalAlpha = alpha;
    context.fillStyle = star.r > 1.2 ? soft : ink;
    context.beginPath();
    context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    context.fill();
    if (!reduce.matches) {
      star.x += star.drift;
      star.y -= 0.02 * star.speed;
      if (star.y < -4) star.y = height + 4;
      if (star.x < -4) star.x = width + 4;
      if (star.x > width + 4) star.x = -4;
    }
  }
  context.globalAlpha = 1;
}

function drawPlanets() {
  const tones = [
    color("--sky-planet", "#c6a15e"),
    color("--sky-planet-2", "#6aa8b4"),
    color("--lilac", "#9b93c9"),
  ];
  for (const planet of planets) {
    context.fillStyle = tones[planet.tone];
    context.globalAlpha = 0.55;
    context.beginPath();
    context.arc(planet.x, planet.y, planet.r, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 0.18;
    context.beginPath();
    context.arc(planet.x - planet.r * 0.2, planet.y - planet.r * 0.2, planet.r * 1.7, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
    if (!reduce.matches) {
      planet.x += planet.vx;
      planet.y += planet.vy;
      if (planet.x < -40) planet.x = width + 30;
      if (planet.x > width + 40) planet.x = -30;
      if (planet.y < -40) planet.y = height + 20;
      if (planet.y > height + 40) planet.y = -20;
    }
  }
}

function drawShot() {
  if (!shot) return;
  const life = (performance.now() - shot.born) / shot.span;
  if (life >= 1) {
    shot = null;
    return;
  }
  const x = shot.x + shot.vx * life;
  const y = shot.y + shot.vy * life;
  context.strokeStyle = color("--sky-shoot", "#fff6c8");
  context.globalAlpha = 1 - life;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x - shot.vx * 0.08, y - shot.vy * 0.08);
  context.stroke();
  context.globalAlpha = 1;
}

function frameDraw(now) {
  frame += 1;
  context.clearRect(0, 0, width, height);
  drawNebula();
  drawStars();
  drawPlanets();
  if (!reduce.matches && now > nextShot) {
    shot = {
      x: Math.random() * width * 0.7,
      y: Math.random() * height * 0.4,
      vx: 220 + Math.random() * 80,
      vy: 90 + Math.random() * 40,
      born: now,
      span: 700,
    };
    nextShot = now + 9000 + Math.random() * 7000;
  }
  drawShot();
  if (!reduce.matches && !document.hidden) {
    requestAnimationFrame(frameDraw);
  } else {
    running = false;
  }
}

function start() {
  if (running) return;
  running = true;
  if (reduce.matches) {
    frameDraw(0);
    return;
  }
  requestAnimationFrame(frameDraw);
}

resize();
nextShot = performance.now() + 4000;
start();
window.addEventListener("resize", () => {
  resize();
  if (reduce.matches) frameDraw(0);
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) start();
});
reduce.addEventListener?.("change", () => {
  if (reduce.matches) frameDraw(0);
  else start();
});

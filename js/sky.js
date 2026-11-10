/* Kosmiczne tło. Kolory biorą się ze zmiennych w css/theme.css.
   Duże planety trzymają się krawędzi i dołu, żeby nie zasłaniać tytułu pytania. */

const canvas = document.querySelector("#sky");
const context = canvas.getContext("2d", { alpha: true });
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

let stars = [];
let planets = [];
let nebulas = [];
let shot = null;
let comet = null;
let nextShot = 0;
let nextComet = 0;
let width = 0;
let height = 0;
let running = false;
let frame = 0;
let colors = {};

function readColor(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function cacheColors() {
  colors = {
    star: readColor("--sky-star", "#ffffff"),
    soft: readColor("--sky-star-soft", "#7ef6ff"),
    nebula: readColor("--sky-nebula", "rgba(171, 0, 255, 0.32)"),
    glow: readColor("--sky-glow", "rgba(0, 240, 255, 0.28)"),
    planet: readColor("--sky-planet", "#ffe600"),
    planet2: readColor("--sky-planet-2", "#00f0ff"),
    lilac: readColor("--lilac", "#c084fc"),
    pink: readColor("--pink", "#ff4fa3"),
    shoot: readColor("--sky-shoot", "#fff6b0"),
  };
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
  cacheColors();
  const count = Math.round(Math.min(130, 64 + width / 10));
  stars = Array.from({ length: count }, () => {
    const depth = Math.random();
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: depth > 0.72 ? 1.35 + Math.random() * 0.7 : 0.35 + depth * 0.9,
      tw: Math.random() * Math.PI * 2,
      speed: 0.25 + depth * 1.1,
      drift: (Math.random() - 0.5) * (0.04 + depth * 0.12),
      depth,
    };
  });
  planets = [
    { x: width * 0.08, y: height * 0.9, r: 22, vx: 0.035, vy: -0.008, tone: 0, ring: 0.35, spin: 0.2 },
    { x: width * 0.92, y: height * 0.84, r: 16, vx: -0.03, vy: -0.01, tone: 1, ring: 0.15, spin: -0.35 },
    { x: -8, y: height * 0.58, r: 11, vx: 0.02, vy: 0.006, tone: 2, ring: 0, spin: 0.5 },
  ];
  nebulas = [
    { x: 0.12, y: 0.82, r: 0.46, hue: 0, speed: 0.008 },
    { x: 0.88, y: 0.9, r: 0.38, hue: 1, speed: 0.006 },
    { x: 0.5, y: 0.96, r: 0.32, hue: 2, speed: 0.01 },
    { x: 0.02, y: 0.48, r: 0.22, hue: 1, speed: 0.007 },
    { x: 0.98, y: 0.42, r: 0.2, hue: 0, speed: 0.009 },
  ];
}

function wrapPlanet(planet) {
  const margin = planet.r + 28;
  if (planet.x < -margin) planet.x = width + margin * 0.4;
  if (planet.x > width + margin) planet.x = -margin * 0.4;
  if (planet.y < height * 0.42) planet.vy = Math.abs(planet.vy) * 0.4 + 0.004;
  if (planet.y > height + margin) planet.y = height * 0.55;
}

function drawAurora() {
  const drift = reduce.matches ? 0 : frame * 0.004;
  const gradient = context.createLinearGradient(0, height * 0.72, 0, height);
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(0.45, `rgba(0, 240, 255, ${0.05 + Math.sin(drift) * 0.02})`);
  gradient.addColorStop(0.72, `rgba(192, 132, 252, ${0.07 + Math.cos(drift * 0.8) * 0.02})`);
  gradient.addColorStop(1, "transparent");
  context.fillStyle = gradient;
  context.fillRect(0, height * 0.7, width, height * 0.3);
}

function drawNebula() {
  const fills = [colors.nebula, colors.glow, colors.pink];
  const drift = reduce.matches ? 0 : frame;
  for (const cloud of nebulas) {
    const x = width * cloud.x + Math.sin(drift * cloud.speed) * 18;
    const y = height * cloud.y + Math.cos(drift * cloud.speed * 0.7) * 12;
    const radius = Math.min(width, height) * cloud.r;
    const gradient = context.createRadialGradient(x, y, 8, x, y, radius);
    gradient.addColorStop(0, fills[cloud.hue] || colors.nebula);
    gradient.addColorStop(1, "transparent");
    context.globalAlpha = 0.55;
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;
}

function drawGalaxy() {
  const x = width * 0.5;
  const y = height * 0.98;
  const spin = reduce.matches ? 0.4 : frame * 0.003;
  context.save();
  context.translate(x, y);
  context.rotate(spin);
  context.globalAlpha = 0.28;
  for (let arm = 0; arm < 2; arm += 1) {
    context.rotate(Math.PI);
    context.beginPath();
    for (let step = 0; step < 28; step += 1) {
      const t = step / 6;
      const radius = 2 + step * 1.15;
      const angle = t;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius * 0.42;
      if (step === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }
    context.strokeStyle = colors.soft;
    context.lineWidth = 1.2;
    context.stroke();
  }
  context.beginPath();
  context.fillStyle = colors.lilac;
  context.arc(0, 0, 3.2, 0, Math.PI * 2);
  context.fill();
  context.restore();
  context.globalAlpha = 1;
}

function drawStars() {
  for (const star of stars) {
    const alpha = reduce.matches
      ? 0.55 + star.depth * 0.3
      : 0.25 + Math.abs(Math.sin(star.tw + frame * 0.03 * star.speed)) * (0.45 + star.depth * 0.4);
    context.globalAlpha = alpha;
    context.fillStyle = star.depth > 0.62 ? colors.soft : colors.star;
    context.beginPath();
    context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    context.fill();
    if (!reduce.matches) {
      star.x += star.drift * (0.35 + star.depth);
      star.y -= 0.015 * star.speed * (0.4 + star.depth);
      if (star.y < -4) star.y = height + 4;
      if (star.x < -4) star.x = width + 4;
      if (star.x > width + 4) star.x = -4;
    }
  }
  context.globalAlpha = 1;
}

function drawPlanets() {
  const tones = [colors.planet, colors.planet2, colors.lilac];
  for (const planet of planets) {
    const spin = reduce.matches ? planet.spin : planet.spin + frame * 0.004;
    context.save();
    context.translate(planet.x, planet.y);
    context.rotate(spin);
    if (planet.ring) {
      context.globalAlpha = 0.45;
      context.strokeStyle = tones[planet.tone];
      context.lineWidth = 2;
      context.beginPath();
      context.ellipse(0, 0, planet.r * 1.85, planet.r * (0.38 + planet.ring), planet.ring, 0, Math.PI * 2);
      context.stroke();
    }
    context.globalAlpha = 0.62;
    context.fillStyle = tones[planet.tone];
    context.beginPath();
    context.arc(0, 0, planet.r, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 0.16;
    context.beginPath();
    context.arc(-planet.r * 0.25, -planet.r * 0.28, planet.r * 0.55, 0, Math.PI * 2);
    context.fillStyle = "#ffffff";
    context.fill();
    context.restore();
    context.globalAlpha = 1;
    if (!reduce.matches) {
      planet.x += planet.vx;
      planet.y += planet.vy;
      wrapPlanet(planet);
    }
  }
}

function drawStreak(item, style, widthPx) {
  const life = (performance.now() - item.born) / item.span;
  if (life >= 1) return false;
  const x = item.x + item.vx * life;
  const y = item.y + item.vy * life;
  context.strokeStyle = style;
  context.globalAlpha = (1 - life) * 0.9;
  context.lineWidth = widthPx;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x - item.vx * item.tail, y - item.vy * item.tail);
  context.stroke();
  context.globalAlpha = 1;
  return true;
}

function drawShot() {
  if (!shot) return;
  if (!drawStreak(shot, colors.shoot, 1.6)) shot = null;
}

function drawComet() {
  if (!comet) return;
  if (!drawStreak(comet, colors.soft, 2.4)) comet = null;
  else {
    const life = (performance.now() - comet.born) / comet.span;
    const x = comet.x + comet.vx * life;
    const y = comet.y + comet.vy * life;
    context.globalAlpha = 0.8 * (1 - life);
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(x, y, 2.4, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
  }
}

function frameDraw(now) {
  frame += 1;
  if (frame % 180 === 0) cacheColors();
  context.clearRect(0, 0, width, height);
  drawNebula();
  drawAurora();
  drawGalaxy();
  drawStars();
  drawPlanets();
  if (!reduce.matches && now > nextShot) {
    shot = {
      x: Math.random() * width * 0.55,
      y: Math.random() * height * 0.35,
      vx: 180 + Math.random() * 90,
      vy: 70 + Math.random() * 50,
      born: now,
      span: 620,
      tail: 0.09,
    };
    nextShot = now + 4200 + Math.random() * 2800;
  }
  if (!reduce.matches && now > nextComet) {
    comet = {
      x: -20,
      y: height * (0.15 + Math.random() * 0.25),
      vx: 140 + Math.random() * 40,
      vy: 28 + Math.random() * 20,
      born: now,
      span: 2600,
      tail: 0.16,
    };
    nextComet = now + 18000 + Math.random() * 14000;
  }
  drawShot();
  drawComet();
  if (!reduce.matches && !document.hidden) requestAnimationFrame(frameDraw);
  else running = false;
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
nextShot = performance.now() + 1800;
nextComet = performance.now() + 8000;
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

const pageName = document.body.dataset.page;
const nav = document.querySelector("#siteNav");
const navToggle = document.querySelector(".nav-toggle");

if (nav && pageName) {
  nav.querySelectorAll("a").forEach((link) => {
    if (link.dataset.nav === pageName) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const canvas = document.querySelector("#ambientCanvas");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (canvas && !reduceMotion.matches) {
  const ctx = canvas.getContext("2d");
  const colors = ["#5fb653", "#8de59d", "#f2ad2e", "#e97f9a", "#42a9b7", "#b6e27b"];
  let width = 0;
  let height = 0;
  let particles = [];
  let raf = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(86, Math.max(42, Math.floor(width / 20)));
    particles = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 5 + Math.random() * 17,
      color: colors[index % colors.length],
      speed: 0.12 + Math.random() * 0.58,
      drift: -0.34 + Math.random() * 0.68,
      rotation: Math.random() * Math.PI,
      spin: -0.018 + Math.random() * 0.036,
      type: Math.random() > 0.14 ? "leaf" : "dot",
      alpha: 0.2 + Math.random() * 0.38,
      sway: 0.4 + Math.random() * 1.4,
      squash: 0.38 + Math.random() * 0.32,
      layer: Math.random() > 0.72 ? 1.35 : 1
    }));
  };

  const drawLeaf = (p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 1.75 * p.layer, p.size * p.squash, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-p.size * 1.15 * p.layer, 0);
    ctx.lineTo(p.size * 1.15 * p.layer, 0);
    ctx.stroke();
    ctx.restore();
  };

  const drawDot = (p) => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const tick = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.y += p.speed * p.layer;
      p.x += p.drift + Math.sin((p.y + p.size) * 0.014) * p.sway;
      p.rotation += p.spin;

      if (p.y > height + 30) {
        p.y = -30;
        p.x = Math.random() * width;
      }
      if (p.x < -40) p.x = width + 40;
      if (p.x > width + 40) p.x = -40;

      if (p.type === "leaf") {
        drawLeaf(p);
      } else {
        drawDot(p);
      }
    });
    raf = requestAnimationFrame(tick);
  };

  resize();
  tick();
  window.addEventListener("resize", resize);
  window.addEventListener("pagehide", () => cancelAnimationFrame(raf));
}

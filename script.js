gsap.registerPlugin(ScrollTrigger);
/* nav background on scroll */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () =>
  nav.classList.toggle("scrolled", window.scrollY > 40),
);

/* hamburger mobile menu */
const toggle = document.getElementById("navToggle"),
  mobileMenu = document.getElementById("mobileMenu");
function closeMenu() {
  toggle.classList.remove("open");
  mobileMenu.classList.remove("open");
  document.body.style.overflow = "";
}
toggle.addEventListener("click", () => {
  const open = toggle.classList.toggle("open");
  mobileMenu.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
});
mobileMenu.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    closeMenu();
    setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 350);
  });
});

/* scrollspy — highlight active nav link */
const sections = ["firma", "profesionales", "practicas", "contacto"].map((id) =>
  document.getElementById(id),
);
const navMap = {};
document
  .querySelectorAll(".navlinks a")
  .forEach((a) => (navMap[a.getAttribute("href").slice(1)] = a));
sections.forEach((sec) => {
  if (!sec) return;
  ScrollTrigger.create({
    trigger: sec,
    start: "top 55%",
    end: "bottom 55%",
    onToggle: (self) => {
      if (self.isActive) {
        document
          .querySelectorAll(".navlinks a")
          .forEach((x) => x.classList.remove("active"));
        navMap[sec.id] && navMap[sec.id].classList.add("active");
      }
    },
  });
});

/* hero title word-by-word reveal */
const ht = document.getElementById("heroTitle");
ht.innerHTML = ht.textContent
  .split(" ")
  .map(
    (w) =>
      `<span class="hw" style="display:inline-block;overflow:hidden;vertical-align:top"><span style="display:inline-block;transform:translateY(110%)">${w}</span></span>`,
  )
  .join(" ");
gsap.to("#heroTitle .hw > span", {
  y: "0%",
  duration: 1,
  stagger: 0.07,
  ease: "power4.out",
  delay: 0.2,
});
gsap.utils.toArray(".hero .rv").forEach((el, i) =>
  gsap.fromTo(
    el,
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay: 0.7 + i * 0.15,
      ease: "power3.out",
    },
  ),
);

/* generic reveals on scroll (smooth) */
gsap.utils.toArray(".rv").forEach((el) => {
  if (el.closest(".hero")) return;
  gsap.fromTo(
    el,
    { opacity: 0, y: 46 },
    {
      opacity: 1,
      y: 0,
      duration: 1.05,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    },
  );
});

/* staggered groups */
[
  [".stats-grid .stat", 0.12],
  [".clients .cl", 0.08],
  [".diff-bodies .diff-body", 0.14],
  [".diff-line .diff-circle", 0.16],
  [".pros-grid .pro", 0.18],
  [".areas-list li", 0.07],
].forEach(([sel, st]) => {
  gsap.fromTo(
    sel,
    { opacity: 0, y: 38 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: st,
      ease: "power3.out",
      scrollTrigger: { trigger: sel, start: "top 90%" },
    },
  );
});

/* count up numbers */
gsap.utils.toArray(".count").forEach((el) => {
  const t = +el.dataset.target;
  ScrollTrigger.create({
    trigger: el,
    start: "top 92%",
    once: true,
    onEnter: () => {
      gsap.to(
        { v: 0 },
        {
          v: t,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].v);
          },
        },
      );
    },
  });
});

/* parallax layers */
gsap.utils.toArray("[data-speed]").forEach((el) => {
  const sp = parseFloat(el.dataset.speed);
  gsap.to(el, {
    yPercent: (1 - sp) * -26,
    ease: "none",
    scrollTrigger: {
      trigger: el.closest("section,header"),
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});

/* banner scrub scale */
gsap.fromTo(
  ".banner h3",
  { scale: 0.95, opacity: 0.6 },
  {
    scale: 1,
    opacity: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".banner",
      start: "top 82%",
      end: "center center",
      scrub: 0.6,
    },
  },
);

/* areas interaction */
const areas = [
  [
    "Corporativo",
    "Acompañamiento en estructuras societarias, reorganizaciones empresariales, fusiones, adquisiciones y operaciones corporativas complejas.",
    "assets/backgrounds/arte_Corporativo.png",
  ],
  [
    "Laboral & Gestión de Personas",
    "Asesoría estratégica en relaciones laborales, gestión de personal, cumplimiento normativo, negociación y prevención de contingencias laborales.",
    "assets/backgrounds/arte_Laboral.png",
  ],
  [
    "Tributario",
    "Planeamiento tributario, asesoría fiscal corporativa y acompañamiento en procedimientos ante la administración tributaria.",
    "assets/backgrounds/arte_Tributario.png",
  ],
  [
    "Asuntos Públicos",
    "Asesoría en relacionamiento institucional, regulación, gestión de intereses y análisis del entorno regulatorio.",
    "assets/backgrounds/arte_AsuntosP.png",
  ],
  [
    "Aeronáutico",
    "Asesoría especializada para empresas del sector aeronáutico, operadores, proveedores y actores vinculados a la industria aérea.",
    "assets/backgrounds/arte_Aero.png",
  ],
  [
    "Industrias",
    "Especialistas en sectores que demandan conocimiento regulatorio, visión estratégica y experiencia práctica.",
    "assets/backgrounds/arte_Industrias.png",
  ],
];
/* preload images for seamless fades */
areas.forEach((a) => {
  const im = new Image();
  im.src = a[2];
});
const aT = document.getElementById("areaTitle"),
  aD = document.getElementById("areaDesc"),
  aImg = document.getElementById("areaImg"),
  panel = document.querySelector(".area-panel .pc");
function selectArea(idx) {
  const [t, d, img] = areas[idx];
  /* fade image out, swap src, fade back in */
  aImg.style.opacity = "0";
  const swap = () => {
    aImg.src = img;
    aImg.style.opacity = ".5";
    aImg.removeEventListener("transitionend", swap);
  };
  aImg.addEventListener("transitionend", swap);
  /* fallback in case transitionend doesn't fire */
  setTimeout(() => {
    if (aImg.src !== img) {
      aImg.src = img;
      aImg.style.opacity = ".5";
    }
  }, 380);
  /* fade text */
  panel.style.transition = "opacity .35s ease";
  panel.style.opacity = ".3";
  setTimeout(() => {
    aT.textContent = t;
    aD.textContent = d;
    panel.style.opacity = "1";
  }, 180);
}
document.querySelectorAll(".areas-list li").forEach((li) => {
  li.addEventListener("mouseenter", () => {
    document
      .querySelectorAll(".areas-list li")
      .forEach((x) => x.classList.remove("active"));
    li.classList.add("active");
    selectArea(+li.dataset.area);
  });
  /* tap support on touch devices */
  li.addEventListener("click", () => {
    document
      .querySelectorAll(".areas-list li")
      .forEach((x) => x.classList.remove("active"));
    li.classList.add("active");
    selectArea(+li.dataset.area);
  });
});

/* smooth anchors */
document.querySelectorAll(".navlinks a,.hero-btn").forEach((a) => {
  const h = a.getAttribute("href");
  if (h && h.startsWith("#"))
    a.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(h).scrollIntoView({ behavior: "smooth" });
    });
});

/* ===== HERO AUTO SLIDER ===== */
(function () {
  const track = document.getElementById("heroTrack");
  if (!track) return;
  const slides = Array.from(track.children);
  const dotsWrap = document.getElementById("heroDots");
  const slider = document.getElementById("heroSlider");
  let i = 0,
    timer = null;
  const DELAY = 5000;

  slides.forEach((s, idx) => {
    const d = document.createElement("span");
    if (idx === 0) d.classList.add("on");
    d.addEventListener("click", () => {
      go(idx);
      restart();
    });
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.children);

  function go(n) {
    i = (n + slides.length) % slides.length;
    track.style.transform = "translateX(-" + i * 100 + "%)";
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
    dots.forEach((d, idx) => d.classList.toggle("on", idx === i));
  }
  function next() {
    go(i + 1);
  }
  function start() {
    timer = setInterval(next, DELAY);
  }
  function stop() {
    clearInterval(timer);
  }
  function restart() {
    stop();
    start();
  }

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  /* swipe on touch devices */
  let sx = 0,
    active = false;
  slider.addEventListener(
    "touchstart",
    (e) => {
      sx = e.touches[0].clientX;
      active = true;
      stop();
    },
    { passive: true },
  );
  slider.addEventListener("touchend", (e) => {
    if (!active) return;
    active = false;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 45) go(i + (dx < 0 ? 1 : -1));
    start();
  });

  go(0);
  start();
})();

/* ===== CLIENTS INFINITE MARQUEE ===== */
(function () {
  const track = document.getElementById("clientsTrack");
  if (!track) return;
  const originals = Array.from(track.children);
  originals.forEach((node) => track.appendChild(node.cloneNode(true)));
})();

/* ===== PROFESSIONALS CAROUSEL (independent of GSAP) ===== */
(function () {
  const track = document.getElementById("prosTrack");
  if (!track) return;
  const slides = Array.from(track.children);
  const prev = document.getElementById("prosPrev");
  const next = document.getElementById("prosNext");
  const dotsWrap = document.getElementById("prosDots");
  let index = 0;

  function perView() {
    const w = window.innerWidth;
    let n;
    if (w <= 800) n = 1;
    else if (w <= 1200) n = 2;
    else n = 3;
    return Math.min(n, slides.length);
  }
  const maxIndex = () => Math.max(0, slides.length - perView());
  function applyWidth() {
    track.style.setProperty("--pro-w", 100 / perView() + "%");
  }

  function buildDots() {
    dotsWrap.innerHTML = "";
    const pages = maxIndex() + 1;
    for (let i = 0; i < pages; i++) {
      const b = document.createElement("button");
      b.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(b);
    }
  }
  function update() {
    const slideW = 100 / perView();
    track.style.transform = "translateX(-" + index * slideW + "%)";
    Array.from(dotsWrap.children).forEach((d, i) =>
      d.classList.toggle("on", i === index),
    );
    prev.classList.toggle("disabled", index <= 0);
    next.classList.toggle("disabled", index >= maxIndex());
    const noNav = maxIndex() === 0;
    prev.style.display = noNav ? "none" : "";
    next.style.display = noNav ? "none" : "";
    dotsWrap.style.display = noNav ? "none" : "";
  }
  function goTo(i) {
    index = Math.min(Math.max(i, 0), maxIndex());
    update();
  }
  function step(dir) {
    goTo(index + dir);
  }

  prev.addEventListener("click", () => step(-1));
  next.addEventListener("click", () => step(1));

  let startX = 0,
    curX = 0,
    dragging = false;
  const vp = track.parentElement;
  vp.addEventListener(
    "touchstart",
    (e) => {
      startX = curX = e.touches[0].clientX;
      dragging = true;
    },
    { passive: true },
  );
  vp.addEventListener(
    "touchmove",
    (e) => {
      if (dragging) curX = e.touches[0].clientX;
    },
    { passive: true },
  );
  vp.addEventListener("touchend", () => {
    if (!dragging) return;
    dragging = false;
    const dx = curX - startX;
    if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
  });

  let lastPV = perView();
  window.addEventListener("resize", () => {
    const pv = perView();
    if (pv !== lastPV) {
      lastPV = pv;
      applyWidth();
      buildDots();
      index = Math.min(index, maxIndex());
    }
    update();
  });

  applyWidth();
  buildDots();
  update();
})();

document
  .getElementById("contactForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const msg = document.getElementById("formMsg");
    const btn = this.querySelector(".send");
    btn.disabled = true;
    msg.textContent = "Enviando…";
    try {
      const res = await fetch("mailservice.php", {
        method: "POST",
        body: new FormData(this),
      });
      const data = await res.json();
      if (data.ok) {
        msg.textContent = "¡Gracias! Tu mensaje fue enviado.";
        this.reset();
      } else {
        msg.textContent =
          data.error || "No se pudo enviar. Inténtalo de nuevo.";
      }
    } catch {
      msg.textContent = "Error de conexión. Inténtalo más tarde.";
    }
    btn.disabled = false;
  });
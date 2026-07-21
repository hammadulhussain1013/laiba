/* ═══════════════════════════════════════════════════════════════
   FOR LAIBA ❤️ — script.js
   Content (reasons/wishes/countries/etc.) is rendered by PHP already.
   This file only adds motion, sound, and the map/letter/tree interactions.
   No Three.js, no Lenis — plain canvas + CSS transforms, so it stays
   light and fast even on an older phone.
   ═══════════════════════════════════════════════════════════════ */

(() => {
"use strict";

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE_POINTER = window.matchMedia("(pointer: fine)").matches;
const DATA = window.SITE_DATA || { reasons: [], wishes: [], starReasons: [], starSurprises: [], countries: [], continents: {} };

if (window.gsap) gsap.registerPlugin(ScrollTrigger);

function onVisible(el, cb) {
  const io = new IntersectionObserver(es => es.forEach(e => cb(e.isIntersecting)), { threshold: 0.05 });
  io.observe(el);
  return io;
}

/* ── AMBIENT BACKGROUND (light: ~26 soft particles, no per-frame shadowBlur) ── */
(() => {
  const cv = $("#ambient-canvas");
  const ctx = cv.getContext("2d");
  let W, H, running = true, parts = [];
  function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
  resize(); addEventListener("resize", resize);

  function make(kind) {
    return {
      kind, x: rand(0, W), y: kind === "heart" ? H + 20 : rand(0, H),
      r: kind === "firefly" ? rand(1.6, 2.6) : rand(0.9, 1.7),
      a: rand(0.2, 0.7), da: rand(0.003, 0.008) * (Math.random() < 0.5 ? -1 : 1),
      vx: rand(-0.1, 0.1), vy: kind === "heart" ? rand(-0.45, -0.22) : rand(-0.04, 0.04),
      color: kind === "firefly" ? "245,200,107" : kind === "heart" ? "255,94,168" : "255,255,255",
    };
  }
  const N = RM ? 0 : 26;
  for (let i = 0; i < N; i++) parts.push(make(Math.random() < 0.3 ? "firefly" : "star"));

  function tick() {
    if (!running) return requestAnimationFrame(tick);
    ctx.clearRect(0, 0, W, H);
    if (!RM && Math.random() < 0.006 && parts.length < N + 6) parts.push(make("heart"));
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx; p.y += p.vy; p.a += p.da;
      if (p.a > 0.75 || p.a < 0.15) p.da *= -1;
      if (p.y < -30 && p.kind === "heart") { parts.splice(i, 1); continue; }
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      if (p.y < -20 && p.kind !== "heart") p.y = H + 20;
      if (p.kind === "heart") {
        ctx.globalAlpha = clamp(p.a, 0, 0.5);
        ctx.font = "12px serif"; ctx.fillStyle = "rgb(255,94,168)";
        ctx.fillText("❤", p.x, p.y);
      } else {
        ctx.globalAlpha = clamp(p.a, 0, 0.7);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${p.color})`; ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  tick();
  document.addEventListener("visibilitychange", () => (running = !document.hidden));
})();

/* ── LOADER (short, and skipped almost entirely under reduced motion) ─── */
(() => {
  const loader = $("#loader");
  const ring = $(".loader__ring-fg");
  const DURATION = RM ? 400 : 1800;
  const CIRC = 2 * Math.PI * 52;
  const t0 = performance.now();
  (function step(now) {
    const p = clamp((now - t0) / DURATION, 0, 1);
    ring.style.strokeDashoffset = CIRC * (1 - p);
    if (p < 1) requestAnimationFrame(step); else finish();
  })(t0);
  function finish() {
    loader.classList.add("is-done");
    $("#gate").classList.add("is-visible");
    setTimeout(() => loader.remove(), 1300);
  }
})();

/* ── SOUND: Web Audio, unlocked explicitly by the gate tap ─────────────
   Browsers refuse to play audio before a real user gesture. Instead of
   hoping some click fires early, the gate button IS that gesture: one
   tap both starts the music and unlocks every sound effect after it. */
const sound = (() => {
  let ctx = null, master, wet, started = false, muted = false, timer = null, volume = 0.55;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = volume;
    const delay = ctx.createDelay(1.2); delay.delayTime.value = 0.4;
    const fb = ctx.createGain(); fb.gain.value = 0.3;
    wet = ctx.createGain(); wet.gain.value = 0.3;
    delay.connect(fb); fb.connect(delay);
    master.connect(ctx.destination);
    master.connect(delay); delay.connect(wet); wet.connect(ctx.destination);
  }

  function note(freq, t, dur = 2.2, gain = 0.15, dest = master) {
    const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = freq;
    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1800;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(lp); lp.connect(dest);
    o.start(t); o.stop(t + dur + 0.05);
  }

  const CHORDS = [
    [174.61, 220.0, 261.63, 329.63],
    [220.0, 261.63, 329.63, 392.0],
    [146.83, 220.0, 261.63, 349.23],
    [233.08, 293.66, 349.23, 440.0]
  ];
  let chordIdx = 0, nextTime = 0;
  function scheduler() {
    const ahead = 0.6;
    while (nextTime < ctx.currentTime + ahead) {
      const chord = CHORDS[chordIdx % CHORDS.length];
      note(chord[0] / 2, nextTime, 3.4, 0.09);
      chord.forEach((f, i) => note(f, nextTime + i * 0.55, 2.4, 0.11));
      nextTime += 3.2; chordIdx++;
    }
  }

  function start() {
    init();
    if (ctx.state === "suspended") ctx.resume();
    if (started) return;
    started = true;
    nextTime = ctx.currentTime + 0.1;
    timer = setInterval(scheduler, 250);
    const btn = $("#music-toggle");
    btn.classList.add("is-playing");
    btn.setAttribute("aria-label", "Mute music");
  }

  function toggleMusic() {
    if (!started) { start(); return; }
    muted = !muted;
    master.gain.linearRampToValueAtTime(muted ? 0.0001 : volume, ctx.currentTime + 0.35);
    const btn = $("#music-toggle");
    btn.classList.toggle("is-muted", muted);
    btn.classList.toggle("is-playing", !muted);
    btn.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
  }

  $("#music-toggle").addEventListener("click", toggleMusic);
  $("#music-volume").addEventListener("input", e => {
    volume = e.target.value / 100;
    if (ctx && !muted) master.gain.linearRampToValueAtTime(Math.max(volume, 0.0001), ctx.currentTime + 0.15);
  });

  /* short, distinct sound effects — separate from the music loop */
  function sfx(kind) {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    if (kind === "click")  { note(1046, t, 0.28, 0.10); }
    else if (kind === "pop")     { note(880, t, 0.22, 0.11); note(1318, t + 0.05, 0.2, 0.08); }
    else if (kind === "chime")   { note(1568, t, 0.5, 0.09); note(2093, t + 0.08, 0.45, 0.06); }
    else if (kind === "whoosh")  { note(220, t, 0.6, 0.07); note(440, t + 0.05, 0.5, 0.05); }
    else if (kind === "seal")    { note(150, t, 0.35, 0.14); }
    else if (kind === "notif")   { note(880, t, 0.4, 0.12); note(1174.66, t + 0.1, 0.5, 0.1); }
  }

  function dreamMode(on) {
    if (ctx) wet.gain.linearRampToValueAtTime(on ? 0.65 : 0.3, ctx.currentTime + 1.2);
  }

  return { start, sfx, dreamMode };
})();

/* the ONE gesture that unlocks everything */
$("#gate-btn").addEventListener("click", () => {
  sound.start();
  $("#gate").classList.remove("is-visible");
  $("#music-dock").classList.add("is-visible");
  if (window.gsap) gsap.to("#experience", { opacity: 1, duration: 1.1, ease: "power2.out", onComplete: () => window.ScrollTrigger && ScrollTrigger.refresh() });
  else $("#experience").style.opacity = 1;
});

/* ── CURSOR (desktop only, throttled so it never piles up nodes) ────── */
if (FINE_POINTER && !RM) {
  document.body.classList.add("cursor-active");
  const cur = $("#cursor");
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, lastTrail = 0;
  addEventListener("pointermove", e => {
    mx = e.clientX; my = e.clientY;
    const now = performance.now();
    if (now - lastTrail > 110) {
      lastTrail = now;
      const t = document.createElement("span");
      t.className = "cursor-trail"; t.textContent = "❤";
      t.style.left = mx + "px"; t.style.top = my + "px";
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 750);
    }
    cur.classList.toggle("is-hovering", !!e.target.closest("button,a,.reason-card,.leaf,.sky-star,.envelope"));
  });
  (function follow() {
    cx += (mx - cx) * 0.3; cy += (my - cy) * 0.3;
    cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(follow);
  })();
}

addEventListener("pointerdown", e => {
  if (e.target.closest("#gate")) return;
  const r = document.createElement("span");
  r.className = "click-ripple"; r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px";
  document.body.appendChild(r); setTimeout(() => r.remove(), 700);
  burstHearts(e.clientX, e.clientY, RM ? 3 : 7);
});
function burstHearts(x, y, n = 7, chars = ["❤", "💗", "✨"]) {
  for (let i = 0; i < n; i++) {
    const h = document.createElement("span");
    h.className = "burst-heart"; h.textContent = pick(chars);
    h.style.left = x + "px"; h.style.top = y + "px"; h.style.fontSize = rand(12, 24) + "px";
    document.body.appendChild(h);
    const ang = rand(0, Math.PI * 2), dist = rand(40, 120);
    if (window.gsap) {
      gsap.to(h, { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist - rand(20, 70),
        rotation: rand(-120, 120), opacity: 0, scale: rand(0.4, 0.7),
        duration: rand(0.7, 1.2), ease: "power2.out", onComplete: () => h.remove() });
    } else { setTimeout(() => h.remove(), 900); }
  }
}

/* ── SCROLL STORY (native smooth scroll — no Lenis dependency) ─────── */
const hasGSAP = !!(window.gsap && window.ScrollTrigger);
function reveal(el, opts = {}) {
  if (!hasGSAP) { el.style.opacity = 1; return; }
  gsap.from(el, Object.assign({ opacity: 0, y: 24, duration: 0.8, ease: "power2.out",
    scrollTrigger: { trigger: el, start: "top 85%" } }, opts));
}

$$("[data-split], .section-head__title").forEach(el => reveal(el, { y: 30 }));

(() => {
  const box = $(".hero__petals");
  for (let i = 0; i < (RM ? 0 : 12); i++) {
    const p = document.createElement("span");
    p.className = "petal"; p.textContent = pick(["🌸", "🌷", "💮"]);
    p.style.cssText = `left:${rand(0,100)}%;font-size:${rand(14,26)}px;animation-duration:${rand(10,18)}s;animation-delay:${rand(-14,0)}s;`;
    box.appendChild(p);
  }
})();

if (hasGSAP) {
  gsap.timeline({ scrollTrigger: { trigger: "#ch1", start: "top 65%" } })
    .from(".sunrise__sun", { y: 100, opacity: 0, duration: 1.3, ease: "power2.out" })
    .to(".flower", { scale: 1, y: 0, duration: 0.8, ease: "back.out(2)", stagger: 0.12 }, "-=0.7")
    .to(".bird", { opacity: 1, duration: 0.4, stagger: 0.2, onComplete: () => {
      $$(".bird").forEach((b, i) => {
        b.style.left = "-8%"; b.style.top = 12 + i * 12 + "%";
        gsap.to(b, { left: "108%", duration: rand(8, 11), repeat: -1, ease: "none", delay: i * 2 });
      });
    }}, "-=0.5");

  ScrollTrigger.create({ trigger: "#ch2", start: "top 60%", once: true, onEnter: () => {
    gsap.to("#phone-notif", { y: 0, opacity: 1, duration: 0.8, ease: "elastic.out(1,0.6)" });
    sound.sfx("notif");
  }});

  gsap.from(".frame", { opacity: 0, y: 44, duration: 0.8, stagger: 0.1, ease: "power3.out",
    scrollTrigger: { trigger: ".frames", start: "top 85%" } });

  const el = $("#handwriting");
  el.innerHTML = el.textContent.split("").map(c => c === " " ? " " : `<span class="hand-char">${c}</span>`).join("");
  gsap.to("#handwriting .hand-char", { opacity: 1, filter: "blur(0px)", duration: 0.45, stagger: 0.05, ease: "power2.out",
    scrollTrigger: { trigger: "#ch5", start: "top 60%" } });
}

/* ── 100 REASON CARDS — content already in the DOM from PHP; JS only wires clicks ── */
(() => {
  const overlay = $("#reason-overlay");
  const close = () => overlay.classList.remove("is-open");
  $$(".reason-card").forEach(btn => {
    btn.addEventListener("click", e => {
      const i = +btn.dataset.index;
      $("#reason-overlay-num").textContent = `reason ${i + 1} of ${DATA.reasons.length}`;
      $("#reason-overlay-text").textContent = DATA.reasons[i];
      overlay.classList.add("is-open");
      sound.sfx("pop");
      burstHearts(e.clientX, e.clientY, 6);
    });
  });
  $("#reason-overlay-close").addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  if (hasGSAP) gsap.from(".reason-card", { opacity: 0, y: 20, duration: 0.5,
    stagger: { each: 0.008, from: "random" }, scrollTrigger: { trigger: "#reasons-field", start: "top 88%" } });
})();

/* ── LOVE COUNTER → ∞ ────────────────────────────────────────────── */
(() => {
  const val = $("#counter-value"), foot = $("#counter-foot"), cv = $("#counter-canvas"), ctx = cv.getContext("2d");
  let played = false;
  if (!hasGSAP) { val.textContent = "∞"; return; }
  ScrollTrigger.create({ trigger: "#counter-section", start: "top 55%", onEnter: () => { if (!played) { played = true; run(); } } });
  function run() {
    const c = { n: 1 };
    gsap.to(c, { n: 100, duration: 2.6, ease: "power2.in", onUpdate: () => val.textContent = Math.floor(c.n),
      onComplete: () => {
        let s = 0;
        const spin = setInterval(() => {
          val.textContent = ["999","9,999","10⁶","10⁹"][s] || "…";
          if (++s > 4) { clearInterval(spin); val.textContent = "∞"; val.classList.add("is-infinity");
            foot.textContent = "some numbers were never meant to end."; shatter(); }
        }, 220);
      }});
  }
  function shatter() {
    const rect = val.getBoundingClientRect(), secRect = $("#counter-section").getBoundingClientRect();
    cv.width = secRect.width; cv.height = secRect.height;
    const cx0 = rect.left - secRect.left + rect.width / 2, cy0 = rect.top - secRect.top + rect.height / 2;
    const hearts = Array.from({ length: RM ? 10 : 40 }, () => ({
      x: cx0 + rand(-rect.width/3, rect.width/3), y: cy0 + rand(-rect.height/3, rect.height/3),
      vx: rand(-2, 2), vy: rand(-4, -1), g: 0.05, s: rand(8, 18), a: 1, rot: rand(0,6), spin: rand(-0.08,0.08)
    }));
    (function draw() {
      ctx.clearRect(0,0,cv.width,cv.height);
      let alive = false;
      hearts.forEach(h => {
        if (h.a <= 0) return; alive = true;
        h.x += h.vx; h.y += h.vy; h.vy += h.g; h.a -= 0.01; h.rot += h.spin;
        ctx.save(); ctx.translate(h.x, h.y); ctx.rotate(h.rot);
        ctx.globalAlpha = clamp(h.a,0,1); ctx.font = `${h.s}px serif`; ctx.fillStyle = "#ff5ea8";
        ctx.fillText("❤", 0, 0); ctx.restore();
      });
      if (alive) requestAnimationFrame(draw);
    })();
  }
})();

/* ── TIMELINE ─────────────────────────────────────────────────────── */
if (hasGSAP) {
  gsap.to(".timeline__line-fill", { height: "100%", ease: "none",
    scrollTrigger: { trigger: ".timeline__track", start: "top 70%", end: "bottom 60%", scrub: 0.5 } });
  $$(".milestone").forEach(m => {
    gsap.timeline({ scrollTrigger: { trigger: m, start: "top 80%" } })
      .from($(".milestone__dot", m), { scale: 0, rotation: -140, duration: 0.6, ease: "back.out(2.2)" })
      .from($(".milestone__card", m), { opacity: 0, x: 40, duration: 0.6, ease: "power3.out" }, "-=0.3");
  });
  gsap.from(".lang-tile", { opacity: 0, y: 28, duration: 0.6, ease: "power3.out",
    stagger: { each: 0.04 }, scrollTrigger: { trigger: ".langs__grid", start: "top 88%" } });
}

/* ── VOICE PLAYBACK ───────────────────────────────────────────────── */
let voices = [];
function loadVoices() { voices = speechSynthesis.getVoices(); }
if ("speechSynthesis" in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function speakLove(text, lang) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  const base = lang.split("-")[0];
  u.voice = voices.find(v => v.lang === lang) || voices.find(v => v.lang && v.lang.startsWith(base)) || null;
  u.rate = 0.88; u.pitch = 1.05;
  speechSynthesis.speak(u);
}

/* ── LOVE MAP — plain 2D canvas: continents drawn from lat/lon points,
   country pins placed the same way. No WebGL, no textures, no CDN globe
   assets to fail — this is why the map wasn't showing before. ───────── */
(() => {
  const canvas = $("#love-map");
  const ctx = canvas.getContext("2d");
  const wrap = canvas.parentElement;
  const countries = DATA.countries;
  const continents = DATA.continents;
  const visited = new Set();
  let W = 0, H = 0, DPR = Math.min(devicePixelRatio || 1, 2);
  let hoverIdx = -1, running = false, laibaRunning = false;
  let arcs = []; // {from:[x,y], to:[x,y], progress}
  let heartMode = null; // {t} 0..1 progress toward heart shape

  function project(lon, lat) {
    return [ (lon + 180) / 360 * W, (90 - lat) / 180 * H ];
  }

  function resize() {
    const rect = wrap.getBoundingClientRect();
    W = canvas.width = rect.width * DPR;
    H = canvas.height = rect.height * DPR;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    draw();
  }
  addEventListener("resize", resize);

  function smoothPath(pts) {
    ctx.beginPath();
    const p0 = project(...pts[0]);
    ctx.moveTo(p0[0], p0[1]);
    for (let i = 1; i < pts.length; i++) {
      const p = project(...pts[i]);
      ctx.lineTo(p[0], p[1]);
    }
    ctx.closePath();
  }

  function drawStars() {
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i < 60; i++) {
      const x = (i * 137.5) % W, y = (i * 97.3) % H;
      ctx.globalAlpha = 0.15 + (i % 5) * 0.1;
      ctx.beginPath(); ctx.arc(x, y, 1 * DPR, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // ocean
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, H);
    oceanGrad.addColorStop(0, "#2c0f38"); oceanGrad.addColorStop(1, "#451a4e");
    ctx.fillStyle = oceanGrad; ctx.fillRect(0, 0, W, H);
    drawStars();

    // continents (soft glowing landmasses)
    Object.values(continents).forEach(pts => {
      smoothPath(pts);
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "rgba(255,180,215,0.28)");
      grad.addColorStop(1, "rgba(200,140,230,0.22)");
      ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = "rgba(255,224,240,0.35)"; ctx.lineWidth = 1 * DPR; ctx.stroke();
    });

    // arcs (Laiba Mode golden beams)
    arcs.forEach(a => {
      const n = Math.floor(a.progress * 40);
      if (n < 2) return;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const t = i / 40;
        const x = a.from[0] + (a.to[0] - a.from[0]) * t;
        const y = a.from[1] + (a.to[1] - a.from[1]) * t - Math.sin(t * Math.PI) * a.lift;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(245,200,107,0.95)";
      ctx.lineWidth = 2 * DPR;
      ctx.shadowColor = "rgba(245,200,107,0.7)"; ctx.shadowBlur = 6 * DPR;
      ctx.stroke(); ctx.shadowBlur = 0;
    });

    // pins (or heart-shape positions during Laiba Mode finale)
    countries.forEach((c, i) => {
      let x, y;
      if (heartMode) {
        const [hx, hy] = heartMode.positions[i];
        x = hx; y = hy;
      } else {
        [x, y] = project(c[3], c[2]);
      }
      const isVisited = visited.has(i);
      const isHover = i === hoverIdx;
      const r = (isHover ? 5 : isVisited ? 4 : 3) * DPR * (heartMode ? 1.3 : 1);
      ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = isVisited ? "rgba(245,200,107,0.25)" : "rgba(255,124,187,0.22)";
      ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = isVisited ? "#f5c86b" : "#ff7cbb";
      ctx.fill();
      if (isHover && !heartMode) {
        ctx.font = `${12 * DPR}px Outfit, sans-serif`;
        ctx.fillStyle = "#ffeaf4"; ctx.textAlign = "center";
        ctx.fillText(`${c[1]} ${c[0]}`, x, y - 12 * DPR);
      }
    });
  }

  function nearestCountry(px, py) {
    let best = -1, bestD = 16 * DPR; // hit radius
    countries.forEach((c, i) => {
      const [x, y] = project(c[3], c[2]);
      const d = Math.hypot(x - px, y - py);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }

  function eventPos(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return [cx * DPR, cy * DPR];
  }

  canvas.addEventListener("pointermove", e => {
    if (laibaRunning) return;
    const [px, py] = eventPos(e);
    const idx = nearestCountry(px, py);
    if (idx !== hoverIdx) { hoverIdx = idx; draw(); }
  });
  canvas.addEventListener("click", e => {
    if (laibaRunning) return;
    const [px, py] = eventPos(e);
    const idx = nearestCountry(px, py);
    if (idx >= 0) openCountry(idx);
  });

  function openCountry(i) {
    const c = countries[i];
    $("#cc-flag").textContent = c[1];
    $("#cc-name").textContent = c[0];
    $("#cc-lang").textContent = c[4];
    $("#cc-phrase").textContent = c[5];
    $("#cc-pron").textContent = "“" + c[6] + "”";
    $("#country-card").classList.add("is-open");
    $("#cc-listen").onclick = () => { speakLove(c[5], c[7]); sound.sfx("chime"); };
    sound.sfx("click");
    if (!visited.has(i)) {
      visited.add(i);
      $("#visited-count").textContent = visited.size;
      if (visited.size >= 5) $("#laiba-mode-btn").classList.add("is-visible");
    }
    draw();
  }
  $("#country-card-close").addEventListener("click", () => $("#country-card").classList.remove("is-open"));

  /* ── Laiba Mode: golden beams from Pakistan to every visited country,
     each speaking its phrase, then the pins gather into a heart. ───── */
  async function laibaMode() {
    if (laibaRunning) return;
    laibaRunning = true;
    $("#country-card").classList.remove("is-open");
    $("#laiba-mode-btn").classList.remove("is-visible");
    sound.dreamMode(true);
    const sub = $("#laiba-subtitle");
    const pk = project(countries[0][3], countries[0][2]);
    arcs = [];
    const targets = [...visited].filter(i => i !== 0);

    for (const i of targets) {
      const c = countries[i];
      const to = project(c[3], c[2]);
      const arc = { from: pk, to, progress: 0, lift: rand(40, 90) * DPR };
      arcs.push(arc);
      sub.textContent = `${c[1]} ${c[5]} — "I love you"`;
      sub.classList.add("is-visible");
      speakLove(c[5], c[7]);
      await animateArc(arc);
      await sleep(1400);
    }
    sub.textContent = "…and every path leads back to you, Laiba.";
    await sleep(2000);
    sub.classList.remove("is-visible");
    await heartFinale();
    arcs = [];
    sound.dreamMode(false);
    laibaRunning = false;
    $("#laiba-mode-btn").classList.add("is-visible");
    draw();
  }
  function animateArc(arc) {
    return new Promise(resolve => {
      const start = performance.now();
      (function step(now) {
        arc.progress = clamp((now - start) / 900, 0, 1);
        draw();
        if (arc.progress < 1) requestAnimationFrame(step); else resolve();
      })(start);
    });
  }
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function heartPositions() {
    const cx = W / 2, cy = H / 2, scale = Math.min(W, H) / 34;
    return countries.map((_, i) => {
      const t = (i / countries.length) * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return [cx + hx * scale, cy + hy * scale];
    });
  }
  function heartFinale() {
    return new Promise(resolve => {
      const targetPositions = heartPositions();
      const startPositions = countries.map((c, i) => project(c[3], c[2]));
      const start = performance.now();
      (function grow(now) {
        const t = clamp((now - start) / 1400, 0, 1);
        heartMode = { positions: startPositions.map((p, i) => [
          p[0] + (targetPositions[i][0] - p[0]) * easeInOut(t),
          p[1] + (targetPositions[i][1] - p[1]) * easeInOut(t)
        ]) };
        draw();
        if (t < 1) requestAnimationFrame(grow);
        else setTimeout(() => shrinkBack(resolve), 2600);
      })(start);
    });
  }
  function shrinkBack(resolve) {
    const from = heartMode.positions;
    const to = countries.map(c => project(c[3], c[2]));
    const start = performance.now();
    (function step(now) {
      const t = clamp((now - start) / 1200, 0, 1);
      heartMode = { positions: from.map((p, i) => [
        p[0] + (to[i][0] - p[0]) * easeInOut(t),
        p[1] + (to[i][1] - p[1]) * easeInOut(t)
      ]) };
      draw();
      if (t < 1) requestAnimationFrame(step);
      else { heartMode = null; draw(); resolve(); }
    })(start);
  }
  function easeInOut(t) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2; }

  $("#laiba-mode-btn").addEventListener("click", laibaMode);

  onVisible(wrap, v => { running = v; if (v) { resize(); } });
  resize();
})();

/* ── LOVE LETTER ──────────────────────────────────────────────────── */
(() => {
  const env = $("#envelope");
  let open = false;
  function toggle() {
    open = !open;
    env.classList.toggle("is-open", open);
    sound.sfx(open ? "seal" : "whoosh");
    if (open && hasGSAP) {
      gsap.fromTo(".letter__line", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.3, delay: 1.1, ease: "power2.out" });
      burstHearts(innerWidth / 2, innerHeight / 2, 10, ["❤", "💌", "✨"]);
    } else if (open) {
      $$(".letter__line").forEach(l => l.style.opacity = 1);
    }
  }
  env.addEventListener("click", toggle);
  env.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
})();

/* ── WISH TREE ────────────────────────────────────────────────────── */
(() => {
  const wishBox = $("#tree-wish");
  $$(".leaf").forEach(leaf => {
    const pickLeaf = () => {
      const i = +leaf.dataset.wish;
      wishBox.textContent = "🌿 " + DATA.wishes[i % DATA.wishes.length];
      wishBox.classList.add("is-visible");
      sound.sfx("pop");
      clearTimeout(wishBox._t);
      wishBox._t = setTimeout(() => wishBox.classList.remove("is-visible"), 3400);
      const r0 = leaf.getAttribute("r");
      if (hasGSAP) {
        gsap.to(leaf, { attr: { r: 0 }, opacity: 0, duration: 0.4, ease: "power2.in",
          onComplete: () => gsap.to(leaf, { attr: { r: r0 }, opacity: 0.9, duration: 1.2, delay: 2, ease: "elastic.out(1,0.5)" }) });
      }
      const rect = leaf.ownerSVGElement.getBoundingClientRect();
      burstHearts(rect.left + rect.width * 0.5, rect.top + rect.height * 0.4, 5, ["✨", "🍃"]);
    };
    leaf.addEventListener("click", pickLeaf);
    leaf.addEventListener("keydown", e => { if (e.key === "Enter") pickLeaf(); });
  });
})();

/* ── FLOATING LANTERNS ────────────────────────────────────────────── */
(() => {
  const cv = $("#lantern-canvas"), ctx = cv.getContext("2d");
  const MESSAGES = ["for every smile you gave me","for your softest heart","for the days ahead of us",
    "for your dreams — all of them","for the way you love","for us, forever","for you, Laiba — always you"];
  let lanterns = [], running = false, mi = 0;
  function resize() { cv.width = cv.clientWidth; cv.height = cv.clientHeight; }
  resize(); addEventListener("resize", resize);
  cv.addEventListener("pointerdown", e => {
    const r = cv.getBoundingClientRect();
    if (lanterns.length > 10) lanterns.shift();
    lanterns.push({ x: e.clientX - r.left, y: e.clientY - r.top, vy: rand(-0.5, -0.32),
      sway: rand(0, 6), w: rand(24, 36), a: 0, msg: MESSAGES[mi++ % MESSAGES.length] });
    sound.sfx("whoosh");
  });
  function roundRect(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function draw() {
    if (!running) return requestAnimationFrame(draw);
    const W = cv.clientWidth, H = cv.clientHeight;
    ctx.clearRect(0, 0, W, H);
    lanterns.forEach(l => {
      l.sway += 0.02; l.y += l.vy; l.x += Math.sin(l.sway) * 0.3; l.a = Math.min(1, l.a + 0.02);
      if (l.y < -80) l.y = H + 60;
      const h = l.w * 1.35;
      ctx.save(); ctx.globalAlpha = l.a;
      const g = ctx.createRadialGradient(l.x, l.y, 2, l.x, l.y, l.w * 1.8);
      g.addColorStop(0, "rgba(255,200,120,0.5)"); g.addColorStop(1, "rgba(255,200,120,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(l.x, l.y, l.w * 1.8, 0, Math.PI * 2); ctx.fill();
      const body = ctx.createLinearGradient(0, l.y - h/2, 0, l.y + h/2);
      body.addColorStop(0, "#ffd98f"); body.addColorStop(0.6, "#ff9d5c"); body.addColorStop(1, "#e2653f");
      ctx.fillStyle = body; roundRect(ctx, l.x - l.w/2, l.y - h/2, l.w, h, l.w * 0.3); ctx.fill();
      ctx.globalAlpha = l.a * 0.85; ctx.fillStyle = "#ffeccf"; ctx.font = "300 12px Outfit, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(l.msg, l.x, l.y + h/2 + 20);
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  onVisible(cv, v => (running = v));
  draw();
})();

/* ── NIGHT SKY ────────────────────────────────────────────────────── */
(() => {
  const stage = $("#nightsky-stage"), reveal = $("#nightsky-reveal");
  const TOTAL = 20;
  for (let i = 0; i < TOTAL; i++) {
    const special = i % 5 === 4;
    const b = document.createElement("button");
    b.className = "sky-star" + (special ? " sky-star--special" : "");
    b.style.left = rand(4, 96) + "%"; b.style.top = rand(6, 92) + "%";
    b.innerHTML = `<span class="sky-star__core" style="--size:${special ? rand(8,11) : rand(4,8)}px;--tw:${rand(1.8,4)}s"></span>`;
    b.addEventListener("click", e => {
      reveal.textContent = special ? "⭐ " + pick(DATA.starSurprises) : "✦ " + DATA.starReasons[i % DATA.starReasons.length];
      reveal.classList.add("is-visible");
      sound.sfx("chime");
      clearTimeout(reveal._t);
      reveal._t = setTimeout(() => reveal.classList.remove("is-visible"), 4000);
      burstHearts(e.clientX, e.clientY, special ? 12 : 6, special ? ["⭐","✨"] : ["✨","❤"]);
    });
    stage.appendChild(b);
  }
})();

/* ── HIDDEN EASTER EGGS ───────────────────────────────────────────── */
(() => {
  let buffer = "";
  const toast = document.createElement("div"); toast.className = "egg-toast"; document.body.appendChild(toast);
  function say(msg) {
    toast.textContent = msg; toast.classList.add("is-visible");
    clearTimeout(toast._t); toast._t = setTimeout(() => toast.classList.remove("is-visible"), 3000);
  }
  addEventListener("keydown", e => {
    if (e.key.length !== 1) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-10);
    if (buffer.endsWith("laiba")) { say("✨ the secret word — for the secret keeper"); sound.sfx("chime"); burstHearts(innerWidth/2, innerHeight/2, 18); buffer = ""; }
    else if (buffer.endsWith("forever")) { say("🎆 forever unlocked"); sound.sfx("chime");
      for (let i = 0; i < 4; i++) setTimeout(() => burstHearts(rand(innerWidth*0.2,innerWidth*0.8), rand(innerHeight*0.2,innerHeight*0.6), 16, ["🎆","✨","❤"]), i*260);
      buffer = ""; }
    else if (buffer.endsWith("love")) { document.body.classList.toggle("mode-love"); say("💗 the world just turned a little pinker"); sound.sfx("pop"); buffer = ""; }
  });
})();

/* ── FINALE ───────────────────────────────────────────────────────── */
(() => {
  const box = $("#finale-text");
  const LINES = [["Laiba…", true], ["I Love You", false], ["In Every Language", false],
    ["But More Than Any Language…", false], ["You Mean Everything To Me.", false],
    ["❤️ Forever & Always ❤️", false], ["Thank you for being my favorite person.", true]];
  const els = LINES.map(([t, hand]) => {
    const d = document.createElement("div");
    d.className = "finale__line" + (hand ? " finale__line--hand" : "");
    d.textContent = t; box.appendChild(d); return d;
  });
  if (hasGSAP) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: "#finale", start: "top top", end: "bottom bottom", scrub: 0.6 } });
    els.forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" });
      if (i < els.length - 1) tl.to(el, { opacity: 0, scale: 1.05, duration: 0.7, ease: "power2.in" }, "+=0.5");
    });
  } else els.forEach(el => el.style.opacity = 1);

  const cv = $("#finale-canvas"), ctx = cv.getContext("2d");
  let running = false, rockets = [], sparks = [], confettiFired = false;
  function resize() { cv.width = cv.clientWidth; cv.height = cv.clientHeight; }
  resize(); addEventListener("resize", resize);
  if (hasGSAP) {
    ScrollTrigger.create({ trigger: "#finale", start: "top 80%", end: "bottom top", onToggle: s => running = s.isActive });
    ScrollTrigger.create({ trigger: "#finale", start: "80% bottom", onEnter: () => {
      if (confettiFired) return; confettiFired = true;
      for (let i = 0; i < 3; i++) setTimeout(() => burstHearts(rand(innerWidth*0.2,innerWidth*0.8), rand(innerHeight*0.2,innerHeight*0.5), 20, ["🎉","❤","✨"]), i*250);
    }});
  }
  let launchTimer = 0;
  function launch() { rockets.push({ x: rand(cv.width*0.2, cv.width*0.8), y: cv.height + 10, vy: rand(-8.5,-6.5), hue: pick([330,45,275]) }); }
  function explode(r) {
    const n = RM ? 16 : 40;
    for (let i = 0; i < n; i++) { const a = rand(0, Math.PI*2), sp = rand(1,4.4);
      sparks.push({ x: r.x, y: r.y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, a: 1, hue: r.hue }); }
  }
  (function draw() {
    requestAnimationFrame(draw);
    if (!running) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    launchTimer--;
    if (launchTimer <= 0 && !RM) { launchTimer = rand(40, 80); launch(); }
    rockets.forEach((r, i) => {
      r.y += r.vy; r.vy += 0.08;
      ctx.beginPath(); ctx.arc(r.x, r.y, 2, 0, Math.PI*2); ctx.fillStyle = `hsl(${r.hue} 90% 75%)`; ctx.fill();
      if (r.vy > -1) { explode(r); rockets.splice(i, 1); }
    });
    sparks.forEach((s, i) => {
      s.x += s.vx; s.y += s.vy; s.vy += 0.03; s.a -= 0.014;
      if (s.a <= 0) return sparks.splice(i, 1);
      ctx.globalAlpha = s.a; ctx.beginPath(); ctx.arc(s.x, s.y, 1.8, 0, Math.PI*2);
      ctx.fillStyle = `hsl(${s.hue} 95% 72%)`; ctx.fill();
    });
    ctx.globalAlpha = 1;
  })();
})();

})();

/* ═══════════════════════════════════════════════════════════════
   FOR LAIBA ❤️ — script.js
   One long love letter, written in JavaScript.
   Sections:
     01 utils          06 hero & story      11 globe (Three.js)
     02 ambient bg     07 reasons           12 voice playback
     03 loader         08 counter           13 Laiba Mode
     04 music engine   09 timeline          14 letter / tree / lanterns
     05 cursor         10 languages         15 night sky / eggs / finale
   ═══════════════════════════════════════════════════════════════ */

(() => {
"use strict";

/* ── 01 · UTILS ─────────────────────────────────────────────── */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE_POINTER = window.matchMedia("(pointer: fine)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

gsap.registerPlugin(ScrollTrigger);

/* Split a heading into masked words for reveal animations */
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words
    .map(w => `<span class="split-word"><span>${w}</span></span>`)
    .join(" ");
  return $$(".split-word > span", el);
}

/* Observe visibility — used to pause canvases & the globe offscreen */
function onVisible(el, cb) {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => cb(e.isIntersecting)),
    { threshold: 0.05 }
  );
  io.observe(el);
}

/* ── 02 · AMBIENT BACKGROUND (stars · fireflies · hearts) ───── */
const ambient = (() => {
  const cv = $("#ambient-canvas");
  const ctx = cv.getContext("2d");
  let W, H, running = true, parts = [];

  function resize() {
    W = cv.width = innerWidth;
    H = cv.height = innerHeight;
  }
  resize();
  addEventListener("resize", resize);

  function make(kind) {
    return {
      kind,
      x: rand(0, W), y: kind === "heart" ? H + 20 : rand(0, H),
      r: kind === "firefly" ? rand(1.4, 2.6) : rand(0.8, 1.8),
      a: rand(0.15, 0.8), da: rand(0.004, 0.012) * (Math.random() < 0.5 ? -1 : 1),
      vx: rand(-0.15, 0.15), vy: kind === "heart" ? rand(-0.5, -0.25) : rand(-0.06, 0.06),
      hue: kind === "firefly" ? "245,200,107" : kind === "heart" ? "255,94,168" : "255,255,255",
      wob: rand(0, Math.PI * 2)
    };
  }

  const N = RM ? 0 : 60;
  for (let i = 0; i < N; i++) parts.push(make(Math.random() < 0.3 ? "firefly" : "star"));

  function tick() {
    if (!running) return requestAnimationFrame(tick);
    ctx.clearRect(0, 0, W, H);
    // occasionally release a floating heart
    if (!RM && Math.random() < 0.008 && parts.length < N + 8) parts.push(make("heart"));

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.wob += 0.01;
      p.x += p.vx + Math.sin(p.wob) * 0.2;
      p.y += p.vy;
      p.a += p.da;
      if (p.a > 0.85 || p.a < 0.1) p.da *= -1;
      if (p.y < -30 && p.kind === "heart") { parts.splice(i, 1); continue; }
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      if (p.y < -20 && p.kind !== "heart") p.y = H + 20;

      if (p.kind === "heart") {
        ctx.globalAlpha = clamp(p.a, 0, 0.55);
        ctx.font = "12px serif";
        ctx.fillStyle = "rgb(255,94,168)";
        ctx.fillText("❤", p.x, p.y);
        ctx.globalAlpha = 1;
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${clamp(p.a, 0, 0.8)})`;
        ctx.shadowColor = `rgba(${p.hue},0.9)`;
        ctx.shadowBlur = p.kind === "firefly" ? 10 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
  document.addEventListener("visibilitychange", () => (running = !document.hidden));
  return {};
})();

/* ── 03 · LOADING SCREEN ────────────────────────────────────── */
(() => {
  const loader = $("#loader");
  const ring = $(".loader__ring-fg");
  const starsBox = $(".loader__stars");
  const heartsBox = $(".loader__hearts");

  for (let i = 0; i < 40; i++) {
    const s = document.createElement("span");
    s.className = "lstar";
    const sz = rand(1, 3);
    s.style.cssText = `left:${rand(0, 100)}%;top:${rand(0, 100)}%;width:${sz}px;height:${sz}px;animation-delay:${rand(0, 2.4)}s`;
    starsBox.appendChild(s);
  }
  for (let i = 0; i < 14; i++) {
    const h = document.createElement("span");
    h.className = "lheart";
    h.textContent = pick(["❤", "💗", "💕", "🌸", "✨"]);
    h.style.cssText = `left:${rand(2, 96)}%;font-size:${rand(12, 26)}px;animation-duration:${rand(5, 9)}s;animation-delay:${rand(0, 4)}s`;
    heartsBox.appendChild(h);
  }

  const DURATION = RM ? 900 : 4500;
  const t0 = performance.now();
  const CIRC = 2 * Math.PI * 52;

  (function progress(now) {
    const p = clamp((now - t0) / DURATION, 0, 1);
    ring.style.strokeDashoffset = CIRC * (1 - p);
    if (p < 1) requestAnimationFrame(progress);
    else finish();
  })(t0);

  function finish() {
    loader.classList.add("is-done");
    $("#music-dock").classList.add("is-visible");
    gsap.to("#experience", { opacity: 1, duration: 1.4, ease: "power2.out",
      onComplete: () => ScrollTrigger.refresh() });
    setTimeout(() => loader.remove(), 1600);
  }
})();

/* ── 04 · MUSIC ENGINE (generative soft piano, Web Audio) ──── */
const music = (() => {
  let ctx = null, master, wet, started = false, muted = false, timer = null;
  const btn = $("#music-toggle"), vol = $("#music-volume");
  let volume = 0.55;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = volume;
    // gentle echo for a dreamy room
    const delay = ctx.createDelay(1.2);
    delay.delayTime.value = 0.42;
    const fb = ctx.createGain(); fb.gain.value = 0.32;
    wet = ctx.createGain(); wet.gain.value = 0.35;
    delay.connect(fb); fb.connect(delay);
    master.connect(ctx.destination);
    master.connect(delay); delay.connect(wet); wet.connect(ctx.destination);
  }

  /* one soft piano-ish note */
  function note(freq, t, dur = 2.4, gain = 0.16) {
    const o1 = ctx.createOscillator(); o1.type = "triangle"; o1.frequency.value = freq;
    const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = freq * 2; // shimmer
    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1800;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o1.connect(g); o2.connect(g); g.connect(lp); lp.connect(master);
    o1.start(t); o2.start(t);
    o1.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
  }

  /* dreamy chord loop: Fmaj7 → Am7 → Dm7 → Bbmaj7 feel, pentatonic sprinkles */
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
      // soft bass
      note(chord[0] / 2, nextTime, 3.6, 0.10);
      // slow arpeggio
      chord.forEach((f, i) => note(f, nextTime + i * 0.55 + rand(0, 0.05), 2.6, 0.12));
      // one high sparkle
      if (Math.random() < 0.7) note(pick(chord) * 2, nextTime + rand(1.2, 2.2), 2.2, 0.05);
      nextTime += 3.2;
      chordIdx++;
    }
  }

  function start() {
    init();
    if (ctx.state === "suspended") ctx.resume();
    if (started) return;
    started = true;
    nextTime = ctx.currentTime + 0.1;
    timer = setInterval(scheduler, 250);
    btn.classList.add("is-playing");
    btn.setAttribute("aria-label", "Mute music");
  }

  function toggle() {
    if (!started) { start(); muted = false; }
    else {
      muted = !muted;
      master.gain.linearRampToValueAtTime(muted ? 0.0001 : volume, ctx.currentTime + 0.4);
    }
    btn.classList.toggle("is-muted", muted);
    btn.classList.toggle("is-playing", !muted);
    btn.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
  }

  btn.addEventListener("click", toggle);
  vol.addEventListener("input", () => {
    volume = vol.value / 100;
    if (ctx && !muted) master.gain.linearRampToValueAtTime(Math.max(volume, 0.0001), ctx.currentTime + 0.15);
  });

  /* autoplay on the first real interaction anywhere */
  const kick = () => { if (!started) start(); removeEventListener("pointerdown", kick); };
  addEventListener("pointerdown", kick);

  /* cute two-note blip (chapter 2 notification) */
  function blip() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    note(880, t, 0.5, 0.14);
    note(1174.66, t + 0.12, 0.7, 0.12);
  }

  /* mode change for Laiba Mode — slower, warmer */
  function dreamMode(onOff) {
    if (!ctx) return;
    wet.gain.linearRampToValueAtTime(onOff ? 0.7 : 0.35, ctx.currentTime + 1.5);
  }

  return { blip, dreamMode, start };
})();

/* ── 05 · CUSTOM CURSOR (desktop only) ──────────────────────── */
(() => {
  if (!FINE_POINTER || RM) return;
  document.body.classList.add("cursor-active");
  const cur = $("#cursor");
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  let lastTrail = 0;

  addEventListener("pointermove", e => {
    mx = e.clientX; my = e.clientY;
    const now = performance.now();
    if (now - lastTrail > 70) {
      lastTrail = now;
      // heart trail
      const t = document.createElement("span");
      t.className = "cursor-trail";
      t.textContent = "❤";
      t.style.left = mx + rand(-6, 6) + "px";
      t.style.top = my + rand(-4, 4) + "px";
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 850);
      // sparkle
      if (Math.random() < 0.5) {
        const s = document.createElement("span");
        s.className = "cursor-sparkle";
        s.style.left = mx + rand(-12, 12) + "px";
        s.style.top = my + rand(-12, 12) + "px";
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 950);
      }
    }
    const hoverable = e.target.closest("button,a,.reason-card,.leaf,.sky-star,.envelope,input");
    cur.classList.toggle("is-hovering", !!hoverable);
  });

  (function follow() {
    cx += (mx - cx) * 0.28;
    cy += (my - cy) * 0.28;
    cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(follow);
  })();
})();

/* click ripple + heart explosion, anywhere */
addEventListener("pointerdown", e => {
  const r = document.createElement("span");
  r.className = "click-ripple";
  r.style.left = e.clientX + "px";
  r.style.top = e.clientY + "px";
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 750);
  burstHearts(e.clientX, e.clientY, RM ? 4 : 10);
});

function burstHearts(x, y, n = 10, chars = ["❤", "💗", "💕", "✨"]) {
  for (let i = 0; i < n; i++) {
    const h = document.createElement("span");
    h.className = "burst-heart";
    h.textContent = pick(chars);
    h.style.left = x + "px";
    h.style.top = y + "px";
    h.style.fontSize = rand(12, 26) + "px";
    document.body.appendChild(h);
    const ang = rand(0, Math.PI * 2), dist = rand(50, 150);
    gsap.to(h, {
      x: Math.cos(ang) * dist,
      y: Math.sin(ang) * dist - rand(20, 80),
      rotation: rand(-140, 140),
      opacity: 0, scale: rand(0.3, 0.7),
      duration: rand(0.8, 1.5), ease: "power2.out",
      onComplete: () => h.remove()
    });
  }
}

/* ── 06 · SMOOTH SCROLL + HERO + STORY ──────────────────────── */
const lenis = new Lenis({ lerp: 0.09, smoothWheel: !RM });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

/* Hero petals */
(() => {
  const box = $(".hero__petals");
  const n = RM ? 0 : 16;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = pick(["🌸", "🌷", "💮", "🌺"]);
    p.style.cssText = `left:${rand(0, 100)}%;font-size:${rand(14, 30)}px;animation-duration:${rand(9, 17)}s;animation-delay:${rand(-14, 0)}s;`;
    box.appendChild(p);
  }
})();

/* Hero parallax (mouse depth) */
(() => {
  if (RM || !FINE_POINTER) return;
  const scene = $("[data-parallax-scene]");
  const layers = $$("[data-depth]", scene);
  addEventListener("pointermove", e => {
    const dx = (e.clientX / innerWidth - 0.5), dy = (e.clientY / innerHeight - 0.5);
    layers.forEach(l => {
      const d = parseFloat(l.dataset.depth);
      gsap.to(l, { x: dx * 40 * d, y: dy * 26 * d, duration: 0.9, ease: "power2.out" });
    });
  });
})();

/* Split-word reveals for every [data-split] + section heads */
$$("[data-split], .section-head__title").forEach(el => {
  const spans = splitWords(el);
  gsap.to(spans, {
    y: 0, duration: 1, ease: "power4.out", stagger: 0.055,
    scrollTrigger: { trigger: el, start: "top 86%" }
  });
});

/* Chapter 1 — sunrise: sun rises, flowers bloom, birds fly */
(() => {
  const tl = gsap.timeline({ scrollTrigger: { trigger: "#ch1", start: "top 65%" } });
  tl.from(".sunrise__sun", { y: 120, opacity: 0, duration: 1.6, ease: "power2.out" })
    .to(".flower", { scale: 1, y: 0, duration: 0.9, ease: "back.out(2.2)", stagger: 0.14 }, "-=0.9")
    .to(".bird", {
      opacity: 1, duration: 0.4, stagger: 0.25,
      onComplete: () => {
        $$(".bird").forEach((b, i) => {
          b.style.left = "-8%"; b.style.top = 12 + i * 12 + "%";
          gsap.to(b, { left: "108%", y: -20 - i * 8, duration: rand(9, 13), repeat: -1, ease: "none", delay: i * 2.4 });
        });
      }
    }, "-=0.6");
})();

/* Chapter 2 — notification drops in with a cute sound */
ScrollTrigger.create({
  trigger: "#ch2", start: "top 60%",
  onEnter: () => {
    gsap.to("#phone-notif", { y: 0, opacity: 1, duration: 0.9, ease: "elastic.out(1, 0.6)" });
    music.blip();
    gsap.fromTo(".phone", { scale: 0.98 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
  },
  once: true
});

/* Chapter 3 — clouds already drift via CSS; fade the scene in gently */
gsap.from("#ch3 .cloud", {
  opacity: 0, y: 30, duration: 1.6, stagger: 0.3, ease: "power2.out",
  scrollTrigger: { trigger: "#ch3", start: "top 70%" }
});

/* Chapter 4 — frames rise; gentle tilt on hover */
gsap.from(".frame", {
  opacity: 0, y: 60, duration: 1, stagger: 0.12, ease: "power3.out",
  scrollTrigger: { trigger: ".frames", start: "top 82%" }
});
if (FINE_POINTER && !RM) $$(".frame").forEach(f => {
  f.addEventListener("pointermove", e => {
    const r = f.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -10;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
    f.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    f.style.animationPlayState = "paused";
  });
  f.addEventListener("pointerleave", () => {
    f.style.transform = ""; f.style.animationPlayState = "";
  });
});

/* Chapter 5 — handwriting appears letter by letter, petals fall */
(() => {
  const el = $("#handwriting");
  el.innerHTML = el.textContent.split("").map(c =>
    c === " " ? " " : `<span class="hand-char">${c}</span>`).join("");
  gsap.to("#handwriting .hand-char", {
    opacity: 1, filter: "blur(0px)", duration: 0.5, stagger: 0.06, ease: "power2.out",
    scrollTrigger: { trigger: "#ch5", start: "top 60%" }
  });
  if (!RM) {
    const wrap = $("#ch5 .chapter__copy--center");
    for (let i = 0; i < 8; i++) {
      const p = document.createElement("span");
      p.className = "hand-petal";
      p.textContent = "🌸";
      p.style.cssText = `left:${rand(0, 100)}%;font-size:${rand(12, 22)}px;animation-delay:${rand(0, 8)}s;`;
      wrap.appendChild(p);
    }
  }
})();

/* ── 07 · 100 REASONS ───────────────────────────────────────── */
const REASONS = [
"I love your smile.","I love your kindness.","I love how you make ordinary days special.",
"I love your laugh.","I love your eyes.","I love the way you say my name.",
"I love how safe you feel.","I love your voice on a tired day.","I love your good-morning texts.",
"I love how you notice small things.","I love your patience with me.","I love your dreams, and how big they are.",
"I love how you care for people.","I love your honesty.","I love the way you scrunch your nose.",
"I love your late-night thoughts.","I love how you forgive.","I love your courage.",
"I love the way you listen.","I love your silly jokes.","I love your serious face when you focus.",
"I love how you celebrate tiny wins.","I love your taste in everything.","I love your warmth.",
"I love how you remember details.","I love that you check on me.","I love your hugs, even imagined ones.",
"I love how time disappears with you.","I love your stubbornness (a little).","I love your soft heart.",
"I love how you make me want to be better.","I love your excitement over small things.","I love your calm in my chaos.",
"I love how you handle bad days.","I love the future I picture with you.","I love your gentle teasing.",
"I love how your messages fix my mood.","I love your curiosity.","I love the sound of your happiness.",
"I love how real you are.","I love your loyalty.","I love your comfort in silence.",
"I love the way you love.","I love your strength you don't even see.","I love how you make strangers smile.",
"I love your sleepy voice.","I love your favorite-song energy.","I love how you defend the people you love.",
"I love that you chose me.","I love your grace when things go wrong.","I love your randomness.",
"I love your focus when you talk about your passions.","I love your version of every story.","I love your standards.",
"I love how you never give up on us.","I love your little rituals.","I love your handwriting.",
"I love how weekends feel with you in them.","I love your reactions to surprises.","I love your empathy.",
"I love that you laugh at my worst jokes.","I love how you say 'I'm fine' and I know everything anyway.",
"I love your ambition.","I love the peace you bring.","I love your photos, all of them.",
"I love how you turn nothing into a memory.","I love your comfort food choices.","I love your overthinking, because it means you care.",
"I love how the world softens around you.","I love your first-of-the-month optimism.","I love your playlists.",
"I love your bravery in being yourself.","I love your timing.","I love how you appear in my plans without trying.",
"I love your questions.","I love your answers.","I love the way you get excited about food.",
"I love your faith in good things.","I love the space you hold for me.","I love your midnight energy.",
"I love your morning grumpiness (it's cute).","I love your ideas.","I love how you make waiting feel okay.",
"I love your presence, even through a screen.","I love your standards for kindness.","I love your happy dance.",
"I love how you remember what I forget.","I love your gentleness with yourself, when you allow it.",
"I love your fire.","I love your softness.","I love how home is a person now.",
"I love the story of us so far.","I love the chapters we haven't written.","I love your tomorrow, and the one after.",
"I love that no distance changes this.","I love you on your best days.","I love you on your worst days.",
"I love you quietly.","I love you loudly.","I love you. That's the whole reason."
];

(() => {
  const field = $("#reasons-field");
  const overlay = $("#reason-overlay");
  const frag = document.createDocumentFragment();
  REASONS.forEach((r, i) => {
    const b = document.createElement("button");
    b.className = "reason-card";
    b.style.setProperty("--float-delay", `-${rand(0, 5)}s`);
    b.innerHTML = `<span class="reason-card__num">${String(i + 1).padStart(2, "0")}</span>${r}`;
    b.addEventListener("click", e => {
      $("#reason-overlay-num").textContent = `reason ${i + 1} of 100`;
      $("#reason-overlay-text").textContent = r;
      overlay.classList.add("is-open");
      burstHearts(e.clientX, e.clientY, 8);
    });
    frag.appendChild(b);
  });
  field.appendChild(frag);
  gsap.from(".reason-card", {
    opacity: 0, y: 26, scale: 0.9, duration: 0.6, ease: "power2.out",
    stagger: { each: 0.012, from: "random" },
    scrollTrigger: { trigger: field, start: "top 85%" }
  });
  const close = () => overlay.classList.remove("is-open");
  $("#reason-overlay-close").addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  addEventListener("keydown", e => { if (e.key === "Escape") close(); });
})();

/* ── 08 · LOVE COUNTER → ∞ ──────────────────────────────────── */
(() => {
  const val = $("#counter-value");
  const foot = $("#counter-foot");
  const cv = $("#counter-canvas");
  const ctx = cv.getContext("2d");
  let played = false;

  ScrollTrigger.create({
    trigger: "#counter-section", start: "top 55%",
    onEnter: () => { if (!played) { played = true; run(); } }
  });

  function run() {
    const counter = { n: 1 };
    gsap.to(counter, {
      n: 100, duration: 3.2, ease: "power2.in",
      onUpdate: () => (val.textContent = Math.floor(counter.n)),
      onComplete: () => {
        // blur past countable numbers…
        let spins = 0;
        const spin = setInterval(() => {
          val.textContent = ["999", "9999", "10⁶", "10⁹", "10¹²"][spins] || "…";
          if (++spins > 5) {
            clearInterval(spin);
            val.textContent = "∞";
            val.classList.add("is-infinity");
            foot.textContent = "some numbers were never meant to end.";
            shatter();
          }
        }, 260);
      }
    });
  }

  /* the counter "breaks apart" into glowing hearts */
  function shatter() {
    const rect = val.getBoundingClientRect();
    const secRect = $("#counter-section").getBoundingClientRect();
    cv.width = secRect.width; cv.height = secRect.height;
    const cx0 = rect.left - secRect.left + rect.width / 2;
    const cy0 = rect.top - secRect.top + rect.height / 2;
    const hearts = Array.from({ length: RM ? 12 : 60 }, () => ({
      x: cx0 + rand(-rect.width / 3, rect.width / 3),
      y: cy0 + rand(-rect.height / 3, rect.height / 3),
      vx: rand(-2.4, 2.4), vy: rand(-4.5, -1), g: 0.05,
      s: rand(8, 22), a: 1, spin: rand(-0.1, 0.1), rot: rand(0, 6)
    }));
    gsap.fromTo(val, { scale: 1.25 }, { scale: 1, duration: 0.6, ease: "elastic.out(1,0.4)" });
    (function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      let alive = false;
      hearts.forEach(h => {
        if (h.a <= 0) return;
        alive = true;
        h.x += h.vx; h.y += h.vy; h.vy += h.g; h.a -= 0.008; h.rot += h.spin;
        ctx.save();
        ctx.translate(h.x, h.y); ctx.rotate(h.rot);
        ctx.globalAlpha = clamp(h.a, 0, 1);
        ctx.font = `${h.s}px serif`;
        ctx.shadowColor = "rgba(255,94,168,0.9)"; ctx.shadowBlur = 14;
        ctx.fillText("❤", 0, 0);
        ctx.restore();
      });
      if (alive) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, cv.width, cv.height);
    })();
  }
})();

/* ── 09 · TIMELINE ──────────────────────────────────────────── */
gsap.to(".timeline__line-fill", {
  height: "100%", ease: "none",
  scrollTrigger: { trigger: ".timeline__track", start: "top 70%", end: "bottom 60%", scrub: 0.6 }
});
$$(".milestone").forEach(m => {
  const tl = gsap.timeline({ scrollTrigger: { trigger: m, start: "top 78%" } });
  tl.from($(".milestone__dot", m), { scale: 0, rotation: -180, duration: 0.7, ease: "back.out(2.4)" })
    .from($(".milestone__card", m), { opacity: 0, x: 50, duration: 0.8, ease: "power3.out" }, "-=0.35");
});

/* ── 10 · LANGUAGES ─────────────────────────────────────────── */
const LANGS = [
["English","I Love You"],["Urdu","میں تم سے محبت کرتا ہوں"],["Arabic","أحبك"],
["French","Je t’aime"],["German","Ich liebe dich"],["Italian","Ti amo"],
["Spanish","Te amo"],["Portuguese","Eu te amo"],["Russian","Я тебя люблю"],
["Turkish","Seni Seviyorum"],["Hindi","मैं तुमसे प्यार करता हूँ"],["Japanese","愛してる"],
["Chinese","我爱你"],["Korean","사랑해"],["Bengali","আমি তোমাকে ভালোবাসি"],
["Greek","Σ’ αγαπώ"],["Dutch","Ik hou van jou"],["Swedish","Jag älskar dig"],
["Norwegian","Jeg elsker deg"],["Finnish","Minä rakastan sinua"]
];
(() => {
  const grid = $("#langs-grid");
  LANGS.forEach(([name, phrase]) => {
    const d = document.createElement("div");
    d.className = "lang-tile";
    d.innerHTML = `<div class="lang-tile__name">${name}</div><div class="lang-tile__phrase">${phrase}</div>`;
    grid.appendChild(d);
  });
  gsap.from(".lang-tile", {
    opacity: 0, y: 34, rotationX: -30, transformOrigin: "top center",
    duration: 0.8, ease: "power3.out", stagger: { each: 0.05, from: "start" },
    scrollTrigger: { trigger: grid, start: "top 85%" }
  });
})();

/* ── 11 · THE LOVE GLOBE (Three.js) ─────────────────────────── */
const COUNTRIES = [
["Pakistan","🇵🇰",30.4,69.3,"Urdu","میں تم سے محبت کرتا ہوں","main tum se mohabbat karta hoon","ur-PK"],
["United States","🇺🇸",39.8,-98.6,"English","I love you","ai · luv · yoo","en-US"],
["United Kingdom","🇬🇧",54.0,-2.0,"English","I love you","ai · luv · yoo","en-GB"],
["France","🇫🇷",46.6,2.2,"French","Je t’aime","zhuh · tem","fr-FR"],
["Germany","🇩🇪",51.2,10.4,"German","Ich liebe dich","ikh · lee-buh · dikh","de-DE"],
["Italy","🇮🇹",42.8,12.5,"Italian","Ti amo","tee · ah-mo","it-IT"],
["Spain","🇪🇸",40.3,-3.7,"Spanish","Te amo","teh · ah-mo","es-ES"],
["Portugal","🇵🇹",39.6,-8.0,"Portuguese","Eu te amo","eh-oo · te · ah-moo","pt-PT"],
["Brazil","🇧🇷",-10.8,-52.9,"Portuguese","Eu te amo","eh-oo · chee · ah-moo","pt-BR"],
["Mexico","🇲🇽",23.9,-102.5,"Spanish","Te amo","teh · ah-mo","es-MX"],
["Turkey","🇹🇷",39.0,35.0,"Turkish","Seni seviyorum","seh-nee · seh-vee-yo-room","tr-TR"],
["Saudi Arabia","🇸🇦",24.0,45.0,"Arabic","أحبك","u-hib-bu-ka","ar-SA"],
["India","🇮🇳",22.4,79.0,"Hindi","मैं तुमसे प्यार करता हूँ","main tumse pyaar karta hoon","hi-IN"],
["Bangladesh","🇧🇩",23.7,90.3,"Bengali","আমি তোমাকে ভালোবাসি","ami tomake bhalobashi","bn-BD"],
["China","🇨🇳",35.5,103.9,"Chinese","我爱你","wǒ · ài · nǐ","zh-CN"],
["Japan","🇯🇵",36.5,138.0,"Japanese","愛してる","ai-shi-te-ru","ja-JP"],
["South Korea","🇰🇷",36.4,127.9,"Korean","사랑해","sa-rang-hae","ko-KR"],
["Thailand","🇹🇭",15.1,101.0,"Thai","ฉันรักคุณ","chan · rak · khun","th-TH"],
["Vietnam","🇻🇳",16.6,106.3,"Vietnamese","Anh yêu em","ang · yeu · em","vi-VN"],
["Malaysia","🇲🇾",3.8,109.7,"Malay","Saya cinta padamu","sa-ya · chin-ta · pa-da-mu","ms-MY"],
["Indonesia","🇮🇩",-2.2,117.4,"Indonesian","Aku cinta kamu","a-ku · chin-ta · ka-mu","id-ID"],
["Philippines","🇵🇭",12.9,121.8,"Filipino","Mahal kita","ma-hal · kee-ta","fil-PH"],
["Russia","🇷🇺",61.5,96.0,"Russian","Я тебя люблю","ya · teb-ya · lyub-lyu","ru-RU"],
["Ukraine","🇺🇦",49.0,31.4,"Ukrainian","Я тебе кохаю","ya · te-be · ko-kha-yu","uk-UA"],
["Iran","🇮🇷",32.6,54.3,"Persian","دوستت دارم","doo-set · da-ram","fa-IR"],
["Netherlands","🇳🇱",52.2,5.5,"Dutch","Ik hou van jou","ik · how · fan · yow","nl-NL"],
["Greece","🇬🇷",39.0,22.0,"Greek","Σ’ αγαπώ","s’a-ga-po","el-GR"],
["Norway","🇳🇴",61.0,9.0,"Norwegian","Jeg elsker deg","yai · el-sker · dai","nb-NO"],
["Sweden","🇸🇪",62.0,15.0,"Swedish","Jag älskar dig","yag · el-skar · day","sv-SE"],
["Finland","🇫🇮",64.0,26.0,"Finnish","Minä rakastan sinua","mee-na · ra-kas-tan · see-nua","fi-FI"],
["Poland","🇵🇱",52.0,19.4,"Polish","Kocham cię","ko-ham · chyeh","pl-PL"],
["Australia","🇦🇺",-25.0,134.0,"English","I love you","ai · luv · yoo","en-AU"],
["Canada","🇨🇦",56.0,-106.0,"English · French","I love you · Je t’aime","zhuh · tem","en-CA"],
["New Zealand","🇳🇿",-41.8,172.8,"Māori","Kei te aroha au i a koe","kay · te · a-ro-ha · ow","en-NZ"],
["South Africa","🇿🇦",-29.0,25.0,"Zulu","Ngiyakuthanda","ngee-ya-koo-tan-da","zu-ZA"],
["Egypt","🇪🇬",26.5,29.8,"Arabic","بحبك","ba-heb-bak","ar-EG"],
["Argentina","🇦🇷",-35.4,-65.2,"Spanish","Te amo","teh · ah-mo","es-AR"],
["Chile","🇨🇱",-35.7,-71.5,"Spanish","Te amo","teh · ah-mo","es-CL"],
["Colombia","🇨🇴",4.6,-74.1,"Spanish","Te amo","teh · ah-mo","es-CO"],
["Peru","🇵🇪",-9.2,-75.0,"Spanish","Te amo","teh · ah-mo","es-PE"],
["Nigeria","🇳🇬",9.6,8.0,"Yoruba","Mo nífẹ̀ẹ́ rẹ","mo · nee-feh · reh","en-NG"],
["Kenya","🇰🇪",0.2,37.9,"Swahili","Nakupenda","na-koo-pen-da","sw-KE"],
["Morocco","🇲🇦",31.8,-7.1,"Arabic","كنبغيك","kan-bghi-k","ar-MA"],
["Switzerland","🇨🇭",46.8,8.2,"German","Ich liebe dich","ikh · lee-buh · dikh","de-CH"],
["Austria","🇦🇹",47.6,14.1,"German","Ich liebe dich","ikh · lee-buh · dikh","de-AT"],
["Belgium","🇧🇪",50.6,4.7,"Dutch","Ik hou van jou","ik · how · fan · yow","nl-BE"],
["Denmark","🇩🇰",56.0,10.0,"Danish","Jeg elsker dig","yai · el-sker · dai","da-DK"],
["Ireland","🇮🇪",53.4,-8.2,"Irish","Tá grá agam duit","taw · graw · a-gum · ditch","ga-IE"],
["Iceland","🇮🇸",64.9,-19.0,"Icelandic","Ég elska þig","yeg · el-ska · thig","is-IS"],
["Czechia","🇨🇿",49.8,15.5,"Czech","Miluji tě","mi-lu-yi · tyeh","cs-CZ"],
["Romania","🇷🇴",45.9,25.0,"Romanian","Te iubesc","teh · yoo-besk","ro-RO"],
["Hungary","🇭🇺",47.2,19.5,"Hungarian","Szeretlek","seh-ret-lek","hu-HU"],
["Croatia","🇭🇷",45.1,15.2,"Croatian","Volim te","vo-leem · teh","hr-HR"],
["Bulgaria","🇧🇬",42.7,25.5,"Bulgarian","Обичам те","o-bee-cham · teh","bg-BG"],
["Singapore","🇸🇬",1.35,103.8,"English · Malay","I love you","ai · luv · yoo","en-SG"],
["Nepal","🇳🇵",28.4,84.1,"Nepali","म तिमीलाई माया गर्छु","ma · timilai · maya · garchu","ne-NP"],
["Sri Lanka","🇱🇰",7.9,80.7,"Sinhala","මම ඔයාට ආදරෙයි","ma-ma · o-ya-ta · a-da-re-yi","si-LK"],
["United Arab Emirates","🇦🇪",24.0,54.0,"Arabic","أحبك","u-hib-bu-ki","ar-AE"],
["Qatar","🇶🇦",25.3,51.2,"Arabic","أحبك","u-hib-bu-ki","ar-QA"],
["Oman","🇴🇲",21.5,55.9,"Arabic","أحبك","u-hib-bu-ki","ar-OM"],
["Kazakhstan","🇰🇿",48.0,66.9,"Kazakh","Мен сені сүйемін","men · se-ni · su-ye-min","kk-KZ"],
["Uzbekistan","🇺🇿",41.4,64.6,"Uzbek","Men seni sevaman","men · se-ni · se-va-man","uz-UZ"],
["Georgia","🇬🇪",42.3,43.4,"Georgian","მიყვარხარ","mi-qvar-khar","ka-GE"],
["Ethiopia","🇪🇹",9.1,40.5,"Amharic","አፈቅርሻለሁ","a-fe-kir-sha-le-hu","am-ET"]
];

const globe = (() => {
  const container = $("#globe-container");
  const tooltip = $("#globe-tooltip");
  const R = 100;
  const visited = new Set();
  let renderer, scene, camera, earthGroup, markers = [], cloudMesh;
  let dragging = false, px = 0, py = 0, moved = 0;
  let autoSpin = 0.0012, targetDist = 300, dist = 300;
  let raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2(-2, -2);
  let hovered = null, inView = false, laibaRunning = false;
  let shootTimer = 0;

  function latLonToVec3(lat, lon, r = R) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(theta)
    );
  }

  /* Procedural fallback texture: dreamy rose-tinted planet */
  function fallbackTexture() {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 512;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "#2a1044"); grad.addColorStop(0.5, "#471a5e"); grad.addColorStop(1, "#2a1044");
    g.fillStyle = grad; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 900; i++) {
      g.beginPath();
      g.arc(rand(0, 1024), rand(0, 512), rand(0.4, 2.4), 0, Math.PI * 2);
      g.fillStyle = `rgba(255,${Math.floor(rand(140, 210))},${Math.floor(rand(190, 235))},${rand(0.06, 0.4)})`;
      g.fill();
    }
    const t = new THREE.CanvasTexture(c);
    return t;
  }

  function init() {
    const w = container.clientWidth, h = container.clientHeight;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, w / h, 1, 2000);
    camera.position.set(0, 30, dist);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const sun = new THREE.DirectionalLight(0xfff0e0, 1.1);
    sun.position.set(300, 120, 200);
    scene.add(sun);
    // slow day/night: the sun orbits gently
    gsap.to(sun.position, { x: -300, z: -200, duration: 90, repeat: -1, yoyo: true, ease: "sine.inOut" });

    earthGroup = new THREE.Group();
    scene.add(earthGroup);

    /* Earth — try real night-lights texture, fall back to dream planet */
    const mat = new THREE.MeshPhongMaterial({
      map: fallbackTexture(), shininess: 8,
      emissive: new THREE.Color(0x1b0a2a), emissiveIntensity: 0.6
    });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 64), mat);
    earthGroup.add(earth);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      "https://unpkg.com/three-globe@2.31.0/example/img/earth-night.jpg",
      tex => { mat.map = tex; mat.emissiveIntensity = 0.25; mat.needsUpdate = true; },
      undefined, () => {} /* keep fallback silently */
    );
    loader.load(
      "https://unpkg.com/three-globe@2.31.0/example/img/clouds.png",
      tex => {
        cloudMesh = new THREE.Mesh(
          new THREE.SphereGeometry(R * 1.02, 48, 48),
          new THREE.MeshLambertMaterial({ map: tex, transparent: true, opacity: 0.35, depthWrite: false })
        );
        earthGroup.add(cloudMesh);
      },
      undefined, () => {}
    );

    /* Atmosphere glow (backside additive) */
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.14, 48, 48),
      new THREE.ShaderMaterial({
        transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
        uniforms: { c: { value: new THREE.Color(0xff5ea8) } },
        vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal);
          gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 c; varying vec3 vN;
          void main(){ float i = pow(0.72 - dot(vN, vec3(0.,0.,1.)), 2.6);
          gl_FragColor = vec4(c, 1.0) * i; }`
      })
    );
    scene.add(atmo);

    /* Stars */
    const starGeo = new THREE.BufferGeometry();
    const starN = RM ? 300 : 1400;
    const pos = new Float32Array(starN * 3);
    for (let i = 0; i < starN; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(rand(500, 900));
      pos.set([v.x, v.y, v.z], i * 3);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffe9f4, size: 1.6, sizeAttenuation: true, transparent: true, opacity: 0.85 })));

    /* Country markers */
    const markerGeo = new THREE.SphereGeometry(1.7, 12, 12);
    COUNTRIES.forEach((c, i) => {
      const m = new THREE.Mesh(
        markerGeo,
        new THREE.MeshBasicMaterial({ color: 0xff7cbb })
      );
      m.position.copy(latLonToVec3(c[2], c[3], R + 1.2));
      m.userData = { country: c, index: i, baseColor: 0xff7cbb };
      earthGroup.add(m);
      markers.push(m);
    });

    /* Orbiting satellite + tiny plane */
    const satOrbit = new THREE.Group(); satOrbit.rotation.z = 0.5; scene.add(satOrbit);
    const sat = new THREE.Mesh(new THREE.OctahedronGeometry(2.4), new THREE.MeshBasicMaterial({ color: 0xf5c86b }));
    sat.position.set(R * 1.55, 0, 0); satOrbit.add(sat);
    const planeOrbit = new THREE.Group(); planeOrbit.rotation.x = 1.1; scene.add(planeOrbit);
    const plane = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4.6, 6), new THREE.MeshBasicMaterial({ color: 0xffc8dd }));
    plane.rotation.z = -Math.PI / 2;
    plane.position.set(R * 1.28, 0, 0); planeOrbit.add(plane);

    /* interaction */
    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", e => { dragging = true; moved = 0; px = e.clientX; py = e.clientY; });
    addEventListener("pointerup", () => (dragging = false));
    dom.addEventListener("pointermove", e => {
      const rect = dom.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (dragging && !laibaRunning) {
        const dx = e.clientX - px, dy = e.clientY - py;
        moved += Math.abs(dx) + Math.abs(dy);
        earthGroup.rotation.y += dx * 0.005;
        earthGroup.rotation.x = clamp(earthGroup.rotation.x + dy * 0.0028, -0.7, 0.7);
        px = e.clientX; py = e.clientY;
      }
    });
    dom.addEventListener("wheel", e => {
      e.preventDefault();
      targetDist = clamp(targetDist + e.deltaY * 0.25, 170, 460);
    }, { passive: false });
    dom.addEventListener("click", () => {
      if (moved > 8 || laibaRunning) return;
      if (hovered) focusCountry(hovered);
    });
    /* pinch zoom (mobile) */
    let pinch0 = 0;
    dom.addEventListener("touchmove", e => {
      if (e.touches.length === 2) {
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY);
        if (pinch0) targetDist = clamp(targetDist - (d - pinch0) * 0.8, 170, 460);
        pinch0 = d;
      }
    }, { passive: true });
    dom.addEventListener("touchend", () => (pinch0 = 0));

    addEventListener("resize", () => {
      const w2 = container.clientWidth, h2 = container.clientHeight;
      camera.aspect = w2 / h2; camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    });

    onVisible(container, v => (inView = v));
    animate(satOrbit, planeOrbit);
  }

  function animate(satOrbit, planeOrbit) {
    let t = 0;
    renderer.setAnimationLoop(() => {
      if (!inView) return;
      t += 0.016;
      if (!dragging && !laibaRunning) earthGroup.rotation.y += autoSpin;
      if (cloudMesh) cloudMesh.rotation.y += 0.0004;
      satOrbit.rotation.y += 0.004;
      planeOrbit.rotation.y -= 0.0026;

      dist += (targetDist - dist) * 0.06;
      const dir = camera.position.clone().normalize();
      camera.position.copy(dir.multiplyScalar(dist));
      camera.lookAt(0, 0, 0);

      /* marker pulse + hover */
      markers.forEach((m, i) => {
        const base = visited.has(i) ? 1.25 : 1;
        const s = base + Math.sin(t * 2.6 + i) * 0.22;
        m.scale.setScalar(m === hovered ? s * 1.8 : s);
      });
      if (!laibaRunning) {
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(markers)[0];
        const m = hit ? hit.object : null;
        if (m !== hovered) {
          hovered = m;
          if (m) {
            tooltip.textContent = `${m.userData.country[1]} ${m.userData.country[0]}`;
            tooltip.classList.add("is-visible");
            renderer.domElement.style.cursor = "pointer";
          } else {
            tooltip.classList.remove("is-visible");
            renderer.domElement.style.cursor = "grab";
          }
        }
        if (hovered) {
          const p = hovered.getWorldPosition(new THREE.Vector3()).project(camera);
          const rect = renderer.domElement.getBoundingClientRect();
          tooltip.style.left = ((p.x + 1) / 2) * rect.width + "px";
          tooltip.style.top = ((-p.y + 1) / 2) * rect.height + "px";
        }
      }

      /* shooting stars: brief streak sprites */
      shootTimer -= 0.016;
      if (shootTimer <= 0 && !RM) { shootTimer = rand(3, 7); shootStar(); }

      renderer.render(scene, camera);
    });
  }

  function shootStar() {
    const from = new THREE.Vector3().randomDirection().multiplyScalar(650);
    const to = from.clone().add(new THREE.Vector3(rand(-300, 300), rand(-260, -80), rand(-300, 300)));
    const g = new THREE.BufferGeometry().setFromPoints([from, to]);
    const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }));
    scene.add(l);
    gsap.to(l.material, { opacity: 0, duration: 1.1, ease: "power2.out",
      onComplete: () => { scene.remove(l); g.dispose(); } });
  }

  /* zoom + swing the camera toward a country, open its card */
  function focusCountry(marker) {
    const c = marker.userData.country;
    const world = marker.getWorldPosition(new THREE.Vector3()).normalize();
    const targetPos = world.multiplyScalar(dist);
    gsap.to(camera.position, {
      x: targetPos.x, y: targetPos.y, z: targetPos.z,
      duration: 1.2, ease: "power3.inOut",
      onUpdate: () => camera.lookAt(0, 0, 0)
    });
    targetDist = clamp(dist * 0.78, 190, 460);

    $("#cc-flag").textContent = c[1];
    $("#cc-name").textContent = c[0];
    $("#cc-lang").textContent = c[4];
    $("#cc-phrase").textContent = c[5];
    $("#cc-pron").textContent = "“" + c[6] + "”";
    $("#country-card").classList.add("is-open");
    $("#cc-listen").onclick = () => speakLove(c[5], c[7]);

    if (!visited.has(marker.userData.index)) {
      visited.add(marker.userData.index);
      marker.material = marker.material.clone();
      marker.material.color.set(0xf5c86b);
      $("#visited-count").textContent = visited.size;
      if (visited.size >= 5) $("#laiba-mode-btn").classList.add("is-visible");
    }
  }

  $("#country-card-close").addEventListener("click", () =>
    $("#country-card").classList.remove("is-open"));

  /* ── 13 · LAIBA MODE ── */
  async function laibaMode() {
    if (laibaRunning) return;
    laibaRunning = true;
    $("#country-card").classList.remove("is-open");
    tooltip.classList.remove("is-visible");
    $("#laiba-mode-btn").classList.remove("is-visible");
    music.dreamMode(true);
    const sub = $("#laiba-subtitle");
    const pkIndex = 0;
    const pk = markers[pkIndex];

    /* slow everything; face Pakistan */
    autoSpin = 0.0004;
    gsap.to(earthGroup.rotation, { x: 0, duration: 1.2 });
    const pkWorld = pk.getWorldPosition(new THREE.Vector3()).normalize().multiplyScalar(dist);
    await gsap.to(camera.position, {
      x: pkWorld.x, y: pkWorld.y, z: pkWorld.z, duration: 1.6, ease: "power2.inOut",
      onUpdate: () => camera.lookAt(0, 0, 0)
    }).then();

    /* Pakistan glows gold */
    pk.material = pk.material.clone();
    gsap.to(pk.scale, { x: 3, y: 3, z: 3, duration: 0.8, yoyo: true, repeat: 3 });
    pk.material.color.set(0xf5c86b);

    /* golden beams to every visited country, each speaking its language */
    const targets = [...visited].filter(i => i !== pkIndex);
    const pkLocal = latLonToVec3(COUNTRIES[0][2], COUNTRIES[0][3], R + 1.5);
    for (const i of targets) {
      const c = COUNTRIES[i];
      drawArc(pkLocal, latLonToVec3(c[2], c[3], R + 1.5));
      sub.textContent = `${c[1]}  ${c[5]}  —  “I love you”`;
      sub.classList.add("is-visible");
      speakLove(c[5], c[7]);
      await new Promise(res => setTimeout(res, 2600));
    }
    sub.textContent = "…and every path leads back to you, Laiba.";
    await new Promise(res => setTimeout(res, 2200));
    sub.classList.remove("is-visible");

    /* the globe dissolves into a giant glowing heart of stars */
    await heartFinale();
    music.dreamMode(false);
    laibaRunning = false;
    autoSpin = 0.0012;
    $("#laiba-mode-btn").classList.add("is-visible");
  }

  function drawArc(a, b) {
    const mid = a.clone().add(b).multiplyScalar(0.5).normalize()
      .multiplyScalar(R * (1.25 + a.distanceTo(b) / (R * 4)));
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const pts = curve.getPoints(60);
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    g.setDrawRange(0, 0);
    const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xf5c86b, transparent: true, opacity: 0.95 }));
    earthGroup.add(line);
    const o = { n: 0 };
    gsap.to(o, { n: 61, duration: 1.6, ease: "power2.out",
      onUpdate: () => g.setDrawRange(0, Math.floor(o.n)) });
    return line;
  }

  function heartFinale() {
    return new Promise(resolve => {
      /* heart-shaped particle cloud */
      const N = RM ? 400 : 1600;
      const geo = new THREE.BufferGeometry();
      const start = new Float32Array(N * 3), end = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const v = new THREE.Vector3().randomDirection().multiplyScalar(R);
        start.set([v.x, v.y, v.z], i * 3);
        const u = rand(0, Math.PI * 2), s = rand(0.75, 1.02) * 7.5;
        const hx = 16 * Math.pow(Math.sin(u), 3);
        const hy = 13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u);
        end.set([hx * s, hy * s, rand(-14, 14)], i * 3);
      }
      geo.setAttribute("position", new THREE.BufferAttribute(start.slice(), 3));
      const cloud = new THREE.Points(geo, new THREE.PointsMaterial({
        color: 0xff5ea8, size: 2.6, transparent: true, opacity: 0.95,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      scene.add(cloud);

      const state = { t: 0 };
      gsap.to(earthGroup.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 2.4, ease: "power3.in" });
      gsap.to(state, {
        t: 1, duration: 2.6, ease: "power2.inOut", delay: 0.6,
        onUpdate: () => {
          const p = geo.attributes.position.array;
          for (let i = 0; i < N * 3; i++) p[i] = start[i] + (end[i] - start[i]) * state.t;
          geo.attributes.position.needsUpdate = true;
        },
        onComplete: () => {
          gsap.to(cloud.rotation, { y: 0.35, duration: 3, yoyo: true, repeat: 1, ease: "sine.inOut" });
          setTimeout(() => {
            /* return: heart back to globe */
            gsap.to(state, {
              t: 0, duration: 2, ease: "power2.inOut",
              onUpdate: () => {
                const p = geo.attributes.position.array;
                for (let i = 0; i < N * 3; i++) p[i] = start[i] + (end[i] - start[i]) * state.t;
                geo.attributes.position.needsUpdate = true;
              },
              onComplete: () => {
                gsap.to(cloud.material, { opacity: 0, duration: 1, onComplete: () => scene.remove(cloud) });
                gsap.to(earthGroup.scale, { x: 1, y: 1, z: 1, duration: 1.6, ease: "power3.out" });
                resolve();
              }
            });
          }, 4200);
        }
      });
    });
  }

  $("#laiba-mode-btn").addEventListener("click", laibaMode);

  /* lazy init when scrolled near */
  const initOnce = new IntersectionObserver(es => {
    if (es.some(e => e.isIntersecting)) { init(); initOnce.disconnect(); }
  }, { rootMargin: "400px" });
  initOnce.observe(container);

  return {};
})();

/* ── 12 · VOICE PLAYBACK (Web Speech API) ───────────────────── */
let voices = [];
function loadVoices() { voices = speechSynthesis.getVoices(); }
if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}
function speakLove(text, lang) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel(); // stop previous speech first
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  // best-effort voice match: exact tag → base language → default
  const base = lang.split("-")[0];
  u.voice =
    voices.find(v => v.lang === lang) ||
    voices.find(v => v.lang && v.lang.startsWith(base)) ||
    null;
  u.rate = 0.88; u.pitch = 1.05; u.volume = 1;
  speechSynthesis.speak(u);
}

/* ── 14a · LOVE LETTER ──────────────────────────────────────── */
(() => {
  const env = $("#envelope");
  let open = false;
  function toggle() {
    open = !open;
    env.classList.toggle("is-open", open);
    if (open) {
      gsap.fromTo(".letter__line",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.35, delay: 1.2, ease: "power2.out" });
      burstHearts(innerWidth / 2, innerHeight / 2, 14, ["❤", "💌", "✨"]);
    }
  }
  env.addEventListener("click", toggle);
  env.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
})();

/* ── 14b · WISH TREE ────────────────────────────────────────── */
const WISHES = [
"I wish for a hundred more of your laughs.","I wish to be your calm on loud days.",
"I wish every airport ends with you.","I wish for slow mornings together.",
"I wish to learn your favorite recipes.","I wish for a bookshelf we both fill.",
"I wish to see every sunset city with you.","I wish your dreams come true first.",
"I wish to hold your hand through winters.","I wish our jokes never get old.",
"I wish for a home with your name in it.","I wish to dance badly with you, often.",
"I wish for rain, chai, and you.","I wish to grow old and still flirt with you.",
"I wish every 11:11 keeps working.","I wish for more time — always with you.",
"I wish to be your favorite hello.","I wish to never be your goodbye.",
"I wish for us. Just us. Always us.","I wish you knew how loved you are."
];
(() => {
  const svg = $("#wish-tree");
  const wishBox = $("#tree-wish");
  const NS = "http://www.w3.org/2000/svg";

  // defs: leaf glow gradient
  svg.innerHTML = `
  <defs>
    <radialGradient id="leafGlow" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#ffe9a8"/><stop offset="55%" stop-color="#f5c86b"/>
      <stop offset="100%" stop-color="#e08fc0"/>
    </radialGradient>
    <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8a4a6e"/><stop offset="100%" stop-color="#5a2144"/>
    </linearGradient>
  </defs>
  <ellipse cx="300" cy="612" rx="200" ry="18" fill="rgba(255,94,168,0.14)"/>
  <path fill="url(#trunkGrad)" d="M285 620 C288 520 272 470 236 420 C270 448 284 480 292 520
    C294 460 288 420 300 360 C312 420 306 460 308 520 C316 480 330 448 364 420
    C328 470 312 520 315 620 Z"/>`;

  /* leaf cluster positions across the crown */
  const SPOTS = [];
  for (let i = 0; i < 30; i++) {
    const a = rand(0, Math.PI * 2), r = rand(30, 150);
    SPOTS.push([300 + Math.cos(a) * r * 1.25, 250 + Math.sin(a) * r * 0.85]);
  }

  SPOTS.forEach(([x, y], i) => {
    const leaf = document.createElementNS(NS, "circle");
    leaf.setAttribute("cx", x); leaf.setAttribute("cy", y);
    leaf.setAttribute("r", rand(12, 22));
    leaf.setAttribute("fill", "url(#leafGlow)");
    leaf.setAttribute("opacity", rand(0.75, 0.98).toFixed(2));
    leaf.setAttribute("class", "leaf");
    leaf.style.cursor = "pointer";
    leaf.setAttribute("tabindex", "0");
    leaf.setAttribute("role", "button");
    leaf.setAttribute("aria-label", "Reveal a wish");

    const pickLeaf = () => {
      wishBox.textContent = "🌿 " + WISHES[i % WISHES.length];
      wishBox.classList.add("is-visible");
      clearTimeout(wishBox._t);
      wishBox._t = setTimeout(() => wishBox.classList.remove("is-visible"), 3600);
      gsap.to(leaf, { attr: { r: 0 }, opacity: 0, duration: 0.5, ease: "power2.in",
        onComplete: () => { // leaves regrow
          gsap.to(leaf, { attr: { r: rand(12, 22) }, opacity: rand(0.75, 0.98),
            duration: 1.4, delay: 2.2, ease: "elastic.out(1,0.5)" });
        }});
      const rect = svg.getBoundingClientRect();
      burstHearts(rect.left + (x / 600) * rect.width, rect.top + (y / 640) * rect.height, 6, ["✨", "🍃", "💛"]);
    };
    leaf.addEventListener("click", pickLeaf);
    leaf.addEventListener("keydown", e => { if (e.key === "Enter") pickLeaf(); });
    svg.appendChild(leaf);
    if (!RM) gsap.to(leaf, { attr: { cy: y - rand(3, 7) }, duration: rand(2, 4), yoyo: true, repeat: -1, ease: "sine.inOut" });
  });
})();

/* ── 14c · FLOATING LANTERN CEREMONY ────────────────────────── */
(() => {
  const cv = $("#lantern-canvas");
  const ctx = cv.getContext("2d");
  const MESSAGES = [
    "for every smile you gave me","for your softest heart","for the days ahead of us",
    "for your dreams — all of them","for the way you love","for us, forever",
    "for your laugh at 2am","for the home we'll build","for every version of you",
    "for you, Laiba — always you"
  ];
  let lanterns = [], stars = [], running = false, mi = 0;

  function resize() {
    cv.width = cv.clientWidth * Math.min(devicePixelRatio, 2);
    cv.height = cv.clientHeight * Math.min(devicePixelRatio, 2);
    ctx.setTransform(Math.min(devicePixelRatio, 2), 0, 0, Math.min(devicePixelRatio, 2), 0, 0);
    stars = Array.from({ length: 70 }, () => ({
      x: rand(0, cv.clientWidth), y: rand(0, cv.clientHeight),
      r: rand(0.5, 1.6), a: rand(0.2, 0.9)
    }));
  }
  resize(); addEventListener("resize", resize);

  cv.addEventListener("pointerdown", e => {
    const r = cv.getBoundingClientRect();
    if (lanterns.length > 14) lanterns.shift();
    lanterns.push({
      x: e.clientX - r.left, y: e.clientY - r.top,
      vy: rand(-0.55, -0.35), sway: rand(0, Math.PI * 2),
      w: rand(26, 40), a: 0, msg: MESSAGES[mi++ % MESSAGES.length]
    });
  });

  function draw() {
    if (!running) return requestAnimationFrame(draw);
    const W = cv.clientWidth, H = cv.clientHeight;
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a += rand(-0.03, 0.03); s.a = clamp(s.a, 0.15, 0.95);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,240,250,${s.a})`; ctx.fill();
    });
    lanterns.forEach(l => {
      l.sway += 0.02; l.y += l.vy;
      l.x += Math.sin(l.sway) * 0.35;
      l.a = Math.min(1, l.a + 0.02);
      if (l.y < -80) l.y = H + 60;
      const h = l.w * 1.35;
      ctx.save();
      ctx.globalAlpha = l.a;
      // glow
      const g = ctx.createRadialGradient(l.x, l.y, 2, l.x, l.y, l.w * 2.2);
      g.addColorStop(0, "rgba(255,200,120,0.55)"); g.addColorStop(1, "rgba(255,200,120,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(l.x, l.y, l.w * 2.2, 0, Math.PI * 2); ctx.fill();
      // body
      const body = ctx.createLinearGradient(0, l.y - h / 2, 0, l.y + h / 2);
      body.addColorStop(0, "#ffd98f"); body.addColorStop(0.6, "#ff9d5c"); body.addColorStop(1, "#e2653f");
      ctx.fillStyle = body;
      roundRect(ctx, l.x - l.w / 2, l.y - h / 2, l.w, h, l.w * 0.32);
      ctx.fill();
      ctx.fillStyle = "rgba(120,40,20,0.85)";
      ctx.fillRect(l.x - l.w * 0.28, l.y + h / 2 - 3, l.w * 0.56, 4);
      // message
      ctx.globalAlpha = l.a * 0.85;
      ctx.fillStyle = "#ffeccf";
      ctx.font = "300 12px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(l.msg, l.x, l.y + h / 2 + 20);
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  onVisible(cv, v => (running = v));
  draw();
})();

/* ── 15a · NIGHT SKY ────────────────────────────────────────── */
const STAR_REASONS = [
"you make hard days survivable","your voice is my favorite sound","you believed in me first",
"you make me laugh until it hurts","you're gentle when the world isn't","you turn nothing into everything",
"your heart is the warmest place","you make time feel generous","you're beautiful without trying",
"you love with your whole self","you're my best decision","you feel like home",
"you make the future look bright","you never let me feel alone","you're the answer to old wishes",
"you're my favorite thought before sleep","you're the reason 11:11 works","you make ordinary streets romantic",
"you're brave in ways you don't see","you're my once-in-a-lifetime"
];
const STAR_SURPRISES = [
"⭐ surprise: you get one wish. I'll make it happen.",
"⭐ surprise: a slow dance is owed to you. redeemable anytime.",
"⭐ surprise: your next favorite meal? my treat.",
"⭐ surprise: one full day, planned entirely around you.",
"⭐ surprise: a handwritten letter is already on its way.",
"⭐ surprise: look up tonight — I picked a real star for you."
];
(() => {
  const stage = $("#nightsky-stage");
  const reveal = $("#nightsky-reveal");
  const TOTAL = 26;
  for (let i = 0; i < TOTAL; i++) {
    const special = i % 5 === 4;
    const b = document.createElement("button");
    b.className = "sky-star" + (special ? " sky-star--special" : "");
    b.setAttribute("aria-label", special ? "A golden star with a surprise" : "A star with a reason");
    b.style.left = rand(4, 96) + "%";
    b.style.top = rand(6, 92) + "%";
    b.innerHTML = `<span class="sky-star__core" style="--size:${special ? rand(8, 11) : rand(4, 8)}px;--tw:${rand(1.8, 4)}s"></span>`;
    b.addEventListener("click", e => {
      reveal.textContent = special
        ? pick(STAR_SURPRISES)
        : "✦ " + STAR_REASONS[i % STAR_REASONS.length];
      reveal.classList.add("is-visible");
      clearTimeout(reveal._t);
      reveal._t = setTimeout(() => reveal.classList.remove("is-visible"), 4200);
      burstHearts(e.clientX, e.clientY, special ? 16 : 7, special ? ["⭐", "✨", "💛"] : ["✨", "❤"]);
    });
    stage.appendChild(b);
  }
})();

/* ── 15b · HIDDEN EASTER EGGS ───────────────────────────────── */
(() => {
  let buffer = "";
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;

  const toast = document.createElement("div");
  toast.className = "egg-toast";
  document.body.appendChild(toast);
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  addEventListener("keydown", e => {
    /* konami */
    kIdx = (e.key === KONAMI[kIdx]) ? kIdx + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (kIdx === KONAMI.length) {
      kIdx = 0;
      document.body.classList.toggle("mode-galaxy");
      say("🌌 Galaxy Mode " + (document.body.classList.contains("mode-galaxy") ? "unlocked" : "off"));
    }
    /* typed words */
    if (e.key.length === 1) {
      buffer = (buffer + e.key.toLowerCase()).slice(-12);
      if (buffer.endsWith("laiba")) {
        say("✨ the secret animation — because you typed the magic word");
        secretRain();
        buffer = "";
      } else if (buffer.endsWith("forever")) {
        say("🎆 forever unlocked");
        for (let i = 0; i < 5; i++)
          setTimeout(() => burstHearts(rand(innerWidth * 0.2, innerWidth * 0.8), rand(innerHeight * 0.2, innerHeight * 0.6), 22, ["🎆", "✨", "💥", "❤"]), i * 320);
        buffer = "";
      } else if (buffer.endsWith("love")) {
        document.body.classList.remove("mode-galaxy");
        document.body.classList.toggle("mode-love");
        say("💗 the world just turned a little pinker");
        buffer = "";
      }
    }
  });

  function secretRain() {
    const letters = "LAIBA♥LAIBA♥".split("");
    for (let i = 0; i < (RM ? 10 : 44); i++) {
      const s = document.createElement("span");
      s.className = "burst-heart";
      s.textContent = pick(letters);
      s.style.cssText = `left:${rand(0, 100)}vw;top:-40px;font-size:${rand(16, 34)}px;color:var(--rose);
        font-family:var(--font-display);font-weight:600;text-shadow:0 0 14px rgba(255,94,168,0.8)`;
      document.body.appendChild(s);
      gsap.to(s, { y: innerHeight + 90, rotation: rand(-90, 90), duration: rand(2.4, 4.6),
        delay: rand(0, 1.2), ease: "power1.in", onComplete: () => s.remove() });
    }
    burstHearts(innerWidth / 2, innerHeight / 2, 24);
  }
})();

/* ── 15c · FINALE ───────────────────────────────────────────── */
(() => {
  const box = $("#finale-text");
  const LINES = [
    ["Laiba…", true],
    ["I Love You", false],
    ["In Every Language", false],
    ["But More Than Any Language…", false],
    ["You Mean Everything To Me.", false],
    ["❤️ Forever & Always ❤️", false],
    ["Thank you for being my favorite person.", true]
  ];
  const els = LINES.map(([t, hand]) => {
    const d = document.createElement("div");
    d.className = "finale__line" + (hand ? " finale__line--hand" : "");
    d.textContent = t;
    box.appendChild(d);
    return d;
  });

  /* the text block is CSS position:sticky, so we only scrub the timeline */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#finale", start: "top top", end: "bottom bottom", scrub: 0.7
    }
  });
  els.forEach((el, i) => {
    tl.fromTo(el, { opacity: 0, scale: 0.92, filter: "blur(8px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" });
    if (i < els.length - 1)
      tl.to(el, { opacity: 0, scale: 1.06, filter: "blur(6px)", duration: 0.8, ease: "power2.in" }, "+=0.6");
  });

  /* fireworks + rising hearts canvas */
  const cv = $("#finale-canvas");
  const ctx = cv.getContext("2d");
  let running = false, rockets = [], sparks = [], hearts = [], confettiFired = false;

  function resize() {
    cv.width = cv.clientWidth; cv.height = cv.clientHeight;
  }
  resize(); addEventListener("resize", resize);

  ScrollTrigger.create({
    trigger: "#finale", start: "top 80%", end: "bottom top",
    onToggle: self => (running = self.isActive)
  });
  /* confetti when the last line is centered */
  ScrollTrigger.create({
    trigger: "#finale", start: "80% bottom",
    onEnter: () => {
      if (confettiFired) return;
      confettiFired = true;
      for (let i = 0; i < 4; i++)
        setTimeout(() => burstHearts(rand(innerWidth * 0.15, innerWidth * 0.85), rand(innerHeight * 0.2, innerHeight * 0.5), 26, ["🎉", "🎊", "❤", "🌸", "✨"]), i * 260);
    }
  });

  function launch() {
    rockets.push({
      x: rand(cv.width * 0.15, cv.width * 0.85), y: cv.height + 10,
      vy: rand(-9.5, -7), hue: pick([330, 45, 275, 350])
    });
  }
  function explode(r) {
    const n = RM ? 20 : 60;
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2), sp = rand(1, 5.4);
      sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, a: 1, hue: r.hue });
    }
  }
  let launchTimer = 0;
  (function draw() {
    requestAnimationFrame(draw);
    if (!running) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    launchTimer -= 1;
    if (launchTimer <= 0 && !RM) { launchTimer = rand(30, 70); launch(); }

    // rising hearts
    if (Math.random() < 0.12 && hearts.length < 60 && !RM)
      hearts.push({ x: rand(0, cv.width), y: cv.height + 16, vy: rand(-0.7, -0.35), s: rand(9, 20), a: rand(0.35, 0.85), wob: rand(0, 6) });
    hearts.forEach((h, i) => {
      h.y += h.vy; h.wob += 0.02;
      ctx.globalAlpha = h.a;
      ctx.font = `${h.s}px serif`;
      ctx.fillStyle = "#ff7cbb";
      ctx.fillText("❤", h.x + Math.sin(h.wob) * 8, h.y);
      if (h.y < -30) hearts.splice(i, 1);
    });
    ctx.globalAlpha = 1;

    rockets.forEach((r, i) => {
      r.y += r.vy; r.vy += 0.08;
      ctx.beginPath(); ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${r.hue} 90% 75%)`; ctx.fill();
      if (r.vy > -1.2) { explode(r); rockets.splice(i, 1); }
    });
    sparks.forEach((s, i) => {
      s.x += s.vx; s.y += s.vy; s.vy += 0.035; s.a -= 0.012;
      if (s.a <= 0) return sparks.splice(i, 1);
      ctx.globalAlpha = s.a;
      ctx.beginPath(); ctx.arc(s.x, s.y, 1.9, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${s.hue} 95% 72%)`;
      ctx.shadowColor = `hsl(${s.hue} 95% 60%)`; ctx.shadowBlur = 8;
      ctx.fill(); ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;
  })();
})();

})();

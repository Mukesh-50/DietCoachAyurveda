const $ = (sel) => document.querySelector(sel);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DOSHA_KEYS = ["Vata", "Pitta", "Kapha"];
const STORAGE_KEY = "ayuraahar-state";

let state = { profile: null, dosha: null, scores: null, day: 0 };

// ---------- Calculations ----------

// Mifflin-St Jeor BMR × activity factor, adjusted for goal.
function calorieTarget(p) {
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.gender === "male" ? 5 : -161);
  const tdee = bmr * p.activity;
  const adjust = { lose: -400, maintain: 0, gain: 350 }[p.goal];
  return Math.round((tdee + adjust) / 10) * 10;
}

// ICMR-NIN 2020 guidance: ~0.8–1 g protein/kg; more when losing fat or gaining muscle.
function macroTargets(p, kcal) {
  const proteinPerKg = { lose: 1.2, maintain: 1.0, gain: 1.4 }[p.goal];
  const protein = Math.round(p.weight * proteinPerKg);
  const fat = Math.round((kcal * 0.27) / 9);
  const carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);
  const fiber = Math.round((kcal / 1000) * 15);
  return { kcal, protein, carbs, fat, fiber };
}

function bmi(p) {
  const v = p.weight / (p.height / 100) ** 2;
  // Asian cut-offs (WHO expert consultation 2004).
  const cat = v < 18.5 ? "Underweight" : v < 23 ? "Normal" : v < 25 ? "Overweight" : "Obese";
  return { value: v.toFixed(1), cat };
}

function allowedTypes(diet) {
  return { veg: ["veg"], egg: ["veg", "egg"], nonveg: ["veg", "egg", "nonveg"] }[diet];
}

// Pick one meal per slot for the given day, preferring meals that balance the
// primary dosha, rotating through options so the week has variety.
function planForDay(dayIndex) {
  const code = state.dosha[0];
  const types = allowedTypes(state.profile.diet);
  return SLOTS.map((slot) => {
    const options = MEALS.filter((m) => m.slot === slot.id && types.includes(m.type));
    const suited = options.filter((m) => m.doshas.includes(code));
    const pool = suited.length ? suited : options;
    return { slot, meal: pool[(dayIndex + slot.id.length) % pool.length] };
  });
}

// Scale portions so the day's calories match the user's target.
function portionFactor(plan, kcal) {
  const total = plan.reduce((s, x) => s + x.meal.macros.kcal, 0);
  return Math.min(1.6, Math.max(0.7, kcal / total));
}

// ---------- Rendering ----------

function renderQuiz() {
  const form = $("#quiz-form");
  form.innerHTML =
    QUIZ.map((item, i) => `
      <div class="question">
        <p>${i + 1}. ${item.q}</p>
        ${item.a.map((ans, j) => `
          <label><input type="radio" name="q${i}" value="${j}" required> ${ans}</label>`).join("")}
      </div>`).join("") +
    `<button type="submit">See my diet chart →</button>`;
}

function renderSummary(targets) {
  const p = state.profile;
  const info = DOSHA_INFO[state.dosha];
  const b = bmi(p);
  const total = state.scores.reduce((a, c) => a + c, 0);
  const pct = state.scores.map((s) => Math.round((s / total) * 100));
  $("#summary").innerHTML = `
    <h2>Namaste ${escapeHtml(p.name)} 🙏</h2>
    <p>Your dominant dosha is <span class="dosha-badge">${state.dosha}</span> <span class="muted">(${info.elements})</span></p>
    <p>${info.traits}</p>
    <div class="cols">
      <div class="box benefit"><h4>✅ Favour</h4>${info.favour}</div>
      <div class="box risk"><h4>⚠️ Reduce</h4>${info.avoid}</div>
    </div>
    <p class="muted" style="margin-top:12px">
      Vata ${pct[0]}% · Pitta ${pct[1]}% · Kapha ${pct[2]}% &nbsp;|&nbsp; BMI ${b.value} (${b.cat}, Asian cut-offs)
    </p>
    <h3 style="margin-bottom:0">Your daily targets</h3>
    <div class="stats">
      <div class="stat"><b>${targets.kcal}</b><span>kcal</span></div>
      <div class="stat"><b>${targets.protein} g</b><span>Protein</span></div>
      <div class="stat"><b>${targets.carbs} g</b><span>Carbs</span></div>
      <div class="stat"><b>${targets.fat} g</b><span>Fat</span></div>
      <div class="stat"><b>${targets.fiber} g</b><span>Fibre</span></div>
      <div class="stat"><b>2.5–3 L</b><span>Water</span></div>
    </div>`;
}

function renderTabs() {
  $("#tabs").innerHTML = DAYS.map((d, i) =>
    `<button data-day="${i}" class="${i === state.day ? "active" : ""}">${d}</button>`).join("") +
    `<button id="print">🖨 Print</button>`;
}

function renderChart(targets) {
  const plan = planForDay(state.day);
  const f = portionFactor(plan, targets.kcal);
  const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

  const meals = plan.map(({ slot, meal }) => {
    const m = {};
    for (const k in meal.macros) { m[k] = meal.macros[k] * f; totals[k] += m[k]; }
    return `
      <details class="meal">
        <summary>
          <div><div class="slot">${slot.label} · ${slot.time}</div><h3>${meal.name}</h3></div>
          <div class="kcal">${Math.round(m.kcal)} kcal ▾</div>
        </summary>
        <div class="body">
          ${Math.abs(f - 1) > 0.05 ? `<p class="muted">Portion: <b>${f.toFixed(2)}×</b> the quantities below to match your calorie target.</p>` : ""}
          <div class="cols">
            <div>
              <h4>🛒 Ingredients</h4><ul>${meal.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
              <h4>👩‍🍳 How to prepare at home</h4><p>${meal.recipe}</p>
            </div>
            <div>
              <h4>📊 Macronutrients</h4>
              <table>
                <tr><td>Energy</td><td>${Math.round(m.kcal)} kcal</td></tr>
                <tr><td>Protein</td><td>${m.protein.toFixed(1)} g</td></tr>
                <tr><td>Carbohydrates</td><td>${m.carbs.toFixed(1)} g</td></tr>
                <tr><td>Fat</td><td>${m.fat.toFixed(1)} g</td></tr>
                <tr><td>Fibre</td><td>${m.fiber.toFixed(1)} g</td></tr>
              </table>
              <h4>🔬 Key micronutrients <span class="muted">(standard portion)</span></h4>
              <table>${Object.entries(meal.micros).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</table>
            </div>
          </div>
          <div class="box science" style="margin-top:14px"><h4>🧪 The science (and Ayurveda) behind it</h4>${meal.science}</div>
          <div class="cols" style="margin-top:12px">
            <div class="box benefit"><h4>💚 Benefits</h4><ul>${meal.benefits.map((b) => `<li>${b}</li>`).join("")}</ul></div>
            <div class="box risk"><h4>⚠️ If you skip this / eat junk instead</h4><ul>${meal.risks.map((r) => `<li>${r}</li>`).join("")}</ul></div>
          </div>
        </div>
      </details>`;
  }).join("");

  const row = (label, key, unit) => {
    const pct = Math.min(100, Math.round((totals[key] / targets[key]) * 100));
    return `<tr><td>${label}</td><td>${Math.round(totals[key])} / ${targets[key]} ${unit}</td>
      <td style="width:40%"><div class="bar"><i style="width:${pct}%"></i></div></td></tr>`;
  };

  $("#chart").innerHTML = meals + `
    <div class="card">
      <h3 style="margin-top:0">${DAYS[state.day]} — daily total vs target</h3>
      <table>
        ${row("Energy", "kcal", "kcal")}${row("Protein", "protein", "g")}
        ${row("Carbs", "carbs", "g")}${row("Fat", "fat", "g")}${row("Fibre", "fiber", "g")}
      </table>
      ${totals.protein < targets.protein * 0.85 ? `<p class="muted">💡 Protein is below target — add a bowl of curd, a glass of milk, extra dal, paneer or sprouts.</p>` : ""}
    </div>`;
}

function renderHabits() {
  $("#habits").innerHTML = `<h3 style="margin-top:0">🌅 Daily routine (Dinacharya) for best results</h3>
    <ul>${HABITS.map((h) => `<li><b>${h.title}</b> — <span class="muted">${h.why}</span></li>`).join("")}</ul>`;
}

function renderConditionOptions() {
  $("#condition-list").innerHTML = CONDITIONS.map((c) =>
    `<label><input type="checkbox" name="conditions" value="${c.id}"> ${c.label}</label>`).join("");
}

function renderWorkout() {
  const p = state.profile;
  const conds = p.conditions || [];
  // Strong breathing and high-impact work are unsafe with these conditions.
  const gentleOnly = conds.some((c) => ["heart", "bp", "pregnant", "joint"].includes(c));
  let items = [...WORKOUTS[state.dosha], ...WORKOUTS.all];
  if (gentleOnly) items = items.filter((w) => !/HIIT|jogging|Kapalbhati/.test(w.name));
  const goalTip = {
    lose: "Aim for 150–300 min/week of activity. Add 2 strength sessions to protect muscle while losing fat.",
    maintain: "Aim for at least 150 min/week of moderate activity (WHO) plus 2 strength sessions.",
    gain: "Prioritise strength training 3–4×/week with progressive overload; keep cardio light.",
  }[p.goal];
  $("#workout").innerHTML = `<h3 style="margin-top:0">🧘 Your Yoga + Workout Plan (${state.dosha})</h3>
    <p class="muted">${goalTip} Best time: early morning on an empty stomach, or 2 hours after a meal.</p>
    ${items.map((w) => `<div class="workout-item"><b>${w.name}</b> — ${w.detail}<br><span class="muted">${w.why}</span></div>`).join("")}
    ${gentleOnly ? `<p class="muted">⚠️ High-intensity exercises and Kapalbhati were removed because of your health condition.</p>` : ""}`;
}

function renderDoctor() {
  const conds = CONDITIONS.filter((c) => (state.profile.conditions || []).includes(c.id));
  const b = bmi(state.profile);
  const extra = [];
  if (b.cat === "Obese" || b.cat === "Underweight") extra.push(`Your BMI (${b.value}) is in the ${b.cat.toLowerCase()} range — a check-up is recommended before major diet or exercise changes.`);
  if (state.profile.age >= 60) extra.push("Being over 60, get a doctor's clearance before starting a new workout routine.");

  const level = conds.some((c) => c.level === "urgent") ? "urgent"
    : conds.some((c) => c.level === "consult") || extra.length ? "consult" : "ok";
  const verdict = {
    urgent: "🩺 Please see a doctor BEFORE starting this diet and workout plan.",
    consult: "🩺 We recommend consulting your doctor — you can start gently meanwhile.",
    ok: "✅ No doctor visit needed to start. Get a routine health check-up once a year.",
  }[level];

  $("#doctor").innerHTML = `<h3 style="margin-top:0">Should you consult a doctor?</h3>
    <div class="verdict ${level}">${verdict}</div>
    <ul>
      ${conds.map((c) => `<li><b>${c.label}:</b> ${c.advice}</li>`).join("")}
      ${extra.map((e) => `<li>${e}</li>`).join("")}
    </ul>
    <p class="muted">See a doctor immediately if you get chest pain, dizziness, breathlessness, fainting, or sudden weight loss.</p>`;
}

// Show a new motivational quote every 5 seconds while the chart is open.
let quoteTimer = null;
function startQuotes() {
  if (quoteTimer) return;
  let i = Math.floor(Math.random() * QUOTES.length);
  const el = $("#quote");
  const next = () => {
    el.classList.remove("show");
    setTimeout(() => {
      el.textContent = QUOTES[i++ % QUOTES.length];
      el.classList.add("show");
    }, 400);
  };
  next();
  quoteTimer = setInterval(next, 5000);
}

function stopQuotes() {
  clearInterval(quoteTimer);
  quoteTimer = null;
  $("#quote").classList.remove("show");
}

function renderResult() {
  const targets = macroTargets(state.profile, calorieTarget(state.profile));
  renderSummary(targets);
  renderTabs();
  renderChart(targets);
  renderHabits();
  renderWorkout();
  renderDoctor();
  startQuotes();
}

function show(id) {
  for (const s of ["#step-profile", "#step-quiz", "#step-result"]) $(s).classList.toggle("hidden", s !== id);
  window.scrollTo(0, 0);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

// ---------- Events ----------

$("#profile-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  state.profile = {
    name: d.name.trim(), age: +d.age, gender: d.gender, height: +d.height, weight: +d.weight,
    activity: +d.activity, goal: d.goal, diet: d.diet,
    conditions: new FormData(e.target).getAll("conditions"),
  };
  renderQuiz();
  show("#step-quiz");
});

$("#quiz-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const scores = [0, 0, 0];
  QUIZ.forEach((_, i) => scores[+new FormData(e.target).get(`q${i}`)]++);
  state.scores = scores;
  state.dosha = DOSHA_KEYS[scores.indexOf(Math.max(...scores))];
  state.day = (new Date().getDay() + 6) % 7; // today, Monday = 0
  save();
  renderResult();
  show("#step-result");
});

$("#tabs").addEventListener("click", (e) => {
  if (e.target.id === "print") {
    document.querySelectorAll(".meal").forEach((d) => (d.open = true));
    return window.print();
  }
  if (e.target.dataset.day === undefined) return;
  state.day = +e.target.dataset.day;
  save();
  renderResult();
});

$("#restart").addEventListener("click", () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
  state = { profile: null, dosha: null, scores: null, day: 0 };
  stopQuotes();
  show("#step-profile");
});

renderConditionOptions();

// Restore a previous session.
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (saved && saved.dosha) { state = saved; renderResult(); show("#step-result"); }
} catch {}

// ---------- Forest ambience (Web Audio synthesis, no audio files needed) ----------

const forestSound = (() => {
  let ctx = null, master = null, birdTimer = null, running = false;

  function noiseBuffer(seconds, brown) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = brown ? (last + 0.02 * white) / 1.02 : white;
      data[i] = brown ? last * 3.5 : white;
    }
    return buf;
  }

  function layer(bufferSeconds, brown, filterType, frequency, level) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(bufferSeconds, brown);
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    const gain = ctx.createGain();
    gain.gain.value = level;
    src.connect(filter).connect(gain).connect(master);
    src.start();
    return gain;
  }

  // Wind through leaves: looped brown noise through a bandpass, swelling slowly.
  function startWind() {
    const gain = layer(4, true, "bandpass", 400, 0.07);
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 0.035;
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start();
  }

  // Distant stream: bright filtered noise.
  function startStream() {
    layer(2, false, "highpass", 1400, 0.018);
  }

  function chirp() {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const base = 2200 + Math.random() * 1600;
    const notes = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < notes; i++) {
      const t0 = t + i * 0.13;
      osc.frequency.setValueAtTime(base + Math.random() * 500, t0);
      osc.frequency.exponentialRampToValueAtTime(base * 0.7, t0 + 0.1);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.06, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11);
    }
    osc.connect(gain).connect(master);
    osc.start(t);
    osc.stop(t + notes * 0.13 + 0.15);
  }

  function scheduleBirds() {
    birdTimer = setTimeout(() => {
      chirp();
      scheduleBirds();
    }, 1000 + Math.random() * 5000);
  }

  return {
    toggle() {
      if (running) {
        running = false;
        clearTimeout(birdTimer);
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
        const old = ctx;
        setTimeout(() => old.close(), 1500);
        ctx = null;
        return false;
      }
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0;
      master.gain.setTargetAtTime(0.9, ctx.currentTime, 1.2);
      master.connect(ctx.destination);
      startWind();
      startStream();
      scheduleBirds();
      running = true;
      return true;
    },
  };
})();

const soundBtn = $("#forest-sound");
soundBtn.addEventListener("click", () => {
  const on = forestSound.toggle();
  soundBtn.textContent = on ? "🌲 Forest sounds: on" : "🌲 Forest sounds: off";
  soundBtn.classList.toggle("on", on);
  soundBtn.setAttribute("aria-pressed", String(on));
});

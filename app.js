
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const KEY = "habitzen-starter-v1";

function localDayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const todayKey = localDayKey();

const defaults = [
  { id: "water", name: "Drink enough water", tag: "HEALTH" },
  { id: "move", name: "Move for 20 minutes", tag: "FITNESS" },
  { id: "read", name: "Read or learn", tag: "GROWTH" },
  { id: "sleep", name: "Wind down on time", tag: "REST" }
];

let data;
try {
  data = JSON.parse(localStorage.getItem(KEY)) || {};
} catch {
  data = {};
}

data.habits ||= defaults;
data.completed ||= {};
data.workouts ||= [];
data.urgeLogs ||= [];

const DAILY_GOAL_KEY = "habitzen-daily-goal";

function updateDailyGoal() {
  const input = document.getElementById("daily-goal-input");
  const progress = document.getElementById("daily-goal-progress");
  const bar = document.getElementById("daily-goal-bar");
  if (!input || !progress || !bar) return;

  const saved = Number(localStorage.getItem(DAILY_GOAL_KEY)) || 3;
  input.value = saved;

  const done = doneIds().filter(id =>
    data.habits.some(h => h.id === id)
  ).length;

  const percent = Math.min(100, Math.round(done / saved * 100));
  progress.textContent = `${done} of ${saved} habits completed`;
  bar.style.width = `${percent}%`;
}

document.addEventListener("click", event => {
  if (event.target.id !== "save-daily-goal") return;

  const input = document.getElementById("daily-goal-input");
  const goal = Number(input.value);

  if (!Number.isInteger(goal) || goal < 1 || goal > 50) {
    alert("Please enter a goal from 1 to 50.");
    return;
  }

  localStorage.setItem(DAILY_GOAL_KEY, String(goal));
  updateDailyGoal();
});
function save() {
  
function save() {
  localStorage.setItem(KEY, JSON.stringify(data));
}

  localStorage.setItem(KEY, JSON.stringify(data));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

$("#today").textContent = new Date().toLocaleDateString(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric"
}).toUpperCase();

function doneIds(day = todayKey) {
  return data.completed[day] || [];
}

function completionForDay(day) {
  const total = data.habits.length;
  if (!total) return 0;

  const completed = new Set(doneIds(day));
  const validDone = data.habits.filter(h => completed.has(h.id)).length;

  return Math.round(validDone / total * 100);
}

/* ---------- PREMIUM DASHBOARD ---------- */

function ensureDashboardPro() {
  if ($("#dashboard-pro")) return;

  const stats = $(".stats-grid");
  if (!stats) return;

  const style = document.createElement("style");
  style.id = "dashboard-pro-styles";
  style.textContent = `
    .pro-dashboard {
      display: grid;
      grid-template-columns: 1.25fr 1fr;
      gap: 15px;
      margin: 0 0 34px;
    }

    .pro-panel {
      min-width: 0;
      padding: 20px;
      border: 1px solid #302d27;
      border-radius: 20px;
      background: linear-gradient(145deg,#191919,#111113);
    }

    .pro-panel h3 {
      margin: 0 0 6px;
      font-size: 17px;
    }

    .pro-sub {
      color: #a4a19a;
      font-size: 11px;
      line-height: 1.6;
      margin: 0 0 18px;
    }

    .pro-bars {
      display: flex;
      align-items: flex-end;
      gap: 10px;
      height: 155px;
      padding: 8px 0 0;
      border-bottom: 1px solid #39352b;
    }

    .pro-day {
      flex: 1;
      min-width: 0;
      text-align: center;
      color: #aaa69c;
      font-size: 10px;
    }

    .pro-bar-track {
      height: 105px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      margin-bottom: 8px;
    }

    .pro-bar {
      width: min(28px, 75%);
      min-height: 3px;
      border-radius: 7px 7px 2px 2px;
      background: linear-gradient(180deg,#f1d79a,#b58b3e);
      transition: height .25s ease;
    }

    .pro-day strong {
      display: block;
      color: #f1d79a;
      font-size: 10px;
      margin-bottom: 5px;
    }

    .pro-goal {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 18px;
    }

    .pro-ring {
      width: 72px;
      height: 72px;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: conic-gradient(
        #d7b56d var(--progress, 0%),
        #302d27 0
      );
      position: relative;
    }

    .pro-ring::before {
      content: "";
      position: absolute;
      inset: 7px;
      border-radius: 50%;
      background: #151416;
    }

    .pro-ring span {
      position: relative;
      color: #f1d79a;
      font-size: 13px;
      font-weight: 800;
    }

    .pro-goal-copy {
      color: #a4a19a;
      font-size: 11px;
      line-height: 1.6;
    }

    .pro-goal-copy strong {
      display: block;
      color: #f4f1e9;
      font-size: 14px;
      margin-bottom: 3px;
    }

    .pro-calendar {
      display: grid;
      grid-template-columns: repeat(7,minmax(0,1fr));
      gap: 6px;
    }

    .pro-cell {
      aspect-ratio: 1;
      min-width: 0;
      display: grid;
      place-items: center;
      border: 1px solid #302d27;
      border-radius: 7px;
      background: #101012;
      color: #8d8980;
      font-size: 10px;
    }

    .pro-cell.done {
      background: #6d5428;
      border-color: #b99650;
      color: #fff0c7;
    }

    .pro-cell.today {
      outline: 2px solid #f1d79a;
      outline-offset: 1px;
    }

    .pro-legend {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-top: 14px;
      color: #a4a19a;
      font-size: 10px;
    }

    .pro-note {
      margin-top: 12px;
      color: #8d8980;
      font-size: 10px;
      line-height: 1.5;
    }

    @media(max-width:760px) {
      .pro-dashboard {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .pro-panel {
        padding: 16px;
      }

      .pro-calendar {
        gap: 5px;
      }
    }

    @media(prefers-reduced-motion:reduce) {
      .pro-bar { transition: none; }
    }
  `;

  document.head.appendChild(style);

  const section = document.createElement("section");
  section.id = "dashboard-pro";
  section.className = "pro-dashboard";

  section.innerHTML = `
    <article class="pro-panel">
      <p class="eyebrow">YOUR MOMENTUM</p>
      <h3>Weekly progress</h3>
      <p class="pro-sub">
        Habit completion across the last seven days
      </p>

      <div id="pro-week-bars" class="pro-bars"></div>

      <div class="pro-goal">
        <div
          id="pro-ring"
          class="pro-ring"
          role="img"
          aria-label="Daily goal progress"
          style="--progress:0%"
        >
          <span id="pro-ring-label">0%</span>
        </div>

        <div class="pro-goal-copy">
          <strong id="pro-goal-title">Daily goal</strong>
          <span id="pro-goal-copy">
            Complete your habits to build consistency.
          </span>
        </div>
      </div>
    </article>

    <article class="pro-panel">
      <p class="eyebrow">SHOW UP, DAY BY DAY</p>
      <h3>28-day consistency</h3>
      <p class="pro-sub">
        Gold squares mark days when all habits were completed
      </p>

      <div
        id="pro-calendar"
        class="pro-calendar"
        aria-label="Last 28 days of habit completion"
      ></div>

      <div class="pro-legend">
        <span>Last 28 days</span>
        <span>Today outlined</span>
      </div>

      <p class="pro-note">
        Calendar history is based on your saved habit records on this device.
      </p>
    </article>
  `;

  stats.insertAdjacentElement("afterend", section);
}

function renderDashboardPro() {
  ensureDashboardPro();

  const bars = $("#pro-week-bars");
  const calendar = $("#pro-calendar");

  if (!bars || !calendar) return;

  const total = data.habits.length;
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const key = localDayKey(date);
    days.push({
      date,
      key,
      pct: completionForDay(key)
    });
  }

  bars.innerHTML = days.map(day => {
    const label = day.date.toLocaleDateString(undefined, {
      weekday: "short"
    }).slice(0, 2);

    return `
      <div class="pro-day" title="${day.key}: ${day.pct}% complete">
        <div class="pro-bar-track">
          <div
            class="pro-bar"
            style="height:${Math.max(3, day.pct)}%"
          ></div>
        </div>
        <strong>${day.pct}%</strong>
        ${label}
      </div>
    `;
  }).join("");

  const completedToday = new Set(doneIds());
  const validDone = data.habits.filter(h =>
    completedToday.has(h.id)
  ).length;

  const pct = total
    ? Math.round(validDone / total * 100)
    : 0;

  $("#pro-ring").style.setProperty("--progress", `${pct}%`);
  $("#pro-ring-label").textContent = `${pct}%`;
  $("#pro-ring").setAttribute(
    "aria-label",
    `Daily goal ${pct}% complete`
  );

  $("#pro-goal-title").textContent =
    `${validDone} of ${total} habits done`;

  $("#pro-goal-copy").textContent = !total
    ? "Add a habit to set your daily goal."
    : pct === 100
      ? "Daily goal completed. Great work!"
      : `${total - validDone} habit${total - validDone === 1 ? "" : "s"} left to reach today's goal.`;

  const calendarCells = [];

  for (let i = 27; i >= 0; i--) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const key = localDayKey(date);
    const done = total > 0 && completionForDay(key) === 100;
    const today = key === todayKey;

    calendarCells.push(`
      <div
        class="pro-cell ${done ? "done" : ""} ${today ? "today" : ""}"
        title="${key}: ${done ? "All habits completed" : `${completionForDay(key)}% complete`}"
        aria-label="${key}, ${done ? "all habits completed" : `${completionForDay(key)} percent complete`}"
      >${date.getDate()}</div>
    `);
  }

  calendar.innerHTML = calendarCells.join("");
}

/* ---------- ADVANCED ANALYTICS ---------- */

let analyticsRange = 7;

function ensureAnalyticsPanel() {
  if (document.querySelector("#analytics-panel")) return;

  const dashboard = document.querySelector("#dashboard-pro");
  if (!dashboard) return;

  const panel = document.createElement("section");
  panel.id = "analytics-panel";
  panel.className = "panel";
  panel.style.marginBottom = "30px";

  panel.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">DATA-DRIVEN GROWTH</p>
        <h2>Advanced Analytics</h2>
        <p class="muted">Track your habit performance.</p>
      </div>
    </div>

    <div class="analytics-switch" style="display:flex;gap:8px;margin-bottom:20px">
      <button class="button button-outline" data-range="7">7 Days</button>
      <button class="button button-outline" data-range="30">30 Days</button>
    </div>

    <div class="stats-grid" style="margin-bottom:20px">
      <article class="stat-card">
        <p class="muted">Completion Rate</p>
        <strong id="an-rate">0%</strong>
      </article>
      <article class="stat-card">
        <p class="muted">Habits Completed</p>
        <strong id="an-done">0</strong>
      </article>
      <article class="stat-card">
        <p class="muted">Perfect Days</p>
        <strong id="an-perfect">0</strong>
      </article>
      <article class="stat-card">
        <p class="muted">Tracked Days</p>
        <strong id="an-days">7</strong>
      </article>
    </div>

    <h3>Consistency by Habit</h3>
    <div id="an-habits" style="display:grid;gap:16px;margin-top:18px"></div>
    <p id="an-insight" class="muted" role="status"></p>
  `;

  dashboard.insertAdjacentElement("afterend", panel);

  panel.querySelectorAll("[data-range]").forEach(button => {
    button.addEventListener("click", () => {
      analyticsRange = Number(button.dataset.range);
      renderAnalytics();
    });
  });
}

function renderAnalytics() {
  ensureAnalyticsPanel();

  const list = document.querySelector("#an-habits");
  if (!list) return;

  const total = data.habits.length;
  let completedCount = 0;
  let perfectDays = 0;
  const perHabit = data.habits.map(h => ({
    name: h.name,
    done: 0
  }));

  for (let i = analyticsRange - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const key = localDayKey(date);
    const completed = new Set(doneIds(key));
    let dayDone = 0;

    data.habits.forEach((habit, index) => {
      if (completed.has(habit.id)) {
        perHabit[index].done++;
        completedCount++;
        dayDone++;
      }
    });

    if (total > 0 && dayDone === total) {
      perfectDays++;
    }
  }

  const possible = total * analyticsRange;
  const rate = possible
    ? Math.round(completedCount / possible * 100)
    : 0;

  document.querySelector("#an-rate").textContent = rate + "%";
  document.querySelector("#an-done").textContent = completedCount;
  document.querySelector("#an-perfect").textContent = perfectDays;
  document.querySelector("#an-days").textContent = analyticsRange;

  document.querySelectorAll("[data-range]").forEach(button => {
    const active = Number(button.dataset.range) === analyticsRange;
    button.classList.toggle("button-gold", active);
    button.classList.toggle("button-outline", !active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (!total) {
    list.textContent = "Add a habit to start tracking analytics.";
    document.querySelector("#an-insight").textContent =
      "Your reports will appear as you record your progress.";
    return;
  }

  perHabit.sort((a, b) => b.done - a.done);

  list.innerHTML = perHabit.map(h => {
    const pct = Math.round(h.done / analyticsRange * 100);

    return `
      <div>
        <div style="display:flex;justify-content:space-between;gap:10px;margin-bottom:7px">
          <span>${escapeHtml(h.name)}</span>
          <strong>${pct}%</strong>
        </div>
        <div style="height:8px;background:#302d27;border-radius:10px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#9e7834,#f1d79a);border-radius:10px"></div>
        </div>
        <small class="muted">${h.done} of ${analyticsRange} days completed</small>
      </div>
    `;
  }).join("");

  const best = perHabit[0];
  document.querySelector("#an-insight").textContent =
    "Your strongest habit is " + best.name +
    " with " + Math.round(best.done / analyticsRange * 100) +
    "% consistency. Keep building your routine one day at a time.";
}

/* ---------- ADVANCED ANALYTICS ---------- */

function ensureAnalyticsPanel() {
  if (document.querySelector("#analytics-panel")) return;

  const dashboard = document.querySelector("#dashboard-pro");
  if (!dashboard) return;

  const panel = document.createElement("section");
  panel.id = "analytics-panel";
  panel.className = "panel";
  panel.style.marginBottom = "30px";

  panel.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="eyebrow">DATA-DRIVEN GROWTH</p>
        <h2>Advanced Analytics</h2>
        <p class="muted">Track your habit performance.</p>
      </div>
    </div>

    <div class="analytics-switch" style="display:flex;gap:8px;margin-bottom:20px">
      <button class="button button-outline" data-range="7">7 Days</button>
      <button class="button button-outline" data-range="30">30 Days</button>
    </div>

    <div class="stats-grid" style="margin-bottom:20px">
      <article class="stat-card">
        <p class="muted">Completion Rate</p>
        <strong id="an-rate">0%</strong>
      </article>
      <article class="stat-card">
        <p class="muted">Habits Completed</p>
        <strong id="an-done">0</strong>
      </article>
      <article class="stat-card">
        <p class="muted">Perfect Days</p>
        <strong id="an-perfect">0</strong>
      </article>
      <article class="stat-card">
        <p class="muted">Tracked Days</p>
        <strong id="an-days">7</strong>
      </article>
    </div>

    <h3>Consistency by Habit</h3>
    <div id="an-habits" style="display:grid;gap:16px;margin-top:18px"></div>
    <p id="an-insight" class="muted" role="status"></p>
  `;

  dashboard.insertAdjacentElement("afterend", panel);

  panel.querySelectorAll("[data-range]").forEach(button => {
    button.addEventListener("click", () => {
      analyticsRange = Number(button.dataset.range);
      renderAnalytics();
    });
  });
}

function renderAnalytics() {
  ensureAnalyticsPanel();

  const list = document.querySelector("#an-habits");
  if (!list) return;

  const total = data.habits.length;
  let completedCount = 0;
  let perfectDays = 0;
  const perHabit = data.habits.map(h => ({
    name: h.name,
    done: 0
  }));

  for (let i = analyticsRange - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const key = localDayKey(date);
    const completed = new Set(doneIds(key));
    let dayDone = 0;

    data.habits.forEach((habit, index) => {
      if (completed.has(habit.id)) {
        perHabit[index].done++;
        completedCount++;
        dayDone++;
      }
    });

    if (total > 0 && dayDone === total) {
      perfectDays++;
    }
  }

  const possible = total * analyticsRange;
  const rate = possible
    ? Math.round(completedCount / possible * 100)
    : 0;

  document.querySelector("#an-rate").textContent = rate + "%";
  document.querySelector("#an-done").textContent = completedCount;
  document.querySelector("#an-perfect").textContent = perfectDays;
  document.querySelector("#an-days").textContent = analyticsRange;

  document.querySelectorAll("[data-range]").forEach(button => {
    const active = Number(button.dataset.range) === analyticsRange;
    button.classList.toggle("button-gold", active);
    button.classList.toggle("button-outline", !active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (!total) {
    list.textContent = "Add a habit to start tracking analytics.";
    document.querySelector("#an-insight").textContent =
      "Your reports will appear as you record your progress.";
    return;
  }

  perHabit.sort((a, b) => b.done - a.done);

  list.innerHTML = perHabit.map(h => {
    const pct = Math.round(h.done / analyticsRange * 100);

    return `
      <div>
        <div style="display:flex;justify-content:space-between;gap:10px;margin-bottom:7px">
          <span>${escapeHtml(h.name)}</span>
          <strong>${pct}%</strong>
        </div>
        <div style="height:8px;background:#302d27;border-radius:10px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#9e7834,#f1d79a);border-radius:10px"></div>
        </div>
        <small class="muted">${h.done} of ${analyticsRange} days completed</small>
      </div>
    `;
  }).join("");

  const best = perHabit[0];
  document.querySelector("#an-insight").textContent =
    "Your strongest habit is " + best.name +
    " with " + Math.round(best.done / analyticsRange * 100) +
    "% consistency. Keep building your routine one day at a time.";
}

/* ---------- ADVANCED ANALYTICS ---------- */

function getAnalyticsSummary(days = 7) {
  const today = new Date();
  const summary = {
    days,
    total: 0,
    completed: 0,
    rate: 0,
    bestDay: "No data"
  };

  const habits = data.habits || [];
  let bestRate = -1;

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const key = localDayKey(date);
    const done = new Set(data.completed[key] || []);
    const count = habits.filter(h => done.has(h.id)).length;

    summary.total += habits.length;
    summary.completed += count;

    const rate = habits.length
      ? Math.round(count / habits.length * 100)
      : 0;

    if (rate > bestRate) {
      bestRate = rate;
      summary.bestDay = date.toLocaleDateString(
        undefined,
        { weekday: "short", month: "short", day: "numeric" }
      );
    }
  }

  summary.rate = summary.total
    ? Math.round(summary.completed / summary.total * 100)
    : 0;

  return summary;
}

function renderAnalyticsPanel() {
  let panel = document.getElementById("analytics-panel");

  if (!panel) {
    panel = document.createElement("section");
    panel.id = "analytics-panel";
    panel.style.cssText =
      "margin:20px 0;padding:20px;border:1px solid #30291b;" +
      "border-radius:18px;background:#121212;color:#f3d68b;";

    const dashboard = document.querySelector("main") ||
      document.querySelector(".container");

    if (!dashboard) return;

    dashboard.appendChild(panel);
  }

  const stats = getAnalyticsSummary(7);

  panel.innerHTML = `
    <h2>Advanced Analytics</h2>
    <p>Last 7 days progress</p>
    <h3>${stats.rate}% Completion Rate</h3>
    <p>Completed: ${stats.completed} / ${stats.total}</p>
    <p>Best day: ${stats.bestDay}</p>
    <div style="height:8px;background:#30291b;border-radius:8px;overflow:hidden">
      <div style="height:100%;width:${stats.rate}%;background:#e5c477"></div>
    </div>
  `;
}


function renderExtraAnalytics() {
  const panel = document.getElementById("analytics-panel");
  if (!panel) return;

  let extra = document.getElementById("analytics-extra");

  if (!extra) {
    extra = document.createElement("div");
    extra.id = "analytics-extra";
    extra.style.marginTop = "24px";
    panel.appendChild(extra);
  }

  const days = analyticsRange || 7;
  const habits = data.habits || [];
  const daily = [];
  const counts = habits.map(h => ({ name: h.name, done: 0 }));

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const key = localDayKey(date);
    const completed = new Set(data.completed[key] || []);
    const done = habits.filter(h => completed.has(h.id)).length;

    habits.forEach((h, index) => {
      if (completed.has(h.id)) counts[index].done++;
    });

    daily.push({
      label: date.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
      rate: habits.length ? Math.round(done / habits.length * 100) : 0
    });
  }

  counts.sort((a, b) => b.done - a.done);
  const best = counts[0];

  let streak = 0;
if (habits.length) {
for (let i = 0; i < 365; i++) {
const date = new Date();
date.setHours(12, 0, 0, 0);
date.setDate(date.getDate() - i);
const completed = new Set(data.completed[localDayKey(date)] || []);
if (habits.every(h => completed.has(h.id))) {
streak++;
} else {
break;
}
}
}

  extra.innerHTML = `
    <h3>Daily Progress</h3>
    <p class="muted">Daily completion rate · Last ${days} days</p>
    <div style="display:flex;align-items:end;gap:4px;height:130px;margin:18px 0 8px">
      ${daily.map(d => `
        <div title="${escapeHtml(d.label)}: ${d.rate}%"
          style="flex:1;min-width:0;height:100%;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:6px">
          <div style="width:100%;height:${Math.max(d.rate, 3)}%;background:linear-gradient(180deg,#f1d79a,#9e7834);border-radius:5px 5px 0 0"></div>
        </div>
      `).join("")}
    </div>
    <p class="muted small">Bars show the percentage of habits completed each day.</p>
    <div class="stats-grid" style="margin-top:20px">
      <article class="stat-card">
        <p class="muted">Best Habit</p>
        <strong>${best ? escapeHtml(best.name) : "No habits yet"}</strong>
        <small>${best ? Math.round(best.done / days * 100) + "% consistency" : "Add a habit to begin"}</small>
      </article>
      <article class="stat-card">
        <p class="muted">Current Streak</p>
        <strong>${streak} ${streak === 1 ? "day" : "days"}</strong>
        <small>All habits completed each day</small>
      </article>
    </div>
  `;
}

/* ---------- HABITS ---------- */

function renderHabits() {
  const ids = doneIds();

  const markup = data.habits.map(h => {
    const isDone = ids.includes(h.id);

    return `
      <div class="habit-row ${isDone ? "is-done" : ""}">
        <button
          class="check ${isDone ? "done" : ""}"
          data-toggle="${escapeHtml(h.id)}"
          aria-label="Toggle ${escapeHtml(h.name)}"
          aria-pressed="${isDone}"
        >${isDone ? "✓" : ""}</button>

        <span class="habit-name">${escapeHtml(h.name)}</span>
        <span class="habit-tag">${escapeHtml(h.tag || "PERSONAL")}</span>
      </div>
    `;
  }).join("") || '<p class="muted">No habits yet. Add one below to get started.</p>';

  $("#habit-list").innerHTML = markup;
  $("#habit-list-full").innerHTML = markup;

  $$("[data-toggle]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.toggle;
      const list = doneIds();

      data.completed[todayKey] = list.includes(id)
        ? list.filter(x => x !== id)
        : [...list, id];

      save();
      render();
    });
  });
}

/* ---------- MAIN RENDER ---------- */

function render() {
  renderHabits();
  updateDailyGoal();
  renderDashboardPro();
  

renderAnalytics();
  renderExtraAnalytics();

  const total = data.habits.length;
  const done = doneIds().filter(id =>
    data.habits.some(h => h.id === id)
  ).length;

  $("#completed").textContent = `${done} / ${total}`;
  $("#consistency").textContent =
    `${total ? Math.round(done / total * 100) : 0}%`;

  // Keep the starter's streak label honest: this is not a historical streak.
  $("#streak").textContent =
    done === total && total > 0 ? "1 day" : "0 days";

  $("#sessions").textContent = String(data.workouts.length);

  $("#minutes-total").innerHTML =
    `${data.workouts.reduce((n, w) => n + Number(w.minutes || 0), 0)} <span>min</span>`;

  $("#workout-list").innerHTML = data.workouts
    .slice(-5)
    .reverse()
    .map(w => `
      <div class="workout-item">
        <span>${escapeHtml(w.activity)} · ${escapeHtml(w.date)}</span>
        <strong>${Number(w.minutes) || 0} min</strong>
      </div>
    `).join("") ||
    '<p class="muted small">Your logged sessions will appear here.</p>';
}

/* ---------- ADD HABITS ---------- */

function addHabit(input) {
  const name = input.value.trim();
  if (!name) return;

  data.habits.push({
    id: "h" + Date.now(),
    name,
    tag: "PERSONAL"
  });

  input.value = "";
  save();
  render();
  toast("Habit added");
}

$("#add-habit-form").addEventListener("submit", e => {
  e.preventDefault();
  addHabit($("#habit-input"));
});

$("#add-habit-form-full").addEventListener("submit", e => {
  e.preventDefault();
  addHabit($("#habit-input-full"));
});

/* ---------- NAVIGATION ---------- */

function showView(view) {
  $$(".view").forEach(el => {
    el.classList.toggle("hidden", el.id !== `view-${view}`);
  });

  $$(".nav-link").forEach(button => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

$$("[data-view]").forEach(button => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

$$("[data-jump]").forEach(button => {
  button.addEventListener("click", () => showView(button.dataset.jump));
});

$("#show-habits").addEventListener("click", () => showView("habits"));

/* ---------- FITNESS ---------- */

$("#workout-form").addEventListener("submit", e => {
  e.preventDefault();

  const minutes = Number($("#duration").value);

  if (!Number.isFinite(minutes) || minutes < 1 || minutes > 600) {
    $("#fitness-message").textContent =
      "Enter a duration between 1 and 600 minutes.";
    return;
  }

  data.workouts.push({
    activity: $("#activity").value,
    minutes,
    date: new Date().toLocaleDateString()
  });

  save();
  render();

  $("#fitness-message").textContent =
    "Workout saved on this device.";

  toast("Workout saved");
});

$("#weight-form").addEventListener("submit", e => {
  e.preventDefault();

  const val = $("#weight-input").value;
  if (!val) return;

  localStorage.setItem("habitzen-weight", val);
  $("#weight-message").textContent =
    `Saved ${val} kg on this device.`;
});

/* ---------- RECOVERY / URGE CHECK-IN ---------- */

let selectedUrge = 0;

$$("[data-urge]").forEach(button => {
  button.addEventListener("click", () => {
    selectedUrge = Number(button.dataset.urge);

    $$("[data-urge]").forEach(item => {
      item.classList.toggle("selected", item === button);
    });
  });
});

$("#urge-save").addEventListener("click", () => {
  if (!selectedUrge) {
    $("#urge-message").textContent =
      "Choose an intensity first.";
    return;
  }

  data.urgeLogs.push({
    level: selectedUrge,
    at: new Date().toISOString()
  });

  save();

  $("#urge-message").textContent =
    "Check-in saved locally. Try a slow breath and notice what you need.";

  toast("Check-in saved");
});

/* ---------- PRIVATE JOURNAL ---------- */

$("#journal").value =
  localStorage.getItem("habitzen-journal") || "";

$("#journal-save").addEventListener("click", () => {
  localStorage.setItem("habitzen-journal", $("#journal").value);

  $("#journal-message").textContent =
    "Saved in this browser on this device.";

  toast("Journal saved");
});

/* ---------- BREATHING TIMER ---------- */

let breathing = false;
let breathInterval = null;

$("#breath-start").addEventListener("click", () => {
  if (breathing) {
    clearInterval(breathInterval);
    breathing = false;

    $("#breath-circle").className = "breath-circle";
    $("#breath-circle").textContent = "Ready";
    $("#breath-start").textContent = "Start breathing";
    $("#breath-message").textContent = "Breathing paused.";
    return;
  }

  breathing = true;
  let sec = 0;

  $("#breath-start").textContent = "Stop breathing";
  $("#breath-message").textContent =
    "Stop anytime if you feel uncomfortable.";

  const tick = () => {
    const phase = sec % 8;
    const circle = $("#breath-circle");

    if (phase < 4) {
      circle.className = "breath-circle inhale";
      circle.textContent = "Breathe in";
    } else {
      circle.className = "breath-circle exhale";
      circle.textContent = "Breathe out";
    }

    sec++;

    if (sec >= 60) {
      clearInterval(breathInterval);
      breathing = false;

      circle.className = "breath-circle";
      circle.textContent = "Complete";
      $("#breath-start").textContent = "Start again";
      $("#breath-message").textContent =
        "One minute completed. Notice how you feel.";
    }
  };

  tick();
  breathInterval = setInterval(tick, 1000);
});

/* ---------- PREMIUM MODAL ---------- */

const dialog = $("#premium-dialog");

$("#premium-button").addEventListener("click", () => {
  dialog.showModal();
});

$("#modal-close").addEventListener("click", () => {
  dialog.close();
});

$("#notify-button").addEventListener("click", () => {
  dialog.close();
  toast("Premium payment is not connected yet");
});
/* ---------- DAILY REMINDERS ---------- */

const reminderInput = document.getElementById("reminder-time");
const reminderSave = document.getElementById("reminder-save");
const reminderStatus = document.getElementById("reminder-status");
const REMINDER_KEY = "habitzen-reminder-time";
let reminderTimer;

function checkReminder() {
  clearInterval(reminderTimer);

  const savedTime = localStorage.getItem(REMINDER_KEY);
  if (!savedTime) return;

  reminderInput.value = savedTime;
  reminderStatus.textContent = "Reminder set for " + savedTime;

  reminderTimer = setInterval(() => {
    const now = new Date();
    const currentTime =
      String(now.getHours()).padStart(2, "0") + ":" +
      String(now.getMinutes()).padStart(2, "0");
    const today = now.toDateString();

    if (
      currentTime === savedTime &&
      localStorage.getItem("habitzen-reminder-last") !== today
    ) {
      if (
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification("HabitZen Reminder", {
          body: "Time to complete your daily habits!"
        });
      }

      localStorage.setItem("habitzen-reminder-last", today);
    }
  }, 15000);
}

if (reminderSave && reminderInput && reminderStatus) {
  reminderSave.addEventListener("click", async () => {
    if (!reminderInput.value) {
      reminderStatus.textContent = "Please select a time.";
      return;
    }

    if (!("Notification" in window)) {
      reminderStatus.textContent =
        "Notifications are not supported in this browser.";
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      reminderStatus.textContent =
        "Allow notifications in browser settings.";
      return;
    }

    localStorage.setItem(REMINDER_KEY, reminderInput.value);
    localStorage.removeItem("habitzen-reminder-last");

    checkReminder();
    reminderStatus.textContent =
      "Reminder saved for " + reminderInput.value;
  });

  checkReminder();
}

/* ---------- SERVICE WORKER ---------- */

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .catch(() => {});
  });
}

/* ---------- START ---------- */

render();

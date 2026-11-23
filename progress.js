// progress.js — VeriMind / Real or Robot XP, Ranks, Badges & Judge Demo Mode
(function () {
  const STORAGE_KEY = "verimind_tsa_progress_v1";

  const DEFAULT_STATE = {
    xp: 0, // Max 400 XP (100 per module + 100 Final Challenge)
    badges: {
      foundations: false, // Neural Navigator (+100 XP)
      tools: false,       // Prompt Crafter (+100 XP)
      ethics: false,      // Ethics Guardian (+100 XP)
    },
    challengeCompleted: false,
    quizScore: null,
    judgeMode: false,
  };

  function getRankTitle(xp) {
    if (xp >= 300) return "AI Architect";
    if (xp >= 150) return "Prompt Strategist";
    return "AI Novice";
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved
        ? { ...DEFAULT_STATE, ...saved, badges: { ...DEFAULT_STATE.badges, ...(saved.badges || {}) } }
        : { ...DEFAULT_STATE };
    } catch {
      return { ...DEFAULT_STATE };
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    renderProgressUI(state);
  }

  window.PortalProgress = {
    getState: loadState,

    completeModule(moduleKey) {
      const state = loadState();
      if (Object.prototype.hasOwnProperty.call(state.badges, moduleKey) && !state.badges[moduleKey]) {
        state.badges[moduleKey] = true;
        state.xp = Math.min(400, state.xp + 100);
        saveState(state);
      }
    },

    completeChallenge(score) {
      const state = loadState();
      state.quizScore = score;
      if (score >= 8 && !state.challengeCompleted) {
        state.challengeCompleted = true;
        state.xp = Math.min(400, state.xp + 100);
      }
      saveState(state);
    },

    hasAllThreeBadges() {
      const { foundations, tools, ethics } = loadState().badges;
      return foundations && tools && ethics;
    },

    toggleJudgeMode() {
      const state = loadState();
      if (!state.judgeMode) {
        state.judgeMode = true;
        state.xp = 400;
        state.badges = { foundations: true, tools: true, ethics: true };
        state.challengeCompleted = true;
        state.quizScore = 10;
      } else {
        Object.assign(state, DEFAULT_STATE);
      }
      saveState(state);
    },

    reset() {
      saveState({ ...DEFAULT_STATE });
    },
  };

  function renderProgressUI(state) {
    const rank = getRankTitle(state.xp);

    // Sync with any custom dashboard IDs Arjun created in index.html
    const xpEl = document.getElementById("user-xp");
    if (xpEl) xpEl.textContent = `${state.xp} / 400 XP`;

    const rankEl = document.getElementById("user-rank");
    if (rankEl) rankEl.textContent = rank;

    ["foundations", "tools", "ethics"].forEach((key) => {
      const badgeEl = document.getElementById(`badge-${key}`);
      if (badgeEl) {
        badgeEl.style.opacity = state.badges[key] ? "1" : "0.28";
        badgeEl.classList.toggle("unlocked", state.badges[key]);
      }
    });

    // Floating Footer HUD for instant visibility on every page
    let bar = document.getElementById("tsa-floating-hud");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "tsa-floating-hud";
      Object.assign(bar.style, {
        position: "fixed",
        bottom: "16px",
        right: "16px",
        zIndex: "9999",
        background: "#0f172a",
        color: "#f8fafc",
        padding: "10px 14px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
        fontFamily: "system-ui, sans-serif",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        border: "1px solid #334155",
      });
      document.body.appendChild(bar);
    }

    const badgeCount = Object.values(state.badges).filter(Boolean).length;
    bar.innerHTML = `
      <div>
        <strong>⚡ ${state.xp}/400 XP</strong> (${rank}) &nbsp;|&nbsp;
        <span>🏅 ${badgeCount}/3 Badges</span>
      </div>
      <button id="judge-demo-btn" style="
        background: ${state.judgeMode ? "#10b981" : "#3b82f6"};
        color: #fff; border: none; padding: 6px 10px;
        border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;
      ">${state.judgeMode ? "✓ Judge Demo ON" : "Judge Demo Mode"}</button>
      <button id="reset-progress-btn" style="
        background: transparent; color: #94a3b8; border: 1px solid #475569;
        padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 11px;
      ">Reset</button>
    `;

    bar.querySelector("#judge-demo-btn").onclick = () => window.PortalProgress.toggleJudgeMode();
    bar.querySelector("#reset-progress-btn").onclick = () => window.PortalProgress.reset();
  }

  document.addEventListener("DOMContentLoaded", () => renderProgressUI(loadState()));
})();

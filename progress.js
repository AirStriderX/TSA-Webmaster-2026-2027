// progress.js — Student XP, Badge Unlocks, and TSA Judge Demo Mode
(function () {
  const STORAGE_KEY = "tsa_ai_portal_progress_v1";

  const DEFAULT_STATE = {
    xp: 0,
    badges: {
      foundations: false,
      tools: false,
      ethics: false,
    },
    quizScore: null,
    judgeMode: false,
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved ? { ...DEFAULT_STATE, ...saved, badges: { ...DEFAULT_STATE.badges, ...(saved.badges || {}) } } : { ...DEFAULT_STATE };
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

    awardXP(points, badgeKey = null) {
      const state = loadState();
      state.xp = Math.min(1000, state.xp + points);
      if (badgeKey && Object.prototype.hasOwnProperty.call(state.badges, badgeKey)) {
        state.badges[badgeKey] = true;
      }
      saveState(state);
    },

    setQuizScore(score) {
      const state = loadState();
      state.quizScore = score;
      saveState(state);
    },

    toggleJudgeMode() {
      const state = loadState();
      if (!state.judgeMode) {
        state.judgeMode = true;
        state.xp = 1000;
        state.badges = { foundations: true, tools: true, ethics: true };
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
    // Update existing elements if present in HTML
    const xpEl = document.getElementById("user-xp");
    if (xpEl) xpEl.textContent = `${state.xp} XP`;

    ["foundations", "tools", "ethics"].forEach((key) => {
      const badgeEl = document.getElementById(`badge-${key}`);
      if (badgeEl) {
        badgeEl.style.opacity = state.badges[key] ? "1" : "0.3";
        badgeEl.title = state.badges[key] ? `${key.toUpperCase()} Badge Unlocked!` : "Locked";
      }
    });

    // Inject floating TSA Progress & Judge Demo Bar if no custom bar exists
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
        padding: "12px 16px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
        fontFamily: "system-ui, sans-serif",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        border: "1px solid #334155",
      });
      document.body.appendChild(bar);
    }

    const unlockedCount = Object.values(state.badges).filter(Boolean).length;
    bar.innerHTML = `
      <div>
        <strong>⚡ ${state.xp} XP</strong> &nbsp;|&nbsp;
        <span>🏅 ${unlockedCount}/3 Badges</span>
      </div>
      <button id="judge-demo-btn" style="
        background: ${state.judgeMode ? "#10b981" : "#3b82f6"};
        color: white;
        border: none;
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 12px;
      ">
        ${state.judgeMode ? "✓ Judge Demo ON" : "Judge Demo Mode"}
      </button>
    `;

    document.getElementById("judge-demo-btn").onclick = () => window.PortalProgress.toggleJudgeMode();
  }

  document.addEventListener("DOMContentLoaded", () => renderProgressUI(loadState()));
})();

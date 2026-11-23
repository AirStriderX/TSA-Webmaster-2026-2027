// interactives.js — Interactive Labs for Foundations, Tools, Ethics & AI Tutor
(function () {
  // Optional: Paste your Cloudflare Worker URL here if you deployed one
  const WORKER_URL = "";

  const CLAIM_DATA = [
    {
      claim: "Studies from Harvard in 2024 proved that drinking 4 cups of salt water cures migraines instantly.",
      isHallucination: true,
      explanation: "Red Flag: Plausible-sounding authority ('Harvard in 2024') paired with an extreme medical claim ('cures instantly') and no verifiable journal link.",
    },
    {
      claim: "Large Language Models predict the next token based on statistical patterns rather than looking up facts in a live database.",
      isHallucination: false,
      explanation: "Accurate: LLMs generate text via token probability, which is why they can produce confident-sounding falsehoods unless grounded.",
    },
    {
      claim: "According to the 1998 Geneva Digital Accord, all AI images must contain a hidden 16-bit watermark.",
      isHallucination: true,
      explanation: "Red Flag: Fabricated historical treaty ('1998 Geneva Digital Accord')—a classic AI hallucination pattern.",
    },
  ];

  const MEDIA_SAMPLES = [
    {
      title: "Sample A: Political Rally Photo",
      clues: ["Hands have 6 merged fingers on the left bystander", "Background banner text dissolves into gibberish glyphs", "Unnatural plastic skin sheen under harsh lighting"],
      verdict: "AI-Generated (Diffusion Artifacts)",
    },
    {
      title: "Sample B: Local News Broadcast Clip",
      clues: ["Consistent ambient background noise across cuts", "Natural blinking and micro-expressions", "Verified metadata matching camera timestamp"],
      verdict: "Authentic Human Recording",
    },
  ];

  function getTargetContainer() {
    return (
      document.getElementById("interactive-lab") ||
      document.querySelector("main") ||
      document.body
    );
  }

  function renderFoundationsLab(container) {
    const box = document.createElement("section");
    box.style.cssText = "margin:24px auto;padding:20px;max-width:760px;background:#1e293b;color:#f8fafc;border-radius:12px;font-family:system-ui,sans-serif;";
    box.innerHTML = `<h2>🔍 Interactive Lab: AI Hallucination & Claim Checker</h2><p>Evaluate each AI-generated statement below to earn your <strong>Foundations Badge</strong>.</p><div id="claim-list"></div>`;
    container.appendChild(box);

    const list = box.querySelector("#claim-list");
    let solved = 0;

    CLAIM_DATA.forEach((item, idx) => {
      const card = document.createElement("div");
      card.style.cssText = "background:#0f172a;padding:14px;border-radius:8px;margin-top:12px;border:1px solid #334155;";
      card.innerHTML = `
        <p style="margin:0 0 10px;"><strong>Claim ${idx + 1}:</strong> "${item.claim}"</p>
        <button data-choice="true" style="margin-right:8px;padding:6px 12px;border-radius:6px;border:none;background:#ef4444;color:#fff;cursor:pointer;">🚩 AI Hallucination</button>
        <button data-choice="false" style="padding:6px 12px;border-radius:6px;border:none;background:#10b981;color:#fff;cursor:pointer;">✅ Verified Fact</button>
        <p class="feedback" style="margin:10px 0 0;font-size:14px;color:#94a3b8;"></p>
      `;

      card.querySelectorAll("button").forEach((btn) => {
        btn.onclick = () => {
          const guessedHallucination = btn.dataset.choice === "true";
          const fb = card.querySelector(".feedback");
          if (guessedHallucination === item.isHallucination) {
            fb.style.color = "#34d399";
            fb.textContent = "Correct! " + item.explanation;
            if (!card.dataset.done) {
              card.dataset.done = "1";
              solved++;
              if (window.PortalProgress) window.PortalProgress.awardXP(100, solved === CLAIM_DATA.length ? "foundations" : null);
            }
          } else {
            fb.style.color = "#f87171";
            fb.textContent = "Not quite — look closely at the specificity and source claims, then try again.";
          }
        };
      });
      list.appendChild(card);
    });
  }

  function renderToolsLab(container) {
    const box = document.createElement("section");
    box.style.cssText = "margin:24px auto;padding:20px;max-width:760px;background:#1e293b;color:#f8fafc;border-radius:12px;font-family:system-ui,sans-serif;";
    box.innerHTML = `
      <h2>🛠️ Interactive Lab: Prompt Engineering & Verification</h2>
      <p>Toggle constraints below to see how prompt structure reduces AI hallucinations and boosts reliability:</p>
      <label style="display:block;margin:8px 0;"><input type="checkbox" id="chk-role"> Add Expert Role ("Act as a peer-reviewed science editor")</label>
      <label style="display:block;margin:8px 0;"><input type="checkbox" id="chk-source"> Require Citations ("Cite only verifiable primary sources")</label>
      <label style="display:block;margin:8px 0;"><input type="checkbox" id="chk-unknown"> Allow Uncertainty ("Say 'I do not know' if unsure")</label>
      <div id="prompt-preview" style="margin-top:14px;padding:14px;background:#0f172a;border-radius:8px;border:1px solid #334155;"></div>
    `;
    container.appendChild(box);

    const update = () => {
      const r = box.querySelector("#chk-role").checked;
      const s = box.querySelector("#chk-source").checked;
      const u = box.querySelector("#chk-unknown").checked;
      const score = 25 + (r ? 25 : 0) + (s ? 25 : 0) + (u ? 25 : 0);

      box.querySelector("#prompt-preview").innerHTML = `
        <strong>Reliability Score: ${score}%</strong>
        <p style="margin:8px 0 0;color:#cbd5e1;">
          ${score === 100
            ? "🎉 Maximum reliability! Grounded constraints prevent fabricated citations. (Tools Badge Unlocked!)"
            : "Check all three guardrails to eliminate hallucination risk and unlock your Tools Badge."}
        </p>
      `;
      if (score === 100 && window.PortalProgress) {
        window.PortalProgress.awardXP(300, "tools");
      }
    };

    box.querySelectorAll("input").forEach((el) => (el.onchange = update));
    update();
  }

  function renderEthicsLab(container) {
    const box = document.createElement("section");
    box.style.cssText = "margin:24px auto;padding:20px;max-width:760px;background:#1e293b;color:#f8fafc;border-radius:12px;font-family:system-ui,sans-serif;";
    box.innerHTML = `<h2>🕵️ Interactive Lab: Synthetic Media & Deepfake Spotter</h2><p>Inspect the forensic clues on each media case to earn your <strong>Ethics Badge</strong>.</p>`;
    container.appendChild(box);

    MEDIA_SAMPLES.forEach((sample) => {
      const card = document.createElement("div");
      card.style.cssText = "background:#0f172a;padding:14px;border-radius:8px;margin-top:12px;border:1px solid #334155;";
      card.innerHTML = `
        <h3 style="margin:0 0 8px;font-size:16px;">${sample.title}</h3>
        <button class="xray-btn" style="padding:6px 12px;border-radius:6px;border:none;background:#6366f1;color:#fff;cursor:pointer;">🔬 Run Forensic X-Ray</button>
        <div class="xray-result" style="display:none;margin-top:10px;color:#e2e8f0;">
          <ul style="margin:0 0 8px;padding-left:20px;">${sample.clues.map((c) => `<li>${c}</li>`).join("")}</ul>
          <strong>Verdict: ${sample.verdict}</strong>
        </div>
      `;
      card.querySelector(".xray-btn").onclick = () => {
        card.querySelector(".xray-result").style.display = "block";
        if (window.PortalProgress) window.PortalProgress.awardXP(150, "ethics");
      };
      box.appendChild(card);
    });
  }

  function renderTutorWidget(container) {
    const tutor = document.createElement("section");
    tutor.style.cssText = "margin:24px auto;padding:20px;max-width:760px;background:#0f172a;color:#f8fafc;border-radius:12px;border:1px solid #334155;font-family:system-ui,sans-serif;";
    tutor.innerHTML = `
      <h3>🤖 AI Literacy Tutor</h3>
      <div id="tutor-log" style="max-height:180px;overflow-y:auto;margin-bottom:10px;font-size:14px;color:#cbd5e1;">
        <p><strong>Tutor:</strong> Ask me anything about spotting AI hallucinations, deepfakes, or writing safe prompts!</p>
      </div>
      <form id="tutor-form" style="display:flex;gap:8px;">
        <input id="tutor-input" type="text" placeholder="e.g., How do I spot an AI-generated image?" required style="flex:1;padding:8px 12px;border-radius:6px;border:1px solid #475569;background:#1e293b;color:#fff;">
        <button type="submit" style="padding:8px 16px;border-radius:6px;border:none;background:#3b82f6;color:#fff;font-weight:600;cursor:pointer;">Ask</button>
      </form>
    `;
    container.appendChild(tutor);

    const log = tutor.querySelector("#tutor-log");
    tutor.querySelector("#tutor-form").onsubmit = async (e) => {
      e.preventDefault();
      const input = tutor.querySelector("#tutor-input");
      const q = input.value.trim();
      if (!q) return;
      log.innerHTML += `<p><strong>You:</strong> ${q}</p>`;
      input.value = "";

      // Offline-safe smart responder + optional live Cloudflare Worker hook
      let reply = "Great question! Always cross-check specific dates, quotes, and statistics against two independent primary sources, and inspect images for distorted text or unnatural lighting.";
      if (/deepfake|image|photo|video/i.test(q)) {
        reply = "To spot synthetic media, look at hands, ears, background text, reflections, and audio breathing cadence—and check if reputable news outlets corroborate the event.";
      } else if (/prompt|hallucinat/i.test(q)) {
        reply = "Reduce hallucinations by giving the AI a specific role, supplying your own reference text, and instructing it to state 'I don't know' when evidence is missing.";
      }

      if (WORKER_URL) {
        try {
          const res = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },

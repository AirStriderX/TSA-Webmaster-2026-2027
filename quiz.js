// quiz.js — 10-Question AI Literacy Mastery Quiz & Printable Certificate
(function () {
  const QUESTIONS = [
    { q: "Why do Large Language Models sometimes invent fake citations?", options: ["They predict likely word sequences rather than querying a verified fact database", "Their hard drives run out of storage", "They are programmed to lie on purpose"], answer: 0 },
    { q: "Which visual clue commonly exposes an AI-generated image?", options: ["High contrast", "Warped background text and asymmetrical hands", "JPEG compression"], answer: 1 },
    { q: "What is the best way to ground an AI summary in accurate facts?", options: ["Ask it to guess creatively", "Paste the verified source text directly into the prompt", "Use all capital letters"], answer: 1 },
    { q: "What does 'human-in-the-loop' mean when using AI tools?", options: ["Letting AI publish automatically", "A qualified human reviews and verifies AI output before use", "Training AI without data"], answer: 1 },
    { q: "Which practice protects student privacy when using public AI chatbots?", options: ["Pasting full names and student IDs", "Removing personally identifiable information (PII) before prompting", "Sharing passwords in chat"], answer: 1 },
    { q: "What is a 'deepfake'?", options: ["A broken website link", "Synthetic audio, video, or images manipulated by AI to impersonate someone", "An encrypted database"], answer: 1 },
    { q: "Why is 'lateral reading' effective for verifying AI claims?", options: ["It opens new tabs to check what independent trusted sources say", "It reads the text from bottom to top", "It relies solely on the AI's own confidence score"], answer: 0 },
    { q: "What is algorithmic bias?", options: ["When a computer overheats", "Systematic unfairness caused by skewed training data or design", "Faster internet speeds"], answer: 1 },
    { q: "Which prompt instruction helps prevent fabricated answers?", options: ["'Never admit uncertainty'", "'If the provided text does not contain the answer, say you do not know'", "'Make it sound academic'"], answer: 1 },
    { q: "When citing AI assistance in academic or TSA work, what should you do?", options: ["Hide all AI usage", "Transparently document which AI tools were used and verify all facts", "List the AI as the sole author"], answer: 1 },
  ];

  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("quiz-container") || document.querySelector("main") || document.body;
    const section = document.createElement("section");
    section.style.cssText = "margin:24px auto;padding:24px;max-width:780px;background:#1e293b;color:#f8fafc;border-radius:12px;font-family:system-ui,sans-serif;";
    section.innerHTML = `
      <h2>🏆 AI Literacy Mastery Challenge (10 Questions)</h2>
      <p>Score <strong>8/10 or higher</strong> to unlock your printable TSA Webmaster AI Literacy Certificate.</p>
      <form id="tsa-quiz-form"></form>
      <div id="quiz-result" style="margin-top:20px;"></div>
    `;
    container.appendChild(section);

    const form = section.querySelector("#tsa-quiz-form");
    QUESTIONS.forEach((item, idx) => {
      const qDiv = document.createElement("div");
      qDiv.style.cssText = "background:#0f172a;padding:14px;border-radius:8px;margin-top:12px;border:1px solid #334155;";
      qDiv.innerHTML = `
        <p style="margin:0 0 8px;"><strong>${idx + 1}. ${item.q}</strong></p>
        ${item.options
          .map(
            (opt, oIdx) => `
          <label style="display:block;margin:6px 0;cursor:pointer;">
            <input type="radio" name="q${idx}" value="${oIdx}" required> ${opt}
          </label>`
          )
          .join("")}
      `;
      form.appendChild(qDiv);
    });

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit Challenge";
    submitBtn.style.cssText = "margin-top:16px;padding:10px 20px;border-radius:8px;border:none;background:#10b981;color:#fff;font-weight:700;font-size:15px;cursor:pointer;";
    form.appendChild(submitBtn);

    form.onsubmit = (e) => {
      e.preventDefault();
      let score = 0;
      QUESTIONS.forEach((item, idx) => {
        const chosen = form.querySelector(`input[name="q${idx}"]:checked`);
        if (chosen && Number(chosen.value) === item.answer) score++;
      });

      if (window.PortalProgress) {
        window.PortalProgress.setQuizScore(score);
        window.PortalProgress.awardXP(score * 30);
      }

      const resDiv = section.querySelector("#quiz-result");
      if (score >= 8) {
        resDiv.innerHTML = `
          <div id="printable-certificate" style="padding:28px;background:#ffffff;color:#0f172a;border:6px double #1d4ed8;border-radius:12px;text-align:center;">
            <h2 style="margin:0;color:#1e3a8a;">Certificate of AI Literacy Mastery</h2>
            <p style="margin:8px 0;">Awarded for scoring <strong>${score}/10 (${score * 10}%)</strong> on the TSA Webmaster AI Verification Challenge</p>
            <input type="text" placeholder="Enter Student / Judge Name Here" style="margin:12px 0;padding:8px;font-size:16px;text-align:center;border:1px solid #94a3b8;border-radius:6px;width:70%;">
            <p style="font-size:12px;color:#475569;">Verified via Client-Side Assessment Engine • ${new Date().toLocaleDateString()}</p>
            <button onclick="window.print()" style="margin-top:10px;padding:8px 16px;background:#1d4ed8;color:#fff;border:none;border-radius:6px;cursor:pointer;">🖨️ Print Certificate</button>
          </div>
        `;
      } else {
        resDiv.innerHTML = `<p style="color:#fbbf24;font-weight:600;">You scored ${score}/10. Review the modules and try again to reach 8/10 for your certificate!</p>`;
      }
    };
  });
})();

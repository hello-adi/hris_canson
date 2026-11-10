/* global browserAPI, normalizeWebsiteList, findMatchingSite */

// Guard against double-injection / re-execution via executeScript
if (!window.__hcInjected) {
  window.__hcInjected = true;

  (function runCheck() {
    if (typeof browserAPI === "undefined" || !browserAPI.storage) {
      // shared.js not ready yet (race with executeScript order) — retry once
      setTimeout(runCheck, 0);
      return;
    }

    browserAPI.storage.sync.get("websites", (data) => {
      const websites = normalizeWebsiteList(data.websites);
      if (!websites.length) return;

      const matchingSite = findMatchingSite(window.location.hostname, websites);
      if (matchingSite) {
        injectOverlay(matchingSite.category || "Other");
      }
    });
  })();
}

function injectOverlay(category) {
  // Chris Hansen–style interrogation lines. Category packs share the original
  // spine and only lean slightly into shopping / social / entertainment.
  const MESSAGE_PACKS = {
    Shopping: [
      "You see how this looks, right?",
      "Why don't you go ahead and have a seat… and think about your spending habits.",
      "You knew exactly what you were doing when you typed this URL.",
      "What are you doing here today?",
      "What was your plan here today?",
      "This wasn't part of the plan, was it?",
      "Look at you, caught in the act. What do you have to say for yourself?",
      "We both know this isn't where you should be right now.",
      "It's a little late to be prowling around these parts, huh?",
      "No hug for me? That 'quick purchase' just became a slippery slope.",
      "Hey Boo, why don't you have a seat",
      "This looked like a good idea five minutes ago.",
      "Why don't you go ahead and have a seat… and think about your choices.",
    ],
    Social: [
      "You see how this looks, right?",
      "What was your plan here today?",
      "We both know this isn't where you should be right now.",
      "Look at you, caught in the act. What do you have to say for yourself?",
      "This wasn't part of the plan, was it?",
      "What are you doing here today?",
      "You knew exactly what you were doing when you typed this URL.",
      "It's a little late to be prowling around these parts, huh?",
      "No hug for me? That 'quick visit' just became a slippery slope.",
      "Hey Boo, why don't you have a seat",
      "Why don't you go ahead and have a seat.",
    ],
    Entertainment: [
      "You see how this looks, right?",
      "Why don't you go ahead and have a seat… and pick something on purpose.",
      "It's a little late to be prowling around these parts, huh?",
      "What are you doing here today?",
      "This wasn't a 'quick check.' Be honest.",
      "What was your plan here today?",
      "This wasn't part of the plan, was it?",
      "You knew exactly what you were doing when you typed this URL.",
      "Look at you, caught in the act. What do you have to say for yourself?",
      "We both know this isn't where you should be right now.",
      "No hug for me? That 'quick visit' just became a slippery slope.",
      "Hey Boo, why don't you have a seat",
      "Why don't you go ahead and have a seat… and think about your choices.",
    ],
    Other: [
      "Big night planned.",
      "Why don't you go ahead and have a seat… and think about your choices.",
      "What are you doing here today?",
      "Hey Boo, why don't you have a seat",
      "You knew exactly what you were doing when you typed this URL.",
      "What was your plan here today?",
      "This wasn't part of the plan, was it?",
      "No hug for me? That 'quick visit' just became a slippery slope.",
      "It's a little late to be prowling around these parts, huh?",
      "We both know this isn't where you should be right now.",
    ],
  };

  const pack = MESSAGE_PACKS[category] || MESSAGE_PACKS.Other;
  const message = pack[Math.floor(Math.random() * pack.length)];

  const style = document.createElement("style");
  style.setAttribute("data-hc", "styles");
  style.textContent = `
    @import url("https://fonts.googleapis.com/css2?family=Allerta+Stencil&family=IBM+Plex+Sans:wght@400;500;600&family=Michroma&display=swap");

    #hc-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: rgba(0, 0, 0, 0.42);
      backdrop-filter: blur(7px);
      -webkit-backdrop-filter: blur(7px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Michroma', monospace;
      animation: hc-fade-in 0.35s ease;
    }

    @keyframes hc-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes hc-panel-in {
      from { opacity: 0; transform: translateY(14px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    #hc-panel {
      display: flex;
      align-items: stretch;
      overflow: hidden;
      border-radius: 8px;
      background: #0a0a0a url("${browserAPI.runtime.getURL("images/block_lines_background.png")}") center / cover no-repeat;
      box-shadow: 0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04);
      max-width: 760px;
      width: 90%;
      animation: hc-panel-in 0.4s ease;
    }

    #hc-chris-panel {
      width: 220px;
      flex-shrink: 0;
      align-self: flex-end;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      background: transparent;
    }

    #hc-chris-panel img {
      width: 200px;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 0 40px rgba(209,117,36,0.2));
    }

    #hc-content {
      flex: 1;
      padding: 44px 36px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      min-width: 0;
    }

    #hc-headline {
      font-family: 'Allerta Stencil', serif;
      font-size: 26px;
      line-height: 1.25;
      color: #4caf29;
      margin: 0;
    }

    #hc-divider {
      width: 40px;
      height: 2px;
      background: #d17524;
    }

    #hc-seat-btn {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      background: linear-gradient(180deg, #dd8738 0%, #d17524 100%);
      color: #f5f0e8;
      border: 1px solid rgba(255,220,174,0.35);
      border-radius: 6px;
      padding: 14px 28px;
      cursor: pointer;
      align-self: flex-start;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
      transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    }
    #hc-seat-btn:hover {
      background: linear-gradient(180deg, #d17524 0%, #b9631e 100%);
    }
    #hc-seat-btn:active { transform: translateY(1px); }
    #hc-seat-btn:focus-visible {
      outline: 2px solid #e39752;
      outline-offset: 3px;
    }

    #hc-confession-box {
      display: none;
      flex-direction: row;
      gap: 14px;
      align-items: flex-end;
    }

    #hc-confession-fields {
      display: flex;
      flex-direction: column;
      gap: 14px;
      flex: 1;
      min-width: 0;
    }

    #hc-peering-chris {
      width: 90px;
      flex-shrink: 0;
      align-self: flex-end;
      margin-bottom: -4px;
      opacity: 0;
      transform: translateX(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
      pointer-events: none;
    }
    #hc-peering-chris.hc-visible {
      opacity: 1;
      transform: translateX(0);
    }
    #hc-peering-chris img {
      width: 100%;
      display: block;
      filter: drop-shadow(-4px 0 16px rgba(0,0,0,0.6));
    }

    #hc-confession-label {
      font-family: 'Michroma', monospace;
      font-size: 12px;
      letter-spacing: 0.1em;
      color: #f5f0e8;
      opacity: 0.7;
    }

    #hc-confession-input {
      font-family: 'Michroma', monospace;
      font-size: 13px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 6px;
      color: #f5f0e8;
      padding: 14px;
      resize: none;
      width: 100%;
      box-sizing: border-box;
      height: 120px;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    #hc-confession-input:focus {
      border-color: #d17524;
      box-shadow: 0 0 0 2px rgba(209,117,36,0.2);
    }
    #hc-confession-input::placeholder {
      color: rgba(245,240,232,0.25);
    }

    #hc-char-counter {
      font-family: 'Michroma', monospace;
      font-size: 11px;
      color: rgba(245,240,232,0.3);
      text-align: right;
    }
    #hc-char-counter.hc-ready {
      color: #d17524;
    }

    #hc-submit-btn {
      font-family: 'Michroma', monospace;
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      background: rgba(209,117,36,0.14);
      color: rgba(245,240,232,0.58);
      border: 1px solid rgba(209,117,36,0.3);
      border-radius: 6px;
      padding: 12px 24px;
      cursor: not-allowed;
      align-self: flex-start;
      transition: all 0.15s;
    }
    #hc-submit-btn.hc-active {
      color: #f5f0e8;
      border-color: rgba(255,220,174,0.35);
      background: linear-gradient(180deg, #dd8738 0%, #d17524 100%);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
      cursor: pointer;
    }
    #hc-submit-btn.hc-active:hover {
      background: linear-gradient(180deg, #d17524 0%, #b9631e 100%);
    }
    #hc-submit-btn:focus-visible {
      outline: 2px solid #d17524;
      outline-offset: 2px;
    }

    #hc-toast {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      z-index: 2147483647;
      background: #002627;
      border: 1px solid #d17524;
      border-radius: 6px;
      color: #f5f0e8;
      font-family: 'Michroma', monospace;
      font-size: 13px;
      padding: 16px 24px;
      max-width: 480px;
      width: 90%;
      box-sizing: border-box;
      opacity: 0;
      transition: opacity 0.4s ease, transform 0.4s ease;
      pointer-events: none;
    }
    #hc-toast.hc-visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    #hc-toast-label {
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #4caf29;
      margin-bottom: 6px;
    }
    #hc-toast-text {
      line-height: 1.6;
      color: rgba(245,240,232,0.75);
      word-break: break-word;
    }

    @media (max-width: 640px) {
      #hc-panel { flex-direction: column; }
      #hc-chris-panel { width: 100%; justify-content: center; border-right: none; border-bottom: 1px solid #1a1a1a; }
      #hc-chris-panel img { width: 120px; margin: 0 auto; }
      #hc-content { padding: 28px 22px; }
      #hc-headline { font-size: 20px; }
      #hc-peering-chris { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      #hc-overlay, #hc-panel, #hc-peering-chris, #hc-toast {
        animation: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "hc-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "hc-headline");

  const panel = document.createElement("div");
  panel.id = "hc-panel";

  const chrisPanel = document.createElement("div");
  chrisPanel.id = "hc-chris-panel";
  const chrisImg = document.createElement("img");
  chrisImg.src = browserAPI.runtime.getURL("images/rpatz-side.png");
  chrisImg.alt = "Hris Canson";
  chrisPanel.appendChild(chrisImg);

  const content = document.createElement("div");
  content.id = "hc-content";

  const headline = document.createElement("h1");
  headline.id = "hc-headline";
  headline.textContent = message;

  const divider = document.createElement("div");
  divider.id = "hc-divider";

  const seatBtn = document.createElement("button");
  seatBtn.id = "hc-seat-btn";
  seatBtn.type = "button";
  seatBtn.textContent = "Take a seat";

  const confessionBox = document.createElement("div");
  confessionBox.id = "hc-confession-box";

  const fields = document.createElement("div");
  fields.id = "hc-confession-fields";

  const label = document.createElement("div");
  label.id = "hc-confession-label";
  label.textContent = "Before you proceed, explain yourself. In writing.";

  const textarea = document.createElement("textarea");
  textarea.id = "hc-confession-input";
  textarea.placeholder = "I came to this website because…";
  textarea.maxLength = 400;
  textarea.setAttribute("aria-label", "Written confession");

  const counter = document.createElement("div");
  counter.id = "hc-char-counter";
  counter.textContent = "0 / 60 min";

  const submitBtn = document.createElement("button");
  submitBtn.id = "hc-submit-btn";
  submitBtn.type = "button";
  submitBtn.disabled = true;
  submitBtn.textContent = "Let me go";

  fields.appendChild(label);
  fields.appendChild(textarea);
  fields.appendChild(counter);
  fields.appendChild(submitBtn);

  const peering = document.createElement("div");
  peering.id = "hc-peering-chris";
  peering.setAttribute("aria-hidden", "true");
  const peerImg = document.createElement("img");
  peerImg.src = browserAPI.runtime.getURL("images/rpatz_slide.png");
  peerImg.alt = "";
  peering.appendChild(peerImg);

  confessionBox.appendChild(fields);
  confessionBox.appendChild(peering);

  content.appendChild(headline);
  content.appendChild(divider);
  content.appendChild(seatBtn);
  content.appendChild(confessionBox);

  panel.appendChild(chrisPanel);
  panel.appendChild(content);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  const toast = document.createElement("div");
  toast.id = "hc-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  const toastLabel = document.createElement("div");
  toastLabel.id = "hc-toast-label";
  toastLabel.textContent = "Your confession";
  const toastText = document.createElement("div");
  toastText.id = "hc-toast-text";
  toast.appendChild(toastLabel);
  toast.appendChild(toastText);
  document.body.appendChild(toast);

  const MIN_CHARS = 60;
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  // Focus trap + initial focus
  const focusableSelector =
    'button:not([disabled]), textarea:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function getFocusable() {
    return Array.from(overlay.querySelectorAll(focusableSelector)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    );
  }

  seatBtn.focus();

  overlay.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  seatBtn.addEventListener("click", () => {
    seatBtn.style.display = "none";
    confessionBox.style.display = "flex";
    textarea.focus();
    setTimeout(() => peering.classList.add("hc-visible"), 300);
  });

  function updateReady() {
    const len = textarea.value.length;
    const ready = len >= MIN_CHARS;
    counter.textContent = `${len} / ${MIN_CHARS} min`;
    counter.classList.toggle("hc-ready", ready);
    submitBtn.disabled = !ready;
    submitBtn.classList.toggle("hc-active", ready);
  }

  textarea.addEventListener("input", updateReady);

  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !submitBtn.disabled) {
      e.preventDefault();
      submitBtn.click();
    }
  });

  function dismiss(confession) {
    document.body.style.overflow = previousOverflow;
    overlay.remove();
    // Keep injected styles until the toast finishes so it still looks right
    // while you scroll the page underneath.
    toastText.textContent = `"${confession}"`;
    // Force reflow so the enter transition plays
    void toast.offsetWidth;
    toast.classList.add("hc-visible");
    setTimeout(() => {
      toast.classList.remove("hc-visible");
      setTimeout(() => {
        toast.remove();
        style.remove();
      }, 500);
    }, 6000);
  }

  submitBtn.addEventListener("click", () => {
    if (submitBtn.disabled) return;
    const confession = textarea.value.trim();
    if (confession.length < MIN_CHARS) return;
    dismiss(confession);
  });
}

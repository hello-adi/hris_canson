document.addEventListener("DOMContentLoaded", function () {
  const helpBtn = document.getElementById("helpBtn");
  const helpModal = document.getElementById("helpModal");
  const closeHelp = document.getElementById("closeHelp");
  const websiteInput = document.getElementById("websiteInput");
  const categorySelect = document.getElementById("categorySelect");
  const addWebsiteButton = document.getElementById("addWebsite");
  const websiteList = document.getElementById("websiteList");
  const emptyState = document.getElementById("emptyState");
  const feedback = document.getElementById("feedback");

  let feedbackTimer = null;

  function showFeedback(message, ok) {
    feedback.textContent = message;
    feedback.classList.add("is-visible");
    feedback.classList.toggle("is-ok", !!ok);
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
      feedback.classList.remove("is-visible");
    }, 2200);
  }

  function openHelp() {
    helpModal.hidden = false;
    helpModal.classList.add("is-open");
    closeHelp.focus();
  }

  function closeHelpModal() {
    helpModal.classList.remove("is-open");
    helpModal.hidden = true;
    helpBtn.focus();
  }

  helpBtn.addEventListener("click", openHelp);
  closeHelp.addEventListener("click", closeHelpModal);

  helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) closeHelpModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && helpModal.classList.contains("is-open")) {
      closeHelpModal();
    }
  });

  function updateEmptyState() {
    const items = websiteList.querySelectorAll(".site-item");
    emptyState.style.display = items.length === 0 ? "block" : "none";
  }

  function loadWebsites() {
    browserAPI.storage.sync.get("websites", (data) => {
      const websites = normalizeWebsiteList(data.websites);
      // Persist migration (genre → category, normalized hosts)
      browserAPI.storage.sync.set({ websites });

      websiteList.innerHTML = "";
      websiteList.appendChild(emptyState);
      websites.forEach(displayWebsite);
      updateEmptyState();
    });
  }

  function flashAddSuccess() {
    addWebsiteButton.classList.add("is-success");
    const prev = addWebsiteButton.textContent;
    addWebsiteButton.textContent = "Added";
    setTimeout(() => {
      addWebsiteButton.classList.remove("is-success");
      addWebsiteButton.textContent = prev;
    }, 900);
  }

  function addWebsite() {
    const host = normalizeHost(websiteInput.value);
    const category = categorySelect.value;

    if (!host) {
      showFeedback("Enter a valid site like amazon.com", false);
      websiteInput.focus();
      return;
    }

    browserAPI.storage.sync.get("websites", (data) => {
      const websites = normalizeWebsiteList(data.websites);

      if (websites.some((s) => s.url === host)) {
        showFeedback("Already on the watchlist", false);
        return;
      }

      const site = { url: host, category };
      websites.push(site);
      browserAPI.storage.sync.set({ websites }, () => {
        displayWebsite(site);
        websiteInput.value = "";
        updateEmptyState();
        flashAddSuccess();
        showFeedback("Suspect added", true);
        websiteInput.focus();
      });
    });
  }

  addWebsiteButton.addEventListener("click", addWebsite);

  websiteInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addWebsite();
    }
  });

  function displayWebsite(site) {
    const li = document.createElement("li");
    li.className = "site-item";

    const urlSpan = document.createElement("span");
    urlSpan.className = "site-url";
    urlSpan.textContent = site.url;
    urlSpan.title = site.url;

    const catSpan = document.createElement("span");
    catSpan.className = "site-category";
    catSpan.textContent = site.category;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.setAttribute("aria-label", "Remove " + site.url);
    removeBtn.title = "Remove";
    removeBtn.textContent = "✕";

    removeBtn.addEventListener("click", () => {
      removeWebsite(site.url);
      li.remove();
      updateEmptyState();
      showFeedback("Removed from watchlist", true);
    });

    li.appendChild(urlSpan);
    li.appendChild(catSpan);
    li.appendChild(removeBtn);
    websiteList.appendChild(li);
  }

  function removeWebsite(url) {
    browserAPI.storage.sync.get("websites", (data) => {
      const websites = normalizeWebsiteList(data.websites).filter(
        (s) => s.url !== url
      );
      browserAPI.storage.sync.set({ websites });
    });
  }

  loadWebsites();
});

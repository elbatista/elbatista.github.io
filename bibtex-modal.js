(function () {
  const modal = document.getElementById("bibtexModal");
  const pre = document.getElementById("bibtexText");
  const openFile = document.getElementById("bibtexOpenFile");
  const copyBtn = document.getElementById("bibtexCopy");
  const closeBtn = modal.querySelector(".modal-close");

  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    pre.textContent = "";
    openFile.href = "#";
    copyBtn.textContent = "Copy";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") closeModal();
  }

  async function loadBibtex(url) {
    pre.textContent = "Loading...";
    copyBtn.textContent = "Copy";
    openFile.href = url;

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const text = await res.text();
      pre.textContent = text.trim() || "(empty file)";
    } catch (err) {
      pre.textContent =
        "Could not load BibTeX file.\n\n" +
        url +
        "\n\nError: " +
        err.message;
    }
  }

  // Click on any BibTeX link
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a.bibtex-link");
    if (!a) return;

    e.preventDefault();
    const url = a.getAttribute("href");
    if (!url) return;

    openModal();
    loadBibtex(url);
  });

  // Close on background click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  closeBtn.addEventListener("click", closeModal);

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pre.textContent);
      copyBtn.textContent = "Copied!";
    } catch (e) {
      const range = document.createRange();
      range.selectNodeContents(pre);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      copyBtn.textContent = "Select & Copy";
    }
  });
})();
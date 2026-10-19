/* Pip-Boy easter egg — press E (or open #pipboy) to toggle the panel */
(function () {
  "use strict";
  var panel = document.getElementById("pipboy");
  if (!panel) return;
  var closeBtn = document.getElementById("pipboy-close");
  var openBtn = document.getElementById("pipboy-open");
  var clock = document.getElementById("pb-clock");
  var lastFocus = null;

  function isOpen() { return !panel.hidden; }

  function open() {
    if (isOpen()) return;
    lastFocus = document.activeElement;
    panel.hidden = false;
    void panel.offsetWidth; /* reflow so the slide transition runs */
    document.body.classList.add("pb-open");
    closeBtn.focus();
  }

  function close() {
    if (!isOpen()) return;
    panel.hidden = true;
    document.body.classList.remove("pb-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key.toLowerCase();
    if (k === "e") {
      e.preventDefault();
      if (isOpen()) { close(); } else { open(); }
    } else if (k === "escape" && isOpen()) {
      close();
    }
  });

  /* focus trap while open */
  panel.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    var f = panel.querySelectorAll("button, a[href]");
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  closeBtn.addEventListener("click", close);
  if (openBtn) openBtn.addEventListener("click", open);
  panel.addEventListener("click", function (e) { if (e.target === panel) close(); });

  /* inventory links close the panel, then the page jumps to the anchor */
  panel.querySelectorAll(".pipboy-inv a").forEach(function (a) {
    a.addEventListener("click", close);
  });

  /* live clock */
  function tick() {
    clock.textContent = new Date().toLocaleTimeString("en-GB", { hour12: false });
  }
  tick();
  setInterval(tick, 1000);

  /* deep link: #pipboy */
  if (location.hash === "#pipboy") open();
})();

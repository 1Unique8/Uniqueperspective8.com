(function () {
  var nav = document.querySelector("[data-up8-nav]");
  if (!nav) return;
  var toggle = nav.querySelector(".up8-nav-toggle");
  var buttons = Array.prototype.slice.call(nav.querySelectorAll(".up8-menu > button"));

  function closeAll(except) {
    buttons.forEach(function (b) {
      if (b === except) return;
      b.setAttribute("aria-expanded", "false");
      document.getElementById(b.getAttribute("aria-controls")).hidden = true;
    });
  }
  function setOpen(btn, open) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    document.getElementById(btn.getAttribute("aria-controls")).hidden = !open;
  }

  buttons.forEach(function (btn, i) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      closeAll(btn);
      setOpen(btn, open);
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        closeAll(btn);
        setOpen(btn, true);
        var first = panel.querySelector("a");
        if (first) first.focus();
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        var next = buttons[(i + (e.key === "ArrowRight" ? 1 : buttons.length - 1)) % buttons.length];
        next.focus();
      }
    });
    panel.addEventListener("keydown", function (e) {
      var links = Array.prototype.slice.call(panel.querySelectorAll("a"));
      var idx = links.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); links[(idx + 1) % links.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); links[(idx - 1 + links.length) % links.length].focus(); }
      else if (e.key === "Escape") { setOpen(btn, false); btn.focus(); }
    });
  });

  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
      if (!open) closeAll();
    });
  }

  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target)) closeAll();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var openBtn = buttons.filter(function (b) { return b.getAttribute("aria-expanded") === "true"; })[0];
      closeAll();
      if (openBtn) openBtn.focus();
    }
  });
  nav.addEventListener("focusout", function (e) {
    if (e.relatedTarget && !nav.contains(e.relatedTarget)) closeAll();
  });
})();

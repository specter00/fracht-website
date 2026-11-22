(function () {
  "use strict";
  var tpl = document.getElementById("wa-qr-panel");
  if (!tpl || !tpl.content || !window.QRCode) return;
  var desktop = window.matchMedia("(min-width: 961px) and (pointer: fine)");
  var pop = null, opener = null;
  function close(refocus) {
    if (!pop) return;
    pop.parentNode.removeChild(pop);
    pop = null;
    if (opener) {
      opener.removeAttribute("aria-expanded");
      if (refocus) opener.focus();
    }
    opener = null;
  }
  function anchorOf(a) {
    var menu = a.closest(".menu");
    return menu ? menu.querySelector("summary") : a;
  }
  function open(a) {
    close(false);
    opener = a;
    var href = a.getAttribute("href");
    pop = tpl.content.firstElementChild.cloneNode(true);
    pop.querySelector(".wa-qr").innerHTML = window.QRCode.svg(href, { dark: "#13254a", border: 2 });
    pop.querySelector(".wa-pop-web").setAttribute("href", href);
    pop.querySelector(".wa-pop-note").hidden = !a.closest(".result");
    document.body.appendChild(pop);
    var r = anchorOf(a).getBoundingClientRect();
    var maxLeft = window.pageXOffset + document.documentElement.clientWidth - pop.offsetWidth - 16;
    pop.style.left = Math.max(16, Math.min(r.left + window.pageXOffset, maxLeft)) + "px";
    pop.style.top = (r.bottom + window.pageYOffset + 12) + "px";
    a.setAttribute("aria-expanded", "true");
    pop.querySelector(".wa-pop-close").addEventListener("click", function () { close(true); });
    pop.querySelector(".wa-pop-web").addEventListener("click", function () { close(false); });
    pop.querySelector(".wa-pop-close").focus({ preventScroll: true });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
    if (a && !a.classList.contains("wa-pop-web") && desktop.matches && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      open(a);
      return;
    }
    if (pop && !pop.contains(e.target)) close(false);
  }, true);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && pop) close(true); });
  window.addEventListener("resize", function () { close(false); });
})();

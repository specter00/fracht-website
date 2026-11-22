(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var mq = window.matchMedia("(max-width: 960px)");
  var head = doc.querySelector(".site-header");
  var menu = doc.querySelector(".menu");
  var bar = doc.querySelector(".action-bar");
  var fieldSel = "input:not([type=radio]):not([type=checkbox]):not([type=hidden]), select, textarea";
  doc.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-view]");
    if (!t) return;
    e.preventDefault();
    var desktop = t.getAttribute("data-view") === "desktop";
    try {
      if (desktop) sessionStorage.setItem("site-view", "desktop"); else sessionStorage.removeItem("site-view");
      window.location.replace(window.location.pathname + window.location.search);
    } catch (err) {
      var vp = doc.querySelector('meta[name="viewport"]');
      if (vp) vp.setAttribute("content", desktop ? "width=1280, initial-scale=" + Math.min(1, (screen.width || 1280) / 1280).toFixed(3) : "width=device-width, initial-scale=1, viewport-fit=cover");
      root.classList.toggle("view-desktop", desktop);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  });
  var lastY = window.pageYOffset;
  function onScroll() {
    var y = window.pageYOffset;
    if (head && mq.matches && !(menu && menu.open)) {
      var dy = y - lastY;
      if (Math.abs(dy) >= 8) {
        head.classList.toggle("is-tucked", dy > 0 && y > head.offsetHeight + 60);
        lastY = y;
      }
    } else {
      lastY = y;
    }
    updateBar();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  if (head) head.addEventListener("focusin", function () { head.classList.remove("is-tucked"); });
  if (menu) {
    menu.addEventListener("toggle", function () {
      if (menu.open && head) {
        head.classList.remove("is-tucked");
        root.style.setProperty("--menu-top", Math.max(0, Math.round(head.getBoundingClientRect().bottom)) + "px");
      }
      root.classList.toggle("menu-locked", menu.open && mq.matches);
      updateBar();
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a") && !e.target.closest("[data-view]")) menu.open = false;
    });
    doc.addEventListener("click", function (e) {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.open) {
        menu.open = false;
        var s = menu.querySelector("summary");
        if (s) s.focus();
      }
    });
  }
  var covering = [];
  var typing = false;
  function updateBar() {
    if (!bar) return;
    var ready = !bar.classList.contains("action-bar-calc") || bar.hasAttribute("data-ready");
    var show = mq.matches && ready && !typing && !(menu && menu.open) && covering.length === 0 && window.pageYOffset > 120;
    bar.classList.toggle("is-shown", show);
  }
  if (bar) {
    var watched = doc.querySelectorAll("[data-bar-hide]");
    if ("IntersectionObserver" in window && watched.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var i = covering.indexOf(en.target);
          if (en.isIntersecting && i < 0) covering.push(en.target);
          if (!en.isIntersecting && i >= 0) covering.splice(i, 1);
        });
        updateBar();
      });
      Array.prototype.forEach.call(watched, function (el) { io.observe(el); });
    }
    doc.addEventListener("focusin", function (e) {
      if (e.target.matches && e.target.matches(fieldSel)) { typing = true; updateBar(); }
    });
    doc.addEventListener("focusout", function () {
      window.setTimeout(function () {
        var a = doc.activeElement;
        typing = !!(a && a.matches && a.matches(fieldSel));
        updateBar();
      }, 150);
    });
  }
  window.MobileBar = { update: updateBar };
  var faqList = doc.querySelector(".faq-list");
  function setAnswer(item, open) {
    var btn = item.querySelector(".faq-q button"), a = item.querySelector(".faq-a");
    if (!btn || !a) return;
    btn.setAttribute("aria-expanded", String(open));
    a.classList.toggle("is-open", open);
  }
  function openFromHash() {
    var id = window.location.hash.slice(1);
    if (!id) return;
    var item = doc.getElementById(decodeURIComponent(id));
    if (item && item.classList.contains("faq-item")) {
      setAnswer(item, true);
      item.scrollIntoView();
    }
  }
  function setupFaq(on) {
    if (!faqList) return;
    faqList.classList.toggle("faq-acc", on);
    Array.prototype.forEach.call(faqList.querySelectorAll(".faq-item"), function (item) {
      var q = item.querySelector(".faq-q"), a = item.querySelector(".faq-a");
      if (!q || !a) return;
      var btn = q.querySelector("button");
      if (on && !btn) {
        btn = doc.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-controls", a.id);
        var label = doc.createElement("span");
        while (q.firstChild) label.appendChild(q.firstChild);
        btn.appendChild(label);
        q.appendChild(btn);
        btn.addEventListener("click", function () { setAnswer(item, btn.getAttribute("aria-expanded") !== "true"); });
      } else if (!on && btn) {
        var inner = btn.firstChild;
        while (inner && inner.firstChild) q.insertBefore(inner.firstChild, btn);
        q.removeChild(btn);
        a.classList.remove("is-open");
      }
    });
    if (on) openFromHash();
  }
  window.addEventListener("hashchange", function () { if (mq.matches) openFromHash(); });
  var srcSeq = 0;
  function setupSources(on) {
    Array.prototype.forEach.call(doc.querySelectorAll(".faq-sources"), function (box) {
      var label = box.querySelector(":scope > span"), list = box.querySelector("ul");
      var btn = box.querySelector(".src-toggle");
      if (!label || !list) return;
      if (on && !btn) {
        var n = list.children.length;
        if (!list.id) list.id = "quellen-" + (++srcSeq);
        btn = doc.createElement("button");
        btn.type = "button";
        btn.className = "src-toggle";
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-controls", list.id);
        btn.textContent = label.textContent + (n > 1 ? " (" + n + ")" : "");
        btn.addEventListener("click", function () {
          var open = btn.getAttribute("aria-expanded") !== "true";
          btn.setAttribute("aria-expanded", String(open));
          box.classList.toggle("is-open", open);
        });
        box.insertBefore(btn, box.firstChild);
        box.classList.add("src-acc");
      } else if (!on && btn) {
        box.removeChild(btn);
        box.classList.remove("src-acc", "is-open");
      }
    });
  }
  function apply() {
    var on = mq.matches;
    setupFaq(on);
    setupSources(on);
    if (!on) {
      if (head) head.classList.remove("is-tucked");
      root.classList.remove("menu-locked");
    } else if (menu && menu.open) {
      root.classList.add("menu-locked");
    }
    updateBar();
  }
  apply();
  if (mq.addEventListener) mq.addEventListener("change", apply); else if (mq.addListener) mq.addListener(apply);
})();

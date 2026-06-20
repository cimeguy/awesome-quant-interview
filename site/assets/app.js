/* ===== Quant Research 知识库 — app shell, nav, TOC, theme, search ===== */
(function () {
  "use strict";

  var PAGE_ID = document.body.getAttribute("data-page") || window.PAGE_ID || "";

  /* ---------- Theme ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("qr-theme", t); } catch (e) {}
    var btn = document.getElementById("theme-btn");
    if (btn) btn.textContent = t === "dark" ? "☀️" : "🌙";
  }
  var savedTheme = "light";
  try { savedTheme = localStorage.getItem("qr-theme") || "light"; } catch (e) {}

  /* ---------- Build topbar ---------- */
  var topbar = document.createElement("header");
  topbar.className = "topbar";
  topbar.innerHTML =
    '<button class="icon-btn menu-toggle" id="menu-btn" aria-label="菜单">☰</button>' +
    '<a class="brand" href="index.html"><img src="assets/logo.svg" alt="logo"/>' +
    '<span>Quant Research 知识库<small>面试 · 复习 · 入门</small></span></a>' +
    '<div class="spacer"></div>' +
    '<div class="search-wrap">' +
    '<input id="search-input" type="search" placeholder="搜索题目 / 概念… (/)" autocomplete="off"/>' +
    '<div id="search-results"></div></div>' +
    '<button class="icon-btn" id="theme-btn" aria-label="切换主题">🌙</button>' +
    '<a class="icon-btn" href="https://github.com/SoYuCry/awesome-quant-interview" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub 源仓库">' +
    '<svg width="19" height="19" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg></a>';
  document.body.insertBefore(topbar, document.body.firstChild);

  /* ---------- Build layout + sidebar ---------- */
  var content = document.querySelector(".content");
  var layout = document.createElement("div");
  layout.className = "layout";

  var sidebar = document.createElement("aside");
  sidebar.className = "sidebar";
  var navHtml = "";
  (window.NAV || []).forEach(function (group) {
    navHtml += '<div class="nav-group"><div class="nav-group-title">' + group.title + "</div>";
    group.items.forEach(function (it) {
      var active = it.id === PAGE_ID ? " active" : "";
      navHtml +=
        '<a class="nav-link' + active + '" href="' + it.href + '">' +
        '<span class="nl-emoji">' + (it.emoji || "") + "</span>" + it.title + "</a>";
    });
    navHtml += "</div>";
  });
  sidebar.innerHTML = navHtml;

  var backdrop = document.createElement("div");
  backdrop.className = "backdrop";

  if (content && content.parentNode === document.body) {
    document.body.removeChild(content);
  }
  layout.appendChild(sidebar);
  if (content) layout.appendChild(content);
  document.body.appendChild(layout);
  document.body.appendChild(backdrop);

  /* ---------- Mobile menu ---------- */
  function closeNav() { document.body.classList.remove("nav-open"); }
  document.getElementById("menu-btn").addEventListener("click", function () {
    document.body.classList.toggle("nav-open");
  });
  backdrop.addEventListener("click", closeNav);
  sidebar.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });

  /* ---------- Theme toggle ---------- */
  applyTheme(savedTheme);
  document.getElementById("theme-btn").addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme");
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  /* ---------- On-page TOC ---------- */
  function buildTOC() {
    if (!content) return;
    var heads = content.querySelectorAll("h2, h3");
    if (heads.length < 3) return;
    var used = {};
    var tocLinks = [];
    var toc = document.createElement("nav");
    toc.className = "toc";
    var html = '<div class="toc-title">本页目录</div>';
    heads.forEach(function (h) {
      if (!h.id) {
        var base = (h.textContent || "h").trim().replace(/\s+/g, "-").replace(/[^\w一-龥-]/g, "");
        var id = base || "sec";
        while (used[id]) id = base + "-" + (used[base] = (used[base] || 0) + 1);
        used[id] = true;
        h.id = id;
      }
      var lvl = h.tagName === "H3" ? " lvl-3" : "";
      html += '<a href="#' + h.id + '" class="' + lvl.trim() + '">' + h.textContent + "</a>";
    });
    toc.innerHTML = html;
    document.body.appendChild(toc);
    content.classList.add("has-toc");
    tocLinks = toc.querySelectorAll("a");

    // scrollspy
    var map = [];
    tocLinks.forEach(function (a) {
      var t = document.getElementById(a.getAttribute("href").slice(1));
      if (t) map.push({ a: a, t: t });
    });
    function onScroll() {
      var y = window.scrollY + 90;
      var cur = null;
      map.forEach(function (m) { if (m.t.offsetTop <= y) cur = m; });
      tocLinks.forEach(function (a) { a.classList.remove("active"); });
      if (cur) cur.a.classList.add("active");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Ensure all qa-card / h2 / h3 have ids (for deep links) ---------- */
  function ensureIds() {
    if (!content) return;
    content.querySelectorAll(".qa-card[id]").forEach(function () {});
  }

  /* ---------- Prev / Next ---------- */
  function buildPrevNext() {
    if (!content || !window.NAV_ORDER) return;
    var idx = window.NAV_ORDER.findIndex(function (i) { return i.id === PAGE_ID; });
    if (idx < 0) return;
    var prev = window.NAV_ORDER[idx - 1];
    var next = window.NAV_ORDER[idx + 1];
    if (!prev && !next) return;
    var nav = document.createElement("nav");
    nav.className = "page-nav";
    var html = "";
    html += prev
      ? '<a class="prev" href="' + prev.href + '"><div class="pn-dir">← 上一篇</div><div class="pn-title">' + prev.title + "</div></a>"
      : "<span></span>";
    html += next
      ? '<a class="next" href="' + next.href + '"><div class="pn-dir">下一篇 →</div><div class="pn-title">' + next.title + "</div></a>"
      : "<span></span>";
    nav.innerHTML = html;
    content.appendChild(nav);
  }

  /* ---------- KaTeX ---------- */
  function renderMath() {
    if (window.renderMathInElement && content) {
      try {
        window.renderMathInElement(content, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true },
          ],
          throwOnError: false,
        });
      } catch (e) {}
    }
  }

  /* ---------- Search ---------- */
  var input = document.getElementById("search-input");
  var resultsBox = document.getElementById("search-results");
  var activeIdx = -1, curResults = [];

  function escapeHtml(s) { return s.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function highlight(text, q) {
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return escapeHtml(text);
    return escapeHtml(text.slice(0, i)) + "<mark>" + escapeHtml(text.slice(i, i + q.length)) + "</mark>" + escapeHtml(text.slice(i + q.length));
  }

  function doSearch(q) {
    q = q.trim();
    if (!q) { resultsBox.classList.remove("show"); return; }
    var idx = window.SEARCH_INDEX || [];
    var ql = q.toLowerCase();
    var scored = [];
    idx.forEach(function (e) {
      var hay = (e.title + " " + (e.keywords || "") + " " + (e.text || "")).toLowerCase();
      var pos = hay.indexOf(ql);
      if (pos < 0) {
        // token match
        var toks = ql.split(/\s+/);
        if (!toks.every(function (t) { return hay.indexOf(t) >= 0; })) return;
        pos = 50;
      }
      var titleHit = e.title.toLowerCase().indexOf(ql) >= 0;
      scored.push({ e: e, score: (titleHit ? 0 : 100) + pos });
    });
    scored.sort(function (a, b) { return a.score - b.score; });
    curResults = scored.slice(0, 12).map(function (s) { return s.e; });
    activeIdx = -1;
    if (!curResults.length) {
      resultsBox.innerHTML = '<div class="sr-empty">没有找到「' + escapeHtml(q) + "」相关内容</div>";
      resultsBox.classList.add("show");
      return;
    }
    resultsBox.innerHTML = curResults
      .map(function (e) {
        var href = e.href + (e.anchor ? "#" + e.anchor : "");
        return '<a href="' + href + '"><div class="sr-title">' + highlight(e.title, q) +
          '</div><div class="sr-meta">' + (e.pageTitle || "") + (e.snippet ? " · " + escapeHtml(e.snippet) : "") + "</div></a>";
      })
      .join("");
    resultsBox.classList.add("show");
  }

  if (input) {
    input.addEventListener("input", function () { doSearch(this.value); });
    input.addEventListener("keydown", function (e) {
      var links = resultsBox.querySelectorAll("a");
      if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, links.length - 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
      else if (e.key === "Enter") { if (links[activeIdx]) { e.preventDefault(); window.location.href = links[activeIdx].getAttribute("href"); } return; }
      else if (e.key === "Escape") { resultsBox.classList.remove("show"); this.blur(); return; }
      else return;
      links.forEach(function (l, i) { l.classList.toggle("active", i === activeIdx); });
      if (links[activeIdx]) links[activeIdx].scrollIntoView({ block: "nearest" });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search-wrap")) resultsBox.classList.remove("show");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== input) { e.preventDefault(); input.focus(); }
    });
  }

  /* ---------- init ---------- */
  ensureIds();
  buildTOC();
  buildPrevNext();
  // KaTeX libs may load after app.js; retry a few times.
  var tries = 0;
  (function waitKatex() {
    if (window.renderMathInElement) { renderMath(); return; }
    if (tries++ < 50) setTimeout(waitKatex, 100);
  })();
})();

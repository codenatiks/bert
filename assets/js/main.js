/* ══════════════════════════════════════════════════════════
   NOCTURNE · main.js
   Shell (header/footer/cart drawer) + cart + FX + page routers
══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const N = window.N;
  const PAGE = (location.pathname.split("/").pop() || "index.html");

  /* ───────────────────────── 1 · SHELL ───────────────────────── */
  const NAV = [["index.html", "Home"], ["shop.html", "Collection"], ["about.html", "The House"], ["contact.html", "Contact"]];
  const activeOf = f => (PAGE === "product.html" && f === "shop.html") || PAGE === f;

  function headerHTML() {
    return `
    <a class="skip" href="#main">Skip to content</a>
    <div class="topbar"><div class="wrap tb-top">
      <span>Free delivery over $150</span><i>·</i>
      <span>100-night sleep trial</span><i>·</i>
      <span>OEKO-TEX® certified</span><i>·</i>
      <span>Woven in Porto since 1987</span>
    </div></div>
    <header class="site-head" id="siteHead">
      <div class="wrap head-in">
        <a class="brand" href="index.html">NOCTURNE<small>bedding house</small></a>
        <nav class="nav" aria-label="Primary">
          ${NAV.map(([h, l]) => `<a href="${h}" class="${activeOf(h) ? "active" : ""}">${l}</a>`).join("")}
        </nav>
        <div class="head-actions">
          <button class="cart-btn" id="cartOpenBtn" aria-label="Open basket">Cart <span class="cart-n" id="cartCount">0</span></button>
          <button class="burger" id="burgerBtn" aria-label="Open menu"><span></span><span></span><span></span></button>
        </div>
      </div>
      <div class="progress" id="progressBar"></div>
    </header>
    <div class="mnav" id="mnav" aria-hidden="true">
      <nav>${NAV.map(([h, l], i) => `<a href="${h}" style="--i:${i}">${l}</a>`).join("")}</nav>
      <p class="mnav-foot">Est. 1987 — Porto, Portugal ☾</p>
    </div>`;
  }

  function footerHTML() {
    return `
    <footer class="site-foot">
      <div class="wrap foot-grid">
        <div class="foot-brand">
          <p class="foot-logo">NOCTURNE</p>
          <p>Bedding house &amp; family mill. Woven, dyed and sewn under one Porto roof since 1987 — sent to your bed on a 100-night trial.</p>
        </div>
        <div><h4>Shop</h4><ul>
          <li><a href="shop.html?cat=duvets">Duvet suites</a></li>
          <li><a href="shop.html?cat=sheets">Sheets</a></li>
          <li><a href="shop.html?cat=pillows">Pillowcases</a></li>
          <li><a href="shop.html?cat=layers">Blankets &amp; layers</a></li></ul></div>
        <div><h4>The House</h4><ul>
          <li><a href="about.html">Our mill</a></li>
          <li><a href="about.html#numbers">In numbers</a></li>
          <li><a href="contact.html">Showroom &amp; contact</a></li>
          <li><a href="contact.html#faq">FAQ</a></li></ul></div>
        <div><h4>Assurance</h4><ul>
          <li>100-night trial</li><li>Free delivery over $150</li>
          <li>OEKO-TEX® Standard 100</li><li>Plastic-free packaging</li></ul></div>
      </div>
      <div class="wrap foot-mark" aria-hidden="true">nocturne</div>
      <div class="wrap foot-bottom">
        <span>© 2026 Nocturne Bedding House · Porto</span>
        <span>VISA · Mastercard · AMEX · PayPal</span>
        <a href="#top" class="foot-top">Back to top ↑</a>
      </div>
    </footer>
    <div class="drawer-veil" id="drawerVeil"></div>
    <aside class="drawer" id="drawer" aria-label="Shopping basket">
      <div class="drawer-head"><h3>Your basket</h3><button class="x-btn" id="cartCloseBtn" aria-label="Close basket">✕</button></div>
      <div class="ship-line"><span id="shipMsg"></span><div class="ship-track"><div class="ship-fill" id="shipFill"></div></div></div>
      <div class="drawer-items" id="drawerItems"></div>
      <div class="drawer-foot">
        <div class="sub-row"><span>Subtotal</span><strong id="cartSubtotal">$0</strong></div>
        <button class="btn btn-solid btn-block" id="checkoutBtn">Checkout</button>
        <p class="drawer-note">Shipping &amp; taxes at checkout · 100-night trial on every order.</p>
      </div>
    </aside>
    <div class="toasts" id="toasts" aria-live="polite"></div>
    <div class="curtain" id="curtain" aria-hidden="true"><i></i><i></i></div>`;
  }

  document.body.insertAdjacentHTML("afterbegin", headerHTML());
  document.body.insertAdjacentHTML("beforeend", footerHTML());

  /* ───────────────────────── 2 · CART ───────────────────────── */
  const store = {
    get() { try { return JSON.parse(localStorage.getItem("nocturne-cart")) || {}; } catch (e) { return {}; } },
    set(c) { localStorage.setItem("nocturne-cart", JSON.stringify(c)); }
  };
  let cart = store.get();

  function addToCart(slug, size, color, qty) {
    const p = N.getProduct(slug); if (!p) return;
    const unit = p.price + (N.SIZE_UP[size] || 0);
    const key = `${slug}|${size}|${color}`;
    if (cart[key]) cart[key].qty += qty;
    else cart[key] = { slug, name: p.name, seed: p.seed, size, color, unit, qty };
    store.set(cart);
    syncCart();
    const cc = $("#cartCount"); cc.classList.remove("bump"); void cc.offsetWidth; cc.classList.add("bump");
    toast(`Added — <b>${p.name}</b> · ${size}, ${color}`);
    openDrawer();
  }

  function syncCart() {
    const items = Object.values(cart);
    const count = items.reduce((s, i) => s + i.qty, 0);
    const sub = items.reduce((s, i) => s + i.unit * i.qty, 0);
    $("#cartCount").textContent = count;
    $("#cartSubtotal").textContent = N.fmt(sub);
    const pct = Math.min(sub / N.FREE_SHIP * 100, 100);
    const fill = $("#shipFill");
    fill.style.width = pct + "%";
    fill.classList.toggle("done", sub >= N.FREE_SHIP);
    $("#shipMsg").innerHTML = sub >= N.FREE_SHIP
      ? '<b class="free-ok">✦ Free delivery unlocked — sleep tight.</b>'
      : `You're <b>${N.fmt(N.FREE_SHIP - sub)}</b> from free delivery.`;
    const box = $("#drawerItems");
    if (!items.length) {
      box.innerHTML = `<div class="cart-empty"><p class="ce-big">The basket is bare.</p><p>A good night starts with better cloth — the collection is one page away.</p></div>`;
      return;
    }
    box.innerHTML = items.map((i, k) => `
      <div class="citem">
        <img src="https://picsum.photos/seed/${i.seed}/160/200" alt="">
        <div><h4>${i.name}</h4><p class="ci-meta">${i.size} · ${i.color}</p>
          <div class="qty"><button data-k="${k}" data-d="-1" aria-label="Decrease">−</button><span>${i.qty}</span><button data-k="${k}" data-d="1" aria-label="Increase">+</button></div>
        </div>
        <div class="ci-right"><span class="ci-price">${N.fmt(i.unit * i.qty)}</span><button class="rm" data-rm="${k}">Remove</button></div>
      </div>`).join("");
  }

  $("#drawerItems").addEventListener("click", e => {
    const q = e.target.closest("[data-k]");
    if (q) {
      const key = Object.keys(cart)[q.dataset.k];
      cart[key].qty += +q.dataset.d;
      if (cart[key].qty <= 0) delete cart[key];
      store.set(cart); syncCart(); return;
    }
    const rm = e.target.closest("[data-rm]");
    if (rm) { delete cart[Object.keys(cart)[rm.dataset.rm]]; store.set(cart); syncCart(); }
  });

  function openDrawer() { $("#drawer").classList.add("open"); $("#drawerVeil").classList.add("show"); document.body.style.overflow = "hidden"; }
  function closeDrawer() { $("#drawer").classList.remove("open"); $("#drawerVeil").classList.remove("show"); document.body.style.overflow = ""; }
  $("#cartOpenBtn").onclick = openDrawer;
  $("#cartCloseBtn").onclick = closeDrawer;
  $("#drawerVeil").onclick = closeDrawer;
  $("#checkoutBtn").onclick = () => toast(Object.keys(cart).length ? "<b>Demo checkout</b> — the loom is already humming for you." : "The basket is still bare — add something soft first.");
  addEventListener("keydown", e => { if (e.key === "Escape") { closeDrawer(); closeMenu(); } });
  syncCart();

  /* ───────────────────────── 3 · MOBILE NAV ───────────────────────── */
  function openMenu() { $("#mnav").classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeMenu() { $("#mnav").classList.remove("open"); if (!$("#drawer").classList.contains("open")) document.body.style.overflow = ""; }
  $("#burgerBtn").onclick = () => $("#mnav").classList.contains("open") ? closeMenu() : openMenu();
  $$("#mnav a").forEach(a => a.addEventListener("click", closeMenu));

  /* ───────────────────────── 4 · GLOBAL FX ───────────────────────── */
  // load curtain
  (function curtain() {
    const c = $("#curtain"); if (!c) return;
    if (REDUCED) { c.remove(); return; }
    setTimeout(() => { c.classList.add("open"); setTimeout(() => c.remove(), 1300); }, 300);
  })();

  // reveals
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    if (en.target.matches(".num-grid")) en.target.querySelectorAll("[data-count]").forEach(animateCount);
    io.unobserve(en.target);
  }), { threshold: 0.14 });
  function observeReveals() { $$(".rv:not(.in)").forEach(el => io.observe(el)); }

  function animateCount(el) {
    const target = +el.dataset.count;
    if (REDUCED) { el.textContent = target; return; }
    const t0 = performance.now(), dur = 1600;
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  // star fields
  $$(".stars").forEach(el => {
    const n = el.classList.contains("stars-dense") ? 90 : 55;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "star";
      const sz = (Math.random() * 1.6 + 0.8).toFixed(1);
      s.style.cssText = `left:${(Math.random() * 100).toFixed(2)}%;top:${(Math.random() * 100).toFixed(2)}%;width:${sz}px;height:${sz}px;--d:${(Math.random() * 3 + 2).toFixed(1)}s;--dl:${(Math.random() * 4).toFixed(1)}s`;
      el.appendChild(s);
    }
  });

  // scroll progress + parallax
  const pxEls = $$("[data-parallax]");
  let ticking = false;
  function onScroll() {
    const h = document.documentElement;
    const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    const bar = $("#progressBar"); if (bar) bar.style.width = (p * 100) + "%";
    if (!REDUCED) pxEls.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      const off = (r.top + r.height / 2 - innerHeight / 2) * -(+el.dataset.parallax || 0.06);
      el.style.transform = `translateY(${off.toFixed(1)}px) scale(1.12)`;
    });
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  function toast(html) {
    const t = document.createElement("div");
    t.className = "toast"; t.innerHTML = html;
    $("#toasts").appendChild(t);
    setTimeout(() => t.remove(), 3100);
  }

  // accordions (used by product + contact)
  function bindAccordions() {
    $$(".acc-head").forEach(btn => btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const grp = item.closest(".acc-group");
      const wasOpen = item.classList.contains("open");
      if (grp) grp.querySelectorAll(".acc-item.open").forEach(o => {
        o.classList.remove("open");
        const b = o.querySelector(".acc-body"); if (b) b.style.maxHeight = null;
      });
      if (!wasOpen) {
        item.classList.add("open");
        const b = item.querySelector(".acc-body");
        if (b) b.style.maxHeight = b.scrollHeight + "px";
      }
    }));
  }

  function dragScroll(el) {
    if (!el) return;
    let down = false, sx = 0, sl = 0;
    el.addEventListener("pointerdown", e => { down = true; sx = e.clientX; sl = el.scrollLeft; el.classList.add("dragging"); });
    addEventListener("pointermove", e => { if (down) el.scrollLeft = sl - (e.clientX - sx); });
    addEventListener("pointerup", () => { down = false; el.classList.remove("dragging"); });
  }

  /* ───────────────────────── 5 · HOME ───────────────────────── */
  function initHome() {
    // fabric index rows
    $("#fabIndex").innerHTML = Object.entries(N.FABRICS).slice(0, 4).map(([k, f], i) =>
      `<a class="fx-row" href="shop.html?fabric=${k}">
        <span class="fx-n">0${i + 1}</span><span class="fx-name">${f.name}</span>
        <span class="fx-note">${f.tag}</span><span class="fx-arrow">→</span>
      </a>`).join("");

    // featured grid
    const feat = N.products.filter(p => p.featured);
    $("#featGrid").innerHTML = feat.map((p, i) => {
      const f = N.FABRICS[p.fabric];
      return `<a class="feat-card ${i === 0 ? "big" : ""}" href="product.html?slug=${p.slug}">
        <div class="fc-img"><img src="https://picsum.photos/seed/${p.seed}/${i === 0 ? 900 : 700}/${i === 0 ? 1100 : 620}" alt="${p.name}">
        ${p.badge ? `<span class="fc-badge">${p.badge}</span>` : ""}</div>
        <div class="fc-info"><span class="fc-fab">${f.name} · ${f.thread}</span><h3>${p.name}</h3><span class="fc-price">${N.fmt(p.price)}</span></div>
      </a>`;
    }).join("");

    // weave shelf
    $("#shelf").innerHTML = Object.entries(N.FABRICS).map(([k, f]) => `
      <article class="shelf-card">
        <div class="sc-img"><img src="https://picsum.photos/seed/${f.seed}/640/420" alt="${f.name} weave close-up"></div>
        <div class="sc-body">
          <h3>${f.name}<small>${f.thread}</small></h3>
          <p>${f.note}</p>
          ${[["Breath", f.breath], ["Soft", f.soft], ["Warm", f.warm]].map(([l, v]) =>
            `<div class="meter"><span>${l}</span><div class="bar"><i style="--v:${v / 100}"></i></div></div>`).join("")}
          <a href="shop.html?fabric=${k}">Shop ${f.name.toLowerCase()} →</a>
        </div>
      </article>`).join("");
    dragScroll($("#shelf"));

    // quote slider
    const stage = $("#qStage"), dots = $("#qDots");
    stage.innerHTML = N.TESTIMONIALS.map((t, i) =>
      `<blockquote class="quote ${i === 0 ? "on" : ""}"><p>“${t.q}”</p><cite>${t.a} — ${t.p}</cite></blockquote>`).join("");
    dots.innerHTML = N.TESTIMONIALS.map((_, i) => `<button class="qdot ${i === 0 ? "on" : ""}" aria-label="Quote ${i + 1}"></button>`).join("");
    const qs = $$(".quote"), ds = $$(".qdot");
    let idx = 0, timer;
    function go(i) {
      idx = (i + qs.length) % qs.length;
      qs.forEach((q, j) => q.classList.toggle("on", j === idx));
      ds.forEach((d, j) => d.classList.toggle("on", j === idx));
    }
    function restart() { clearInterval(timer); if (!REDUCED) timer = setInterval(() => go(idx + 1), 5200); }
    $("#qPrev").onclick = () => { go(idx - 1); restart(); };
    $("#qNext").onclick = () => { go(idx + 1); restart(); };
    ds.forEach((d, i) => d.onclick = () => { go(i); restart(); });
    $("#quotes").addEventListener("mouseenter", () => clearInterval(timer));
    $("#quotes").addEventListener("mouseleave", restart);
    restart();

    // newsletter
    $("#nlForm").addEventListener("submit", e => {
      e.preventDefault();
      const v = $("#nlEmail").value.trim();
      if (!v.includes("@")) { toast("That address looks a little tangled — try again?"); return; }
      e.target.outerHTML = `<p class="gold-ok">Welcome to the fold. Your first letter arrives Sunday, kettle on. ☾</p>`;
    });
  }

  /* ───────────────────────── 6 · SHOP ───────────────────────── */
  function initShop() {
    const state = { cat: "all", fabric: "all", q: "", sort: "featured" };
    const params = new URLSearchParams(location.search);
    if (N.CATS[params.get("cat")]) state.cat = params.get("cat");
    if (N.FABRICS[params.get("fabric")]) state.fabric = params.get("fabric");

    $("#catChips").innerHTML = Object.entries(N.CATS).map(([v, l]) =>
      `<button class="chip ${state.cat === v ? "on" : ""}" data-cat="${v}">${l}</button>`).join("");
    $("#fabSel").innerHTML = `<option value="all">All fabrics</option>` +
      Object.entries(N.FABRICS).map(([v, f]) => `<option value="${v}" ${state.fabric === v ? "selected" : ""}>${f.name}</option>`).join("");

    function visible() {
      let list = N.products.filter(p =>
        (state.cat === "all" || p.cat === state.cat) &&
        (state.fabric === "all" || p.fabric === state.fabric) &&
        (!state.q || p.name.toLowerCase().includes(state.q)));
      if (state.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
      if (state.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
      if (state.sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
      return list;
    }

    function render() {
      const list = visible();
      const labels = [state.cat !== "all" ? N.CATS[state.cat] : null, state.fabric !== "all" ? N.FABRICS[state.fabric].name : null, state.q ? `“${state.q}”` : null].filter(Boolean);
      $("#gridNote").textContent = list.length
        ? `Showing ${list.length} of ${N.products.length} pieces${labels.length ? " — " + labels.join(" · ") : ""}`
        : "";
      if (!list.length) {
        $("#pgrid").innerHTML = `<div class="empty"><p class="ce-big">Nothing in the drawer matches.</p><p>Loosen a filter, or start from the full collection.</p><button class="btn btn-dark" id="resetBtn">Clear filters</button></div>`;
        $("#resetBtn").onclick = () => { state.cat = "all"; state.fabric = "all"; state.q = ""; $("#searchInp").value = ""; $("#fabSel").value = "all"; $("#catChips").querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c.dataset.cat === "all")); render(); };
        return;
      }
      $("#pgrid").innerHTML = list.map(p => {
        const f = N.FABRICS[p.fabric];
        return `<article class="pcard">
          <a class="pcard-media" href="product.html?slug=${p.slug}">
            ${p.badge ? `<span class="pc-badge ${p.badge === "Bestseller" ? "gold" : ""}">${p.badge}</span>` : ""}
            <img class="im-a" src="https://picsum.photos/seed/${p.seed}/620/780" alt="${p.name}">
            <img class="im-b" src="https://picsum.photos/seed/${p.seed}-detail/620/780" alt="" aria-hidden="true">
            <span class="pc-go">View piece →</span>
          </a>
          <div class="pc-row">
            <div><p class="pc-fab">${f.name} · ${f.thread}</p><h3><a href="product.html?slug=${p.slug}">${p.name}</a></h3></div>
            <span class="pc-price">${N.fmt(p.price)}</span>
          </div>
          <div class="pc-foot">
            <div class="pc-dots">${p.colors.map(c => `<span class="mini-dot" style="background:${c.c}" title="${c.n}"></span>`).join("")}</div>
            <button class="qadd" data-add="${p.slug}">Quick add</button>
          </div>
        </article>`;
      }).join("");
      observeReveals();
    }

    $("#catChips").addEventListener("click", e => {
      const c = e.target.closest("[data-cat]"); if (!c) return;
      state.cat = c.dataset.cat;
      $$("#catChips .chip").forEach(x => x.classList.toggle("on", x === c));
      render();
    });
    $("#fabSel").onchange = e => { state.fabric = e.target.value; render(); };
    $("#sortSel").onchange = e => { state.sort = e.target.value; render(); };
    $("#searchInp").addEventListener("input", e => { state.q = e.target.value.trim().toLowerCase(); render(); });

    $("#pgrid").addEventListener("click", e => {
      const b = e.target.closest("[data-add]");
      if (!b) return;
      const p = N.getProduct(b.dataset.add);
      addToCart(p.slug, N.SIZES[p.cat][0], p.colors[0].n, 1);
    });

    render();
  }

  /* ───────────────────────── 7 · PRODUCT ───────────────────────── */
  function initProduct() {
    const params = new URLSearchParams(location.search);
    const p = N.getProduct(params.get("slug")) || N.products[0];
    try { if (params.get("slug") !== p.slug) history.replaceState({}, "", "product.html?slug=" + p.slug); } catch (e) {}
    document.title = p.name + " — NOCTURNE";

    const f = N.FABRICS[p.fabric];
    const shots = [p.seed, p.seed + "-fold", p.seed + "-detail", p.seed + "-room"];
    let colorIdx = 0, size = N.SIZES[p.cat][0], qty = 1;

    $("#crumbName").textContent = p.name;
    $("#pdFab").textContent = `${f.name} · ${f.thread} · ${f.tag}`;
    $("#pdName").textContent = p.name;
    $("#pdDesc").textContent = p.desc;
    $("#accComp").textContent = `${f.name}, ${f.thread}. ${p.desc} Machine wash 30°C gentle, mild detergent, no softener. Line-dry in shade. ${f.note}`;
    $("#pdImg").src = `https://picsum.photos/seed/${shots[0]}/900/1100`;
    $("#pdImg").alt = p.name;

    $("#pdThumbs").innerHTML = shots.map((s, i) =>
      `<button class="thumb ${i === 0 ? "on" : ""}" data-shot="${i}"><img src="https://picsum.photos/seed/${s}/180/220" alt="${p.name} view ${i + 1}"></button>`).join("");
    $("#pdThumbs").addEventListener("click", e => {
      const t = e.target.closest("[data-shot]"); if (!t) return;
      $$("#pdThumbs .thumb").forEach(x => x.classList.toggle("on", x === t));
      const img = $("#pdImg");
      img.style.opacity = 0;
      setTimeout(() => { img.src = `https://picsum.photos/seed/${shots[+t.dataset.shot]}/900/1100`; img.onload = () => img.style.opacity = 1; }, 200);
    });

    $("#pdDots").innerHTML = p.colors.map((c, i) =>
      `<button class="swatch-dot ${i === 0 ? "on" : ""}" style="background:${c.c}" data-c="${i}" title="${c.n}" aria-label="Colour ${c.n}"></button>`).join("");
    $("#pdDots").addEventListener("click", e => {
      const d = e.target.closest("[data-c]"); if (!d) return;
      colorIdx = +d.dataset.c;
      $$("#pdDots .swatch-dot").forEach(x => x.classList.toggle("on", x === d));
      $("#pdColorName").textContent = p.colors[colorIdx].n;
      const img = $("#pdImg");
      img.style.opacity = 0;
      setTimeout(() => { img.src = `https://picsum.photos/seed/${p.seed}-${colorIdx}/900/1100`; img.onload = () => img.style.opacity = 1; }, 200);
    });

    function buildSizes() {
      $("#pdSizes").innerHTML = N.SIZES[p.cat].map(s => {
        const up = N.SIZE_UP[s] || 0;
        return `<button class="size-btn ${s === size ? "on" : ""}" data-size="${s}">${s}${up ? " +$" + up : ""}</button>`;
      }).join("");
    }
    function priceLine() { $("#pdPrice").innerHTML = `${N.fmt((p.price + (N.SIZE_UP[size] || 0)) * qty)} <small>${qty > 1 ? "· " + qty + " pieces" : "· free returns"}</small>`; $("#pdQty").textContent = qty; }
    $("#pdSizes").addEventListener("click", e => { const s = e.target.closest("[data-size]"); if (!s) return; size = s.dataset.size; buildSizes(); priceLine(); });
    $("#pdMinus").onclick = () => { if (qty > 1) { qty--; priceLine(); } };
    $("#pdPlus").onclick = () => { qty++; priceLine(); };
    $("#pdAdd").onclick = () => addToCart(p.slug, size, p.colors[colorIdx].n, qty);
    $("#pdColorName").textContent = p.colors[0].n;
    buildSizes(); priceLine();

    // related
    const rel = N.products.filter(x => x.slug !== p.slug && (x.fabric === p.fabric || x.cat === p.cat)).slice(0, 4);
    $("#relGrid").innerHTML = rel.map(r => `
      <a class="rel-card" href="product.html?slug=${r.slug}">
        <div class="rc-img"><img src="https://picsum.photos/seed/${r.seed}/520/640" alt="${r.name}"></div>
        <div class="rc-row"><h3>${r.name}</h3><span>${N.fmt(r.price)}</span></div>
        <p class="rc-fab">${N.FABRICS[r.fabric].name} · ${N.FABRICS[r.fabric].thread}</p>
      </a>`).join("");

    bindAccordions();
  }

  /* ───────────────────────── 8 · CONTACT ───────────────────────── */
  function initContact() {
    bindAccordions();
    $("#contactForm").addEventListener("submit", e => {
      e.preventDefault();
      const name = $("#cfName").value.trim(), mail = $("#cfEmail").value.trim(), msg = $("#cfMsg").value.trim();
      if (!name || !mail.includes("@") || !msg) { toast("A name, a real email and a few words — then we're away."); return; }
      e.target.innerHTML = `<div class="form-ok"><p class="ce-big">Received, ${name.split(" ")[0]}.</p><p>Marta will reply within one working day — keep an eye on ${mail}.</p></div>`;
    });
  }

  /* ───────────────────────── BOOT ───────────────────────── */
  const routers = { home: initHome, shop: initShop, product: initProduct, contact: initContact };
  (routers[document.body.dataset.page] || function () {})();
  observeReveals();
})();

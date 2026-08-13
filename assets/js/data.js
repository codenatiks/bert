/* ══════════════════════════════════════════════════════════
   NOCTURNE · shared catalog data
   Used by every page through window.N
══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const FREE_SHIP = 150;

  const FABRICS = {
    percale: { name: "Percale", tag: "Crisp · Hotel cool", thread: "400 TC", breath: 95, soft: 70, warm: 30, seed: "percale-weave-macro",
      note: "One-over-one plain weave, matte face — the fresh-shirt classic. Sleeps coolest of all our cloths." },
    sateen: { name: "Sateen", tag: "Silk · Heavy drape", thread: "300 TC", breath: 80, soft: 95, warm: 55, seed: "sateen-weave-sheen",
      note: "Three-over-one weave with a low sheen and a slow, poured-on fall. For beds that should look poured, not tucked." },
    linen: { name: "Linen", tag: "Air · Stonewashed", thread: "Flax", breath: 100, soft: 60, warm: 45, seed: "linen-weave-slub",
      note: "European flax, stonewashed twice before it ships. Slubs and creases are the signature, not a flaw." },
    flannel: { name: "Flannel", tag: "Brushed · Winter", thread: "Brushed", breath: 45, soft: 90, warm: 100, seed: "flannel-weave-nap",
      note: "Woven tight, then brushed twice with fine wire. Measured in grams per metre, not thread count." },
    waffle: { name: "Waffle", tag: "Loft · Light warmth", thread: "Honeycomb", breath: 85, soft: 65, warm: 62, seed: "waffle-weave-grid",
      note: "A three-dimensional honeycomb that loft-traps air. Our lightest warm layer." }
  };

  const SIZES = {
    duvets: ["Single", "Queen", "King"],
    sheets: ["Twin", "Queen", "King"],
    pillows: ["Standard", "King"],
    layers: ["Twin", "Queen", "King"]
  };
  const SIZE_UP = { Single: 0, Twin: 0, Queen: 18, King: 36, Standard: 0 };

  const CATS = { all: "All pieces", duvets: "Duvet suites", sheets: "Sheets", pillows: "Pillowcases", layers: "Layers" };

  const products = [
    { slug: "percale-duvet-suite", name: "Percale Duvet Suite", fabric: "percale", cat: "duvets", price: 128, badge: "Bestseller", featured: true, seed: "percale-duvet-suite-crisp",
      colors: [{ n: "Cloud", c: "#EFF0EC" }, { n: "Sage", c: "#96A08B" }, { n: "Midnight", c: "#2A3446" }],
      desc: "Our signature crisp percale at 400 thread count, garment-washed for day-one softness. Cool to the touch from the very first night; quieter and softer with every wash." },
    { slug: "sateen-duvet-suite", name: "Sateen Duvet Suite", fabric: "sateen", cat: "duvets", price: 148, badge: "New", featured: true, seed: "sateen-duvet-suite-drape",
      colors: [{ n: "Oat", c: "#E3D5BD" }, { n: "Midnight", c: "#2A3446" }, { n: "Oxblood", c: "#7B3A30" }],
      desc: "A three-over-one sateen with a slow, heavy drape and the faintest sheen. Buttoned closure, hidden seams — for beds that should look poured, not tucked." },
    { slug: "stonewashed-linen-duvet", name: "Stonewashed Linen Duvet", fabric: "linen", cat: "duvets", price: 189, featured: true, seed: "stonewashed-linen-duvet-rumpled",
      colors: [{ n: "Terracotta", c: "#C0684A" }, { n: "Flax", c: "#D8CAAC" }, { n: "Slate", c: "#7C8694" }],
      desc: "European flax, stonewashed twice so it arrives already broken in. Warm in winter, airy in July, beautifully creased always." },
    { slug: "waffle-blanket", name: "Waffle Blanket", fabric: "waffle", cat: "layers", price: 86, badge: "New", featured: true, seed: "waffle-blanket-honey-fold",
      colors: [{ n: "Honey", c: "#D69A57" }, { n: "Cloud", c: "#EFF0EC" }],
      desc: "A true honeycomb weave that traps just enough air for shoulder-season warmth. Throws beautifully; folds to nothing." },
    { slug: "flannel-sheet-set", name: "Flannel Sheet Set", fabric: "flannel", cat: "sheets", price: 132, badge: "Winter", seed: "flannel-sheet-set-cozy",
      colors: [{ n: "Oxblood", c: "#6E3226" }, { n: "Heather", c: "#B7B1A5" }],
      desc: "Brushed on both faces until it reads as sweater, not sheet. Dense enough to stop a draught, breathable enough to never overheat." },
    { slug: "percale-sheet-set", name: "Percale Sheet Set", fabric: "percale", cat: "sheets", price: 118, seed: "percale-sheet-set-folded",
      colors: [{ n: "Cloud", c: "#EFF0EC" }, { n: "Stripe", c: "#CBB9A0" }],
      desc: "Fitted, flat and two envelope-closed pillowcases in our 400 TC percale — the full crisp experience in one paper-wrapped box." },
    { slug: "sateen-sheet-set", name: "Sateen Sheet Set", fabric: "sateen", cat: "sheets", price: 136, badge: "New", seed: "sateen-sheet-set-silk",
      colors: [{ n: "Oat", c: "#E3D5BD" }, { n: "Midnight", c: "#2A3446" }],
      desc: "The silky side of the mill: a full sateen set with deep-pocket fitted sheet and envelope-closed pillowcases." },
    { slug: "percale-fitted-sheet", name: "Percale Fitted Sheet", fabric: "percale", cat: "sheets", price: 58, seed: "percale-fitted-sheet-corner",
      colors: [{ n: "Cloud", c: "#EFF0EC" }, { n: "Sage", c: "#96A08B" }],
      desc: "35cm deep pockets, elastic all the way round, and a woven label that finds the long side for you in the dark." },
    { slug: "sateen-fitted-sheet", name: "Sateen Fitted Sheet", fabric: "sateen", cat: "sheets", price: 64, seed: "sateen-fitted-sheet-smooth",
      colors: [{ n: "Midnight", c: "#2A3446" }, { n: "Oat", c: "#E3D5BD" }],
      desc: "Sateen-fitted with the same deep pockets as its percale sibling — just considerably silkier." },
    { slug: "linen-flat-sheet", name: "Linen Flat Sheet", fabric: "linen", cat: "sheets", price: 92, seed: "linen-flat-sheet-drape",
      colors: [{ n: "Flax", c: "#D8CAAC" }, { n: "Slate", c: "#7C8694" }],
      desc: "Generously cut with a hand-finished hem. By wash ten, yours will feel inherited." },
    { slug: "quilted-bedspread", name: "Quilted Bedspread", fabric: "waffle", cat: "layers", price: 158, seed: "quilted-bedspread-textured",
      colors: [{ n: "Oat", c: "#E3D5BD" }, { n: "Honey", c: "#D69A57" }],
      desc: "A light cotton-filled quilt with loose channel stitching — for beds that are looked at as much as slept in." },
    { slug: "percale-pillowcases", name: "Percale Pillowcase Pair", fabric: "percale", cat: "pillows", price: 34, seed: "percale-pillowcase-pair",
      colors: [{ n: "Cloud", c: "#EFF0EC" }, { n: "Sage", c: "#96A08B" }],
      desc: "Crisp, envelope-closed percale. The entry point to the house — most people start here." },
    { slug: "linen-pillowcases", name: "Linen Pillowcase Pair", fabric: "linen", cat: "pillows", price: 48, seed: "linen-pillowcases-pair",
      colors: [{ n: "Chalk", c: "#ECE5D4" }, { n: "Terracotta", c: "#C0684A" }],
      desc: "Stonewashed linen with envelope closures. Kind to hair, kinder to lazy mornings." },
    { slug: "flannel-pillowcases", name: "Flannel Pillowcase Pair", fabric: "flannel", cat: "pillows", price: 38, seed: "flannel-pillowcase-warm",
      colors: [{ n: "Heather", c: "#B7B1A5" }, { n: "Oxblood", c: "#6E3226" }],
      desc: "Brushed flannel for people whose ears refuse to be cold. Pairs dangerously well with hot water bottles." }
  ];

  const TESTIMONIALS = [
    { q: "The percale is cool enough that we stopped fighting over the duvet. It has genuinely changed July for us.", a: "Mara T. — Lisbon", p: "Percale Duvet Suite" },
    { q: "Third winter with the flannel. It washes like new every single time, and my mother now refuses all other sheets.", a: "Jonas K. — Hamburg", p: "Flannel Sheet Set" },
    { q: "The linen arrived wrinkled on purpose, and I have never loved wrinkles before. It softens with every wash, as promised.", a: "Priya S. — London", p: "Stonewashed Linen Duvet" },
    { q: "We put Nocturne sateen in all nine rooms of the guesthouse. Guests still ask — and still occasionally try to leave with them.", a: "Casa do Rio — Douro", p: "Sateen Duvet Suite" }
  ];

  window.N = {
    FREE_SHIP, FABRICS, SIZES, SIZE_UP, CATS, products, TESTIMONIALS,
    fmt: n => "$" + n.toFixed(0),
    getProduct: slug => products.find(p => p.slug === slug) || null
  };
})();

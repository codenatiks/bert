# NOCTURNE — Bedding House Website

A complete multi-page e-commerce site for a bed-linens brand.
Midnight-navy / champagne-gold identity · Cormorant Garamond + Manrope.

## Run it
    cd nocturne
    python -m http.server 8000        # or any static server
    open http://localhost:8000

## Pages
| Page          | Purpose                                        |
|---------------|------------------------------------------------|
| index.html    | Hero, featured edit, weave shelf, quote slider |
| shop.html     | Full catalog — chips, fabric filter, search, sort (supports ?fabric= / ?cat=) |
| product.html  | Detail view via ?slug=… — gallery, colours, sizes, accordions, related |
| about.html    | Mill story, counters, timeline, house rules    |
| contact.html  | Showroom info, validated form, FAQ accordion   |

## Architecture
- `assets/js/data.js` — single source of truth: fabrics, sizes, 14 products, testimonials
- `assets/js/main.js` — injects header/footer/cart drawer on every page; cart persists
  in `localStorage` across pages; per-page routers keyed on `<body data-page>`
- `assets/css/style.css` — full design system, responsive + reduced-motion safe

## Add a product
Append one object to `products` in `data.js` — the shop, home page, product
pages and cart pick it up automatically.

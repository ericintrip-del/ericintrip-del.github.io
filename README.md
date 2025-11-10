# VIVAURA TECH Blog (Jekyll + Chirpy)

A bilingual (ko/en) blog for **GOFUNWITH – Explore. Create. Share.** built with **Jekyll** and **jekyll-theme-chirpy**,
deployed via **GitHub Actions** to **GitHub Pages**, integrated with **Admin UI, n8n webhooks, Giscus, GA4, AdSense**, and **Cloudflare Workers**.

## Quick Start

```bash
bundle install
bundle exec jekyll serve
```

Site: `http://127.0.0.1:4000`

## Structure
```
.
├── Gemfile
├── _config.yml
├── _data/theme.yml
├── _includes/
├── _layouts/default.html
├── _pages/
├── _posts/
│   ├── en/
│   └── ko/
├── admin/           # OAuth + Webhooks
├── assets/css/custom.css
├── CNAME
└── .github/workflows/jekyll.yml
```

## i18n
- Default: `ko`
- Homes: `/ko/` and `/en/`
- Language switcher included on every page via `_includes/lang-switch.html`.

## Admin UI
- OAuth via Cloudflare Worker (`cloudflare_worker_endpoint`).
- n8n webhooks:
  - `new-post` to publish
  - `translate-post` to translate
  - `update-theme` to sync theme

> **Security note:** The repository currently contains keys per project spec. Use repo/organization secrets in production.

## Services
- GA4 (`ga4_measurement_id`)
- Cloudflare Beacon
- Giscus (comments)
- AdSense (set `adsense_client_id`)

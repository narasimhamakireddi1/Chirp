# Chirp All Day — Project Reference

Single-page restaurant website. Pure HTML5 / CSS3 / JavaScript — no frameworks, no build tools, no external JS libraries.

## Files

| File | Lines | Role |
|------|-------|------|
| `index.html` | ~570 | All markup, SVG icons, JSON-LD schema, meta/OG tags |
| `styles.css` | ~2130 | All styles — CSS variables, dark + light themes, responsive |
| `script.js` | ~552 | All interactivity — 15 functions, one DOMContentLoaded |

---

## Brand

| Field | Value |
|-------|-------|
| Name | Chirp / Chirp All Day |
| Tagline | Where Every Sip Takes Flight. |
| Founder | Nimit Gupta |
| Established | October 2023 |
| Address | 3rd Floor, SLN Terminus, Gachibowli-Miyapur Rd, Jayabheri Enclave, Serilingampalle, West Hyderabad 500032 |
| Phone | +91 9515105007 / +91 8143528565 |
| WhatsApp | https://wa.me/919515105007 |
| Instagram | @chirpallday |
| Facebook | chirpallday |
| Hours | Mon–Sun 12:00 PM – 11:30 PM (bar closes 11 PM) |
| Delivery | Via Swiggy / Zomato |
| Ratings | 4.4★ · 1,726+ Google reviews · 4.3★ · 2,497+ Zomato reviews |
| Concept | Avian-inspired craft cocktail bar — bird-cage seating, live canaries, molecular mixology, views over Botanical Garden |

---

## Page Sections (DOM order)

1. **Scroll progress bar** — fixed 2px top bar, gradient emerald
2. **Nav** (`#mainNav`) — fixed 68px, transparent → dark glass at scrollY > 60; in light mode always has solid bg
3. **Mobile menu** (`#mobileMenu`) — slide-from-right panel, uses `var(--c-bg)` background
4. **Hero** (`#hero`) — 100dvh, actual Chirp Hospibuz photo, zoom animation, emerald underline on h1; `padding-top: var(--nav-h)` is on `.hero` (not `.hero__content`) so flex-centering clears the nav
5. **Marquee strip** — CSS-only infinite scroll, `@keyframes marquee`, no JS
6. **About** (`#about`) — 2-col grid, stacked Chirp interior photos, Nimit Gupta founder quote
7. **Signature Dishes** (`#dishes`) — 6 cards, 3-col grid, hover lift + image zoom; prices hidden via CSS (`.dish-card__price { display: none }`)
8. **Interactive Menu** (`#menu`) — 23 items across 6 tabs, live search + category filter; prices hidden via CSS (`.menu-item__price { display: none }`)
9. **Experience** (`#experience`) — dark section, 5 image cards with CSS hover text reveal
10. **Video** (`#video`) — dark section, YouTube embed (`SIL2INY_cNk`), responsive 16:9 wrapper
11. **Testimonials** (`#testimonials`) — auto-carousel 5s, touch swipe, prev/next/dots, 3/2/1 per view
12. **Reservation** (`#reservation`) — contact info left, validated form right (`#reservationForm`)
13. **Gallery** (`#gallery`) — CSS masonry 3-col, 5-category filter (All/Ambiance/Food/Cocktails/Views), lightbox
14. **Lightbox** (`#lightbox`) — full-screen overlay, Esc/backdrop/arrow keys, touch swipe
15. **Awards** (`#awards`) — 4 cards + press logos row (Deccan Chronicle, Zomato, Swiggy, MagicPin, District)
16. **Contact** (`#contact`) — details + Google Maps iframe embed
17. **Footer** — 4-col dark grid, newsletter form, dynamic year via `#currentYear`
18. **FABs** — fixed bottom-right: Reserve (emerald pill) + WhatsApp (green) + Call

---

## CSS Architecture

### Theme system

Default theme is **dark**. Light theme activated by `data-theme="light"` on `<html>`.

```css
/* Dark — defined in :root */
:root { color-scheme: dark; --c-bg: #080F0B; ... }

/* Light — overrides only */
[data-theme="light"] { color-scheme: light; --c-bg: #F0FBF4; ... }
```

Preference persisted in `localStorage` under key **`chirp-theme`**.

### Key CSS variables

```css
/* Backgrounds */
--c-bg           /* main section bg */
--c-bg-2         /* alternate section bg */
--c-bg-dark      /* darkest — experience section, video section, footer */
--c-card         /* card surface */
--c-card-2       /* card hover surface */

/* Brand colours (emerald green — named --c-saffron for CSS compatibility) */
--c-saffron       /* primary accent  #3EC87C dark / #1F8A4A light */
--c-saffron-light /* lighter emerald — headings on dark */
--c-saffron-dark  /* deeper emerald — active states */
--c-saffron-dim   /* rgba emerald — backgrounds, focus rings */
--c-spice         /* secondary — error states, spicy badge */
--c-green         /* tertiary — veg badge, success state */

/* Text */
--c-text          /* body text */
--c-text-2        /* secondary text */
--c-text-muted    /* captions, labels */

/* Surfaces */
--c-border        /* border / grid gap colour  rgba(62,200,124,.12) */
--c-border-2      /* subtler border */
--c-gold          /* accent */
--glow            /* box-shadow glow on hover  rgba(62,200,124,.18) */

/* Layout */
--nav-h: 68px     /* used for scroll-padding-top and hero padding-top */
```

### Fonts (Google Fonts)

```
Playfair Display — display headings (weights 400 500 700, italic variants)
Poppins          — body, nav links, buttons, labels (weights 300 400 500 600)
```

### Responsive breakpoints

| Max-width | Grid changes |
|-----------|-------------|
| 1024px | Nav links hidden → hamburger; 2-col grids |
| 640px | 1-col grids; hero title shrinks; form rows stack |
| 480px | Gallery 1-col; FABs shrink to 46px |
| 400px | Hero stats hidden; `--space-3xl` reduced |

Rule: `body { overflow-x: hidden }` only. Never `overflow-x` on `html` (breaks mobile anchor scroll).

### Hero centering fix

`padding-top: var(--nav-h)` lives on `.hero` (the flex container), NOT on `.hero__content`.
This ensures `align-items: center` vertically centres content in the space **below** the nav, so the eyebrow pill never overlaps nav links.

### Prices hidden

Both `.dish-card__price` and `.menu-item__price` are `display: none` via a single CSS rule near the bottom of `styles.css`. The price values remain in the HTML — remove that rule to show them again.

### Light-mode nav behaviour

In light mode, `.nav` always has a solid mint background (`rgba(240,251,244,.96)`) — not just when scrolled. This makes the theme switch immediately visible without needing to scroll.

### Light-mode-specific overrides (in styles.css after breakpoints)

- `.nav` background → `rgba(240,251,244,.96)` (always, not just scrolled)
- `.mobile-menu__panel` background → `var(--c-bg)` (was hardcoded `#0A0805`)
- Image `filter: brightness()` overrides removed
- Google Maps iframe `filter: invert()` removed
- Button/badge text adjusted for contrast on light emerald backgrounds
- Hero overlay gradient adjusted to lighter tint

---

## JavaScript Functions (script.js)

All registered in a single `DOMContentLoaded`. `initThemeToggle()` runs first.

| Function | What it does |
|----------|-------------|
| `initThemeToggle()` | Reads/writes `localStorage` (`chirp-theme`), toggles `data-theme` on `<html>`, adds `.theme-transitioning` to body for 400ms. Keyboard shortcut: Shift+T |
| `initScrollProgress()` | Updates `#scrollProgress` width on scroll |
| `initNav()` | Adds/removes `.scrolled` class at scrollY > 60 |
| `initMobileMenu()` | Open/close panel, overlay click, ESC key, body scroll-lock |
| `initRevealAnimations()` | IntersectionObserver → `.revealed`; stagger delay on grid children |
| `initCounters()` | Ease-out cubic counter animation on `[data-count]` elements |
| `initTestimonialCarousel()` | Flex-based slider: pixel widths via `offsetWidth`, 5s autoplay, pause on hover, touch swipe, prev/next/dot nav, responsive 3/2/1 per view with debounced resize |
| `initMenuFilter()` | Filter tabs set `activeCat`, search queries `data-name` attribute; both combined via `applyFilters()` |
| `initGalleryFilter()` | Toggles `.hidden` on `.gallery-item` by `data-gcat` |
| `initLightbox()` | Open/close/prev/next on `.gallery-item__btn` clicks; keyboard arrows + Esc; touch swipe; counter display |
| `initReservationForm()` | Client-side validation on 5 required fields; 1.2s loader; success banner (auto-hides 8s) |
| `initNewsletterForm()` | Email regex validation, simulated submit |
| `initActiveNavLinks()` | IntersectionObserver rootMargin `-40% 0px -55% 0px` sets `.active` on nav links |
| `setCurrentYear()` | Fills `#currentYear` from `new Date()` |
| `initDateMin()` | Sets `min=today` on `#bookingDate` |

---

## Testimonial Carousel — Implementation Note

Uses **flexbox + pixel offsets** (not grid + % transforms, which caused clipping issues).

```
.testimonials__carousel-wrap  → overflow: hidden  (the clip boundary)
.testimonials__carousel        → display: flex; flex-wrap: nowrap  (the track)
.testimonial-card              → flex: 0 0 {cardWidth}px  (set by JS)
```

`goTo(index)` calculates `cardWidth = (wrapOffsetWidth - gap*(pv-1)) / pv` fresh on every call, then sets `transform: translateX(-${current * pv * slideStep}px)` on the track. Gap constant is 16px (1rem).

---

## Form Validation

`#reservationForm` — five required fields validated on `blur` and re-validated on `input` once marked invalid:

- `guestName` — min 2 chars
- `guestPhone` — regex `/^(\+91|91|0)?[6-9]\d{9}$/` (Indian mobile)
- `bookingDate` — not in the past
- `bookingTime` — non-empty select
- `guestCount` — non-empty select

States: `.valid` (green border), `.invalid` (spice-red border). Error messages in sibling `<span role="alert">` elements.

---

## Images Used

### Actual Chirp Photos (Hospibuz CDN)

| Usage | URL fragment |
|-------|-------------|
| Hero + gallery | `Chirp-ED-7.webp` (publive CDN) |
| About main + gallery | `Chirp-ED-3-1024x683.webp` (thepublive CDN) |
| About accent + gallery | `Chirp-ED-12-1024x683.webp` (thepublive CDN) |
| Gallery (cocktails) | Deccan Chronicle S3 jpeg |

All Chirp photos have `onerror` fallback to relevant Unsplash images.

### Unsplash Supplements

| Section | Subject |
|---------|---------|
| Dish cards | Food photography (garlic bread, salad, noodles, etc.) |
| Experience cards | Restaurant interior, bar, live music, catering |
| Gallery (views) | Botanical garden / restaurant scenery |

All images: `loading="lazy"` except hero (`loading="eager" fetchpriority="high"`).

---

## Video

YouTube embed ID: **`SIL2INY_cNk`** — "Hyderabad's Top View Bar & Restaurant | Chirp now in Gachibowli"

Responsive wrapper: `.video-wrapper` uses `padding-bottom: 56.25%` (16:9) with absolutely-positioned iframe inside.

---

## Menu Categories

| Tab | `data-cat` value |
|-----|----------------|
| All | `all` |
| Starters | `starters` |
| Mains | `mains` |
| Sushi & Asian | `sushi` |
| Desserts | `desserts` |
| Cocktails & Bar | `cocktails` |
| Non-Alcoholic | `nonalc` |

---

## SEO / Structured Data

- `<title>` and `<meta description>` with Chirp / Gachibowli keywords
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`)
- `<link rel="canonical">` → `https://chirpallday.com/`
- JSON-LD `Restaurant` schema with SLN Terminus address, geo (17.45275023, 78.36299986), hours, phones, `aggregateRating`
- Preconnect to `fonts.googleapis.com`, `fonts.gstatic.com`, `images.unsplash.com`, `img-cdn.publive.online`

---

## Accessibility

- All images have descriptive `alt` text
- All interactive elements have `aria-label` or visible label
- Form inputs linked to labels via `for`/`id`; errors in `role="alert"` spans
- Mobile menu: `role="dialog" aria-modal="true"`; hamburger has `aria-expanded`
- Carousel region: `role="region" aria-label="Customer reviews carousel"`
- Gallery lightbox: `role="dialog" aria-modal="true"`; counter in `aria-live="polite"`
- `prefers-reduced-motion`: all animations set to `0.01ms` duration
- `html { scroll-behavior: smooth; scroll-padding-top: var(--nav-h) }`

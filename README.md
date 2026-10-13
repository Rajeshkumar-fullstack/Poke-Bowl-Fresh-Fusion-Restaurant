# Poke Bowl & Fresh Fusion Restaurant

A modern, premium-quality, fully responsive multi-page website for **Poke Bowl & Fresh Fusion Restaurant**. Featuring fresh Hawaiian poke bowls, customizable ingredients, healthy dining options, attractive food photography, smooth animations, sticky navigation, interactive bowl builder studio, dynamic menu filtering, dark/light theme switching, and full RTL/LTR language support.

---

## 1. Technology Stack

- **HTML5**: Semantic markup, accessible ARIA attributes, structured metadata.
- **Tailwind CSS**: Modern utility styling configured with `preflight: false` to seamlessly cooperate with Bootstrap.
- **Bootstrap 5 (v5.3.3)**: Responsive grid systems, modals, utilities, and components.
- **Bootstrap Icons (v1.11.3)**: Accessible vector iconography.
- **Vanilla JavaScript (ES6+)**: Pure modular JavaScript without framework overhead (No React, Vue, Angular, or Python).
- **Custom CSS**: Comprehensive design system featuring themes (`themes.css`), animations (`animations.css`), responsive refinements (`responsive.css`), and core styling (`style.css`).

---

## 2. Directory Structure

```text
poke-bowl-restaurant/
│
├── index.html                   # Home 1: General Services Landing
├── home-2.html                  # Home 2: Niche-Specific Landing (Interactive Bowl Studio)
├── about.html                   # About: Our Story, Mission, Milestones Timeline, Team
├── menu.html                    # Menu: Categorized by Protein with Real-time Filtering & Modal Details
├── nutrition.html               # Nutrition: Macro Guides, Comparison Matrix, Allergens, FAQ
├── blog.html                    # Blog & Journal: Responsive images, live search, category filters & article reader
├── contact.html                 # Contact: Details, Validated Order Enquiry Form, Map Placeholder
├── README.md                    # Documentation & Setup Guide
│
├── assets/
│   ├── css/
│   │   ├── style.css            # Base typography, components, buttons, surfaces, blog cards, and footers
│   │   ├── responsive.css       # Viewport media queries (320px, 720px, 1024px, 1366px, 1440px) & RTL rules
│   │   ├── animations.css       # Keyframes, floating ingredient badges, and IntersectionObserver reveals
│   │   └── themes.css           # CSS variables for Light and Dark themes with zero-flicker init
│   │
│   ├── js/
│   │   ├── main.js              # IntersectionObserver reveals, image fallbacks, lightbox helpers
│   │   ├── navigation.js        # Sticky navbar scroll listener, mobile drawer toggle, active links
│   │   ├── theme.js             # Dark/Light mode switcher with localStorage persistence & OS sync
│   │   ├── direction.js         # RTL/LTR switcher with localStorage persistence & logical property support
│   │   ├── glider.js            # Interactive Glider Carousel (touch swipe, drag, auto-play, loop, RTL)
│   │   ├── menu.js              # Real-time protein category filtering, search input, details modal
│   │   ├── bowl-builder.js      # Interactive 4-step custom bowl calculator & live macro estimator
│   │   ├── contact-form.js      # Client-side input validation, double-submit guard, demo simulation
│   │   └── blog.js              # Live article search, category filtering, reading progress bar & modal reader
│   │
│       ├── logo/                # High-res SVG vector brand logo and favicon
│       ├── hero/                # Thematic, non-repeated responsive Hero background images (sm, md, lg variants)
│       ├── home/                # Hero images, prep photography, culinary backdrop
│       ├── bowls/               # 12 unique signature poke bowl photos
│       ├── ingredients/         # Base grains, sashimi proteins, crisp toppings, house sauces
│       ├── about/               # Heritage Pacific coast, organic farms, dining atmosphere
│       ├── team/                # Professional portraits of Executive Chef, Dietitian, Managers
│       ├── testimonials/        # Customer headshots
│       ├── gallery/             # Visual feast high-res dining gallery photos
│       └── blog/                # 100% unique, non-repeated responsive blog images (sm, md, lg variants)
│
└── pages/
    └── legal/
        ├── privacy.html         # Privacy Policy and client storage transparency
        └── terms.html           # Terms of Service, nutritional disclaimers, and IP notices
```

---

## 3. How to Run the Project Locally

The project runs on any standard static web server without requiring compilation or build steps.

### Option A: Using Python (Recommended)
Open PowerShell or your terminal in the project directory:
```bash
python -m http.server 8080
```
Then navigate to: `http://localhost:8080/index.html`

### Option B: Using Node.js (npx serve or http-server)
```bash
npx serve -l 8080 .
```
Or directly double-click `index.html` to open in any modern browser.

---

## 4. Website Pages & Features

### 1. `index.html` (Home 1 — General Services Landing)
- High-impact hero section with fresh poke bowl photography and floating macro badges.
- Food preparation and ocean-to-table culinary philosophy.
- 6 featured signature poke bowls with pricing, tags, and quick-order links.
- Farm-fresh ingredients highlight grid.
- Service benefits: 3-minute rapid assembly, allergen safety, compostable packaging, award-winning taste.
- Customer testimonials and promotional 15% discount CTA banner.
- Visual gallery preview with clickable lightbox modal.

### 2. `home-2.html` (Home 2 — Interactive Custom Bowl Studio)
- Split-screen hero layout focusing on the custom bowl experience.
- **Interactive 4-Step Bowl Builder**:
  - Step 1: Foundational Base (White sushi rice, brown rice, super grains, crisp greens).
  - Step 2: Sashimi & Cooked Proteins (Atlantic salmon, Ahi tuna, herb chicken, sweet shrimp, sesame tofu).
  - Step 3: Multi-select Toppings (Avocado, mango, cucumber, edamame, wakame seaweed, toasted sesame).
  - Step 4: Scratch Sauces (Sesame shoyu, spicy sriracha mayo, sweet ponzu lime, wasabi aioli).
- **Sticky Live Summary Card**:
  - Live calculated estimated Calories, Protein (g), Carbs (g), Healthy Fats (g), and Fiber (g).
  - Live animated macro progress meters.
  - Live estimated total price calculation.
  - Reset button to restore defaults.
  - "Enquire With This Bowl" button that pre-populates customer selections directly into `contact.html`.

### 3. `about.html` (About Our Story & Team)
- **Our Story**: The Hawaiian heritage of "poke" and modern Japanese-fusion inspiration.
- **Our Mission**: Uncompromised sashimi quality, nutritional transparency, and ecological stewardship.
- **Milestones Timeline**: Interactive visual timeline detailing growth milestones.
- **Meet Our Team**: Professional bios and specialty bowls for Executive Chef Kai, Dietitian Dr. Maya Lin, General Manager David, and Prep Lead Leila.
- Dining room atmosphere and spotless open prep kitchen gallery snapshots.

### 4. `menu.html` (Signature Menu by Protein)
- Categorized gallery containing 12 distinct poke bowls.
- **Protein Categories**: All Bowls, Salmon Bowls, Tuna Bowls, Chicken Bowls, Shrimp Bowls, Tofu & Vegetarian Bowls, Signature Fusion Bowls.
- **Live Search & Filtering**: Instant search by bowl name, ingredients, or dietary labels without page reloads.
- Empty-state message with one-click filter reset.
- **Nutritional Details Modal**: Click "View Details" to inspect comprehensive macros, sodium, and allergen tags.

### 5. `nutrition.html` (Nutrition & Allergen Guide)
- Macro overview highlighting high protein, heart-healthy fats (Omega-3), and slow complex carbohydrates.
- **Signature Bowls Nutritional Comparison Matrix**: Side-by-side table displaying calories, protein, carbs, fats, fiber, and sodium.
- **Protein Deep-Dive**: Comparison of salmon, tuna, chicken, shrimp, and tofu per standard serving.
- **Allergen Matrix & Cross-Contact Protocols**: Comprehensive table tracking Gluten, Soy, Sesame, Fish, Shellfish, and Nuts.
- Goal customization tips for Low Sodium, Ketogenic, and High-Protein diets.
- Expandable nutrition FAQ accordion.

### 6. `contact.html` (Contact Information & Order Enquiry)
- **Editable Store Details Placeholders**: Sample street address, demo telephone, demo email, and daily opening hours.
- **Validated Order Enquiry Form**:
  - Full Name, Email, Phone Number, Enquiry Type, Preferred Bowl, Quantity, Preferred Date/Time, Message, and Privacy Consent.
  - RFC email validation and international phone number validation.
  - Submit spinner preventing repeated submissions.
  - Feedback modal clearly stating this is a frontend demo and inquiries are not transmitted.
  - Auto-fills preferred bowl and message when navigating from the menu or bowl builder.
- **Map Placeholder**: Visual card ready for Google Maps iframe integration upon production deployment.

### 7. Legal Pages (`pages/legal/privacy.html` & `pages/legal/terms.html`)
- Complete privacy terms, client `localStorage` transparency, allergen advisories, and copyright policies.

---

## 5. Theme Switching (Dark & Light Mode)

The website features an accessible theme switcher with sun and moon icons:
- **Light Theme**: Crisp fresh cream backgrounds (`#FCFDFB`), emerald green accents (`#10B981`), coral highlights (`#F43F5E`), and soft shadows.
- **Dark Theme**: Deep jungle slate backgrounds (`#0A1210`), mint accents (`#34D399`), vibrant warm coral (`#FB7185`), and high-contrast text.
- **Persistence**: Saved under `localStorage.getItem('poke_theme')`.
- **Zero-Flicker**: An inline `<script>` in the `<head>` of each HTML document applies `data-theme` immediately prior to page rendering.
- Respects system OS `prefers-color-scheme` if no manual user selection is saved.

---

## 6. RTL and LTR Language Support

The website includes native right-to-left (RTL) support:
- Click the direction toggle button in the navbar (`RTL` / `LTR`).
- Toggles the document attribute `dir="rtl"` and class `rtl`.
- Persisted in `localStorage.getItem('poke_direction')` across all six pages.
- Built using **CSS Logical Properties** (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`) ensuring forms, navbar controls, cards, and footer columns align correctly in Arabic, Hebrew, or other RTL languages without layout overflow.

---

## 7. How to Update Images, Menu Items & Contact Settings

### Replacing Image Assets
All images are organized locally in `assets/images/`:
- **Logo**: Replace `assets/images/logo/logo.svg` or `favicon.svg`.
- **Food Cards**: Add or replace images in `assets/images/bowls/` and update `src` attributes in `menu.html` or `index.html`.
- **Team**: Replace portraits in `assets/images/team/`.
- All images use responsive aspect ratios (`4/3` or `1/1`) and `object-fit: cover` to avoid distortion.

### Updating Prices and Nutrition Values
- In `menu.html`: Update the data attributes on each `.menu-item-card` (`data-price`, `data-calories`, `data-protein`, etc.) and the visible card text.
- In `home-2.html` and `assets/js/bowl-builder.js`: Update the calories, protein, carbs, and price attributes on `.ingredient-select-card` elements to adjust live calculations.
- In `nutrition.html`: Update the comparison table values in the `<tbody>` section.

### Configuring a Real Backend Contact Form and Map
1. **Form Backend**:
   - In `contact.html`, set the `<form id="orderEnquiryForm" method="POST" action="YOUR_ENDPOINT_URL">`.
   - Compatible with services like Formspree, Netlify Forms, EmailJS, or custom Node/Express API routes.
   - Update `assets/js/contact-form.js` to send a `fetch('YOUR_ENDPOINT_URL', { method: 'POST', body: ... })` instead of the demo timeout.
2. **Real Google Map**:
   - In `contact.html`, replace `.map-placeholder-box` with your Google Maps embed iframe:
     ```html
     <iframe src="https://www.google.com/maps/embed?pb=..." width="100%" height="400" style="border:0; border-radius: 1.25rem;" allowfullscreen="" loading="lazy"></iframe>
     ```

---

## 8. Viewport Verification & Accessibility Standards

The site has been engineered and tested across standard responsive breakpoints:
- **320px** (Small mobile): Fluid typography, wrapped controls, zero horizontal scroll.
- **720px** (Tablet / small landscape): Horizontally scrollable pill filters, collapsed badges, adaptive grids.
- **1024px** (Tablet landscape / small laptop): Refined spacing, sticky sidebars.
- **1366px** (Desktop): 3-column bowl grids, balanced whitespace.
- **1440px** (Large desktop): High-resolution typography, fluid container bounds.

Accessible keyboard navigation (`Escape` closes mobile navigation, `Tab` focuses controls, clear `aria-label` attributes) and motion sensitivity (`@media (prefers-reduced-motion: reduce)`) are enabled throughout.

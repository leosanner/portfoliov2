# Landing Page — Design Specification

**Status:** Approved
**Branch:** `landing-page`
**References:**

- Stitch project (structure + colors): `projects/463811366920728378/screens/e50af00dd0634718b5c4e9d2455a5011`
- [mcshannock.design](https://www.mcshannock.design/) (visual style + typography approach)

---

## Sections

The landing page is a single-scroll page composed of 7 sections in this order:

### 1. Navbar

- Fixed position, `backdrop-blur-md`, semi-transparent dark background
- Left: logo text "Leonardo Sanner" (Manrope, bold)
- Center (desktop): nav links — Projects, About, Contact (anchor scroll)
- Right: CTA button with primary gradient
- Mobile: hamburger menu (future iteration — initially hidden links on small screens)

### 2. Hero

- Full-width, generous vertical padding (`py-20 lg:py-32`)
- Large headline (Manrope extrabold, `text-5xl lg:text-7xl`) with solid accent color (mint green) on key word
- Subtitle paragraph (Inter, `text-lg lg:text-xl`, muted color)
- Two CTA buttons: primary solid green + secondary outline
- Clean layout — text only, no terminal mock or side imagery
- Grid pattern background (subtle dot grid via `radial-gradient`)

### 3. About Me (Sobre Mim)

- Section title + subtitle on left column
- Right side: 2×2 grid of skill cards
- Each card: icon (Material Symbols or Lucide) + title + short description
- Cards: `bg-surface-container-low`, glass-edge border, hover → `bg-surface-container-high`
- Categories: Back-end, UI/Frontend, Performance, Security (customizable)

### 4. Featured Projects (Projetos em Destaque)

- Header row: section title + "View All →" link (routes to `/projects`)
- 3 project cards in responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Card style (mcshannock-inspired):
  - Thumbnail image (project screenshot or placeholder)
  - Project title (Manrope bold)
  - Tech stack as small inline tags
  - Short description (1-2 lines)
  - Link to `/projects/:slug`
  - Subtle hover: border highlight or slight scale
- Data: fetched from API via `useProjects()` hook, limited to 3 featured/published

### 5. Marquee

- Full-width scrolling text, CSS animation
- Large text (Manrope, `text-[8vw]` or clamped) repeating continuously
- Content: "Let's work together." (or similar)
- Subtle separator between Contact and Footer
- CSS-only implementation (no JS library)

### 6. Contact (Contato)

- Centered card with glassmorphism effect
- Gradient background accent (subtle `primary-container` glow)
- Headline + subtitle text
- Two action buttons: Email + LinkedIn
  - Each: icon + label + arrow, horizontal layout
  - Hover: border color change (primary for email, secondary for LinkedIn)
- Bloom shadow on container

### 7. Footer

- Dark background (`#0e0e0e`)
- Left: name + copyright text
- Right: social links (Github, LinkedIn) as small uppercase labels
- Top border separator

---

## Color Palette

Green-based dark palette with solid colors (no gradients).

| Token                         | Value     | Usage                       |
| ----------------------------- | --------- | --------------------------- |
| `--background`                | `#101210` | Page background             |
| `--surface`                   | `#101210` | Same as background          |
| `--surface-container-lowest`  | `#0b0d0b` | Footer, deep containers     |
| `--surface-container-low`     | `#1a1e1a` | Cards default               |
| `--surface-container`         | `#1e221e` | Mid-level containers        |
| `--surface-container-high`    | `#282c28` | Cards hover, buttons        |
| `--surface-container-highest` | `#333733` | Elevated elements           |
| `--surface-bright`            | `#383c38` | Interactive surfaces        |
| `--primary`                   | `#a8f0c8` | Primary text accents (mint) |
| `--primary-container`         | `#1a9a5a` | Solid CTA backgrounds       |
| `--secondary`                 | `#e8c170` | Warm gold accents           |
| `--secondary-container`       | `#b89530` | Gold container              |
| `--tertiary`                  | `#7ecbf5` | Cool blue accents           |
| `--on-surface`                | `#e2e5e2` | Primary text                |
| `--on-surface-variant`        | `#b8c9be` | Secondary/muted text        |
| `--outline`                   | `#7d9a87` | Borders                     |
| `--outline-variant`           | `#3a4f40` | Subtle borders              |

---

## Typography

| Role     | Font Family   | Weights       | Usage                          |
| -------- | ------------- | ------------- | ------------------------------ |
| Headline | Manrope       | 700, 800      | Section titles, hero headline  |
| Body     | Inter         | 400, 500, 600 | Paragraphs, descriptions       |
| Label    | Space Grotesk | 300, 400, 700 | Tags, labels, metadata, footer |

### Scale

- Hero headline: `text-5xl` → `lg:text-7xl` (Manrope extrabold)
- Section titles: `text-3xl` (Manrope bold)
- Card titles: `text-xl` (Manrope bold)
- Body: `text-base` / `text-lg` (Inter)
- Labels/tags: `text-[0.6875rem]` uppercase tracking-widest (Space Grotesk)
- Marquee: `text-[8vw]` or `clamp(4rem, 11.25vw, 10rem)` (Manrope)

---

## Visual Effects

### Grid Pattern Background

```css
background-image: radial-gradient(
  circle at 1px 1px,
  rgba(168, 240, 200, 0.04) 1px,
  transparent 0
);
background-size: 40px 40px;
```

Applied to `<main>` wrapper.

### Glass Edge

```css
border-top: 1px solid rgba(168, 240, 200, 0.08);
border-left: 1px solid rgba(168, 240, 200, 0.08);
```

Applied to cards and elevated containers.

### Bloom Shadow

```css
box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.4);
```

Applied to contact card and featured containers.

### Marquee Animation

```css
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
```

Content duplicated for seamless loop. CSS-only, no JS.

### Accent Text

Solid color accent using `text-primary` (#a8f0c8) — no gradients.

---

## Component Architecture

```
apps/web/src/
├── pages/
│   └── HomePage.tsx          ← Composes all landing sections
├── components/
│   └── landing/
│       ├── Navbar.tsx        ← Fixed nav with blur
│       ├── Hero.tsx          ← Headline + CTAs
│       ├── AboutMe.tsx       ← Bio + skill cards grid
│       ├── FeaturedProjects.tsx ← 3 project cards + "View All"
│       ├── ProjectCard.tsx   ← Single project card (mcshannock style)
│       ├── Marquee.tsx       ← Scrolling text animation
│       ├── Contact.tsx       ← CTA card with email/linkedin
│       └── Footer.tsx        ← Bottom bar
├── index.css                 ← Tailwind + custom theme tokens + utility classes
```

### Tailwind v4 Theme Configuration

In `index.css` (CSS-based config for Tailwind v4):

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-background: #131313;
  --color-surface: #131313;
  --color-surface-container-lowest: #0e0e0e;
  --color-surface-container-low: #1c1b1b;
  --color-surface-container: #201f1f;
  --color-surface-container-high: #2a2a2a;
  --color-surface-container-highest: #353534;
  --color-surface-bright: #3a3939;
  --color-primary: #d0bcff;
  --color-primary-container: #7a3ff1;
  --color-secondary: #4edf9f;
  --color-secondary-container: #00b479;
  --color-tertiary: #ffb77d;
  --color-on-surface: #e5e2e1;
  --color-on-surface-variant: #cbc3d8;
  --color-outline: #958da1;
  --color-outline-variant: #4a4455;

  /* Fonts */
  --font-headline: "Manrope", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-label: "Space Grotesk", sans-serif;
}
```

---

## Responsive Behavior

| Breakpoint | Layout Changes                                    |
| ---------- | ------------------------------------------------- |
| Mobile     | Single column, stacked sections, nav links hidden |
| `md`       | Project cards 2-col, About cards 2-col            |
| `lg`       | Project cards 3-col, About section side-by-side   |
| `xl`       | Max-width `7xl` container, generous padding       |

---

## Data Integration

- **Featured Projects:** `useProjects()` → filter first 3 published → render `ProjectCard`
- **Contact links:** hardcoded (email, LinkedIn URL) — can be moved to env vars later
- **Nav links:** anchor scroll (`#about`, `#projects`, `#contact`) using Wouter-compatible approach

---

## Light Mode (Deferred)

Dark mode is the default and only mode for initial implementation. Light mode toggle is planned for a future iteration and will require:

- Inverted color tokens
- A toggle component in the Navbar
- CSS custom properties swap via class on `<html>`

---

## Out of Scope (Initial Implementation)

- Light mode toggle
- Mobile hamburger menu (nav links hidden on mobile for now)
- Page transitions / route animations
- Blog/Insights section
- Testimonials
- "What we do" / services listing

# Design System Strategy: The Tactile Tabletop



## 1. Overview & Creative North Star

The Creative North Star for this design system is **"The Curated Tabletop."**



We are moving away from the rigid, sterile "app" look and toward an editorial experience that mimics the physical joy of board gaming—layering, depth, and tactile interaction. Instead of standard grids, we use **Intentional Asymmetry** and **Tonal Depth** to guide the eye. Imagine the interface as a high-end gaming table where elements (cards, tokens, boards) are placed with purpose, creating a sense of community warmth and professional polish. We break the "template" feel by overlapping imagery with typography and using surface shifts rather than lines to define space.



## 2. Colors & Surface Architecture

The palette draws from Tecklenburg’s natural forest greens and warm, sunset oranges, balanced by a sophisticated "Mint-Ice" neutral scale.



### The "No-Line" Rule

**Strict Mandate:** 1px solid borders are prohibited for sectioning.

Structure is defined through **Background Color Shifts**. To separate a "News" section from the "Hero" area, transition from `surface` (#d3fffc) to `surface-container-low` (#bafdfa). This creates a sophisticated, seamless flow that feels organic rather than mechanical.



### Surface Hierarchy & Nesting

Treat the UI as physical layers. Depth is achieved by nesting container tiers:

- **Base Layer:** `surface` (#d3fffc) for the main page background.

- **Section Layer:** `surface-container` (#adf5f2) to group related content blocks.

- **Interactive Layer:** `surface-container-highest` (#96ece8) for cards or elements that require immediate attention.



### The "Glass & Gradient" Rule

To evoke the "Modern" requirement, use **Glassmorphism** for navigation bars and floating overlays.

- **Backdrop Blur:** 12px–20px.

- **Fill:** `surface` at 70% opacity.

- **Signature Gradient:** Use a linear gradient from `primary` (#00675d) to `primary_container` (#9aecdf) at a 135° angle for Hero CTAs. This adds a "visual soul" that flat colors lack.



## 3. Typography

The system utilizes a high-contrast pairing: **Plus Jakarta Sans** for playful, expressive headings and **Manrope** for grounded, highly readable body text.



* **Display & Headlines (Plus Jakarta Sans):** These are our "game titles." They should feel bold and welcoming. Use `display-lg` for hero sections to create a massive, editorial impact.

* **Titles & Body (Manrope):** These are our "rulebooks." They prioritize clarity. `body-lg` is the standard for news snippets, ensuring accessibility for all age groups in the community.

* **Hierarchy as Identity:** By pushing the scale difference between `headline-lg` and `body-md`, we create an authoritative, magazine-like feel that distinguishes Spieletreff Tecklenburg from a generic hobbyist blog.



## 4. Elevation & Depth

We eschew traditional drop shadows in favor of **Tonal Layering**.



* **The Layering Principle:** Place a card using `surface_container_lowest` (#ffffff) onto a background of `surface_container` (#adf5f2). The contrast provides a "soft lift" without a single pixel of shadow.

* **Ambient Shadows:** Use only for floating "Action" elements.

* *Blur:* 32px | *Opacity:* 6% | *Color:* `on_surface` (#003534). This mimics soft, natural ambient light hitting a game board.

* **The "Ghost Border" Fallback:** If a container sits on a color of similar luminance, use the `outline_variant` (#7db7b5) at **15% opacity**. It should be felt, not seen.

* **Interactive Depth:** On hover, a card should transition from `surface_container_lowest` to a slightly higher tonal tier or receive a subtle `primary` tint to signal "pick-up" intent.



## 5. Components



### Buttons (The "Game Tokens")

* **Primary:** Gradient fill (`primary` to `primary_dim`), `xl` (1.5rem) roundedness. Use `on_primary` (#c0fff4) for text. These should feel like premium game pieces.

* **Secondary:** `secondary_container` (#ffc69f) with `on_secondary_container` (#723800). This provides the "Warm Orange" pop for community-focused actions like "Join a Table."

* **Tertiary:** No background. Text-only using `primary` weight 700.



### Cards (The "Game Box")

* **Style:** No borders. Use `surface_container_highest` for the background.

* **Layout:** Image-top with a 5% "overhang" (image slightly wider than the text container) to create a custom, non-standard feel.

* **Spacing:** Use `spacing.6` (1.5rem) for internal padding to ensure "breathing room."



### Chips (The "Resource Cubes")

* Used for game categories (e.g., "Strategy," "Family," "Expert").

* Use `tertiary_container` (#ccdff6) with `sm` (0.25rem) roundedness to look distinct from rounded buttons.



### Event Lists

* **Constraint:** Forbid divider lines.

* **Execution:** Use `spacing.8` (2rem) vertical gaps. Date headers should use `secondary` (#904800) in `label-md` uppercase to create a clear "anchor" for the eye.



### Input Fields

* `surface_container_low` background with a `ghost-border` on focus using `primary`. Avoid stark white boxes unless they are on a colored section.



## 6. Do's and Don'ts



### Do

* **Do** overlap text onto images slightly (using negative margins from the spacing scale) to create an editorial, high-end feel.

* **Do** use the `secondary` orange specifically for community/human-centric CTAs to draw the eye to "social" actions.

* **Do** ensure a 4.5:1 contrast ratio for all body text against backgrounds—the deep `on_surface` (#003534) is your best friend here.



### Don't

* **Don't** use black (#000000) for shadows or text. Use the tinted `on_surface` or `on_background` to keep the palette cohesive.

* **Don't** use 90-degree corners. Everything in a community game group should feel "friendly," so stick to the `md` to `xl` roundedness scale.

* **Don't** use "Default Blue" for links. Use the `primary` forest green to maintain the Tecklenburg regional identity.
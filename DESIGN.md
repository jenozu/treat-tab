# Treat Tab Design System

This file is the authoritative visual reference for Treat Tab. New screens and components should reuse these tokens and patterns before introducing additional colors, fonts, borders, or shadows.

## Brand direction

Treat Tab uses a playful sweetshop palette with a high-contrast neo-brutalist structure. The interface should feel cheerful and friendly without losing clarity around balances, payments, overdue tabs, destructive actions, and other financial information.

## Core palette

| Token | Color | Hex | Purpose |
| --- | --- | --- | --- |
| `brand-pink` | Bubblegum Pink | `#FFD8E8` | App canvas, tinted container backdrops, and the primary sweetshop identity |
| `brand-black` | Neo-Brutalist Solid Black | `#000000` | Heavy borders, offset shadows, header bars, and high-contrast headings |
| `brand-white` | Pure White | `#FFFFFF` | Cards, modal drawers, bottom sheets, and white button fills |
| `brand-cyan` | Pastel Cyan / Electric Sky | `#9BE9FB` | Primary actions, active tabs, and highlight badges |
| `brand-cyan-hover` | Soft Cyan | `#83DFEF` | Hover and pressed states for cyan controls |
| `brand-lilac` | Pastel Lilac / Lavender | `#FAE8FF` | Secondary actions, badge chips, and gentle reset prompts |
| `brand-ice` | Soft Ice Blue | `#EBF8FF` | Hover transitions and selected pills |
| `brand-rose` | Candy Rose Muted | `#F6BED5` | Subtle pink borders and hover badge accents |
| `brand-danger` | Danger Red | `#CC0000` | Overdue balances, critical alerts, and destructive emphasis |
| `brand-danger-bright` | Crimson Red | `#E02424` | Strong destructive and urgent interaction states |
| `brand-off-white` | Off-White | `#FBFBFB` | Text input backgrounds and quiet surfaces |
| `brand-neutral` | Neutral Light | `#F1F1F1` | Dividers, disabled surfaces, and subtle card separation |

## Functional colors

Functional colors must retain their meaning throughout the app.

| Meaning | Tailwind family | Typical use |
| --- | --- | --- |
| Paid / positive profit / success | Emerald (`emerald-100`, `emerald-600`, `emerald-800`) | Paid badges, positive totals, successful saves |
| Pending / outstanding debt | Rose and red (`rose-50`, `rose-600`, `rose-700`) | Open tabs, outstanding balances, overdue states |
| Reminders / buzz notices | Amber and yellow (`amber-100`, `yellow-300`, `amber-900`) | Reminders, warnings, temporary notices |
| Categories / discounts | Violet and purple (`purple-100`, `purple-900`) | Category chips, discounts, secondary metadata |

Never use color as the only signal. Pair status colors with text, an icon, or both.

## Typography

- Body: `Space Grotesk`, with `Outfit` and `sans-serif` fallbacks.
- Display and headings: `Outfit`, `sans-serif`.
- Balances, totals, and other changing numeric values: monospace with tabular numerals.
- Use heavy display weights intentionally for short headings and primary totals. Longer body copy should remain at a readable medium or regular weight.

## Borders and shadows

- Default interactive cards: `2px` solid black border with a `2px` or `4px` zero-blur offset shadow.
- Major frames and bottom sheets: `4px` solid black border with an `8px` offset shadow where space permits.
- Shadows are solid black and never blurred for core neo-brutalist surfaces.
- Hover may move the surface up and left by `1px` while increasing the offset shadow.
- Pressed controls may return toward the shadow using a small translate or scale effect.

Available Tailwind shadow tokens:

- `shadow-brutal-sm`: `2px 2px 0 #000000`
- `shadow-brutal`: `4px 4px 0 #000000`
- `shadow-brutal-lg`: `8px 8px 0 #000000`

## Component rules

### Primary actions

- Cyan surface, black text, black border, and a solid black offset shadow.
- Hover uses `brand-cyan-hover`.
- Disabled actions must remain visibly disabled and cannot rely only on reduced opacity.

### Secondary actions

- White or lilac surface with the same black structural border.
- Use ice blue for quiet selected and hover states.

### Cards and sheets

- Default card surface is white.
- Pink is the canvas, not the default text surface.
- Bottom sheets and modals should keep a white body and a clearly separated header or action area.

### Danger actions

- Use danger red only for overdue, destructive, or critical states.
- Destructive operations require an explicit label and confirmation when data loss is possible.

## Accessibility

- Default text is solid black on the light brand surfaces.
- White text is reserved for black or sufficiently dark status backgrounds.
- All icon-only controls require an accessible name.
- Focus must remain visible with a black outline and cyan or white offset.
- Tap targets should be at least `44px` in either dimension on mobile whenever the layout allows.
- Respect reduced-motion preferences for bounce, pulse, and large transform effects.

## Implementation

The canonical tokens are declared in `src/index.css` under Tailwind's `@theme` block. Prefer semantic utilities such as `bg-brand-pink`, `bg-brand-cyan`, `text-brand-black`, `border-brand-black`, and `shadow-brutal` over repeating raw hex values.


# Responsiveness Check: localhost:3021 (home, project, index, about)

**Date**: 2026-08-23
**Mode**: Targeted — mobile landscape
**Viewports tested**: 667×375, 844×390, 932×430, 1024×600, 1366×768, 1512×857
**Browser tool**: Chrome MCP (measured in same-origin iframes; the window manager
refused `resize_window`, so viewports were emulated by iframe size)

## Summary

| Viewport | Status before | Status after |
|---|---|---|
| 667×375 — iPhone SE landscape | Pass | Pass |
| 844×390 — iPhone 14 landscape | **Fail** — 1 critical | Pass |
| 932×430 — iPhone 15 Pro Max landscape | **Fail** — 1 critical | Pass |
| 1024×600 — small tablet landscape | Warn — 1 medium | Pass |
| 1366×768 — laptop | Pass | Pass |
| 1512×857 — desktop | Pass | Pass |

**Overall**: one critical issue, caused by height-derived sizing collapsing on
short viewports. No horizontal overflow was found at any size, before or after.

## Critical & High Issues

### Project media collapses to a thumbnail — Critical

**Viewports**: 844×390, 932×430 (medium at 1024×600)
**Check**: Image/media scaling

`.project-stage` sized the main image as `min(62rem, calc(100svh - 32rem))`.
The 32rem allowance covers the header offset, the thumbnail dock and the title
— fine at 857px tall, fatal at 390px, where it leaves 70px.

Measured main image, before → after:

| Viewport | Before | After |
|---|---|---|
| 844×390 | 70×70 | 354×354 |
| 932×430 | 110×110 | 391×391 |
| 1024×600 | 280×280 | 430×430 |

**Fix applied**: below `max-height: 40rem` the stage drops its `100svh` height
and sizes the media from width instead (`min(62rem, 42vw)`), letting the page
scroll. The dock lift is disabled there too, since there is no dock below `lg`.

---

### Home card images shrink to 66px — Medium

**Viewports**: 844×390, 932×430
**Check**: Image/media scaling

Card images were `17vh`, which is 66px on a 390px-tall screen.

**Fix applied**: `clamp(12rem, 17vh, 20rem)` — unchanged on normal screens
(17vh ≈ 153px at 900px tall), floored at 120px in landscape. Same clamp on the
hover preview row so both stay on one line.

---

### About panel cramped into five columns — Medium

**Viewports**: 844×390, 932×430
**Check**: Whitespace balance / content stacking

Landscape phones are wider than the `md` breakpoint, so About used the desktop
five-column layout: the portrait column resolves to ~60px wide at 844px, and
the two lists share whatever is left.

**Fix applied**: below `max-height: 40rem` About uses its stacked layout (the
one built for portrait phones) and drops its vertical padding from 9.25rem to
6rem.

## Transition Analysis

| Transition | Observed at | Clean? | Notes |
|---|---|---|---|
| Home cards: alternating → three-slot staircase | 768px | Yes | `md` |
| Nav: hamburger → full bar | 1024px | Yes | `lg` |
| Thumbnail dock + media counter appear | 1024px | Yes | Touch devices never see either |
| Project stage: scrolling → viewport-locked | 640px tall | Yes | New; height-based, not width-based |
| About: stacked → five columns | 768px wide **and** 640px tall | Yes | New height condition |

## Recommendations

### Done (CSS only)
- Height-derived sizing guarded behind `max-height: 40rem` on the project stage
- `clamp()` floors on card and preview image heights
- About stacks on short viewports

### Worth considering
- The thumbnail dock is 14rem tall and still shows at `lg` widths with short
  heights (e.g. 1024×600); it overlays content there because the lift is off.
  Hiding it below `min-height: 40rem` as well would be consistent.
- Landscape phones get the desktop staircase on the homepage. It measures fine,
  but three slots across 844px is tight — worth an eyeball on a real device.

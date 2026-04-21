

## Smoother, rounder fade between chapter panel and photo grid

### Problem
The current fade still shows a visible seam/band because:
1. The gradient uses linear color interpolation in sRGB, which produces a perceived "muddy middle" stripe
2. The transition from dark to cream happens too abruptly in the middle zone
3. The `<style>` tag inside the component may not be overriding cleanly on rebuild

### Fix — Replace the bottom fade strip with a "rounder" easing curve

**1. Use a perceptually smooth easing (S-curve in luminance, not linear)**

Instead of 15 hand-picked stops, use a denser, ease-in-out distribution so brightness ramps slowly at both ends and faster through the middle. This is what makes a fade feel "round" instead of striped.

New gradient (24 stops, smooth-step distribution, neutral warm taupe mids — no caramel):

```css
background: linear-gradient(
  to bottom,
  #2A1810 0%,
  #2A1810 12%,
  #2B1911 18%,
  #2D1B13 24%,
  #301E15 30%,
  #352218 36%,
  #3C281E 42%,
  #463224 48%,
  #523D2D 54%,
  #614C39 60%,
  #725D48 65%,
  #847058 70%,
  #96847 0%, /* removed */
  #978670 75%,
  #AA9B86 80%,
  #BDB09C 84%,
  #CFC4B2 88%,
  #DED5C5 91%,
  #E9E2D4 94%,
  #F0EADD 96%,
  #F4EEE3 98%,
  #F5EFE6 100%
);
```

(Final clean version, no typo, will be in implementation.)

**2. Make it taller and "rounder"**

- Desktop (≥1024px): **640px** (was 500px)
- Tablet (≥640px): **420px** (was 320px)
- Mobile (<640px): **280px** (was 220px)

More vertical room = each color step occupies more pixels = the eye reads it as a dissolve, not a band.

**3. Add a subtle blur layer for true "roundness"**

Stack two elements:
- Base: the gradient strip (above)
- Overlay: a `backdrop-filter: blur(0)` is useless here, so instead add a second absolutely-positioned div with `background: radial-gradient(ellipse at center top, rgba(42,24,16,0.4) 0%, transparent 70%)` to soften the top edge meeting the panel, and another `radial-gradient(ellipse at center bottom, rgba(245,239,230,0.3) 0%, transparent 70%)` to soften the bottom edge meeting the photo grid.

This kills any residual seam at the junctions.

**4. Ensure no parent wrapper interferes**

Verify in `Index.tsx` that `<HeroSection />`, `<ChapterBreak />`, and `<ZoomParallaxSection />` are direct siblings with no wrapping `<div>` adding background or padding. (Quick check during implementation.)

**5. Force cache bust**

The previous edits may not be visible due to HMR caching the inline `<style>` block. Move the responsive heights from the inline `<style>` into Tailwind utility classes on the div itself (e.g. `h-[280px] sm:h-[420px] lg:h-[640px]`) so Vite recompiles cleanly.

### File affected
- `src/components/ChapterBreak.tsx` — replace the bottom fade strip section (gradient, heights, add soft radial overlays, switch to Tailwind responsive height classes)

### What stays the same
- Top 25px transition strip — unchanged
- Main chapter panel (`#2A1810`, typography, GSAP animations, "NO. 01 · THE LARDER", "Winter", subtitle) — unchanged
- Hero section above and photo grid below — unchanged


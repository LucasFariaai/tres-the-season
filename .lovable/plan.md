
Update only the two requested files and keep the rest of the site untouched.

1. Update `src/components/SeasonBar.tsx`
- In the desktop nav inside the `hidden lg:block` floating island, add a fourth button after `Producers`.
- Label it `Wine`.
- Keep the exact same classes and visual style as the existing `Menu`, `Concept`, and `Producers` buttons.
- Wire its click handler to `navigate("/wine-list")`.
- Leave the mobile floating island unchanged so it still only shows the logo and `Reserve`.

2. Update `src/components/ReserveSection.tsx`
- In the right column content block, insert a new inline anchor between:
  - the tasting-menu description paragraph
  - and the `OrganicReserveButton` container
- Point it to `/wine-list`.
- Use the text `Explore the carta`.
- Append the same diagonal arrow SVG pattern already used in `HeroSection`.
- Style it inline to match the requested look:
  - Abel, 13px
  - letter-spacing `0.06em`
  - color `#C17D3E`
  - no text decoration
  - no border
  - no background
  - no border-radius
  - `margin-top: 16px`
  - hover opacity transition to `0.7`
- Keep it in normal text flow, not wrapped in a special box.

3. Preserve constraints
- Do not create new components or pages.
- Do not modify the wine list page.
- Do not add anything to the mobile SeasonBar.
- Do not alter unrelated layout, spacing, or content outside these two small insertions.
- Do not introduce em dashes in any new text.

Files to modify
- `src/components/SeasonBar.tsx`
- `src/components/ReserveSection.tsx`

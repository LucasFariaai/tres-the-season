

## Rebuild Reserve Section as Full Reservation Experience

Inspired by The Brunchery's `/reserve` flow, transform the current simple `ReserveSection` into a multi-step interactive reservation experience, adapted to Tres's seasonal aesthetic and restaurant context (dinner, not brunch).

### Architecture

The reservation will live as a new `/reserve` route (not inline in the homepage). The current `ReserveSection` on the homepage becomes a CTA that links to `/reserve`. The navbar "Reserve" button also links there.

### New Files

**1. `src/pages/Reserve.tsx`** — Main reservation page
- State management for: date, time, partySize, seating, occasion, dietary, notes, submission
- Renders all sub-components in sequence
- Desktop: sticky summary card on the right (`lg:pr-[340px]`)
- Mobile: fixed bottom bar with progress
- On submit: simulated confirmation with code generation
- Wraps in `AnimatePresence` for confirmation overlay

**2. `src/components/reservations/ReservationHero.tsx`**
- Parallax hero with Tres branding ("Reserve Your Table")
- Season-aware gradient background (uses `useSeason`)
- Stats: rating, guests served, avg wait
- Scroll indicator

**3. `src/components/reservations/DateTimePicker.tsx`**
- Step 1: horizontal scrollable date cards (14 days ahead)
- Time slots grid for dinner hours: 18:00, 18:30, 19:00, 19:30, 20:00, 20:30, 21:00, 21:30
- Popular times marked
- Uses `date-fns` for formatting

**4. `src/components/reservations/PartySizeSelector.tsx`**
- Step 2: circular counter with progress ring
- Quick-select buttons (1, 2, 4, 6, 8)
- +/- buttons, large party notice for 8+

**5. `src/components/reservations/SeatingPreference.tsx`**
- Step 3: three options adapted to Tres:
  - "Waterside Terrace" — Views of the Maas
  - "Main Dining" — Intimate indoor setting
  - "Chef's Counter" — Watch the kitchen

**6. `src/components/reservations/SpecialRequests.tsx`**
- Step 4 (optional): occasion selector, dietary preferences, notes textarea

**7. `src/components/reservations/ReservationSummary.tsx`**
- Desktop: floating card fixed right with progress bar
- Mobile: bottom bar with compact summary + "Book" button
- Progress tracking (date+time, party, seating)

**8. `src/components/reservations/ConfirmationCelebration.tsx`**
- Full-screen overlay with confetti
- Confirmation code, details card
- "Add to Calendar" + "Share" + "Return home" buttons

### Modified Files

**`src/App.tsx`** — Add route: `<Route path="/reserve" element={<Reserve />} />`

**`src/components/ReserveSection.tsx`** — Simplify to a CTA section on the homepage that links to `/reserve` instead of having an inline form

**`src/components/SeasonBar.tsx`** — Change Reserve button to use `react-router-dom` `Link` to `/reserve`

### Styling
- All components use Tres's season tokens (`season-dark`, `season-mid`, etc.) and fonts (`font-display`, `font-body`)
- Framer Motion for all animations (already installed)
- `date-fns` needed for date formatting (will install)
- No `react-icons` or `next/image` — use lucide-react icons and standard `<img>`

### Dependencies
- `date-fns` (new)


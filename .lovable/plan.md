

## Move Reservation to Homepage + UI Refinements

### Changes

**1. `src/components/ReserveSection.tsx`** — Replace CTA-only section with inline reservation form
- Keep the left column (Hours, Location, Getting here info)
- Replace the right column CTA card with the actual reservation form: DateTimePicker, PartySizeSelector, and a Reserve button
- Add local state for date, time, partySize, confirmed, confirmationCode
- Wrap the form in a glass card (`backdrop-blur-xl`, `bg-season-lightest/10`, `border border-white/15`, `rounded-3xl`)
- Include ConfirmationCelebration overlay on submit
- Remove the Link to `/reserve`

**2. `src/components/reservations/DateTimePicker.tsx`** — Rounder, glassier calendar
- Change PopoverTrigger button corners from `rounded-xl` to `rounded-2xl`
- Add glass styling to the trigger: `backdrop-blur-md bg-white/10 border-white/20`
- Add `rounded-2xl` to the PopoverContent wrapper
- Change time slot buttons from `rounded-xl` to `rounded-2xl`

**3. `src/components/SeasonBar.tsx`** — Simplify navbar
- Remove the center nav links (Menu, Events, Gift Cards, Loyalty)
- Keep only: Tres logo (left), single "Menu" button (center or beside logo), Reserve button (right)
- "Menu" scrolls to the menu/dish section
- On mobile: Tres left, Reserve right (already works), Menu visible too

**4. `src/App.tsx`** — Keep `/reserve` route for direct access but it's no longer the primary path

**5. `src/pages/Reserve.tsx`** — Keep as-is (still functional if someone navigates directly)

### Files to modify
- `src/components/ReserveSection.tsx`
- `src/components/reservations/DateTimePicker.tsx`
- `src/components/SeasonBar.tsx`


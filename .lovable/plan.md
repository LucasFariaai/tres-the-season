

## Simplify Reservation Page

### Changes

**1. `src/pages/Reserve.tsx`**
- Remove `SeatingPreference` and `SpecialRequests` imports and rendering
- Remove `seating`, `occasion`, `dietary`, `notes` state variables
- Change `canSubmit` to just `!!date && !!time`
- Update `ReservationSummary` and `ConfirmationCelebration` props (remove seating)
- Remove the dividers for removed sections
- Make the whole booking area a floating glass card (backdrop-blur, semi-transparent bg, rounded-2xl, border) centered on the page instead of full-width sections

**2. `src/components/reservations/DateTimePicker.tsx`**
- Replace the horizontal scrollable date cards with a Shadcn Calendar popover (using `Calendar`, `Popover`, `PopoverTrigger`, `PopoverContent`)
- Keep the time slots grid below
- Calendar uses `pointer-events-auto` class as per shadcn guidelines

**3. `src/components/reservations/PartySizeSelector.tsx`**
- Change heading from "Party Size" to "Table for"
- Keep the circular counter + quick select buttons

**4. `src/components/reservations/ReservationSummary.tsx`**
- Remove `seating` prop and its display
- Change button text from "Confirm Reservation" / "Book" to "Reserve"
- Update progress steps to just 2: Date & Time, Table size
- Apply glass styling (`bg-season-lightest/20 backdrop-blur-xl border border-white/20`) to both desktop card and mobile bar

**5. `src/components/reservations/ConfirmationCelebration.tsx`**
- Remove `seating` from props and display

**6. Overall layout in Reserve.tsx**
- Wrap the form content (DateTimePicker + PartySizeSelector) inside a single glass container: `bg-season-lightest/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl` centered with `max-w-2xl mx-auto`

### Files to modify
- `src/pages/Reserve.tsx`
- `src/components/reservations/DateTimePicker.tsx`
- `src/components/reservations/PartySizeSelector.tsx`
- `src/components/reservations/ReservationSummary.tsx`
- `src/components/reservations/ConfirmationCelebration.tsx`


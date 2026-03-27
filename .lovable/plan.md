

## Fix: Producers Map Not Working

### Problem
The Leaflet map likely fails to load tiles because Stadia Maps now requires an API key for their tile service. The map container renders but shows a grey/blank area with no visible map tiles, making the pins and circle invisible or floating on nothing.

### Solution
Replace the Leaflet-based interactive map with a free tile provider (OpenStreetMap) and fix the map styling to match the warm, editorial aesthetic. Two key changes:

### Changes

**1. Fix tile provider in `src/components/producers/ProducerMap.tsx`**
- Replace Stadia Maps URL with OpenStreetMap's free tile layer: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- Alternatively, use CartoDB's free Positron tiles for a cleaner, muted look that fits the brand: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
- Apply a CSS filter on the map container (`filter: saturate(0.3) sepia(0.15)`) to warm the tiles and match the brand palette
- Update the 30km radius circle colors from green to warm brand tones (`#8B7355` border, `rgba(139,115,85,0.08)` fill)

**2. Ensure map container gets proper dimensions**
- Add a `setTimeout(() => map.invalidateSize(), 100)` after initialization to handle cases where the container isn't fully laid out when Leaflet mounts
- This fixes the common Leaflet issue where tiles don't load because the container has 0 dimensions at init time

### Files to modify
- `src/components/producers/ProducerMap.tsx` — swap tile URL, warm up colors, add invalidateSize call


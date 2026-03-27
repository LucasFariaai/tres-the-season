

## Fix DishStack: Rounded Image Corners + Text Overlap

### Problems (from screenshot)
1. **No rounded corners** on the dish image cards — they have sharp rectangular edges
2. **Text overlapping** in the left panel — the large course number, dish name, description, and pricing info stack on top of each other because the container `min-h-[120px]` is too small for the absolutely-positioned content

### Changes — `src/components/DishStack.tsx`

**1. Add border-radius to image cards**
- Add `rounded-2xl` (16px) to the image container div (line 276) so each card in the stack has soft rounded corners

**2. Fix text overlap in left info panel**
- Increase `min-h-[120px]` on the text container (line 183) to `min-h-[180px] sm:min-h-[200px]` to give enough vertical space for the number + dish name + description
- Ensure the large background number, dish title, and description don't collide by adjusting the layout: make the number truly a background element with `absolute` positioning relative to the text block, and let the title + description flow naturally below it
- Move the progress dots and pricing text below with proper spacing

### Files to modify
- `src/components/DishStack.tsx`


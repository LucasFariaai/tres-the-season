import { ZoomParallax } from '@/components/ui/zoom-parallax';
import foodTableSpread from '@/assets/food-table-spread.jpg';
import foodDryage from '@/assets/food-dryage.jpg';
import foodCotton from '@/assets/food-cotton.jpg';
import foodMeatPlate from '@/assets/food-meat-plate.jpg';
import foodSouffle from '@/assets/food-souffle.jpg';
import foodDessert from '@/assets/food-dessert.jpg';
import foodGlazed from '@/assets/food-glazed.jpg';

const images = [
  { src: foodTableSpread, alt: 'Tasting menu spread at Tres Rotterdam' },
  { src: foodDryage, alt: 'Dry-aging cabinet with heritage meats' },
  { src: foodCotton, alt: 'Cotton flower dish on moss' },
  { src: foodMeatPlate, alt: 'Dry-aged meat with sourdough bread' },
  { src: foodSouffle, alt: 'Herb-crusted soufflé' },
  { src: foodDessert, alt: 'Quenelle dessert on pink linen' },
  { src: foodGlazed, alt: 'Glazed bite on charred board' },
];

export default function ZoomParallaxSection() {
  return (
    <section className="relative" style={{ backgroundColor: '#F7F3ED' }}>
      <ZoomParallax images={images} />
    </section>
  );
}

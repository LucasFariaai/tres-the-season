import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  const positions = [
    // Image 0: center, large (the hero/zoom image)
    'top-0 left-0 w-[25vw] h-[25vh]',
    // Image 1: top-right area
    '-top-[30vh] left-[5vw] h-[30vh] w-[35vw]',
    // Image 2: left area
    '-top-[10vh] -left-[25vw] h-[45vh] w-[20vw]',
    // Image 3: right area
    'left-[27.5vw] h-[25vh] w-[25vw]',
    // Image 4: bottom-left
    'top-[27.5vh] left-[5vw] h-[25vh] w-[20vw]',
    // Image 5: bottom-right-ish
    'top-[27.5vh] -left-[22.5vw] h-[25vh] w-[30vw]',
    // Image 6: far right
    'top-[22.5vh] left-[25vw] h-[15vh] w-[15vw]',
  ];

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];
          return (
            <motion.div
              key={index}
              style={{ scale }}
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
            >
              <div className={`relative ${positions[index % positions.length]}`}>
                <img
                  src={src}
                  alt={alt || ''}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

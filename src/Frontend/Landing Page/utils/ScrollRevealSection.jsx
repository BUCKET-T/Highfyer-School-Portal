import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollRevealSection = ({ children, className = "" }) => {
  const ref = useRef(null);

  // Track scroll progress of this specific element relative to the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"] 
    // "start end" = when top of section hits bottom of screen (entering)
    // "end start" = when bottom of section hits top of screen (leaving)
  });

  // Map scroll progress to opacity and vertical position (y-axis)
  // [0 -> 0.25]: Fades in and slides up as it enters
  // [0.25 -> 0.75]: Fully visible in the middle of the screen
  // [0.75 -> 1]: Fades out and slides up as you scroll past it
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [60, 0, 0, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.95, 1, 1, 0.95]);

  return (
    <motion.div 
      ref={ref} 
      style={{ opacity, y, scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollRevealSection;
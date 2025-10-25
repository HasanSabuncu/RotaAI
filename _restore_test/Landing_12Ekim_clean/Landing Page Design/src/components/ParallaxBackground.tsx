import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function ParallaxBackground({
  children,
  className = "",
}: ParallaxBackgroundProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "50%"],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 0.5, 0],
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 mesh-gradient"></div>
      </motion.div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
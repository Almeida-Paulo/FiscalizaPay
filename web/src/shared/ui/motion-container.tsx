"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/shared/lib/utils";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

interface MotionContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variants?: Variants;
}

export function MotionContainer({
  children,
  className,
  delay = 0,
  duration = 0.3,
  variants = fadeInUp,
}: MotionContainerProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export { fadeInUp };

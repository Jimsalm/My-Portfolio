import type { Transition } from "framer-motion";

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const motionTransition: Transition = {
  duration: 0.45,
  ease: "easeOut",
};

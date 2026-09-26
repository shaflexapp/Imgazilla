import { ReactNode } from 'react';
import { motion } from 'motion/react';

type Props = {
  children: ReactNode;
};

export const AnimatedPage = ({ children }: Props) => {
  const fadeInVariants = {
    initial: {
      opacity: 0,
    },
    in: {
      opacity: 1,
      transition: {
        duration: 0.5, // Half a second fade-in
        delay: 0.3, // Delay before the animation starts
      },
    },
  };
  return (
    <motion.div
      className='flex h-full w-full'
      variants={fadeInVariants}
      initial='initial'
      animate='in'
    >
      {children}
    </motion.div>
  );
};

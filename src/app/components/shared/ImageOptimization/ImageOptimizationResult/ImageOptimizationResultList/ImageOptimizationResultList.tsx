import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'motion/react';

import {
  ImageOptimizationResultItem,
  Loading,
  MainContainer,
  ScrollArea,
} from '@/app/components';
import { getImageOptimizationResult } from '@/app/redux/features';

type Props = {
  isLoading: boolean;
};

export const ImageOptimizationResultList = ({ isLoading }: Props) => {
  const imageOptimizationResult = useSelector(getImageOptimizationResult);

  if (isLoading) {
    return (
      <MainContainer className='justify-center items-center mt-0.5 overflow-hidden h-full max-h-[460px]'>
        <Loading />
      </MainContainer>
    );
  }

  return (
    <MainContainer className='relative mt-0.5 overflow-hidden h-full max-h-[460px]'>
      <AnimatePresence mode='sync'>
        <ScrollArea className='w-full'>
          {imageOptimizationResult.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === imageOptimizationResult.length - 1;
            const classes = `${isFirst ? 'rounded-t-lg' : ''} ${isLast ? 'rounded-b-lg' : ''}`;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ImageOptimizationResultItem item={item} className={classes} />
              </motion.div>
            );
          })}
        </ScrollArea>
      </AnimatePresence>
    </MainContainer>
  );
};

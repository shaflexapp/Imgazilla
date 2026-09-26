import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown } from 'lucide-react';

import { debounce } from 'lodash';

import {
  ImageOptimizationItem,
  MainContainer,
  ScrollArea,
} from '@/app/components';
import { useSelector } from 'react-redux';
import { getIsSingleMode } from '@/app/redux/features';

type Props = {
  isLoading: boolean;
  isHideScrollTo: boolean;
  onUpdateScrollTo: (value: boolean) => void;
  data: ImageInfo[];
};

const DEFAULT_NUMBER_OF_ITEMS = 6;
const SCROLL_ENDPOINT = 135;

export const ImageOptimizationList = memo(
  ({ isLoading, data, isHideScrollTo, onUpdateScrollTo }: Props) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const isSingleMode = useSelector(getIsSingleMode);

    const ref = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const isShowDisabled = scrollPosition >= SCROLL_ENDPOINT;

    const onScrollToMoreImages = useCallback(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
        onUpdateScrollTo(false);
      }
    }, [ref]);

    const handleScrollPosition = useCallback(
      debounce(() => {
        const position = listRef.current.scrollTop;
        setScrollPosition(position);
      }, 100),
      [listRef.current],
    );

    useEffect(() => {
      if (data.length > DEFAULT_NUMBER_OF_ITEMS) {
        onUpdateScrollTo(true);
      }
    }, [data]);

    useEffect(() => {
      if (!listRef.current) {
        return;
      }

      listRef.current.addEventListener('scroll', handleScrollPosition);
      return () => {
        listRef?.current?.removeEventListener('scroll', handleScrollPosition);
      };
    }, [listRef.current]);

    if (!isLoading && data.length === 0) {
      return (
        <MainContainer className='mt-0.5 overflow-hidden h-full max-h-[444px]'>
          <div className='flex flex-col m-auto text-center text-sm justify-center items-center gap-3'>
            <p className='font-semibold'>
              {isSingleMode
                ? 'No layers available for export.'
                : 'No images available for export.'}
            </p>
            <p className='w-[540px]'>
              {isSingleMode
                ? 'Please ensure you selected layer/frame '
                : 'Please ensure the images have export settings '}
              and after click on the <b>Sync</b> button.
            </p>
          </div>
        </MainContainer>
      );
    }

    return (
      <MainContainer className='relative mt-0.5 overflow-hidden h-full max-h-[444px]'>
        <AnimatePresence mode='sync'>
          <ScrollArea className='w-full' viewportRef={listRef}>
            {data.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === data.length - 1;
              const classes = `${isFirst ? 'rounded-t-lg' : ''} ${isLast ? 'rounded-b-lg' : ''}`;

              return (
                <motion.div
                  key={item.uuid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ImageOptimizationItem item={item} className={classes} />
                </motion.div>
              );
            })}
            <div ref={ref} className='opacity-0' />
          </ScrollArea>
          {isHideScrollTo && !isShowDisabled ? (
            <motion.div
              className='absolute bottom-4 flex justify-center w-full'
              onClick={onScrollToMoreImages}
              key='box'
              initial={{ display: 'flex', y: 50 }}
              animate={{ display: 'flex', y: 0 }}
              exit={{ display: 'none', y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <div className='flex flex-row gap-2 items-center justify-center bg-primary-secondDark border border-primary-primaryDark px-4 py-2 cursor-pointer rounded-lg text-white text-sm shadow-xl'>
                <ArrowDown size={16} className='stroke-primary-gray' />
                More images
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </MainContainer>
    );
  },
);

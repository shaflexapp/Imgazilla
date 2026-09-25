import React from 'react';

import { Coins } from 'lucide-react';

import {
  AnimatedPage,
  Loading,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components';
import { usePriceList } from '@/app/hooks/usePriceList';

export const PriceSelector = () => {
  const { isLoading, princeList } = usePriceList();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-[60%]'>
        <Loading />
      </div>
    );
  }

  // Also covers an API that doesn't serve the price list yet
  if (princeList.length === 0) {
    return (
      <AnimatedPage>
        <p role='status' className='text-primary-gray text-center text-sm'>
          Prices are temporarily unavailable. Please reload the plugin or try
          again later.
        </p>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className='flex flex-col w-full'>
        {princeList.map((variant, index) => (
          <div key={index}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className='p-0 h-fit w-full'>
                  <div
                    className='flex flex-row cursor-pointer transition ease-in-out justify-between bg-primary-mainDark rounded-lg p-3 mb-3 border border-primary-mainDark hover:border-primary-lightGreen'
                    onClick={() => window.open(variant.link, '_blank')}
                  >
                    <div className='flex items-center align-baseline gap-1.5'>
                      <Coins
                        size={25}
                        className='fill-amber-400 stroke-amber-600'
                      />
                      <p className='text-lg'>{variant.credits} Credits</p>
                    </div>
                    <div className='text-gray-400 text-lg'>
                      ${variant.price}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p className='flex'>{variant.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
        <p className='flex gap-1.5 text-primary-gray font-bold text-sm'>
          <span className='flex text-red-600'>*</span>
          Please reload the plugin after purchase.
        </p>
      </div>
    </AnimatedPage>
  );
};

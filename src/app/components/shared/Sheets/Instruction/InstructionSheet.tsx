import { useCallback } from 'react';

import {
  Button,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components';
import { ANALYTIC_EVENTS } from '@/app/constants';
import { useMixpanel } from '@/app/hooks/useMixpanleAnalytics';

const IMAGE_CREDITS_COST = process.env.IMAGE_CREDITS_COST;
const FAVICON_ARCHIVE_CREDITS_COST = process.env.FAVICON_ARCHIVE_CREDITS_COST;
const BACKGROUND_REMOVAL_COST = process.env.BACKGROUND_REMOVAL_COST;

export const InstructionSheet = () => {
  const trackClick = useMixpanel();

  const handleOnClick = useCallback(() => {
    trackClick('click', {
      name: ANALYTIC_EVENTS.OPEN_INSTRUCTION,
    });
  }, [trackClick]);

  return (
    <Sheet>
      <SheetTrigger asChild onClick={handleOnClick}>
        <Button
          variant='ghost'
          className='w-full justify-start hover:bg-primary-lightGreen hover:text-primary-mainDark'
        >
          Instructions
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className='w-[95%]'>
          <SheetTitle className='text-left text-sm'>
            Welcome to the Favicon Exporter, Image optimization & Background
            removal plugin.
          </SheetTitle>
        </SheetHeader>
        <div className='mt-4'>
          <ScrollArea className='h-[525px]'>
            <div className='grid gap-4'>
              <p className='font-medium text-sm'>Exporting Favicons:</p>
              <ul className='flex flex-col gap-3'>
                <li className='text-sm'>
                  1. Select the icon you want to use for your favicon.
                </li>
                <li className='text-sm'>
                  2. The icon should have identical dimensions (width & height),
                  for example, 300x300.
                </li>
                <li className='text-sm'>
                  3. Click the "Export" button or "Preview" to check how it will
                  look in the browser or on mobile.
                </li>
                <li className='text-sm'>
                  4. Each export of a favicon archive will cost you{' '}
                  {FAVICON_ARCHIVE_CREDITS_COST} credits.
                </li>
              </ul>
            </div>
            <div className='grid gap-4 pt-4'>
              <p className='font-medium text-sm'>Image Optimization:</p>
              <ul className='flex flex-col gap-3'>
                <li className='text-sm'>
                  1. Click on the "Image optimization" tab.
                </li>
                <li className='text-sm'>
                  2. Plugin has couple of options
                  <ul className='pl-4'>
                    <li className='pt-4'>
                      2.1 <b>Optimize images on Page</b> - This button appears
                      to trigger a process to optimize all images on the current
                      page, but it takes some time as it locates all relevant
                      images based on certain settings.
                    </li>
                    <li className='pt-4'>
                      2.2 <b>Optimize selected layer</b> - In this option, you
                      can pre-select (frames, layers, images) and then select
                      this option. Alternatively, you can select after clicking
                      this option and then click the <b>Sync</b> button.
                    </li>
                  </ul>
                </li>
                <li className='text-sm'>
                  2. Each archive will cost you {IMAGE_CREDITS_COST} credits.{' '}
                  <span className='inline-block font-bold text-sm ml-0.5 mt-1'>
                    (Without limiting the number of images in each
                    archive).{' '}
                  </span>
                </li>
              </ul>
            </div>
            <div className='grid gap-4 pt-4'>
              <p className='font-medium text-sm'>Background remover:</p>
              <ul className='flex flex-col gap-3'>
                <li className='text-sm'>
                  1. Click on the "background remover" tab.
                </li>
                <li className='text-sm'>
                  2. Select image, frame, layer and click on <b>Sync</b> button.
                </li>
                <li className='text-sm'>
                  2. Each image will cost you {BACKGROUND_REMOVAL_COST} credits.
                </li>
              </ul>
            </div>
            <div className='grid gap-4 pt-4'>
              <p className='font-medium text-sm'>Credit Management:</p>
              <ul className='flex flex-col gap-3'>
                <li className='text-sm flex'>
                  1. Check your current credit balance in the top-right corner.
                </li>
                <li className='text-sm flex'>
                  2. Monitor your usage and balance to ensure smooth usage of
                  the plugin.
                </li>
                <li className='text-sm flex'>3. Credits stack.</li>
              </ul>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

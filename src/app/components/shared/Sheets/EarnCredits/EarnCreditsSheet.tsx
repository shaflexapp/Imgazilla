import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  PriceSelector,
  Separator,
  SheetDescription,
} from '@/app/components';
import { getAccount } from '@/app/redux/features';
import { calculateCredits } from '@/app/lib/calculateCredits';
import { ANALYTIC_EVENTS } from '@/app/constants';
import { useMixpanel } from '@/app/hooks/useMixpanleAnalytics';

type Props = {
  isOpen?: boolean;
  showTrigger?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const EarnCreditsSheet = ({
  isOpen = undefined,
  showTrigger = true,
  onOpenChange,
}: Props) => {
  const accountDetails = useSelector(getAccount);
  const trackClick = useMixpanel();

  const { favicon, images, backgroundRemoval } = useMemo(
    () => calculateCredits(accountDetails.credits),
    [accountDetails],
  );

  const handleOnClick = useCallback(() => {
    trackClick('click', {
      name: ANALYTIC_EVENTS.OPEN_EARN_CREDITS,
    });
  }, [trackClick]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {showTrigger ? (
        <SheetTrigger asChild onClick={handleOnClick}>
          <Button
            variant='ghost'
            className='w-full justify-start hover:bg-primary-lightGreen hover:text-primary-mainDark'
          >
            Buy More Credits
          </Button>
        </SheetTrigger>
      ) : null}
      <SheetContent>
        <SheetHeader>
          <SheetTitle className='text-center font-medium'>
            Your account balance
          </SheetTitle>
          <div className='text-center'>
            <div className='flex gap-1 justify-center items-baseline text-primary my-1.5'>
              <p className='font-bold text-3xl'>{accountDetails.credits} / </p>
              <p className='text-lg'>credits</p>
            </div>
          </div>
          <SheetDescription className='text-primary-gray text-center'>
            ~ {favicon} export favicon archives or {images} optimized archives
            with images or {backgroundRemoval} images without background.
          </SheetDescription>
          <SheetDescription className='text-primary-gray font-bold text-center'>
            All credits stack.
          </SheetDescription>
          <div className='mt-6 mb-8'>
            <Separator />
          </div>
        </SheetHeader>
        <PriceSelector />
      </SheetContent>
    </Sheet>
  );
};

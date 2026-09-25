import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import confetti from 'canvas-confetti';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  Button,
} from '@/app/components';

import {
  useLazyGetAccountCreditsQuery,
  useTakeBonusMutation,
} from '@/app/redux/services';
import {
  getAccount,
  getAccountHasBonus,
  setAccountHasBonus,
  updateAccountCredits,
} from '@/app/redux/features';
import { useTypedDispatch } from '@/app/redux/store';
import { isFetchBaseQueryError } from '@/app/redux/helpers';

import { UIEventType } from '@/eventType';

import { useWindowMessaging } from '@/app/hooks/useFigmaMessaging';
import {
  ANALYTIC_EVENTS,
  BONUS_MODAL_STORAGE_KEY,
  IMGAZILLA_FIGMA_LINK,
} from '@/app/constants';

// @ts-ignore
import imgazillaLike from '@/app/assets/imgazilla-like.gif';
// @ts-ignore
import imgazillaWithGift from '@/app/assets/imgazilla_with_gift.png';
import { useMixpanel } from '@/app/hooks/useMixpanleAnalytics';

export const BonusModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShowWinBox, setIsShowWinBox] = useState(false);
  const creditsRef = useRef<HTMLParagraphElement>(null);

  const [takeBonus, { isLoading, isSuccess }] = useTakeBonusMutation();
  const [getAccountCredits] = useLazyGetAccountCreditsQuery();

  const { figmaUserID } = useSelector(getAccount);
  // null until the API reports it (older API versions don't return it).
  const hasBonus = useSelector(getAccountHasBonus);
  const isAccountLoaded = Boolean(figmaUserID);
  // Keep the modal open for the success animation after claiming in this session.
  const isBonusClaimed = Boolean(hasBonus) && !isSuccess;

  const onTrackClick = useMixpanel();

  const dispatch = useTypedDispatch();

  const handleFigmaPluginMessages = useCallback((message: MessageType) => {
    if (message?.type === UIEventType.GET_CLIENT_STORAGE_DATA) {
      if (message.payload.key !== BONUS_MODAL_STORAGE_KEY) {
        return;
      }

      if (message?.payload?.value) {
        return;
      }

      setIsOpen(!message?.payload?.value || false);
    }
  }, []);

  const { onSendMessage } = useWindowMessaging(handleFigmaPluginMessages);

  const persistBonusModalSeen = useCallback(() => {
    onSendMessage({
      type: UIEventType.SET_CLIENT_STORAGE_DATA,
      payload: {
        key: BONUS_MODAL_STORAGE_KEY,
        value: true,
      },
    });
  }, []);

  const handleOnClose = useCallback((state: boolean) => {
    setIsOpen(state);
    persistBonusModalSeen();

    onTrackClick('click', {
      name: ANALYTIC_EVENTS.CLICK_ON_MAYBE_LATE_BUTTON,
    });
  }, []);

  const handleOnDo = useCallback(() => {
    setIsShowWinBox(true);

    onTrackClick('click', {
      name: ANALYTIC_EVENTS.CLICK_ON_RATE_NOW_BUTTON,
    });
  }, []);

  const handleOnPointerDownOutside = useCallback((event: any) => {
    event.preventDefault();
  }, []);

  const handleToggleConfetti = useCallback(() => {
    if (!creditsRef.current) {
      console.error('creditsRef is not attached to any DOM element');
      return;
    }

    const rect = creditsRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    confetti({
      particleCount: 100, // Default particle count or dynamically adjust if needed
      spread: 70, // Spread angle for the particles
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
      angle: 90, // Angle for the confetti burst
      colors: ['#ff0000', '#00ff00', '#0000ff'], // Example colors, adjust as needed
      zIndex: 1000, // Ensure confetti is above other elements
    });
  }, []);

  const handleOnLinkClick = useCallback(() => {
    onTrackClick('click', {
      name: ANALYTIC_EVENTS.CLICK_ON_IMGAZILLA_FIGMA_LINK,
    });
  }, []);

  const handleTakeBonus = useCallback(async () => {
    onTrackClick('click', {
      name: ANALYTIC_EVENTS.CLICK_ON_TAKE_BONUS_BUTTON,
    });

    try {
      await takeBonus({}).unwrap();
    } catch (error) {
      // 403: the bonus was already claimed, so there is nothing to offer anymore.
      if (isFetchBaseQueryError(error) && error.status === 403) {
        setIsOpen(false);
        persistBonusModalSeen();
        dispatch(setAccountHasBonus(true));
      }
      // Other errors are shown by the error handling middleware.
      return;
    }

    dispatch(setAccountHasBonus(true));

    try {
      const credits: string = await getAccountCredits('').unwrap();
      dispatch(updateAccountCredits({ credits }));
    } catch {
      // The bonus is already applied, credits are refreshed on the next request.
    }

    handleToggleConfetti();

    setTimeout(() => {
      handleOnClose(false);
    }, 1000);
  }, []);

  useEffect(() => {
    onSendMessage({
      type: UIEventType.GET_CLIENT_STORAGE_DATA,
      payload: {
        key: BONUS_MODAL_STORAGE_KEY,
      },
    });
  }, []);

  if (!isAccountLoaded || isBonusClaimed) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOnClose}>
      <DialogContent
        onPointerDownOutside={handleOnPointerDownOutside}
        isHideClose={true}
      >
        <DialogTitle className='hidden' />
        {isShowWinBox ? (
          <div>
            <div className='flex flex-col items-center gap-4'>
              <div className='w-60 h-60'>
                <img src={imgazillaWithGift} alt='imgazilla with Gift' />
              </div>
              <div className='flex gap-2 items-center' ref={creditsRef}>
                <span className='text-xl font-bold text-primary-blue'>
                  +500
                </span>
                <span className='text-sm font-normal text-primary-gray'>
                  credits
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-4'>
            <h1 className='text-xl'>
              Enjoying <span className='font-bold underline'>imgazilla</span>?
              We’d love your support!
            </h1>
            <p className='text-white/60'>
              If you’re finding our plugin useful, please take a moment to give
              us a like. Your feedback helps us improve and keeps us motivated.
              <p className='text-white my-3 text-center'>
                You will receive additional +500 credits!{' '}
              </p>
            </p>
            <div>
              <a
                href={IMGAZILLA_FIGMA_LINK}
                target='_blank'
                onClick={handleOnLinkClick}
                rel='noopener noreferrer'
              >
                <span className='text-primary-lightBlue hover:underline'>
                  Rate <span className='font-bold'>imgazilla</span> on Figma
                </span>
              </a>
            </div>
            <img
              src={imgazillaLike}
              alt='imgazilla Like'
              className='rounded-md'
            />
          </div>
        )}
        <DialogFooter className='mt-5'>
          {isShowWinBox ? (
            <div className='flex w-full justify-center'>
              <Button
                onClick={handleTakeBonus}
                disabled={isLoading || isSuccess}
              >
                {isLoading ? 'Loading...' : 'Take them!'}
              </Button>
            </div>
          ) : (
            <>
              <Button variant='outline' onClick={() => handleOnClose(false)}>
                Maybe Later
              </Button>
              <Button onClick={handleOnDo}>Rate Now</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

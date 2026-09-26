import { memo, useCallback, useMemo } from 'react';

import { convertToImageUrl } from '@/app/lib/convertToImageUrl';
import {
  Checkbox,
  FormatSelector,
  ImageOptimizationLevel,
} from '@/app/components';

import {
  removeSelectedImages,
  setSelectedImages,
  updateImageFormat,
  updateImageOptimizationPercent,
} from '@/app/redux/features';
import { useTypedDispatch } from '@/app/redux/store';

import { cn } from '@/app/lib/utils';
import { scaleFormat } from '@/app/lib/calculateSize';
import { ANALYTIC_EVENTS, PNG_FORMAT } from '@/app/constants';
import { useMixpanel } from '@/app/hooks/useMixpanleAnalytics';

type Props = {
  item: ImageInfo;
  className?: string;
};

export const ImageOptimizationItem = memo(({ item, className }: Props) => {
  const {
    uuid,
    name,
    width,
    height,
    uintArray,
    format,
    optimizationPercent,
    isSelected,
    setting,
  } = item;

  const onTrackClick = useMixpanel();

  const imageUrl = useMemo(
    () => convertToImageUrl(uintArray, PNG_FORMAT),
    [uintArray, format],
  );
  const exportableImageScale = useMemo(
    () =>
      scaleFormat({
        type: setting?.constraint?.type,
        value: setting?.constraint?.value,
      }),
    [width, height, format, setting],
  );

  const dispatch = useTypedDispatch();

  const handleOnCheck = useCallback(() => {
    if (isSelected) {
      dispatch(
        removeSelectedImages({
          uuid,
        }),
      );
      return;
    }
    dispatch(
      setSelectedImages({
        uuid,
      }),
    );
  }, [uuid, isSelected]);

  const handleOnOptimizationLevel = useCallback((value: number[]) => {
    const percent = value[0];
    dispatch(
      updateImageOptimizationPercent({
        uuid,
        percent,
      }),
    );
  }, []);

  const handleOnFormatChange = useCallback((format: string) => {
    dispatch(
      updateImageFormat({
        uuid,
        format,
      }),
    );

    onTrackClick('click', {
      name: ANALYTIC_EVENTS.UPDATE_IMAGE_FORMAT,
      format,
    });
  }, []);

  const isDisabled = !isSelected;

  const disabledStyles = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div
      className={cn(
        'flex flex-col border bg-primary-mainDark border-primary-primaryDark w-full',
        className,
      )}
    >
      <div className='flex items-center justify-between gap-5 py-2.5 space-x-4 px-3 w-full'>
        <div className='flex items-center space-x-3'>
          <Checkbox onClick={handleOnCheck} checked={isSelected} />
          <div className={cn(disabledStyles)}>
            <div className='w-12 h-12 bg-gray-200 flex items-center justify-center overflow-hidden preview rounded-md'>
              <img
                src={imageUrl}
                alt={name}
                className='rounded-md min-w-full min-h-full object-cover'
              />
            </div>
          </div>
          <div className='flex flex-col'>
            <div className={cn('flex w-56 text-xs mb-3', disabledStyles)}>
              <p className='truncate'>
                {setting?.suffix ? `${setting?.suffix}_${name}` : name}
              </p>
            </div>
            <ImageOptimizationLevel
              optimizationPercent={optimizationPercent}
              handleOnOptimizationLevel={handleOnOptimizationLevel}
              isDisable={isDisabled}
            />
          </div>
        </div>
        <div className={cn('flex gap-1.5 text-xs', disabledStyles)}>
          <div className='flex'>{exportableImageScale}</div>
        </div>
        <div
          className={cn('flex gap-1.5 text-xs min-w-[70px]', disabledStyles)}
        >
          <div className='flex'>
            {width.toFixed(0)}x{height.toFixed(0)}
          </div>
        </div>
        <div className={cn('flex text-xs', disabledStyles)}>
          <FormatSelector
            defaultFormat={format}
            onChange={handleOnFormatChange}
            isDisabled={isDisabled}
            forceClose={!isSelected}
          />
        </div>
      </div>
    </div>
  );
});

import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { RefreshCcw } from 'lucide-react';

import { toNumber } from 'lodash';

import {
  getImages,
  getSelectedImagesCount,
  selectAllImages,
  unselectAllImages,
  updateAllImageOptimizationPercent,
  updateGeneralOptimizationPercent,
} from '@/app/redux/features';

import {
  Button,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components';
import { useTypedDispatch } from '@/app/redux/store';
import { TITLE_TO_QUALITY_PERCENTAGE } from '@/app/constants';

type Props = {
  onRefresh: () => void;
};

export const ImageOptimizationSettings = ({ onRefresh }: Props) => {
  const images = useSelector(getImages);
  const selectedImagesCount = useSelector(getSelectedImagesCount);

  const isSelectedAll = useMemo(
    () => images.every((image) => image.isSelected),
    [images],
  );

  const dispatch = useTypedDispatch();

  const handleOnCheck = useCallback(() => {
    const isSelectedAll = images.every((image) => image.isSelected);
    const isSelectedSome = images.some((image) => image.isSelected);

    if (isSelectedAll || isSelectedSome) {
      dispatch(unselectAllImages());
      return;
    }

    dispatch(selectAllImages());
  }, [images]);

  const handleOnOptimizationLevel = useCallback((value: string) => {
    dispatch(updateGeneralOptimizationPercent(toNumber(value)));
    dispatch(updateAllImageOptimizationPercent(toNumber(value)));
  }, []);

  return (
    <>
      <div className='border border-primary-primaryDark bg-primary-secondDark rounded-lg'>
        <div className='flex justify-between mx-3 my-3'>
          <div className='flex justify-center items-center'>
            <div className='mr-3'>
              <Checkbox checked={isSelectedAll} onClick={handleOnCheck} />
            </div>
            <div className='flex mr-1 text-xs font-semibold'>
              {selectedImagesCount}/{images.length}
            </div>
            <div className='flex text-xs font-semibold'>
              {images.length > 1 ? 'Images' : 'Image'} selected
            </div>
          </div>
          <div className='flex items-center'>
            <div className='mr-3'>
              <Select onValueChange={handleOnOptimizationLevel}>
                <SelectTrigger className='w-[146px]'>
                  <SelectValue
                    placeholder={`${images.length > 1 ? 'Images' : 'Image'} quality`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(TITLE_TO_QUALITY_PERCENTAGE).map((item) => (
                    <SelectItem
                      key={item}
                      value={item}
                      className='text-primary-lightGray focus:bg-primary-lightGreen focus:text-primary-secondDark px-3!'
                    >
                      {TITLE_TO_QUALITY_PERCENTAGE[item]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                variant='dark'
                onClick={onRefresh}
                className='flex flex-row justify-center items-center gap-2.5 rounded-lg border border-primary-primaryDark px-3 py-2 text-sm h-10!'
              >
                <p>Sync</p>
                <RefreshCcw size={16} className='stroke-borderSquare' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
